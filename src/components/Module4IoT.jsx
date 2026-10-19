import React, { useState, useEffect } from 'react';
import {
  Activity,
  Volume2,
  Thermometer,
  Wind,
  Cpu,
  AlertOctagon,
  CheckCircle2,
  Map as MapIcon,
  Zap,
  Lock,
  Wrench,
  Eye,
  X
} from 'lucide-react';

export default function Module4IoT({
  machines,
  riskReports,
  iotForceAlert,
  setIotForceAlert,
  addNotification,
  setActiveTab
}) {
  // Estado de los 4 sensores IoT con actualización automática cada 4 segundos
  const [sensors, setSensors] = useState([
    {
      id: 'SNS-NOISE',
      nombre: 'Ruido Ambiental en Taller',
      codigo: 'IOT-SD-01',
      unidad: 'dB(A)',
      valor: 82.4,
      limite: 85.0,
      normativa: 'Res. 04-2007 Art. 14 (Máx. 85 dB en 8h)',
      ubicacion: 'Bahía de Pruebas Hidráulicas — Santo Domingo',
      equipoAsociado: 'Banco de Pruebas Hidráulicas CAT / JCB',
      accionCorrectiva: 'Uso obligatorio de protectores auditivos de copa (NRR 28 dB) y cierre de mampara acústica.',
      historial: [79.5, 81.0, 82.1, 83.4, 81.8, 82.4],
      forzarAlerta: false
    },
    {
      id: 'SNS-TEMP',
      nombre: 'Temperatura en Nave de Taller',
      codigo: 'IOT-SD-02',
      unidad: '°C',
      valor: 30.2,
      limite: 32.0,
      normativa: 'Res. 04-2007 Art. 22 (Umbral WBGT 32.0 °C)',
      ubicacion: 'Nave Central de Soldadura y Motores',
      equipoAsociado: 'Extractores Industriales Trifásicos',
      accionCorrectiva: 'Activar ventilación forzada al 100% y pausas de hidratación de 15 min cada hora.',
      historial: [29.4, 29.8, 30.1, 30.5, 30.0, 30.2],
      forzarAlerta: false
    },
    {
      id: 'SNS-GAS',
      nombre: 'Monóxido de Carbono (Gases CO)',
      codigo: 'IOT-SD-03',
      unidad: 'ppm',
      valor: 14.0,
      limite: 25.0,
      normativa: 'OSHA PEL / Res. 04-2007 (Límite 25 ppm)',
      ubicacion: 'Foso de Mantenimiento Diésel CAT / JCB',
      equipoAsociado: 'Ductos de Extracción de Gases de Escape',
      accionCorrectiva: 'Apagar motores diésel en foso cerrado y conectar manguera extractora al tubo de escape.',
      historial: [11.0, 12.5, 13.0, 15.2, 13.8, 14.0],
      forzarAlerta: false
    },
    {
      id: 'SNS-VIB',
      nombre: 'Vibración en Bomba Hidráulica',
      codigo: 'IOT-CAT-04',
      unidad: 'mm/s',
      valor: 5.8,
      limite: 4.5,
      normativa: 'ISO 10816 / Manual TECIROMAQ (Máx. 4.5 mm/s)',
      ubicacion: 'Excavadora CAT 320D / Retroexcavadora JCB 3CX',
      equipoAsociado: 'Bomba Hidráulica Principal de Pistones Axiales',
      accionCorrectiva: 'Programar cambio preventivo de sellos y válvula de alivio antes de las próximas 40 horas.',
      historial: [3.9, 4.2, 4.7, 5.1, 5.4, 5.8],
      forzarAlerta: true
    }
  ]);

  const [lastTick, setLastTick] = useState(new Date().toLocaleTimeString('es-DO'));
  const [selectedSensorModal, setSelectedSensorModal] = useState(null);
  const [selectedAreaModal, setSelectedAreaModal] = useState(null);
  const [predictiveOrderCreated, setPredictiveOrderCreated] = useState(false);

  const lockedMachines = machines.filter((m) => m.estado === 'BLOQUEADO_LOTO');

  // Si se activó bloqueo en Inspecciones, reflejar alerta en el sensor de vibración y ruido
  useEffect(() => {
    if (iotForceAlert) {
      setSensors((prev) =>
        prev.map((s) => {
          if (s.id === 'SNS-VIB') {
            return {
              ...s,
              valor: 7.9,
              forzarAlerta: true,
              historial: [...s.historial.slice(1), 7.9]
            };
          }
          if (s.id === 'SNS-NOISE') {
            return {
              ...s,
              valor: 89.6,
              forzarAlerta: true,
              historial: [...s.historial.slice(1), 89.6]
            };
          }
          return s;
        })
      );
    }
  }, [iotForceAlert]);

  // Ciclo de actualización automática cada 4 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setSensors((prev) =>
        prev.map((s) => {
          let nextVal = s.valor;
          if (s.forzarAlerta) {
            const delta = (Math.random() - 0.45) * 1.2;
            nextVal = Math.max(s.limite + 0.6, Number((s.valor + delta).toFixed(1)));
          } else {
            const delta = (Math.random() - 0.48) * 1.2;
            const raw = Number((s.valor + delta).toFixed(1));
            if (s.id === 'SNS-NOISE') {
              nextVal = Math.min(84.2, Math.max(76.0, raw));
            } else if (s.id === 'SNS-TEMP') {
              nextVal = Math.min(31.4, Math.max(28.5, raw));
            } else if (s.id === 'SNS-GAS') {
              nextVal = Math.min(21.0, Math.max(9.0, raw));
            } else {
              nextVal = Math.min(4.1, Math.max(2.4, raw));
            }
          }
          return {
            ...s,
            valor: nextVal,
            historial: [...s.historial.slice(1), nextVal]
          };
        })
      );
      setLastTick(new Date().toLocaleTimeString('es-DO'));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const toggleSensorSpike = (sensorId) => {
    setSensors((prev) =>
      prev.map((s) => {
        if (s.id !== sensorId) return s;
        const nextForce = !s.forzarAlerta;
        const nextVal = nextForce
          ? Number((s.limite * 1.18).toFixed(1))
          : Number((s.limite * 0.82).toFixed(1));
        return {
          ...s,
          forzarAlerta: nextForce,
          valor: nextVal,
          historial: [...s.historial.slice(1), nextVal]
        };
      })
    );
  };

  const getSensorIcon = (id) => {
    if (id === 'SNS-NOISE') return Volume2;
    if (id === 'SNS-TEMP') return Thermometer;
    if (id === 'SNS-GAS') return Wind;
    return Activity;
  };

  const activeAlertsCount = sensors.filter((s) => s.valor > s.limite).length;

  // Zonas Operativas de Planta y Obra
  const plantAreas = [
    {
      nombre: 'Área de Taller Central',
      sede: 'Santo Domingo',
      nivelRiesgo: 'ALTO',
      badge: 'bg-rose-600 text-white',
      border: 'border-rose-500/50',
      resumen: 'Pruebas hidráulicas de alta presión y soldadura en foso.',
      sensoresAsociados: 'Ruido Ambiental (IOT-SD-01), Temperatura (IOT-SD-02), Gases CO (IOT-SD-03)',
      activosEnZona: 'Banco Hidráulico y Foso de Mantenimiento Diésel',
      medidaControl: 'Extractores encendidos, uso obligatorio de protección auditiva y bandeja antiderrame.'
    },
    {
      nombre: 'Patio de Máquinas Pesadas',
      sede: 'Santo Domingo',
      nivelRiesgo: lockedMachines.length > 0 ? 'BLOQUEO LOTO' : 'MODERADO',
      badge: lockedMachines.length > 0 ? 'bg-rose-600 text-white' : 'bg-amber-500 text-slate-950',
      border: lockedMachines.length > 0 ? 'border-rose-500' : 'border-amber-500/40',
      resumen:
        lockedMachines.length > 0
          ? `${lockedMachines.length} máquina(s) bloqueada(s) por falla crítica en espera de liberación LOTO.`
          : 'Estacionamiento y maniobras de excavadoras CAT 320D y retroexcavadoras JCB 3CX.',
      sensoresAsociados: 'Vibración Hidráulica en Cabina (IOT-CAT-04)',
      activosEnZona: 'Excavadora CAT 320D, Retroexcavadora JCB 3CX, Rodillo Dynapac CA250',
      medidaControl: 'Inspección pre-turno obligatoria antes de encender cualquier equipo.'
    },
    {
      nombre: 'Almacén de Repuestos y Lubricantes',
      sede: 'Santo Domingo',
      nivelRiesgo: 'CONTROLADO',
      badge: 'bg-emerald-500 text-slate-950',
      border: 'border-slate-800',
      resumen: 'Almacenamiento de mangueras SAE 100R12 y cubetas de aceite hidráulico ISO VG 68.',
      sensoresAsociados: 'Control de Temperatura de Estantería y Extintores PQS',
      activosEnZona: 'Stock de Sellos, Mangueras y Lubricantes',
      medidaControl: 'Hojas MSDS visibles, dique de contención y faja lumbar para cargas mayores a 15 kg.'
    },
    {
      nombre: 'Frente de Obra Punta Cana',
      sede: 'Bávaro / Punta Cana',
      nivelRiesgo: 'CONTROLADO',
      badge: 'bg-emerald-500 text-slate-950',
      border: 'border-slate-800',
      resumen: 'Movimiento de tierras, excavación de zanjas y compactación de sub-base.',
      sensoresAsociados: 'Telemetría GPS Satelital y Vibración de Cabina ROPS/FOPS',
      activosEnZona: 'Flota Destacada en Obra Este',
      medidaControl: 'Perímetro de seguridad de 8 metros alrededor del giro de la excavadora.'
    }
  ];

  // Sincronizar el sensor abierto en modal con sus lecturas en vivo
  const currentModalSensor = selectedSensorModal
    ? sensors.find((s) => s.id === selectedSensorModal.id)
    : null;

  return (
    <div className="space-y-6">
      {/* Encabezado Principal */}
      <div className="rounded-2xl bg-zinc-900 border border-slate-800 p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
              <Cpu className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Monitoreo de Sensores en Tiempo Real
            </h1>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 flex items-center gap-2.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <div className="text-xs font-mono text-slate-300">
              Actualización cada <strong className="text-white">4s</strong> • Última lectura: <strong className="text-amber-400">{lastTick}</strong>
            </div>
          </div>
        </div>
        <p className="text-slate-400 text-sm mt-2">
          Supervise de forma sencilla el ruido, temperatura, gases y vibración de las máquinas en planta. Si un sensor supera el límite legal, se ilumina en rojo para actuar de inmediato.
        </p>
      </div>

      {/* Resumen Rápido en 3 Indicadores */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-zinc-900/90 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Sensores Conectados
            </span>
            <span className="text-3xl font-extrabold font-mono text-white mt-1 block">
              {sensors.length} Activos
            </span>
            <span className="text-xs text-emerald-400 mt-1 block">
              Transmitiendo cada 4 segundos
            </span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-zinc-900/90 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Sensores en Alerta
            </span>
            <span className={`text-3xl font-extrabold font-mono mt-1 block ${activeAlertsCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {activeAlertsCount} {activeAlertsCount === 1 ? 'Alerta' : 'Alertas'}
            </span>
            <span className="text-xs text-slate-400 mt-1 block">
              Por encima del límite normativo
            </span>
          </div>
          <div className={`p-3 rounded-xl border ${activeAlertsCount > 0 ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
            <AlertOctagon className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-zinc-900/90 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Riesgo Bomba Hidráulica
            </span>
            <span className="text-3xl font-extrabold font-mono text-amber-400 mt-1 block">
              78% (40h)
            </span>
            <span className="text-xs text-slate-400 mt-1 block">
               requiere mantenimiento preventivo
            </span>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Zap className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Alerta si hay Máquinas Bloqueadas por LOTO */}
      {lockedMachines.length > 0 && (
        <div className="p-5 rounded-2xl bg-rose-950/30 border-2 border-rose-600 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-600 text-white shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-white">
                {lockedMachines.length} Máquina(s) Bloqueada(s) por Seguridad (LOTO)
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('loto')}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold shrink-0 flex items-center gap-2"
            >
              <Wrench className="w-4 h-4" />
              Ir a Liberación LOTO
            </button>
          </div>
          <p className="text-xs text-rose-200 mt-2">
            Equipos detenidos: <strong>{lockedMachines.map((m) => `${m.nombre} (${m.lotoCode})`).join(' • ')}</strong>. Los sensores detectaron vibración y presión fuera de rango.
          </p>
        </div>
      )}

      {/* PASO 1: Los 4 Sensores en Vivo */}
      <div className="bg-zinc-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-amber-400 shrink-0" />
            <h2 className="text-base font-bold text-white">
              1. Lectura de Sensores en Planta y Maquinaria
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Use el botón "Probar Alerta / Restaurar" para simular una emergencia
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {sensors.map((sensor) => {
            const Icon = getSensorIcon(sensor.id);
            const exceeded = sensor.valor > sensor.limite;
            const pct = Math.min(100, Math.round((sensor.valor / (sensor.limite * 1.25)) * 100));

            return (
              <div
                key={sensor.id}
                className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                  exceeded
                    ? 'bg-rose-950/25 border-rose-500 shadow-lg'
                    : 'bg-slate-950/90 border-slate-800'
                }`}
              >
                <div>
                  {/* Fila superior alineada: Icono + Nombre a la izquierda, Estado a la derecha */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`p-2 rounded-xl border shrink-0 ${
                          exceeded
                            ? 'bg-rose-600/20 border-rose-500/40 text-rose-400'
                            : 'bg-zinc-900 border-slate-800 text-amber-400'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-sm font-bold text-white">
                        {sensor.nombre}
                      </h3>
                    </div>

                    {exceeded ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-rose-600 text-white shrink-0">
                        <AlertOctagon className="w-3.5 h-3.5" />
                        LÍMITE SUPERADO
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        NORMAL
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 mt-2">
                    Ubicación: <strong className="text-slate-300">{sensor.ubicacion}</strong>
                  </p>

                  {/* Lectura actual vs Límite máximo */}
                  <div className="mt-4 p-3.5 rounded-xl bg-zinc-900/90 border border-slate-800/90 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 uppercase font-bold block">
                        Lectura Actual
                      </span>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span
                          className={`text-2xl font-extrabold font-mono ${
                            exceeded ? 'text-rose-400' : 'text-white'
                          }`}
                        >
                          {sensor.valor.toFixed(1)}
                        </span>
                        <span className="text-xs font-mono text-slate-400">
                          {sensor.unidad}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 uppercase font-bold block">
                        Límite Máximo Legal
                      </span>
                      <span className="text-sm font-mono font-bold text-amber-400 mt-1 block">
                        Máx. {sensor.limite.toFixed(1)} {sensor.unidad}
                      </span>
                    </div>
                  </div>

                  {/* Barra de nivel limpia */}
                  <div className="mt-3 w-full h-2 rounded-full bg-zinc-900 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full transition-all duration-500 ${
                        exceeded ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Botones de Acción Alineados */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedSensorModal(sensor)}
                    className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-slate-200 border border-slate-700 text-xs font-bold inline-flex items-center gap-1.5 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                    Ficha del Sensor
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleSensorSpike(sensor.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-extrabold border transition-all ${
                      exceeded
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 border-emerald-400'
                        : 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border-rose-500/30'
                    }`}
                  >
                    {exceeded ? 'Restaurar a Nivel Normal' : 'Probar Alerta de Peligro'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PASO 2: Diagnóstico Preventivo de Maquinaria (Simple y Directo) */}
      <div className="rounded-2xl bg-zinc-900/90 border-2 border-amber-500/50 p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Zap className="w-5 h-5 text-amber-400 shrink-0" />
            <h2 className="text-base font-bold text-white">
              2. Diagnóstico Preventivo: Bomba Hidráulica (Excavadora CAT 320D)
            </h2>
          </div>

          {predictiveOrderCreated ? (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-extrabold shrink-0">
              <CheckCircle2 className="w-4 h-4" />
              Orden OT-PRED-2026-904 Programada
            </span>
          ) : (
            <button
              type="button"
              onClick={() => {
                setPredictiveOrderCreated(true);
                addNotification(
                  'Orden Preventiva Generada (OT-PRED-2026-904)',
                  'Se programó el cambio preventivo de sellos y válvula en la bomba hidráulica antes de las 40 horas.',
                  'info',
                  'iot'
                );
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold transition-all shrink-0 inline-flex items-center gap-2"
            >
              <Wrench className="w-4 h-4" />
              Programar Mantenimiento Preventivo
            </button>
          )}
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">
          El sensor de vibración detectó desgaste interno en la bomba hidráulica principal (<strong className="text-amber-400">5.8 mm/s</strong>, superando el límite de 4.5 mm/s). Existe un <strong className="text-rose-400">78% de probabilidad de rotura</strong> en las próximas <strong className="text-white">40 horas de uso</strong> si no se cambian los sellos a tiempo.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase font-bold block">
              Equipo Monitoreado
            </span>
            <span className="text-sm font-bold text-white mt-1 block">
              Excavadora CAT 320D / JCB 3CX
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase font-bold block">
              Tiempo Restante Seguro
            </span>
            <span className="text-sm font-mono font-bold text-rose-400 mt-1 block">
              40 Horas de Operación
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase font-bold block">
              Trabajo Recomendado
            </span>
            <span className="text-sm font-bold text-emerald-400 mt-1 block">
              Cambio de sellos y válvula de alivio
            </span>
          </div>
        </div>
      </div>

      {/* PASO 3: Estado de Seguridad por Zonas de Planta y Obra */}
      <div className="bg-zinc-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <MapIcon className="w-5 h-5 text-amber-400 shrink-0" />
            <h2 className="text-base font-bold text-white">
              3. Estado de Seguridad por Zonas de Trabajo
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            4 sectores monitoreados en Santo Domingo y Punta Cana
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plantAreas.map((area) => (
            <div
              key={area.nombre}
              className={`p-5 rounded-2xl bg-slate-950/90 border ${area.border} flex flex-col justify-between gap-4`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-white">
                    {area.nombre}
                  </h3>
                  <span className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold shrink-0 ${area.badge}`}>
                    {area.nivelRiesgo}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-2">
                  {area.resumen}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono text-slate-400 truncate">
                  Sede: {area.sede}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedAreaModal(area)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-slate-200 border border-slate-700 text-xs font-bold inline-flex items-center gap-1.5 shrink-0"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  Ver Medidas
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL 1: Ficha Técnica y Lecturas del Sensor */}
      {currentModalSensor && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedSensorModal(null)}
        >
          <div
            className="bg-zinc-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Activity className="w-5 h-5 text-amber-400 shrink-0" />
                <h3 className="text-base font-extrabold text-white">
                  {currentModalSensor.nombre}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSensorModal(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block">Lectura en Vivo:</span>
                  <span className={`text-2xl font-mono font-extrabold ${currentModalSensor.valor > currentModalSensor.limite ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {currentModalSensor.valor.toFixed(1)} {currentModalSensor.unidad}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block">Límite Normativo:</span>
                  <span className="text-base font-mono font-bold text-amber-400">
                    Máx. {currentModalSensor.limite.toFixed(1)} {currentModalSensor.unidad}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div>
                  <span className="text-slate-400 font-bold block">Ubicación Instalada:</span>
                  <span className="text-white">{currentModalSensor.ubicacion}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">Equipo Vinculado:</span>
                  <span className="text-white">{currentModalSensor.equipoAsociado}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">Base Legal:</span>
                  <span className="text-amber-400 font-mono">{currentModalSensor.normativa}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <span className="text-amber-400 font-bold block mb-1">
                  ¿Qué hacer si este sensor entra en alerta?
                </span>
                <p className="text-slate-200 leading-relaxed">
                  {currentModalSensor.accionCorrectiva}
                </p>
              </div>

              <div>
                <span className="text-slate-400 font-bold block mb-2">
                  Últimas 6 lecturas registradas ({currentModalSensor.unidad}):
                </span>
                <div className="grid grid-cols-6 gap-2">
                  {currentModalSensor.historial.map((val, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded-lg text-center font-mono font-bold border ${
                        val > currentModalSensor.limite
                          ? 'bg-rose-950/50 border-rose-500/50 text-rose-300'
                          : 'bg-slate-950 border-slate-800 text-slate-300'
                      }`}
                    >
                      {val.toFixed(1)}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => toggleSensorSpike(currentModalSensor.id)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold ${
                  currentModalSensor.valor > currentModalSensor.limite
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-rose-600 text-white'
                }`}
              >
                {currentModalSensor.valor > currentModalSensor.limite
                  ? 'Restaurar a Nivel Normal'
                  : 'Simular Alerta Ahora'}
              </button>
              <button
                type="button"
                onClick={() => setSelectedSensorModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Detalle de Zona Operativa */}
      {selectedAreaModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedAreaModal(null)}
        >
          <div
            className="bg-zinc-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <MapIcon className="w-5 h-5 text-amber-400 shrink-0" />
                <h3 className="text-base font-extrabold text-white">
                  {selectedAreaModal.nombre}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAreaModal(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 font-bold">Nivel de Riesgo Actual:</span>
                <span className={`px-2.5 py-1 rounded-lg font-extrabold ${selectedAreaModal.badge}`}>
                  {selectedAreaModal.nivelRiesgo}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div>
                  <span className="text-slate-400 font-bold block">Actividad en el Sector:</span>
                  <span className="text-white">{selectedAreaModal.resumen}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">Maquinaria y Equipos en Zona:</span>
                  <span className="text-white">{selectedAreaModal.activosEnZona}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">Sensores Instalados:</span>
                  <span className="text-amber-400 font-mono">{selectedAreaModal.sensoresAsociados}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <span className="text-emerald-400 font-bold block mb-1">
                  Protocolo de Seguridad Obligatorio:
                </span>
                <p className="text-slate-200 leading-relaxed">
                  {selectedAreaModal.medidaControl}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedAreaModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
