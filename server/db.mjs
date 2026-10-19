import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const DB_FILE = path.join(ROOT_DIR, 'database', 'safework_database.sqlite');

let dbInstance = null;

export function getDatabase() {
  if (!dbInstance) {
    dbInstance = new DatabaseSync(DB_FILE);
    dbInstance.exec('PRAGMA journal_mode = WAL;');
    initSchema(dbInstance);
  }
  return dbInstance;
}

function initSchema(db) {
  // Tabla genérica de pares clave-valor (KV Store en SQLite para estado global unificado)
  db.exec(`
    CREATE TABLE IF NOT EXISTS app_state (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Tablas relacionales normalizadas para auditoría, trazabilidad y consultas SQL directas
  db.exec(`
    CREATE TABLE IF NOT EXISTS machines (
      id TEXT PRIMARY KEY,
      nombre TEXT NOT NULL,
      marca TEXT,
      modelo TEXT,
      serie TEXT,
      horometro REAL,
      ubicacion TEXT,
      operadorAsignado TEXT,
      estado TEXT NOT NULL,
      lotoCode TEXT,
      workOrder TEXT,
      motivoBloqueo TEXT,
      fechaBloqueo TEXT,
      ultimaInspeccion TEXT,
      presionHidraulica TEXT,
      saludBomba INTEGER,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS checklist_logs (
      id TEXT PRIMARY KEY,
      machineId TEXT NOT NULL,
      machineName TEXT NOT NULL,
      operador TEXT NOT NULL,
      fecha TEXT NOT NULL,
      resultado TEXT NOT NULL,
      fallasDetectadas TEXT,
      firma TEXT,
      lotoCode TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS risk_reports (
      id TEXT PRIMARY KEY,
      titulo TEXT NOT NULL,
      area TEXT NOT NULL,
      tipoPeligro TEXT NOT NULL,
      probabilidad INTEGER,
      severidad INTEGER,
      frecuencia INTEGER,
      fineScore INTEGER,
      nivelRiesgo TEXT,
      estado TEXT,
      reportadoPor TEXT,
      fecha TEXT,
      accionesPropuestas TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS certificates (
      id TEXT PRIMARY KEY,
      courseId TEXT NOT NULL,
      courseTitle TEXT NOT NULL,
      studentName TEXT NOT NULL,
      studentCedula TEXT,
      issueDate TEXT NOT NULL,
      score INTEGER NOT NULL,
      verificationCode TEXT UNIQUE NOT NULL,
      normativaRef TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS loto_history (
      id TEXT PRIMARY KEY,
      lotoCode TEXT NOT NULL,
      machineId TEXT NOT NULL,
      machineName TEXT NOT NULL,
      fechaBloqueo TEXT NOT NULL,
      fechaLiberacion TEXT,
      mecanicoResponsable TEXT,
      supervisorHse TEXT,
      motivo TEXT,
      estado TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

// Métodos de acceso al State KV Store
export function getAppState(key) {
  const db = getDatabase();
  const stmt = db.prepare('SELECT value FROM app_state WHERE key = ?');
  const row = stmt.get(key);
  if (!row) return null;
  try {
    return JSON.parse(row.value);
  } catch (err) {
    return row.value;
  }
}

export function setAppState(key, data) {
  const db = getDatabase();
  const value = typeof data === 'string' ? data : JSON.stringify(data);
  const stmt = db.prepare(`
    INSERT INTO app_state (key, value, updated_at) 
    VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
  `);
  stmt.run(key, value);

  // Si es el payload principal de SafeWork, también sincronizamos las tablas SQL relacionales
  if (key === 'SAFEWORK_STATE' && typeof data === 'object' && data !== null) {
    syncRelationalTables(db, data);
  }
}

export function clearAppState(key) {
  const db = getDatabase();
  const stmt = db.prepare('DELETE FROM app_state WHERE key = ?');
  stmt.run(key);
}

// Sincronización a tablas SQL normalizadas para consultas analíticas
function syncRelationalTables(db, data) {
  try {
    // 1. Maquinarias
    if (Array.isArray(data.machines)) {
      const stmtMachine = db.prepare(`
        INSERT INTO machines (id, nombre, marca, modelo, serie, horometro, ubicacion, operadorAsignado, estado, lotoCode, workOrder, motivoBloqueo, fechaBloqueo, ultimaInspeccion, presionHidraulica, saludBomba, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(id) DO UPDATE SET
          nombre=excluded.nombre, marca=excluded.marca, modelo=excluded.modelo, serie=excluded.serie,
          horometro=excluded.horometro, ubicacion=excluded.ubicacion, operadorAsignado=excluded.operadorAsignado,
          estado=excluded.estado, lotoCode=excluded.lotoCode, workOrder=excluded.workOrder,
          motivoBloqueo=excluded.motivoBloqueo, fechaBloqueo=excluded.fechaBloqueo,
          ultimaInspeccion=excluded.ultimaInspeccion, presionHidraulica=excluded.presionHidraulica,
          saludBomba=excluded.saludBomba, updated_at=CURRENT_TIMESTAMP
      `);
      for (const m of data.machines) {
        stmtMachine.run(
          m.id || '',
          m.nombre || '',
          m.marca || '',
          m.modelo || '',
          m.serie || '',
          m.horometro || 0,
          m.ubicacion || '',
          m.operadorAsignado || '',
          m.estado || 'OPERATIVO',
          m.lotoCode || null,
          m.workOrder || null,
          m.motivoBloqueo || null,
          m.fechaBloqueo || null,
          m.ultimaInspeccion || null,
          m.presionHidraulica || '',
          m.saludBomba || 0
        );
      }
    }

    // 2. Checklist logs
    if (Array.isArray(data.checklistLogs)) {
      const stmtLog = db.prepare(`
        INSERT OR IGNORE INTO checklist_logs (id, machineId, machineName, operador, fecha, resultado, fallasDetectadas, firma, lotoCode)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const log of data.checklistLogs) {
        stmtLog.run(
          log.id || String(Date.now()),
          log.machineId || '',
          log.machineName || '',
          log.operador || '',
          log.fecha || '',
          log.resultado || '',
          Array.isArray(log.fallasDetectadas) ? JSON.stringify(log.fallasDetectadas) : (log.fallasDetectadas || ''),
          log.firma || '',
          log.lotoCode || null
        );
      }
    }

    // 3. Reportes de Riesgos
    if (Array.isArray(data.riskReports)) {
      const stmtRisk = db.prepare(`
        INSERT OR REPLACE INTO risk_reports (id, titulo, area, tipoPeligro, probabilidad, severidad, frecuencia, fineScore, nivelRiesgo, estado, reportadoPor, fecha, accionesPropuestas)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const r of data.riskReports) {
        stmtRisk.run(
          r.id || '',
          r.titulo || '',
          r.area || '',
          r.tipoPeligro || '',
          r.probabilidad || 0,
          r.severidad || 0,
          r.frecuencia || 0,
          r.fineScore || 0,
          r.nivelRiesgo || '',
          r.estado || '',
          r.reportadoPor || '',
          r.fecha || '',
          r.accionesPropuestas || ''
        );
      }
    }

    // 4. Certificados
    if (Array.isArray(data.certificates)) {
      const stmtCert = db.prepare(`
        INSERT OR REPLACE INTO certificates (id, courseId, courseTitle, studentName, studentCedula, issueDate, score, verificationCode, normativaRef)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const c of data.certificates) {
        stmtCert.run(
          c.id || '',
          c.courseId || '',
          c.courseTitle || '',
          c.studentName || '',
          c.studentCedula || '',
          c.issueDate || '',
          c.score || 100,
          c.verificationCode || '',
          c.normativaRef || ''
        );
      }
    }

    // 5. Historial LOTO
    if (Array.isArray(data.lotoHistory)) {
      const stmtLoto = db.prepare(`
        INSERT OR REPLACE INTO loto_history (id, lotoCode, machineId, machineName, fechaBloqueo, fechaLiberacion, mecanicoResponsable, supervisorHse, motivo, estado)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const l of data.lotoHistory) {
        stmtLoto.run(
          l.id || '',
          l.lotoCode || '',
          l.machineId || '',
          l.machineName || '',
          l.fechaBloqueo || '',
          l.fechaLiberacion || null,
          l.mecanicoResponsable || '',
          l.supervisorHse || '',
          l.motivo || '',
          l.estado || ''
        );
      }
    }
  } catch (err) {
    console.error('Error al sincronizar tablas relacionales SQLite:', err);
  }
}
