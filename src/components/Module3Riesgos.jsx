import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  Camera,
  MapPin,
  UserCheck,
  CalendarClock,
  CheckCircle2,
  PlusCircle,
  Sliders,
  Flame,
  Wrench,
  Activity,
  Brain,
  Zap,
  Lock,
  X
} from 'lucide-react';

export default function Module3Riesgos({
  riskReports,
  setRiskReports,
  machines,
  setMachines,
  addNotification,
  setActiveTab
}) {
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [filterCategory, setFilterCategory] = useState('TODOS');

  const [reportadoPor, setReportadoPor] = useState('Op. Carlos M. Castillo');
  const [condicion, setCondicion] = useState(
    'Piso resbaladizo por derrame de fluido hidráulico cerca del foso de lubricación'
  );
  const [categoria, setCategoria] = useState('Físico');
  const [ubicacion, setUbicacion] = useState('Área de Taller — Nave Principal SD');
  const [probabilidad, setProbabilidad] = useState(3); // 1: Baja, 2: Media, 3: Alta
  const [consecuencia, setConsecuencia] = useState(3); // 1: Leve, 2: Grave, 3: Catastrófico
  const [accionCorrectiva, setAccionCorrectiva] = useState(
    'Parada inmediata de maniobra en bahía, contención con paños oleofílicos y corrección de racor.'
  );
  const [responsable, setResponsable] = useState('Ing. Laura Báez (Supervisor HSE)');
  const [slaFecha, setSlaFecha] = useState('2026-10-19');
  const [customPhoto, setCustomPhoto] = useState(null);
  const [maquinaAfectadaId, setMaquinaAfectadaId] = useState('NINGUNA');

  const categories = [
    { id: 'Físico', icon: Zap, desc: 'Ruido, iluminación, temperatura, piso resbaladizo' },
    { id: 'Químico', icon: Flame, desc: 'Gases CO, vapores, aceites, solventes' },
    { id: 'Ergonómico', icon: Activity, desc: 'Posturas forzadas, cargas, vibración' },
    { id: 'Mecánico', icon: Wrench, desc: 'Atrapamiento, cables expuestos, alta presión' },
    { id: 'Psicosocial', icon: Brain, desc: 'Fatiga de turno, sobrecarga operativa' }
  ];

  const quickPresets = [
    {
      label: 'Derrame de Aceite en Taller',
      condicion: 'Piso resbaladizo por derrame de aceite hidráulico ISO VG 68 en pasillo de taller',
      categoria: 'Físico',
      ubicacion: 'Área de Taller — Nave Principal SD',
      probabilidad: 3,
      consecuencia: 2,
      accion: 'Confinamiento con kit antiderrame, limpieza desengrasante industrial y señalización.'
    },
    {
      label: 'Cable Trifásico 220V Expuesto',
      condicion: 'Cable eléctrico de 220V con aislamiento roto expuesto a paso de maquinaria en taller',
      categoria: 'Mecánico',
      ubicacion: 'Área de Taller — Zona de Soldadura',
      probabilidad: 3,
      consecuencia: 3,
      accion: 'Corte inmediato de energía en breaker principal, bloqueo LOTO eléctrico y reemplazo de línea.'
    },
    {
      label: 'Falta de EPP Auditivo (>85 dB)',
      condicion: 'Operador auxiliar en área de demolición sin protectores auditivos (>85 dB) ni lentes',
      categoria: 'Físico',
      ubicacion: 'Frente de Obra Punta Cana',
      probabilidad: 2,
      consecuencia: 2,
      accion: 'Detención preventiva de tarea, entrega de EPP certificado (Art. 4.1 Reg. 522-06) y charla 5 min.'
    },
    {
      label: 'Vibración Anormal en Brazo',
      condicion: 'Vibración anormal (>7.2 mm/s) en acoplamiento de brazo hidráulico de excavadora',
      categoria: 'Ergonómico',
      ubicacion: 'Patio de Máquinas Pesadas',
      probabilidad: 3,
      consecuencia: 3,
      accion: 'Parada inmediata del activo, inspección de bujes/pasadores y diagnóstico de bomba hidráulica.'
    }
  ];

  // Cálculo dinámico de Nivel de Riesgo (Matriz 3x3 Severidad x Probabilidad)
  const riskScore = probabilidad * consecuencia;
  const getRiskEvaluation = (score) => {
    if (score <= 2) {
      return {
        nivel: 'Riesgo Aceptable',
        colorClass: 'bg-emerald-950/20 text-emerald-300 border-emerald-500/40',
        badgeBg: 'bg-emerald-600 text-white',
        mensaje: 'Riesgo controlado. Mantener monitoreo rutinario y controles actuales.'
      };
    }
    if (score <= 4) {
      return {
        nivel: 'Riesgo Moderado',
        colorClass: 'bg-amber-950/25 text-amber-300 border-amber-500/40',
        badgeBg: 'bg-amber-500 text-slate-950',
        mensaje: 'Requiere acción correctiva programada con fecha límite (SLA) y supervisión HSE.'
      };
    }
    return {
      nivel: 'Riesgo Crítico / Inadmisible',
      colorClass: 'bg-rose-950/25 text-rose-300 border-rose-500/60',
      badgeBg: 'bg-rose-600 text-white',
      mensaje: 'REQUIERE PARADA INMEDIATA DE LA TAREA (STOP-WORK). No reanudar hasta mitigar el peligro.'
    };
  };

  const currentEval = getRiskEvaluation(riskScore);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCustomPhoto(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitRisk = (e) => {
    e.preventDefault();
    const newId = `RSK-2026-${Math.floor(110 + Math.random() * 889)}`;
    const nowStr = new Date().toLocaleString('es-DO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    const newReport = {
      id: newId,
      fecha: nowStr,
      reportadoPor,
      condicion,
      categoria,
      ubicacion,
      probabilidad,
      consecuencia,
      score: riskScore,
      nivel: currentEval.nivel,
      accionCorrectiva,
      responsable,
      slaFecha,
      estado: riskScore >= 6 ? 'PARADA INMEDIATA ACTIVA' : 'Abierto',
      customPhoto
    };

    setRiskReports((prev) => [newReport, ...prev]);

    // Si es riesgo crítico y se seleccionó una máquina afectada, bloquearla por LOTO
    if (riskScore >= 6 && maquinaAfectadaId !== 'NINGUNA') {
      const lotoCode = `LOTO-2026-RSK-${Math.floor(1000 + Math.random() * 8999)}`;
      const workOrder = `OT-MANT-2026-${Math.floor(1000 + Math.random() * 8999)}`;
      setMachines((prev) =>
        prev.map((m) =>
          m.id === maquinaAfectadaId
            ? {
                ...m,
                estado: 'BLOQUEADO_LOTO',
                lotoCode,
                workOrder,
                motivoBloqueo: `Reporte de Riesgo Crítico (${newId}): ${condicion}`,
                fechaBloqueo: nowStr
              }
            : m
        )
      );
      addNotification(
        `Riesgo Crítico + Bloqueo LOTO (${maquinaAfectadaId})`,
        `Se registró ${newId} y se bloqueó la unidad ${maquinaAfectadaId} con código ${lotoCode}.`,
        'critical',
        'loto'
      );
    } else {
      addNotification(
        `Reporte de Riesgo Registrado (${newId})`,
        `Clasificación: ${currentEval.nivel} (Puntaje ${riskScore}/9). Asignado a ${responsable}.`,
        riskScore >= 6 ? 'critical' : 'info',
        'riesgos'
      );
    }

    setIsNewModalOpen(false);
  };

  const handleToggleStatus = (id) => {
    setRiskReports((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const nextStatus =
          r.estado === 'Abierto' || r.estado === 'PARADA INMEDIATA ACTIVA'
            ? 'En Mitigación'
            : r.estado === 'En Mitigación'
            ? 'Cerrado / Verificado'
            : 'Abierto';
        return { ...r, estado: nextStatus };
      })
    );
  };

  const filteredReports =
    filterCategory === 'TODOS'
      ? riskReports
      : riskReports.filter((r) => r.categoria === filterCategory);

  const openReportsCount = riskReports.filter((r) => r.estado !== 'Cerrado / Verificado').length;
  const criticalReportsCount = riskReports.filter((r) => r.score >= 6 && r.estado !== 'Cerrado / Verificado').length;
  const closedReportsCount = riskReports.filter((r) => r.estado === 'Cerrado / Verificado').length;

  return (
    <div className="space-y-6">
      {/* Encabezado Principal Limpio y Directo */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-zinc-900 via-slate-900 to-zinc-900 border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>IDENTIFICACIÓN DE PELIGROS Y MATRIZ DE RIESGO (ISO 45001)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Control de Riesgos en Planta y Frentes de Obra
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
              Consulte los peligros reportados en taller y obra, verifique qué medida correctiva se aplicó, actualice su estado o registre un nuevo hallazgo con cálculo automático de riesgo.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsNewModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-lg transition-all whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4 shrink-0" />
              <span>Reportar Nuevo Peligro</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Tarjetas de Resumen Rápido */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-zinc-900/90 border border-slate-800 rounded-3xl p-5 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Peligros Activos en Seguimiento
            </span>
            <span className="text-2xl font-extrabold text-white font-mono mt-1 block">
              {openReportsCount}
            </span>
          </div>
          <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-xs font-bold">
            En Planta / Obra
          </span>
        </div>

        <div className="bg-zinc-900/90 border border-slate-800 rounded-3xl p-5 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Riesgos Críticos (Stop-Work)
            </span>
            <span className="text-2xl font-extrabold text-rose-400 font-mono mt-1 block">
              {criticalReportsCount}
            </span>
          </div>
          <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-extrabold">
            Prioridad Alta
          </span>
        </div>

        <div className="bg-zinc-900/90 border border-slate-800 rounded-3xl p-5 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Hallazgos Mitigados y Cerrados
            </span>
            <span className="text-2xl font-extrabold text-emerald-400 font-mono mt-1 block">
              {closedReportsCount}
            </span>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
            Verificados HSE
          </span>
        </div>
      </div>

      {/* Listado Principal de Reportes de Riesgo (Limpio y Fácil de Usar) */}
      <div className="bg-zinc-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-lg space-y-6">
        <div className="pb-4 border-b border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2.5 leading-none">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Bitácora de Peligros Reportados y Plan de Mitigación (SLA)</span>
            </h2>

            {/* Filtro simple por categoría */}
            <div className="flex flex-wrap items-center gap-2">
              {['TODOS', 'Físico', 'Mecánico', 'Químico', 'Ergonómico', 'Psicosocial'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilterCategory(cat)}
                  className={`inline-flex items-center justify-center px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    filterCategory === cat
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <p className="text-xs text-slate-400">
            Haga clic en el botón de estado de cualquier tarjeta para avanzar su proceso (<strong>Abierto → En Mitigación → Cerrado</strong>) o en <strong>Ver Evaluación</strong> para consultar su ficha completa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredReports.map((report) => {
            const isCrit = report.score >= 6;
            const isMod = report.score >= 3 && report.score <= 4;
            const isClosed = report.estado === 'Cerrado / Verificado';

            return (
              <div
                key={report.id}
                className={`p-6 rounded-3xl border-2 flex flex-col justify-between transition-all ${
                  isCrit && !isClosed
                    ? 'bg-rose-950/20 border-rose-500/60 shadow-lg'
                    : 'bg-slate-950/90 border-slate-800'
                }`}
              >
                <div className="space-y-3">
                  {/* Fila superior de etiquetas alineadas */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-zinc-900 border border-slate-800 font-mono text-xs font-bold text-amber-400">
                        {report.id}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-200 text-[11px] font-bold uppercase">
                        Riesgo {report.categoria}
                      </span>
                    </div>

                    <span
                      className={`inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-extrabold ${
                        isCrit
                          ? 'bg-rose-600 text-white'
                          : isMod
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {report.nivel} ({report.score}/9)
                    </span>
                  </div>

                  {/* Descripción del hallazgo */}
                  <div>
                    <h3 className="text-base font-extrabold text-white leading-snug">
                      {report.condicion}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Ubicación: <strong>{report.ubicacion}</strong> • Reportado por: {report.reportadoPor}
                    </p>
                  </div>

                  {/* Medida correctiva y responsable */}
                  <div className="p-3.5 rounded-2xl bg-zinc-900 border border-slate-800 text-xs space-y-1.5">
                    <div className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">
                      Medida Correctiva Asignada:
                    </div>
                    <p className="text-slate-200 leading-relaxed">{report.accionCorrectiva}</p>
                    <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 font-mono">
                      <span>Responsable: {report.responsable}</span>
                      <span>Fecha Límite (SLA): {report.slaFecha}</span>
                    </div>
                  </div>
                </div>

                {/* Pie de la tarjeta con botones alineados */}
                <div className="mt-4 pt-3.5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedReport(report)}
                    className="inline-flex items-center justify-center px-3.5 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
                  >
                    Ver Evaluación (P{report.probabilidad} × C{report.consecuencia})
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleStatus(report.id)}
                    className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-extrabold transition-all shadow-sm ${
                      report.estado === 'Cerrado / Verificado'
                        ? 'bg-emerald-600 text-white'
                        : report.estado === 'En Mitigación'
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-rose-600 text-white'
                    }`}
                  >
                    Estado: {report.estado} (Cambiar)
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL 1: FORMULARIO PARA REPORTAR UN NUEVO PELIGRO Y CALCULAR SU RIESGO */}
      {isNewModalOpen && (
        <div
          onClick={() => setIsNewModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-zinc-900 border-2 border-slate-800 rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Encabezado del Modal */}
            <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 block">
                  NUEVO REGISTRO HSE • ISO 45001 CLÁUSULA 6.1.2
                </span>
                <h3 className="text-xl font-extrabold text-white mt-0.5">
                  Reportar Condición Insegura y Evaluar Nivel de Riesgo
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewModalOpen(false)}
                className="inline-flex items-center justify-center p-2.5 rounded-full bg-slate-800 text-slate-400 hover:text-white shrink-0"
              >
                <X className="w-5 h-5 shrink-0" />
              </button>
            </div>

            {/* Cuerpo del Modal con pasos claros */}
            <form onSubmit={handleSubmitRisk} className="p-6 overflow-y-auto flex-1 space-y-5">
              {/* Atajos rápidos de casos reales */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Plantillas Rápidas de Casos Frecuentes en TECIROMAQ (Opcional):
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {quickPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setCondicion(preset.condicion);
                        setCategoria(preset.categoria);
                        setUbicacion(preset.ubicacion);
                        setProbabilidad(preset.probabilidad);
                        setConsecuencia(preset.consecuencia);
                        setAccionCorrectiva(preset.accion);
                      }}
                      className="inline-flex items-center justify-center px-3.5 py-1.5 rounded-full bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-200 transition-all"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Paso 1: Qué ocurre y dónde */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
                  Paso 1: Datos del Peligro Detectado
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {categories.map((cat) => {
                    const active = categoria === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategoria(cat.id)}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          active
                            ? 'bg-emerald-600 text-white border-emerald-600 font-extrabold shadow-sm'
                            : 'bg-zinc-900 border-slate-800 text-slate-300 font-semibold'
                        }`}
                      >
                        <div className="text-xs">{cat.id}</div>
                      </button>
                    );
                  })}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Descripción del Peligro o Condición Insegura *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={condicion}
                    onChange={(e) => setCondicion(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Ubicación en Planta u Obra *
                    </label>
                    <select
                      value={ubicacion}
                      onChange={(e) => setUbicacion(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
                    >
                      <option value="Área de Taller — Nave Principal SD">Área de Taller — Nave Principal SD</option>
                      <option value="Área de Taller — Zona de Soldadura">Área de Taller — Zona de Soldadura</option>
                      <option value="Patio de Máquinas Pesadas">Patio de Máquinas Pesadas</option>
                      <option value="Almacén Central de Lubricantes">Almacén Central de Lubricantes</option>
                      <option value="Frente de Obra Punta Cana">Frente de Obra Punta Cana</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Reportado Por *
                    </label>
                    <input
                      type="text"
                      required
                      value={reportadoPor}
                      onChange={(e) => setReportadoPor(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Paso 2: Evaluación Simple por Botones (Probabilidad x Consecuencia) */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
                  Paso 2: Nivel de Riesgo (Probabilidad × Consecuencia)
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">
                      1. Probabilidad de que ocurra un accidente:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { val: 1, label: 'Baja (1)' },
                        { val: 2, label: 'Media (2)' },
                        { val: 3, label: 'Alta (3)' }
                      ].map((opt) => (
                        <button
                          key={opt.val}
                          type="button"
                          onClick={() => setProbabilidad(opt.val)}
                          className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                            probabilidad === opt.val
                              ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                              : 'bg-zinc-900 border-slate-800 text-slate-300'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">
                      2. Gravedad del daño (Consecuencia):
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { val: 1, label: 'Leve (1)' },
                        { val: 2, label: 'Grave (2)' },
                        { val: 3, label: 'Fatal (3)' }
                      ].map((opt) => (
                        <button
                          key={opt.val}
                          type="button"
                          onClick={() => setConsecuencia(opt.val)}
                          className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                            consecuencia === opt.val
                              ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                              : 'bg-zinc-900 border-slate-800 text-slate-300'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Resultado automático claro */}
                <div className={`p-3.5 rounded-xl border flex flex-wrap items-center justify-between gap-3 ${currentEval.colorClass}`}>
                  <div>
                    <div className="text-xs font-extrabold uppercase">
                      Resultado: {currentEval.nivel} (Puntaje: {probabilidad} × {consecuencia} = {riskScore} de 9)
                    </div>
                    <p className="text-xs mt-0.5">{currentEval.mensaje}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${currentEval.badgeBg}`}>
                    {riskScore} / 9
                  </span>
                </div>
              </div>

              {/* Paso 3: Acción Correctiva y Responsable */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
                  Paso 3: Plan de Acción Correctiva y Responsable
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Acción Correctiva Inmediata *
                  </label>
                  <input
                    type="text"
                    required
                    value={accionCorrectiva}
                    onChange={(e) => setAccionCorrectiva(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Responsable de Mitigación *
                    </label>
                    <input
                      type="text"
                      required
                      value={responsable}
                      onChange={(e) => setResponsable(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Fecha Límite (SLA) *
                    </label>
                    <input
                      type="date"
                      required
                      value={slaFecha}
                      onChange={(e) => setSlaFecha(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm font-mono text-white"
                    />
                  </div>
                </div>

                {riskScore >= 6 && (
                  <div>
                    <label className="block text-xs font-bold text-rose-400 mb-1.5">
                      ¿Este peligro requiere bloquear una Máquina Pesada por LOTO?
                    </label>
                    <select
                      value={maquinaAfectadaId}
                      onChange={(e) => setMaquinaAfectadaId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-rose-500/60 text-sm text-white"
                    >
                      <option value="NINGUNA">No — Solo afecta un área de taller u obra</option>
                      {machines.map((m) => (
                        <option key={m.id} value={m.id}>
                          Sí — Bloquear con LOTO: {m.nombre} ({m.id})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`px-6 py-2.5 rounded-full text-xs font-extrabold shadow-lg transition-all ${
                    riskScore >= 6
                      ? 'bg-rose-600 hover:bg-rose-500 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {riskScore >= 6
                    ? 'Guardar Riesgo Crítico y Activar Parada'
                    : 'Guardar Reporte de Riesgo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: VER DETALLE DE EVALUACIÓN DE UN REPORTE */}
      {selectedReport && (
        <div
          onClick={() => setSelectedReport(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-zinc-900 border-2 border-slate-800 rounded-3xl max-w-xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
          >
            <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
              <div>
                <span className="text-xs font-mono font-bold text-amber-400 block">
                  FICHA DE EVALUACIÓN DE RIESGO • {selectedReport.id}
                </span>
                <h3 className="text-lg font-extrabold text-white mt-0.5">
                  Riesgo {selectedReport.categoria} — {selectedReport.ubicacion}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="inline-flex items-center justify-center p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5 shrink-0" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-bold uppercase block">Condición Detectada:</span>
                <p className="text-sm font-bold text-white leading-relaxed">{selectedReport.condicion}</p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block">Probabilidad</span>
                  <strong className="text-base font-mono text-white">{selectedReport.probabilidad} / 3</strong>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block">Consecuencia</span>
                  <strong className="text-base font-mono text-white">{selectedReport.consecuencia} / 3</strong>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block">Puntaje Total</span>
                  <strong className="text-base font-mono text-amber-400">{selectedReport.score} / 9</strong>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="text-amber-400 font-bold uppercase block">Plan de Mitigación y SLA:</span>
                <p className="text-slate-200 leading-relaxed">{selectedReport.accionCorrectiva}</p>
                <div className="pt-2 border-t border-slate-800 flex justify-between font-mono text-slate-400">
                  <span>Responsable: {selectedReport.responsable}</span>
                  <span>Fecha Límite: {selectedReport.slaFecha}</span>
                </div>
              </div>
            </div>

            <div className="p-5 bg-slate-950 border-t border-slate-800 flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="px-6 py-2.5 rounded-full bg-emerald-600 text-white text-xs font-extrabold"
              >
                Cerrar Ficha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
