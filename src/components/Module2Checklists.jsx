import React, { useState, useRef, useEffect } from 'react';
import {
  ClipboardCheck,
  AlertOctagon,
  CheckCircle2,
  XCircle,
  MapPin,
  Camera,
  Gauge,
  UserCheck,
  Lock,
  Unlock,
  Wrench,
  PenTool,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  FileWarning,
  Truck,
  X
} from 'lucide-react';
import { CHECKLIST_TEMPLATE } from '../data/initialData';

export default function Module2Checklists({
  machines,
  setMachines,
  checklistLogs,
  setChecklistLogs,
  workers = [],
  setWorkers,
  activeWorkerId,
  setActiveWorkerId,
  addNotification,
  setActiveTab,
  triggerIoTAlertFromChecklist
}) {
  const [selectedMachineId, setSelectedMachineId] = useState(machines[0]?.id || 'EQ-CAT-320D');
  const selectedMachine = machines.find((m) => m.id === selectedMachineId) || machines[0];

  const [operador, setOperador] = useState(selectedMachine?.operadorAsignado || 'Op. Carlos M. Castillo');
  const [horometro, setHorometro] = useState(String(selectedMachine?.horometro || 0));
  const [geoPreset, setGeoPreset] = useState('SD');
  const [coordenadas, setCoordenadas] = useState('18.4861° N, 69.9312° W — Patio Central TECTROMAQ Santo Domingo');
  const [photoPreview, setPhotoPreview] = useState('hydraulic_leak'); // 'hydraulic_leak'| 'brake_wear'| 'compliant_machine'| custom dataURL
  const [observacionesGenerales, setObservacionesGenerales] = useState('');

  // Estado de cada sub-requisito normativo (checkboxes obligatorios para poder declarar CONFORME)
  const [subChecks, setSubChecks] = useState({
    'CHK-01-A': true,
    'CHK-01-B': true,
    'CHK-01-C': true,
    'CHK-02-A': true,
    'CHK-02-B': true,
    'CHK-02-C': true,
    'CHK-03-A': true,
    'CHK-03-B': true,
    'CHK-03-C': true,
    'CHK-04-A': true,
    'CHK-04-B': true,
    'CHK-04-C': true,
    'CHK-05-A': true,
    'CHK-05-B': true,
    'CHK-05-C': true
  });

  // Estado de cada punto del checklist: 'CONFORME' | 'NO_CONFORME'
  const [answers, setAnswers] = useState({
    'CHK-01': 'CONFORME',
    'CHK-02': 'CONFORME',
    'CHK-03': 'CONFORME',
    'CHK-04': 'CONFORME',
    'CHK-05': 'CONFORME'
  });

  // Controla qué punto tiene desplegado el checklist de inspección normativa
  const [openItemId, setOpenItemId] = useState(null);

  const toggleInspectPanel = (itemId) => {
    setOpenItemId((prev) => (prev === itemId ? null : itemId));
  };

  const handleToggleSubCheck = (item, reqId) => {
    setSubChecks((prev) => {
      const next = { ...prev, [reqId]: !prev[reqId] };
      const allMet = (item.requisitos || []).every((r) => next[r.id]);
      setAnswers((prevAns) => ({
        ...prevAns,
        [item.id]: allMet ? 'CONFORME' : 'NO_CONFORME'
      }));
      return next;
    });
  };

  const handleMarkItemConforme = (item) => {
    const updatedSubs = {};
    (item.requisitos || []).forEach((r) => {
      updatedSubs[r.id] = true;
    });
    setSubChecks((prev) => ({ ...prev, ...updatedSubs }));
    setAnswers((prev) => ({ ...prev, [item.id]: 'CONFORME' }));
  };

  const handleMarkItemNoConforme = (item) => {
    const firstReq = item.requisitos?.[0];
    if (firstReq) {
      const allMet = (item.requisitos || []).every((r) => subChecks[r.id]);
      if (allMet) {
        setSubChecks((prev) => ({ ...prev, [firstReq.id]: false }));
      }
    }
    setAnswers((prev) => ({ ...prev, [item.id]: 'NO_CONFORME' }));
  };

  // Canvas de firma digital
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  // Modal de resultado de bloqueo LOTO
  const [lockoutModalData, setLockoutModalData] = useState(null);

  useEffect(() => {
    if (selectedMachine) {
      setOperador(selectedMachine.operadorAsignado);
      setHorometro(String(selectedMachine.horometro));
    }
  }, [selectedMachineId]);

  // Inicializar canvas con guía sutil
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
  }, []);

  const handleGeoChange = (preset) => {
    setGeoPreset(preset);
    if (preset === 'SD') {
      setCoordenadas('18.4861° N, 69.9312° W — Patio Central TECTROMAQ Santo Domingo');
    } else if (preset === 'PC') {
      setCoordenadas('18.5601° N, 68.3725° W — Frente de Obra Bávaro / Punta Cana');
    } else {
      setCoordenadas('18.4729° N, 69.8923° W — Zona Industrial de Herrera, Santo Domingo Oeste');
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhotoPreview(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Funciones de firma en Canvas (Mouse y Touch)
  const getCoordinates = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if (e.touches && e.touches[0]) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const pos = getCoordinates(e, canvas);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setIsDrawing(true);
    setHasSignature(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    const pos = getCoordinates(e, canvas);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const applyQuickDigitalSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(35, 75);
    ctx.bezierCurveTo(65, 25, 95, 95, 135, 45);
    ctx.bezierCurveTo(165, 20, 190, 85, 235, 55);
    ctx.lineTo(310, 50);
    ctx.stroke();

    ctx.fillStyle = '#0369a1';
    ctx.font = '11px Plus Jakarta Sans, sans-serif';
    ctx.fillText(`FIRMA VALIDADA: ${operador.toUpperCase()}`, 35, 98);
    setHasSignature(true);
  };

  // Verificar si algún punto crítico está marcado como NO_CONFORME
  const criticalFailures = CHECKLIST_TEMPLATE.filter(
    (item) => item.critico && answers[item.id] === 'NO_CONFORME');
  const hasCriticalFailure = criticalFailures.length > 0;

  const handleSimulateCriticalFailureDemo = () => {
    setSubChecks({
      'CHK-01-A': true,
      'CHK-01-B': true,
      'CHK-01-C': true,
      'CHK-02-A': false,
      'CHK-02-B': false,
      'CHK-02-C': true,
      'CHK-03-A': true,
      'CHK-03-B': true,
      'CHK-03-C': true,
      'CHK-04-A': true,
      'CHK-04-B': true,
      'CHK-04-C': true,
      'CHK-05-A': true,
      'CHK-05-B': true,
      'CHK-05-C': true
    });
    setAnswers({
      'CHK-01': 'CONFORME',
      'CHK-02': 'NO_CONFORME',
      'CHK-03': 'CONFORME',
      'CHK-04': 'CONFORME',
      'CHK-05': 'CONFORME'});
    setOpenItemId('CHK-02');
    setPhotoPreview('hydraulic_leak');
    setObservacionesGenerales(
      'Fuga activa detectada en racor de manguera hidráulica de alta presión del brazo principal (34,000 kPa). Peligro de rotura e inyección de fluido.');
    applyQuickDigitalSignature();
  };

  const handleSubmitChecklist = (e) => {
    e.preventDefault();
    if (!hasSignature) {
      applyQuickDigitalSignature();
    }

    const timestamp = new Date().toLocaleString('es-DO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'});

    if (hasCriticalFailure) {
      const generatedLotoCode = `LOTO-2026-SD-${Math.floor(1000 + Math.random() * 8999)}`;
      const generatedWorkOrder = `OT-MANT-2026-${Math.floor(1000 + Math.random() * 8999)}`;
      const failureSummary = criticalFailures.map((f) => f.titulo).join('+ ');

      // Bloquear máquina automáticamente
      setMachines((prev) =>
        prev.map((m) => {
          if (m.id === selectedMachineId) {
            return {
              ...m,
              operadorAsignado: operador,
              horometro: parseFloat(horometro) || m.horometro,
              ubicacion: coordenadas,
              estado: 'BLOQUEADO_LOTO',
              lotoCode: generatedLotoCode,
              workOrder: generatedWorkOrder,
              motivoBloqueo: `${failureSummary}. ${observacionesGenerales || ''}`.trim(),
              fechaBloqueo: timestamp,
              ultimaInspeccion: timestamp,
              presionHidraulica: '19,200 kPa (Caída Crítica)',
              saludBomba: 48
            };
          }
          return m;
        })
      );

      // Registrar en bitácora de checklists
      const newLog = {
        id: `INSP-${Math.floor(10000 + Math.random() * 89999)}`,
        fecha: timestamp,
        maquinaId: selectedMachine.id,
        maquinaNombre: selectedMachine.nombre,
        machineId: selectedMachine.id,
        machineName: selectedMachine.nombre,
        operador,
        horometro,
        coordenadas,
        resultado: 'BLOQUEO CRÍTICO LOTO',
        lotoCode: generatedLotoCode,
        workOrder: generatedWorkOrder,
        fallasCriticas: criticalFailures.map((c) => c.titulo),
        fallasDetectadas: criticalFailures.map((c) => c.titulo),
        firma: `FIRMA_DIGITAL_${operador.toUpperCase()}`
      };
      setChecklistLogs((prev) => [newLog, ...prev]);

      // Disparar anomalía en telemetría IoT (Módulo 4)
      if (triggerIoTAlertFromChecklist) {
        triggerIoTAlertFromChecklist(selectedMachine.nombre, generatedLotoCode);
      }

      addNotification(
        ` PARADA CRÍTICA LOTO: ${selectedMachine.id}`,
        `Equipo bloqueado automáticamente (${generatedLotoCode}). Orden emitida: ${generatedWorkOrder}.`,
        'critical',
        'loto');

      setLockoutModalData({
        machine: selectedMachine.nombre,
        machineId: selectedMachine.id,
        lotoCode: generatedLotoCode,
        workOrder: generatedWorkOrder,
        operador,
        coordenadas,
        failures: criticalFailures
      });
    } else {
      // Todo conforme -> equipo operativo
      setMachines((prev) =>
        prev.map((m) => {
          if (m.id === selectedMachineId) {
            return {
              ...m,
              operadorAsignado: operador,
              horometro: parseFloat(horometro) || m.horometro,
              ubicacion: coordenadas,
              ultimaInspeccion: timestamp
            };
          }
          return m;
        })
      );

      const newLog = {
        id: `INSP-${Math.floor(10000 + Math.random() * 89999)}`,
        fecha: timestamp,
        maquinaId: selectedMachine.id,
        maquinaNombre: selectedMachine.nombre,
        machineId: selectedMachine.id,
        machineName: selectedMachine.nombre,
        operador,
        horometro,
        coordenadas,
        resultado: 'APROBADO / OPERATIVO',
        lotoCode: null,
        workOrder: null,
        fallasCriticas: [],
        fallasDetectadas: [],
        firma: `FIRMA_DIGITAL_${operador.toUpperCase()}`
      };
      setChecklistLogs((prev) => [newLog, ...prev]);

      addNotification(
        ` Inspección Conforme: ${selectedMachine.id}`,
        `Checklist pre-operacional aprobado para ${selectedMachine.nombre}. Unidad autorizada para turno.`,
        'success',
        'checklists');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-zinc-900 via-slate-900 to-zinc-900 border border-slate-800 p-6 sm:p-7 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-2">
              <ClipboardCheck className="w-3.5 h-3.5" />
              INSPECCIÓN PRE-OPERACIONAL & REGLA STOP-WORK (MAQUINARIA PESADA)
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Checklists Dinámicos con Vinculación Normativa & Bloqueo LOTO
            </h1>
            <p className="text-slate-400 text-sm mt-1.5 max-w-3xl leading-relaxed">
              Verificación técnica pre-turno obligatoria. Cualquier hallazgo <span className="text-rose-400 font-bold">Crítico No Conforme</span> ejecuta automáticamente el protocolo de bloqueo de energía <strong className="text-amber-400">LOTO</strong> y emite la Orden de Mantenimiento.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {selectedMachine?.estado === 'BLOQUEADO_LOTO' && (
              <button
                type="button"
                onClick={() => {
                  setMachines((prev) =>
                    prev.map((m) =>
                      m.id === selectedMachineId
                        ? {
                            ...m,
                            estado: 'OPERATIVO',
                            lotoCode: null,
                            workOrder: null,
                            motivoBloqueo: null,
                            fechaBloqueo: null
                          }
                        : m
                    )
                  );
                  addNotification(
                    ` Desbloqueo Técnico: ${selectedMachine.id}`,
                    `Unidad restaurada a OPERATIVO para permitir nuevas inspecciones pre-operacionales.`,
                    'success',
                    'checklists'
                  );
                }}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg"
              >
                <Unlock className="w-3.5 h-3.5" />
                Habilitar {selectedMachine.id} a Operativo
              </button>
            )}
            <button
              type="button"
              onClick={handleSimulateCriticalFailureDemo}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-lg"
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              Simular Falla Crítica LOTO (Demo 1-Clic)
            </button>
          </div>
        </div>
      </div>

      {/* Paso 1: Selector de Maquinaria Pesada (3 Unidades) */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Truck className="w-4 h-4 text-amber-400" />
            1. Seleccione Activo de Maquinaria Pesada a Inspeccionar
          </h2>
          <span className="text-xs font-medium text-slate-400">
            Flota Pesada TECTROMAQ Santo Domingo / Punta Cana
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {machines.map((machine) => {
            const isSelected = machine.id === selectedMachineId;
            const isLocked = machine.estado === 'BLOQUEADO_LOTO';
            return (
              <button
                key={machine.id}
                type="button"
                onClick={() => setSelectedMachineId(machine.id)}
                className={`text-left p-6 rounded-3xl border-2 transition-all relative overflow-hidden ${
                  isSelected
                    ? isLocked
                      ? 'bg-rose-950/25 border-rose-500 shadow-xl'
                      : 'bg-zinc-900 border-emerald-500 shadow-xl'
                    : 'bg-zinc-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs font-bold text-amber-400">
                    {machine.id}
                  </span>
                  {isLocked ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-rose-600 text-white">
                      <Lock className="w-3 h-3" />
                      BLOQUEADO LOTO
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" />
                      OPERATIVO
                    </span>
                  )}
                </div>

                <h3 className="text-base font-extrabold text-white leading-snug">
                  {machine.nombre}
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-1.5">
                  Serie: {machine.serie} • Horómetro: {machine.horometro} hrs
                </p>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-300 truncate font-medium">{machine.operadorAsignado}</span>
                  {machine.lotoCode && (
                    <span className="font-mono font-bold text-rose-400">
                      {machine.lotoCode}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Formulario Principal de Inspección */}
      <form onSubmit={handleSubmitChecklist} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Columna Izquierda: Datos de Campo + Puntos de Verificación */}
        <div className="lg:col-span-7 space-y-6">
          {/* Paso 2: Datos de campo obligatorios */}
          <div className="bg-zinc-900/90 border border-slate-800 rounded-3xl p-7 sm:p-8 shadow-lg space-y-5">
            <div className="pb-3 border-b border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2.5 leading-none">
                  <UserCheck className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>2. Datos Obligatorios de Campo y Geolocalización</span>
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Verifique el operador responsable, la lectura del horómetro y la ubicación GPS del equipo.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-300">
                    Operador Asignado (Carné MOPC Cat. 05)
                  </label>
                  {workers.length > 0 && (
                    <span className="text-[11px] text-amber-400 font-mono">
                      {workers.length} operadores registrados
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    list="registered-workers-list"
                    value={operador}
                    onChange={(e) => setOperador(e.target.value)}
                    placeholder="Seleccione o escriba el nombre del operador"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-amber-500 focus:outline-none"
                  />
                  <datalist id="registered-workers-list">
                    {workers.map((w) => (
                      <option key={w.id} value={w.nombre}>
                        {w.cargo} ({w.id} • {w.cedula})
                      </option>
                    ))}
                  </datalist>
                </div>
                {workers.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {workers.map((w) => (
                      <button
                        key={w.id}
                        type="button"
                        onClick={() => setOperador(w.nombre)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                          operador === w.nombre
                            ? 'bg-amber-500 text-slate-950 font-bold border-amber-500'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        {w.id}: {w.nombre.split(' ')[1] || w.nombre}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  Horómetro Actual de Cabina (Horas)
                </label>
                <div className="relative">
                  <Gauge className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={horometro}
                    onChange={(e) => setHorometro(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-sm font-mono text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Geolocalización Satelital GPS (República Dominicana)</span>
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { code: 'SD', label: 'Santo Domingo' },
                    { code: 'PC', label: 'Punta Cana' },
                    { code: 'HERRERA', label: 'Taller Herrera' }
                  ].map((loc) => (
                    <button
                      key={loc.code}
                      type="button"
                      onClick={() => handleGeoChange(loc.code)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                        geoPreset === loc.code
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-slate-950 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {loc.label}
                    </button>
                  ))}
                </div>
              </div>
              <input
                type="text"
                readOnly
                value={coordenadas}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400"
              />
            </div>
          </div>

          {/* Paso 3: Puntos de Verificación con Checklist de Cumplimiento Normativo */}
          <div className="bg-zinc-900/90 border border-slate-800 rounded-3xl p-7 sm:p-8 shadow-lg space-y-5">
            <div className="pb-4 border-b border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2.5 leading-none">
                  <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>3. Puntos de Verificación y Criterios de Normativa Vinculada</span>
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    const allTrue = {};
                    CHECKLIST_TEMPLATE.forEach((it) => {
                      (it.requisitos || []).forEach((r) => {
                        allTrue[r.id] = true;
                      });
                    });
                    setSubChecks(allTrue);
                    setAnswers({
                      'CHK-01': 'CONFORME',
                      'CHK-02': 'CONFORME',
                      'CHK-03': 'CONFORME',
                      'CHK-04': 'CONFORME',
                      'CHK-05': 'CONFORME'
                    });
                  }}
                  className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold shrink-0 whitespace-nowrap"
                >
                  Restaurar Todo Conforme
                </button>
              </div>
              <p className="text-xs text-slate-400">
                Presione el botón <strong className="text-amber-400">Inspección</strong> en cada punto para desplegar y verificar los requisitos exigidos por su normativa vinculada.
              </p>
            </div>

            <div className="space-y-4">
              {CHECKLIST_TEMPLATE.map((item) => {
                const status = answers[item.id];
                const isNoConforme = status === 'NO_CONFORME';
                const reqList = item.requisitos || [];
                const completedCount = reqList.filter((r) => subChecks[r.id]).length;
                const allReqsMet = completedCount === reqList.length;

                return (
                  <div
                    key={item.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      isNoConforme && item.critico
                        ? 'bg-rose-950/30 border-rose-500 shadow-lg'
                        : isNoConforme
                        ? 'bg-amber-950/25 border-amber-500/60'
                        : 'bg-slate-950/90 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] font-bold text-slate-300">
                            {item.id}
                          </span>
                          {item.critico ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[11px] font-extrabold uppercase tracking-wider">
                              Crítico • Stop Work
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[11px] font-bold uppercase">
                              Estándar SST
                            </span>
                          )}
                          <span className="inline-flex items-center text-xs font-mono text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                            {item.normativa}
                          </span>
                          <span className={`inline-flex items-center text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                            allReqsMet
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-600 text-white'
                          }`}>
                            {allReqsMet
                              ? `CONFORME (${completedCount}/${reqList.length})`
                              : `NO CONFORME (${completedCount}/${reqList.length})`}
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-white leading-snug">
                          {item.titulo}
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {item.descripcion}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleMarkItemConforme(item)}
                          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                            status === 'CONFORME'
                              ? 'bg-emerald-500 text-slate-950 border-emerald-500 shadow-md'
                              : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Conforme</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMarkItemNoConforme(item)}
                          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                            status === 'NO_CONFORME'
                              ? 'bg-rose-600 text-white border-rose-500 shadow-md'
                              : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>No Cumple</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setOpenItemId(item.id)}
                          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 whitespace-nowrap"
                        >
                          <ClipboardCheck className="w-3.5 h-3.5 shrink-0" />
                          <span>Detalle</span>
                        </button>
                      </div>
                    </div>

                    {isNoConforme && item.critico && (
                      <div className="mt-4 pt-3 border-t border-rose-500/30 flex items-center gap-2.5 text-xs text-rose-400 font-bold">
                        <AlertOctagon className="w-4 h-4 shrink-0" />
                        <span>
                          Incumplimiento Normativo Crítico ({item.normativa}): Al guardar este checklist, la unidad {selectedMachine.id} quedará bloqueada por LOTO y se emitirá Orden de Mantenimiento.
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Columna Derecha: Evidencia Fotográfica + Firma Digital Canvas + Guardar */}
        <div className="lg:col-span-5 space-y-6">
          {/* Paso 4: Registro Técnico de Evidencia y Parámetros del Equipo */}
          <div className="bg-zinc-900/90 border border-slate-800 rounded-3xl p-7 sm:p-8 shadow-lg space-y-5">
            <div className="pb-3 border-b border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2.5 leading-none">
                  <Camera className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>4. Evidencia de Campo y Diagnóstico del Activo</span>
                </h3>
                <label className="cursor-pointer inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold border border-slate-700 transition-all shrink-0 whitespace-nowrap">
                  <Camera className="w-3.5 h-3.5 shrink-0" />
                  <span>Adjuntar Fotografía Real</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-xs text-slate-400">
                Seleccione el tipo de hallazgo técnico en {selectedMachine.nombre} ({selectedMachine.id}) o suba una foto desde su dispositivo.
              </p>
            </div>

            {/* Selector de escenario técnico específico de maquinaria pesada TECTROMAQ */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setPhotoPreview('hydraulic_leak')}
                className={`inline-flex items-center justify-center px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  photoPreview === 'hydraulic_leak'
                    ? 'bg-rose-600 text-white border-rose-600'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Fuga Línea Hidráulica (34,000 kPa)
              </button>
              <button
                type="button"
                onClick={() => setPhotoPreview('brake_wear')}
                className={`inline-flex items-center justify-center px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  photoPreview === 'brake_wear'
                    ? 'bg-amber-500 text-slate-950 border-amber-500'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Pérdida Freno Hidrostático
              </button>
              <button
                type="button"
                onClick={() => setPhotoPreview('compliant_machine')}
                className={`inline-flex items-center justify-center px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  photoPreview === 'compliant_machine'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Parámetros Operativos Conformes
              </button>
            </div>

            {/* Ficha técnica específica del activo o fotografía real subida */}
            {photoPreview.startsWith('data:image') ? (
              <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 relative">
                <img
                  src={photoPreview}
                  alt="Evidencia fotográfica subida por el operador"
                  className="w-full h-52 object-cover"
                />
                <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-400">
                    Fotografía adjuntada para {selectedMachine.id} ({selectedMachine.nombre})
                  </span>
                  <button
                    type="button"
                    onClick={() => setPhotoPreview('compliant_machine')}
                    className="text-rose-400 font-bold hover:underline"
                  >
                    Quitar foto
                  </button>
                </div>
              </div>
            ) : (
              <div
                className={`rounded-2xl border-2 p-4 space-y-3 ${
                  photoPreview === 'hydraulic_leak'
                    ? 'bg-rose-950/20 border-rose-500/60'
                    : photoPreview === 'brake_wear'
                    ? 'bg-amber-950/25 border-amber-500/60'
                    : 'bg-emerald-950/20 border-emerald-500/40'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
                  <div>
                    <span className="text-[11px] font-mono font-bold uppercase text-amber-400 block">
                      FICHA DE DIAGNÓSTICO EN CAMPO • {selectedMachine.id}
                    </span>
                    <h4 className="text-sm font-extrabold text-white mt-0.5">
                      {photoPreview === 'hydraulic_leak'
                        ? 'Fuga Activa en Distribuidor y Manguera SAE 100R12 de Brazo Principal'
                        : photoPreview === 'brake_wear'
                        ? 'Caída de Presión en Acumulador de Freno de Servicio y Parqueo'
                        : `Inspección Hidráulica, Frenos y Cabina ROPS sin Anomalías (${selectedMachine.nombre})`}
                    </h4>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase ${
                      photoPreview === 'hydraulic_leak'
                        ? 'bg-rose-600 text-white'
                        : photoPreview === 'brake_wear'
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {photoPreview === 'hydraulic_leak'
                      ? 'CRÍTICO STOP-WORK'
                      : photoPreview === 'brake_wear'
                      ? 'REQUIERE AJUSTE'
                      : '100% OPERATIVO'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Componente Inspeccionado</span>
                    <strong className="text-white font-mono">
                      {photoPreview === 'hydraulic_leak'
                        ? 'Racor JIC 37° Cilindro Pluma'
                        : photoPreview === 'brake_wear'
                        ? 'Válvula Freno Hidrostático'
                        : 'Circuito Principal + ROPS'}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Lectura / Parámetro Medido</span>
                    <strong className="text-white font-mono">
                      {photoPreview === 'hydraulic_leak'
                        ? '210 bar (Pérdida -130 bar)'
                        : photoPreview === 'brake_wear'
                        ? 'Retención en rampa < 75%'
                        : '340 bar Nominal / 195 PSI'}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Normativa Aplicable</span>
                    <strong className="text-amber-400 font-mono">
                      {photoPreview === 'hydraulic_leak'
                        ? 'OSHA 1926.600 / Sec. 4.2'
                        : photoPreview === 'brake_wear'
                        ? 'Reg. 522-06 Art. 3.4.1'
                        : 'Reg. 522-06 / ISO 45001'}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Serie / Horómetro Activo</span>
                    <strong className="text-white font-mono">
                      {selectedMachine.serie} ({horometro} hrs)
                    </strong>
                  </div>
                </div>

                <div className="text-xs text-slate-300 leading-relaxed pt-1">
                  <strong className="text-white">Dictamen Técnico: </strong>
                  {photoPreview === 'hydraulic_leak'
                    ? 'Se detecta goteo continuo de aceite hidráulico ISO VG 68 en el acople de alta presión del brazo excavador. Prohibido encender el equipo bajo protocolo LOTO.'
                    : photoPreview === 'brake_wear'
                    ? 'El pedal presenta recorrido largo y pérdida de presión residual en el circuito de estacionamiento. Requiere purga y calibración por taller.'
                    : 'Mangueras secas sin abrasión, freno de parqueo con retención total en pendiente, alarma de retroceso en 102 dB y extintor PQS en 195 PSI.'}
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Notas Técnicas del Operador
              </label>
              <textarea
                rows={2}
                value={observacionesGenerales}
                onChange={(e) => setObservacionesGenerales(e.target.value)}
                placeholder="Detalle cualquier anomalía en frenos, presión hidráulica o ROPS..."
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Paso 5: Firma Digital Táctil / Canvas del Operador */}
          <div className="bg-zinc-900/90 border border-slate-800 rounded-3xl p-7 sm:p-8 shadow-lg space-y-5">
            <div className="pb-3 border-b border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2.5 leading-none">
                  <PenTool className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>5. Firma Digital del Operador</span>
                </h3>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={applyQuickDigitalSignature}
                    className="inline-flex items-center justify-center px-3.5 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold whitespace-nowrap"
                  >
                    Firmar Rápido
                  </button>
                  <button
                    type="button"
                    onClick={clearSignature}
                    className="inline-flex items-center justify-center p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300"
                    title="Limpiar Firma"
                  >
                    <RotateCcw className="w-4 h-4 shrink-0" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-400">
                Dibuje su firma en el recuadro o aplique firma rápida
              </p>
            </div>

            <div className="border-2 border-dashed border-slate-700 rounded-2xl bg-white overflow-hidden relative">
              <canvas
                ref={canvasRef}
                width={380}
                height={115}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-28 cursor-crosshair touch-none"
              />
              {!hasSignature && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-xs text-slate-500 font-mono">
                  Trace aquí la firma del operador con el mouse
                </div>
              )}
            </div>

            {/* Estado dinámico antes de guardar */}
            {hasCriticalFailure ? (
              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/60 text-xs text-rose-300 space-y-1.5">
                <div className="font-extrabold text-rose-400 flex items-center gap-2 uppercase">
                  <AlertOctagon className="w-4 h-4 shrink-0" />
                  <span>Atención: {criticalFailures.length} Punto(s) Crítico(s) No Conforme(s)</span>
                </div>
                <p className="leading-relaxed">
                  Al presionar el botón inferior se aplicará <strong>Bloqueo Automático LOTO</strong>, se generará el código de candado y se emitirá la Orden de Trabajo a Mantenimiento.
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="leading-snug">Todos los puntos críticos están conformes. El equipo continuará en estado OPERATIVO.</span>
              </div>
            )}

            <button
              type="submit"
              className={`w-full py-4 px-6 rounded-full font-extrabold text-sm flex items-center justify-center text-center shadow-xl transition-all ${
                hasCriticalFailure
                  ? 'bg-rose-600 hover:bg-rose-500 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {hasCriticalFailure
                ? 'Registrar Falla Crítica, Bloquear Equipo (LOTO) y Emitir OT'
                : 'Guardar Checklist Pre-Operacional y Autorizar Turno'}
            </button>
          </div>
        </div>
      </form>

      {/* Historial Reciente de Checklists */}
      {checklistLogs.length > 0 && (
        <div className="bg-zinc-900/90 border border-slate-800 rounded-3xl p-7 sm:p-8 shadow-lg">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2.5 leading-snug">
            <FileWarning className="w-5 h-5 text-amber-400 shrink-0" />
            <span>Bitácora Auditable de Inspecciones Pre-Operacionales Recientes</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3.5">ID Inspección</th>
                  <th className="p-3.5">Fecha / Hora</th>
                  <th className="p-3.5">Máquina</th>
                  <th className="p-3.5">Operador</th>
                  <th className="p-3.5">Resultado</th>
                  <th className="p-3.5">Código LOTO / Orden</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {checklistLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/50">
                    <td className="p-3.5 font-mono font-bold text-amber-400">{log.id}</td>
                    <td className="p-3.5 font-mono text-slate-300">{log.fecha}</td>
                    <td className="p-3.5 font-bold text-white">{log.maquinaNombre}</td>
                    <td className="p-3.5 text-slate-300">{log.operador}</td>
                    <td className="p-3.5">
                      {log.resultado.includes('BLOQUEO') ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-rose-600/20 text-rose-400 border border-rose-500/40 font-bold">
                          {log.resultado}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
                          {log.resultado}
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 font-mono text-slate-300">
                      {log.lotoCode ? `${log.lotoCode} / ${log.workOrder}` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL DE INSPECCIÓN Y CUMPLIMIENTO NORMATIVO POR PUNTO */}
      {openItemId && (() => {
        const activeItem = CHECKLIST_TEMPLATE.find((it) => it.id === openItemId);
        if (!activeItem) return null;
        const reqList = activeItem.requisitos || [];
        const completedCount = reqList.filter((r) => subChecks[r.id]).length;
        const allReqsMet = completedCount === reqList.length;

        return (
          <div
            onClick={() => setOpenItemId(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className={`bg-zinc-900 border-2 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl ${
                allReqsMet ? 'border-emerald-500/60' : 'border-rose-500'
              }`}
            >
              {/* Encabezado del Modal */}
              <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs font-bold text-amber-400">
                      {activeItem.id}
                    </span>
                    {activeItem.critico ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[11px] font-extrabold uppercase tracking-wider">
                        Crítico • Stop Work
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[11px] font-bold uppercase">
                        Estándar SST
                      </span>
                    )}
                    <span className="inline-flex items-center text-xs font-mono text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                      {activeItem.normativa}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-white leading-snug">
                    {activeItem.titulo}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setOpenItemId(null)}
                  className="inline-flex items-center justify-center p-2.5 rounded-full bg-slate-800 text-slate-400 hover:text-white shrink-0"
                >
                  <X className="w-5 h-5 shrink-0" />
                </button>
              </div>

              {/* Cuerpo del Modal */}
              <div className="p-6 overflow-y-auto flex-1 space-y-5">
                {activeItem.exigenciaLegal && (
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                    <div className="font-bold text-amber-400 uppercase tracking-wider mb-1">
                      Exigencia Establecida por la Normativa ({activeItem.normativa}):
                    </div>
                    {activeItem.exigenciaLegal}
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Verificación de Requisitos Técnicos ({completedCount}/{reqList.length} cumplidos):
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleMarkItemConforme(activeItem)}
                      className="inline-flex items-center justify-center px-3.5 py-1.5 rounded-full bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold"
                    >
                      Marcar Todo Cumple
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMarkItemNoConforme(activeItem)}
                      className="inline-flex items-center justify-center px-3.5 py-1.5 rounded-full bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-bold"
                    >
                      Reportar Incumplimiento
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {reqList.map((req) => {
                    const checked = !!subChecks[req.id];
                    return (
                      <div
                        key={req.id}
                        onClick={() => handleToggleSubCheck(activeItem, req.id)}
                        className={`flex items-center justify-between gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                          checked
                            ? 'bg-emerald-950/20 border-emerald-500/50 text-slate-100'
                            : 'bg-rose-950/30 border-rose-500 text-rose-100'
                        }`}
                      >
                        <div className="flex items-center gap-3.5 flex-1 min-w-0">
                          <div
                            className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs transition-all ${
                              checked
                                ? 'bg-emerald-500 text-slate-950'
                                : 'bg-rose-600 text-white'
                            }`}
                          >
                            {checked ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
                          </div>
                          <div className="text-xs sm:text-sm leading-snug flex-1">
                            <span className="font-mono text-xs font-bold text-amber-400 mr-2">
                              [{req.id}]
                            </span>
                            <span>{req.texto}</span>
                          </div>
                        </div>

                        <div
                          className="flex items-center gap-2 shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setSubChecks((prev) => {
                                const next = { ...prev, [req.id]: true };
                                const allMet = (activeItem.requisitos || []).every((r) => next[r.id]);
                                setAnswers((prevAns) => ({
                                  ...prevAns,
                                  [activeItem.id]: allMet ? 'CONFORME' : 'NO_CONFORME'
                                }));
                                return next;
                              });
                            }}
                            className={`inline-flex items-center justify-center px-3.5 py-2 rounded-full text-xs font-extrabold transition-all whitespace-nowrap ${
                              checked
                                ? 'bg-emerald-600 text-white shadow-md'
                                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                            }`}
                          >
                            Cumple
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSubChecks((prev) => {
                                const next = { ...prev, [req.id]: false };
                                setAnswers((prevAns) => ({
                                  ...prevAns,
                                  [activeItem.id]: 'NO_CONFORME'
                                }));
                                return next;
                              });
                            }}
                            className={`inline-flex items-center justify-center px-3.5 py-2 rounded-full text-xs font-extrabold transition-all whitespace-nowrap ${
                              !checked
                                ? 'bg-rose-600 text-white shadow-md'
                                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                            }`}
                          >
                            No Cumple
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Resumen del estado resultante */}
                <div
                  className={`p-4 rounded-2xl border text-xs flex items-center justify-between gap-3 ${
                    allReqsMet
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-950/25 border-rose-500/50 text-rose-300'
                  }`}
                >
                  <div>
                    <strong className="block text-sm font-extrabold">
                      Resultado del Punto {activeItem.id}:{' '}
                      {allReqsMet ? 'CONFORME CON LA NORMATIVA' : 'NO CONFORME (INCUMPLIMIENTO DETECTADO)'}
                    </strong>
                    <span className="text-slate-300">
                      {allReqsMet
                        ? 'Todos los criterios técnicos de la norma han sido verificados.'
                        : activeItem.critico
                        ? `Al ser un punto crítico, este incumplimiento activará el bloqueo LOTO de la unidad ${selectedMachine.id}.`
                        : 'Se registrará la observación de incumplimiento en la bitácora.'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pie del Modal */}
              <div className="p-5 bg-slate-950 border-t border-slate-800 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setOpenItemId(null)}
                  className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs font-extrabold transition-all shadow-lg ${
                    allReqsMet
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-rose-600 hover:bg-rose-500 text-white'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Confirmar Inspección ({allReqsMet ? 'Conforme' : 'No Conforme'})</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* MODAL DE BLOQUEO AUTOMÁTICO LOTO & ORDEN DE TRABAJO */}
      {lockoutModalData && (
        <div
          onClick={() => setLockoutModalData(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-zinc-900 border-2 border-rose-600 rounded-3xl max-w-xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
          >
            <div className="p-6 bg-slate-950 border-b border-rose-500/40 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-2xl bg-rose-600 text-white shadow-lg">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-rose-400">
                    PROTOCOLO AUTOMÁTICO STOP-WORK ACTIVADO
                  </span>
                  <h3 className="text-xl font-extrabold text-white">
                    Máquina Bloqueada por Falla Crítica
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLockoutModalData(null)}
                className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4 text-sm">
              <p className="text-slate-300 leading-relaxed">
                En cumplimiento del <strong className="text-white">Art. 3.4.1 del Reglamento 522-06</strong> y la <strong className="text-white">Cláusula 8.1.2 de ISO 45001</strong>, el sistema TECTROMAQ ha inhabilitado inmediatamente la operación del activo:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div>
                  <div className="text-xs text-slate-400">Activo Bloqueado</div>
                  <div className="font-bold text-white">{lockoutModalData.machine}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Operador Reportante</div>
                  <div className="font-bold text-slate-200">{lockoutModalData.operador}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Código Candado LOTO Generado</div>
                  <div className="font-mono font-extrabold text-rose-400 text-base">
                    {lockoutModalData.lotoCode}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Orden de Trabajo Mantenimiento</div>
                  <div className="font-mono font-extrabold text-amber-400 text-base">
                    {lockoutModalData.workOrder}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/40">
                <div className="text-xs font-bold text-rose-400 uppercase mb-1.5">
                  No Conformidades Críticas Detectadas:
                </div>
                <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                  {lockoutModalData.failures.map((f) => (
                    <li key={f.id}>
                      <strong>{f.titulo}</strong> ({f.normativa})
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-5 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setLockoutModalData(null)}
                className="px-4 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                Cerrar Aviso
              </button>
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setLockoutModalData(null);
                    setActiveTab('iot');
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all"
                >
                  Ver Alerta IoT
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLockoutModalData(null);
                    setActiveTab('loto');
                  }}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  Ir a Liberación LOTO
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
