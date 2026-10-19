import React, { useState, useEffect } from 'react';
import {
  Lock,
  Unlock,
  ShieldCheck,
  Wrench,
  CheckCircle2,
  AlertOctagon,
  FileCheck2,
  History as HistoryIcon,
  Sparkles,
  ArrowRight,
  Eye,
  X
} from 'lucide-react';

export default function Module6Loto({
  machines,
  setMachines,
  lotoHistory,
  setLotoHistory,
  setIotForceAlert,
  addNotification,
  setActiveTab
}) {
  const lockedMachines = machines.filter((m) => m.estado === 'BLOQUEADO_LOTO');
  const [selectedLockedId, setSelectedLockedId] = useState(
    lockedMachines[0]?.id || ''
  );

  // Sincronizar selección cuando cambie la lista de bloqueadas
  useEffect(() => {
    if (lockedMachines.length > 0 && !lockedMachines.some((m) => m.id === selectedLockedId)) {
      setSelectedLockedId(lockedMachines[0].id);
    } else if (lockedMachines.length === 0) {
      setSelectedLockedId('');
    }
  }, [machines]);

  const currentLockedMachine = lockedMachines.find((m) => m.id === selectedLockedId);

  // Estado del modal de liberación
  const [isReleaseModalOpen, setIsReleaseModalOpen] = useState(false);

  // Doble Aprobación (Mantenimiento Técnico + Supervisor HSE)
  const [firmaMantenimiento, setFirmaMantenimiento] = useState(
    'Ing. Marcos Tejada (Jefe Mantenimiento Mecánico)'
  );
  const [aprobadoMantenimiento, setAprobadoMantenimiento] = useState(false);

  const [firmaHSE, setFirmaHSE] = useState(
    'Ing. Laura Báez (Supervisor Senior HSE)'
  );
  const [aprobadoHSE, setAprobadoHSE] = useState(false);

  // 3 Verificaciones obligatorias
  const [checks, setChecks] = useState({
    piezaReemplazada: false,
    retiroCandado: false,
    pruebaFrenos: false
  });

  const [notasTecnicasLiberacion, setNotasTecnicasLiberacion] = useState(
    'Se reemplazó manguera hidráulica SAE 100R12 de 34 MPa, se purgó circuito de frenos y se verificó presión nominal sin fugas.'
  );

  const allChecksComplete =
    checks.piezaReemplazada &&
    checks.retiroCandado &&
    checks.pruebaFrenos &&
    aprobadoMantenimiento &&
    aprobadoHSE;

  const handleAutoFillReleaseDemo = () => {
    setChecks({
      piezaReemplazada: true,
      retiroCandado: true,
      pruebaFrenos: true
    });
    setAprobadoMantenimiento(true);
    setAprobadoHSE(true);
  };

  const handleConfirmRelease = (e) => {
    if (e) e.preventDefault();
    if (!currentLockedMachine || !allChecksComplete) return;

    const releaseTimestamp = new Date().toLocaleString('es-DO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    const newHistoryEntry = {
      id: `REL-2026-${Math.floor(100 + Math.random() * 899)}`,
      maquinaId: currentLockedMachine.id,
      maquinaNombre: currentLockedMachine.nombre,
      lotoCode: currentLockedMachine.lotoCode,
      workOrder: currentLockedMachine.workOrder,
      motivoOriginal: currentLockedMachine.motivoBloqueo,
      fechaBloqueo: currentLockedMachine.fechaBloqueo,
      fechaLiberacion: releaseTimestamp,
      aprobadoMantenimiento: firmaMantenimiento,
      aprobadoHSE: firmaHSE,
      verificaciones: [
        'Pieza reemplazada y fuga subsanada',
        'Retiro físico de candado y tarjeta LOTO',
        'Prueba funcional de frenos al 100%'
      ]
    };

    // Actualizar máquina a estado OPERATIVO
    setMachines((prev) =>
      prev.map((m) => {
        if (m.id === currentLockedMachine.id) {
          return {
            ...m,
            estado: 'OPERATIVO',
            lotoCode: null,
            workOrder: null,
            motivoBloqueo: null,
            fechaBloqueo: null,
            presionHidraulica: '34,500 kPa (Nominal)',
            saludBomba: 95
          };
        }
        return m;
      })
    );

    setLotoHistory((prev) => [newHistoryEntry, ...prev]);
    setIotForceAlert(false);

    // Resetear y cerrar modal
    setChecks({
      piezaReemplazada: false,
      retiroCandado: false,
      pruebaFrenos: false
    });
    setAprobadoMantenimiento(false);
    setAprobadoHSE(false);
    setIsReleaseModalOpen(false);

    addNotification(
      `Activo Liberado: ${currentLockedMachine.id}`,
      `Protocolo LOTO cerrado con doble firma. ${currentLockedMachine.nombre} regresa a estado OPERATIVO.`,
      'success',
      'loto'
    );
  };

  return (
    <div className="space-y-6">
      {/* Encabezado Principal */}
      <div className="rounded-2xl bg-zinc-900 border border-slate-800 p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Liberación y Desbloqueo Técnico LOTO
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {lockedMachines.length > 0 && currentLockedMachine ? (
              <button
                type="button"
                onClick={() => setIsReleaseModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold transition-all shrink-0 inline-flex items-center gap-2 shadow-lg"
              >
                <Unlock className="w-4 h-4" />
                Liberar {currentLockedMachine.nombre}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveTab('inspecciones')}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold transition-all shrink-0 inline-flex items-center gap-1.5"
              >
                Ir a Inspecciones
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        <p className="text-slate-400 text-sm mt-2">
          Cuando una máquina se bloquea por falla crítica en el checklist (frenos o fugas hidráulicas), no puede operar hasta que el mecánico y el supervisor HSE completen las 3 revisiones físicas y firmen la liberación.
        </p>
      </div>

      {/* 3 Tarjetas de Resumen Rápido */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-zinc-900/90 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Máquinas Bloqueadas
            </span>
            <span className={`text-3xl font-extrabold font-mono mt-1 block ${lockedMachines.length > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {lockedMachines.length} {lockedMachines.length === 1 ? 'Unidad' : 'Unidades'}
            </span>
            <span className="text-xs text-slate-400 mt-1 block">
              {lockedMachines.length > 0 ? 'Con candado LOTO activo' : 'Flota 100% disponible'}
            </span>
          </div>
          <div className={`p-3 rounded-xl border ${lockedMachines.length > 0 ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'}`}>
            <Lock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-zinc-900/90 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Máquinas Operativas
            </span>
            <span className="text-3xl font-extrabold font-mono text-emerald-400 mt-1 block">
              {machines.length - lockedMachines.length} / {machines.length}
            </span>
            <span className="text-xs text-slate-400 mt-1 block">
              Listas para trabajo en obra
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-zinc-900/90 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Liberaciones Realizadas
            </span>
            <span className="text-3xl font-extrabold font-mono text-amber-400 mt-1 block">
              {lotoHistory.length} Registros
            </span>
            <span className="text-xs text-slate-400 mt-1 block">
              Con doble firma auditable
            </span>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* SECCIÓN 1: Máquinas Bloqueadas y Flota */}
      <div className="bg-zinc-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0" />
            <h2 className="text-base font-bold text-white">
              1. Estado Actual de la Flota TECIROMAQ
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Haga clic en una máquina bloqueada para iniciar su proceso de liberación
          </span>
        </div>

        {lockedMachines.length === 0 ? (
          <div className="p-6 rounded-2xl bg-slate-950 border border-emerald-500/40 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-white">
              No hay maquinaria bloqueada en este momento
            </h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Toda la flota pesada está en estado operativo. Si desea probar el bloqueo en vivo, vaya al módulo de Inspecciones y marque un punto crítico como No Conforme.
            </p>
            <button
              type="button"
              onClick={() => setActiveTab('inspecciones')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold transition-all"
            >
              Ir a Inspecciones
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lockedMachines.map((machine) => {
              const isSelected = machine.id === selectedLockedId;
              return (
                <div
                  key={machine.id}
                  onClick={() => setSelectedLockedId(machine.id)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between gap-4 ${
                    isSelected
                      ? 'bg-rose-950/30 border-rose-500 ring-2 ring-rose-500/30'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-mono text-xs font-extrabold">
                        {machine.lotoCode}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-slate-800 text-amber-400 font-mono text-xs font-bold">
                        {machine.workOrder}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-extrabold text-white mt-3">
                      {machine.nombre} ({machine.id})
                    </h3>
                    <p className="text-xs text-rose-200 mt-1 leading-relaxed">
                      <strong>Causa del Bloqueo:</strong> {machine.motivoBloqueo}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono text-slate-400 truncate">
                      Bloqueado: {machine.fechaBloqueo}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLockedId(machine.id);
                        setIsReleaseModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold inline-flex items-center gap-1.5 shrink-0"
                    >
                      <Unlock className="w-3.5 h-3.5" />
                      Liberar Unidad
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Lista resumida del resto de la flota */}
        <div className="pt-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Resumen General de Unidades:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {machines.map((m) => (
              <div
                key={m.id}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-white">{m.nombre}</div>
                  <div className="font-mono text-[11px] text-slate-400">{m.id}</div>
                </div>
                {m.estado === 'BLOQUEADO_LOTO' ? (
                  <span className="px-2 py-0.5 rounded-lg bg-rose-600/20 text-rose-400 border border-rose-500/40 font-mono font-bold text-[10px]">
                    BLOQUEADO
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold text-[10px]">
                    OPERATIVO
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: Historial Auditable de Liberaciones */}
      <div className="bg-zinc-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <HistoryIcon className="w-5 h-5 text-amber-400 shrink-0" />
            <h2 className="text-base font-bold text-white">
              2. Registro Histórico de Liberaciones LOTO
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Trazabilidad con doble firma auditable
          </span>
        </div>

        <div className="space-y-3">
          {lotoHistory.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-amber-400">{item.id}</span>
                  <span className="text-white font-bold">{item.maquinaNombre} ({item.maquinaId})</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-900 border border-slate-800 font-mono text-[11px] text-slate-300">
                    {item.lotoCode} • {item.workOrder}
                  </span>
                </div>
                <div className="text-slate-400 text-[11px]">
                  Liberado: <strong className="text-slate-200">{item.fechaLiberacion}</strong> • Causa original: {item.motivoOriginal}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right text-[11px] font-mono text-slate-300">
                  <div>Mecánico: {item.aprobadoMantenimiento}</div>
                  <div>HSE: {item.aprobadoHSE}</div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold text-[11px]">
                  OPERATIVO
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL: Protocolo de Doble Aprobación y Liberación */}
      {isReleaseModalOpen && currentLockedMachine && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setIsReleaseModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-zinc-900 border border-slate-700 rounded-2xl max-w-xl w-full max-h-[85vh] overflow-y-auto p-5 space-y-4 shadow-2xl"
          >
            {/* Cabecera alineada */}
            <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Unlock className="w-5 h-5 text-emerald-400 shrink-0" />
                <h3 className="text-sm sm:text-base font-extrabold text-white">
                  Liberación Técnica LOTO — {currentLockedMachine.nombre}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsReleaseModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Datos de la máquina bloqueada */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-rose-400 font-bold">
                  Candado: {currentLockedMachine.lotoCode}
                </span>
                <span className="font-mono text-amber-400 font-bold">
                  Orden: {currentLockedMachine.workOrder}
                </span>
              </div>
              <p className="text-slate-300">
                <strong>Motivo del Bloqueo:</strong> {currentLockedMachine.motivoBloqueo}
              </p>
            </div>

            {/* Paso 1: 3 Verificaciones físicas con 1 clic */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white uppercase">
                  Paso 1: Verificaciones Físicas Obligatorias
                </span>
                <button
                  type="button"
                  onClick={handleAutoFillReleaseDemo}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 font-bold text-[10px] inline-flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  Marcar Todo (Demo)
                </button>
              </div>

              <div
                onClick={() => setChecks({ ...checks, piezaReemplazada: !checks.piezaReemplazada })}
                className={`p-3 rounded-xl border cursor-pointer text-xs transition-all flex items-center justify-between gap-3 ${
                  checks.piezaReemplazada
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-white font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span>[1] Pieza defectuosa reemplazada y fuga subsanada</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold shrink-0 ${checks.piezaReemplazada ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                  {checks.piezaReemplazada ? 'Verificado' : 'Pendiente'}
                </span>
              </div>

              <div
                onClick={() => setChecks({ ...checks, retiroCandado: !checks.retiroCandado })}
                className={`p-3 rounded-xl border cursor-pointer text-xs transition-all flex items-center justify-between gap-3 ${
                  checks.retiroCandado
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-white font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span>[2] Retiro físico del candado rojo y etiqueta LOTO</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold shrink-0 ${checks.retiroCandado ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                  {checks.retiroCandado ? 'Verificado' : 'Pendiente'}
                </span>
              </div>

              <div
                onClick={() => setChecks({ ...checks, pruebaFrenos: !checks.pruebaFrenos })}
                className={`p-3 rounded-xl border cursor-pointer text-xs transition-all flex items-center justify-between gap-3 ${
                  checks.pruebaFrenos
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-white font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span>[3] Prueba funcional de frenos y parada de emergencia al 100%</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold shrink-0 ${checks.pruebaFrenos ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                  {checks.pruebaFrenos ? 'Verificado' : 'Pendiente'}
                </span>
              </div>
            </div>

            {/* Paso 2: Doble firma en 1 clic */}
            <div className="space-y-2 pt-1 border-t border-slate-800">
              <span className="font-bold text-white uppercase text-xs block">
                Paso 2: Doble Firma de Aprobación
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div
                  onClick={() => setAprobadoMantenimiento(!aprobadoMantenimiento)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-2 ${
                    aprobadoMantenimiento
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-white font-semibold'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="truncate">
                    <div className="font-bold text-amber-400">1ª Firma: Mantenimiento</div>
                    <div className="text-[11px] text-slate-400 truncate">{firmaMantenimiento}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold shrink-0 ${aprobadoMantenimiento ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                    {aprobadoMantenimiento ? 'Firmado' : 'Firmar'}
                  </span>
                </div>

                <div
                  onClick={() => setAprobadoHSE(!aprobadoHSE)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-2 ${
                    aprobadoHSE
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-white font-semibold'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="truncate">
                    <div className="font-bold text-emerald-400">2ª Firma: Supervisor HSE</div>
                    <div className="text-[11px] text-slate-400 truncate">{firmaHSE}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold shrink-0 ${aprobadoHSE ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                    {aprobadoHSE ? 'Firmado' : 'Firmar'}
                  </span>
                </div>
              </div>
            </div>

            {/* Dictamen */}
            <div className="pt-1">
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Dictamen Técnico Final
              </label>
              <input
                type="text"
                value={notasTecnicasLiberacion}
                onChange={(e) => setNotasTecnicasLiberacion(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
              />
            </div>

            {/* Botón de confirmación final */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setIsReleaseModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={!allChecksComplete}
                onClick={handleConfirmRelease}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all ${
                  allChecksComplete
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg cursor-pointer'
                    : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
                }`}
              >
                {allChecksComplete
                  ? `Desbloquear y Retornar a Operativo`
                  : 'Complete las 3 revisiones y 2 firmas'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
