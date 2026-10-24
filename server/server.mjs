import http from 'http';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { getAppState, setAppState, clearAppState, getDatabase } from './db.mjs';
import { INITIAL_MACHINES, INITIAL_REGULATORY_ALERTS, INITIAL_AUDITS, INITIAL_RISK_REPORTS, INITIAL_COURSES, INITIAL_LOTO_HISTORY } from '../src/data/initialData.js';
import '../scripts/build-standalone.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const PORT = process.env.PORT || 5173;

const ROUTE_TO_FILE = {
  '/': 'index.html',
  '/index.html': 'index.html',
  '/normativa': 'normativa.html',
  '/normativa.html': 'normativa.html',
  '/inspecciones': 'inspecciones.html',
  '/inspecciones.html': 'inspecciones.html',
  '/riesgos': 'riesgos.html',
  '/riesgos.html': 'riesgos.html',
  '/monitoreo': 'monitoreo.html',
  '/monitoreo.html': 'monitoreo.html',
  '/capacitacion': 'capacitacion.html',
  '/capacitacion.html': 'capacitacion.html',
  '/liberacion-loto': 'liberacion-loto.html',
  '/liberacion-loto.html': 'liberacion-loto.html',
  '/SafeWork_4.0_TECTROMAQ_Demo.html': 'SafeWork_4.0_TECTROMAQ_Demo.html'
};

// Helper para parsear JSON en el cuerpo del request
function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      // Seguridad ante payloads demasiado grandes (> 10MB)
      if (body.length > 10 * 1024 * 1024) {
        reject(new Error('Payload demasiado grande'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : null);
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname.replace(/\/+$/, '') || '/';

  // -------------------------------------------------------------
  // API REST SQLite para TECTROMAQ
  // -------------------------------------------------------------
  if (pathname === '/api/state') {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    if (req.method === 'GET') {
      try {
        const state = getAppState('SAFEWORK_STATE');
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, data: state }));
      } catch (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
      return;
    }

    if (req.method === 'POST') {
      try {
        const body = await readRequestBody(req);
        if (body && typeof body === 'object') {
          setAppState('SAFEWORK_STATE', body);
          res.writeHead(200);
          res.end(JSON.stringify({ success: true, message: 'Estado guardado en SQLite con éxito' }));
        } else {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, error: 'Datos no válidos' }));
        }
      } catch (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
      return;
    }

    if (req.method === 'DELETE') {
      try {
        clearAppState('SAFEWORK_STATE');
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, message: 'Estado reiniciado en SQLite' }));
      } catch (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
      return;
    }
  }

  // Endpoint de consultas SQL analíticas (para ver registros directos de la BD)
  if (pathname === '/api/db-summary') {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    try {
      const db = getDatabase();
      const machines = db.prepare('SELECT COUNT(*) as count FROM machines').get();
      const logs = db.prepare('SELECT COUNT(*) as count FROM checklist_logs').get();
      const certs = db.prepare('SELECT COUNT(*) as count FROM certificates').get();
      const loto = db.prepare('SELECT COUNT(*) as count FROM loto_history').get();
      const risks = db.prepare('SELECT COUNT(*) as count FROM risk_reports').get();
      const workers = db.prepare('SELECT COUNT(*) as count FROM workers').get();

      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        database: 'SQLite 3 (safework_database.sqlite)',
        tables: {
          machines: machines.count,
          checklist_logs: logs.count,
          certificates: certs.count,
          loto_history: loto.count,
          risk_reports: risks.count,
          workers: workers.count
        }
      }));
    } catch (err) {
      res.writeHead(500);
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // -------------------------------------------------------------
  // Servidor de Archivos HTML y estáticos Multi-Página
  // -------------------------------------------------------------
  const targetHtml = ROUTE_TO_FILE[pathname] || 'index.html';
  const filePath = path.join(ROOT_DIR, targetHtml);

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Error loading TECTROMAQ Clinical Platform');
      return;
    }
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache'
    });
    res.end(content);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  // Asegurar que la base de datos SQLite esté inicializada desde el arranque
  getDatabase();

  // Sembrar datos iniciales si la base de datos aún no tiene estado
  try {
    const existingState = getAppState('SAFEWORK_STATE');
    if (!existingState) {
      const defaultState = {
        machines: INITIAL_MACHINES,
        regulatoryAlerts: INITIAL_REGULATORY_ALERTS,
        audits: INITIAL_AUDITS,
        checklistLogs: [],
        iotForceAlert: false,
        riskReports: INITIAL_RISK_REPORTS,
        courses: INITIAL_COURSES,
        certificates: [],
        lotoHistory: INITIAL_LOTO_HISTORY,
        notifications: [
          {
            id: 'NOTIF-INIT-1',
            type: 'warning',
            title: 'Alerta Regulatoria Próxima a Vencer',
            message: 'Certificación y Recarga de Extintores vence en 9 días (Reg. 522-06 Art. 2.8).',
            time: 'Hace 15 min'
          },
          {
            id: 'NOTIF-INIT-2',
            type: 'critical',
            title: 'Alerta Predictiva IA Hidráulica',
            message: 'Probabilidad de fallo en bomba hidráulica estimada en 78% en las próximas 40h.',
            time: 'Hace 5 min'
          }
        ]
      };
      setAppState('SAFEWORK_STATE', defaultState);
      console.log('  ➜ Base de Datos SQLite sembrada exitosamente con registros iniciales.');
    }
  } catch (err) {
    console.error('Error al verificar sembrado de SQLite:', err);
  }

  const hostname = os.hostname();
  const nets = os.networkInterfaces();
  const lanIps = [];
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) lanIps.push(net.address);
    }
  }
  const mainIp = lanIps[0] || '127.0.0.1';

  console.log('====================================================================');
  console.log('  SafeWork 4.0 en TECTROMAQ (SQLITE DATABASE & MULTI-PAGE SERVER)');
  console.log(`  ➜ BD SQLite:           database/safework_database.sqlite (WAL Mode)`);
  console.log('--------------------------------------------------------------------');
  console.log('  ENLACES DE ACCESO PRINCIPALES:');
  console.log(`  ➜ Localhost:           http://localhost:${PORT}/`);
  console.log(`  ➜ Red Local (IP):      http://${mainIp}:${PORT}/`);
  console.log(`  ➜ Nombre PC/Host:      http://${hostname}:${PORT}/`);
  console.log('--------------------------------------------------------------------');
  console.log('  MODULOS DIRECTOS DEL SISTEMA:');
  console.log(`  ➜ Pág 01 Normativa:    http://${mainIp}:${PORT}/normativa`);
  console.log(`  ➜ Pág 02 Inspecciones: http://${mainIp}:${PORT}/inspecciones`);
  console.log(`  ➜ Pág 03 Riesgos:      http://${mainIp}:${PORT}/riesgos`);
  console.log(`  ➜ Pág 04 Monitoreo:    http://${mainIp}:${PORT}/monitoreo`);
  console.log(`  ➜ Pág 05 Capacitación: http://${mainIp}:${PORT}/capacitacion`);
  console.log(`  ➜ Pág 06 LOTO:         http://${mainIp}:${PORT}/liberacion-loto`);
  console.log(`  ➜ API SQLite:          http://${mainIp}:${PORT}/api/state`);
  console.log(`  ➜ Resumen BD SQLite:   http://${mainIp}:${PORT}/api/db-summary`);
  console.log('====================================================================');
});
