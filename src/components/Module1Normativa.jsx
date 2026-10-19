import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  FileText,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Download,
  Printer,
  ShieldCheck,
  ExternalLink,
  X,
  Scale,
  Building2,
  RefreshCw,
  PlusCircle
} from 'lucide-react';
import { NORMATIVAS_DATA } from '../data/initialData';

export default function Module1Normativa({
  regulatoryAlerts,
  setRegulatoryAlerts,
  audits,
  setAudits,
  addNotification
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedNorma, setSelectedNorma] = useState(null);
  const [showOfficialReportModal, setShowOfficialReportModal] = useState(false);
  const [showNewAuditModal, setShowNewAuditModal] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(() =>
    new Date().toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit'})
  );
  const [newAuditForm, setNewAuditForm] = useState({
    tipo: 'Auditoría Interna ISO 45001 / Reg. 522-06',
    inspector: 'Ing. Laura Báez (HSE TECIROMAQ)',
    sede: 'TECIROMAQ Santo Domingo',
    cumplimiento: '97.5%',
    hallazgos: 'Verificación de bloqueo LOTO y extintores en flota CAT / JCB sin desviaciones críticas.'});

  const categories = [
    'Todas',
    'Leyes Dominicanas',
    'Estándares Internacionales',
    'Manuales Internos TECIROMAQ'];

  const filteredNormas = NORMATIVAS_DATA.filter((norma) => {
    const matchesCategory =
      selectedCategory === 'Todas'|| norma.categoria === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      norma.titulo.toLowerCase().includes(q) ||
      norma.subtitulo.toLowerCase().includes(q) ||
      norma.codigo.toLowerCase().includes(q) ||
      norma.resumen.toLowerCase().includes(q) ||
      norma.articulosClave.some(
        (a) => a.art.toLowerCase().includes(q) || a.texto.toLowerCase().includes(q)
      );
    return matchesCategory && matchesSearch;
  });

  const handleAutoSyncNormativas = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const nowTime = new Date().toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit'});
      setLastSyncTime(nowTime);
      setIsSyncing(false);
      addNotification(
        'Sincronización Oficial Completada (MT / ISO / OSHA)',
        'Se verificaron boletines del Ministerio de Trabajo RD, IDOPPRIL e ISO 45001. Todas las normativas y fechas están al día.',
        'success',
        'normativa');
    }, 600);
  };

  const handleRenewAlert = (alertId) => {
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const nextDateStr = nextYear.toISOString().slice(0, 10);

    setRegulatoryAlerts((prev) =>
      prev.map((item) => {
        if (item.id === alertId) {
          return {
            ...item,
            estado: 'Vigente',
            diasRestantes: 365,
            fechaVencimiento: nextDateStr
          };
        }
        return item;
      })
    );
    addNotification(
      'Certificación Renovada Automáticamente',
      `El permiso fue renovado por 12 meses hasta el ${nextDateStr} y su estado cambió a VIGENTE.`,
      'success',
      'normativa');
  };

  const handleExportExcelCSV = () => {
    const headers = ['ID Auditoria', 'Fecha', 'Tipo de Auditoria', 'Inspector', 'Sede', 'Cumplimiento', 'Estado', 'Hallazgos'];
    const rows = audits.map((a) => [
      a.id,
      a.fecha,
      `"${a.tipo}"`,
      `"${a.inspector}"`,
      `"${a.sede}"`,
      a.cumplimiento,
      `"${a.estado}"`,
      `"${a.hallazgos}"`
    ]);
    const csvContent =
      '\uFEFF'+
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Reporte_Auditorias_SST_TECIROMAQ_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    addNotification(
      'Exportación Oficial Completada',
      'Archivo CSV/Excel de Auditorías SST descargado correctamente.',
      'info',
      'normativa');
  };

  const handleCreateAudit = (e) => {
    e.preventDefault();
    const newEntry = {
      id: `AUD-2026-${Math.floor(100 + Math.random() * 899)}`,
      fecha: new Date().toISOString().slice(0, 10),
      ...newAuditForm,
      estado: 'Aprobada / Conforme'};
    setAudits((prev) => [newEntry, ...prev]);
    setShowNewAuditModal(false);
    addNotification(
      'Auditoría Digital Registrada',
      `Se registró la auditoría ${newEntry.id} en el historial oficial.`,
      'success',
      'normativa');
  };

  const getStatusBadge = (estado) => {
    if (estado === 'Vigente') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Vigente
        </span>
      );
    }
    if (estado.includes('Por Vencer')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/40 animate-pulse">
          <Clock className="w-3.5 h-3.5" />
          Por Vencer (&lt; 15 días)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-600/20 text-rose-400 border border-rose-500/50">
        <AlertTriangle className="w-3.5 h-3.5" />
        Vencido
      </span>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-zinc-900 via-slate-900 to-zinc-900 border border-slate-800 p-6 shadow-xl">
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-2">
              <Scale className="w-3.5 h-3.5" />
              CUMPLIMIENTO LEGAL & NORMATIVO (REP. DOMINICANA & INTERNACIONAL)
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Repositorio Normativo, Vencimientos & Auditorías SST
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-3xl">
              Base documental interactiva alineada con el <strong className="text-slate-200">Decreto 522-06</strong>, <strong className="text-slate-200">Resolución 04-2007 (MT)</strong>, <strong className="text-slate-200">ISO 45001:2018</strong> y <strong className="text-slate-200">OSHA 1926</strong> para operaciones de maquinaria pesada TECIROMAQ.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleAutoSyncNormativas}
              className="bg-slate-950/80 border border-slate-800 hover:border-amber-500 rounded-xl px-4 py-2.5 text-left flex items-center gap-3 transition-all"
              title="Verificar actualizaciones en Gaceta Oficial y Ministerio de Trabajo RD"
            >
              <RefreshCw className={`w-4 h-4 text-emerald-400 ${isSyncing ? 'animate-pulse': ''}`} />
              <div>
                <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Sincronización Automática Activa
                </div>
                <div className="text-xs font-mono text-slate-400">
                  {isSyncing ? 'Consultando MT-RD / ISO...': `Últ. verificación: ${lastSyncTime}`}
                </div>
              </div>
            </button>
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-center">
              <div className="text-xs text-slate-400">Índice Cumplimiento MT</div>
              <div className="text-xl font-extrabold text-emerald-400 font-mono">96.8%</div>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-center">
              <div className="text-xs text-slate-400">Marcos Vigentes</div>
              <div className="text-xl font-extrabold text-amber-400 font-mono">{NORMATIVAS_DATA.length} Normas</div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: Base de Datos Normativa & Documental */}
      <div className="bg-zinc-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              1. Base de Datos Normativa & Documental Interactiva
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Consulte el articulado técnico aplicable a cada inspección y operación de equipos pesados
            </p>
          </div>

          {/* Search input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar ley, artículo, LOTO, 85 dB..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-amber-400" /> Categoría:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20': 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Normativa Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredNormas.map((norma) => {
            const isRD = norma.categoria === 'Leyes Dominicanas';
            const isInternal = norma.categoria === 'Manuales Internos TECIROMAQ';
            return (
              <div
                key={norma.id}
                className="group bg-slate-950/90 border border-slate-800/90 hover:border-amber-500/50 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-amber-500/5"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider ${
                        isRD
                          ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30': isInternal
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30': 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'}`}
                    >
                      {norma.categoria}
                    </span>
                    <span className="text-xs font-mono text-slate-400 bg-zinc-900 px-2.5 py-1 rounded-md border border-slate-800">
                      {norma.codigo}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors leading-snug">
                    {norma.titulo}
                  </h3>
                  <p className="text-xs text-amber-400/80 font-medium mt-1">
                    {norma.subtitulo}
                  </p>
                  <p className="text-xs text-slate-400 mt-3 leading-relaxed line-clamp-3">
                    {norma.resumen}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-800/80">
                    <div className="text-[11px] text-slate-400 font-semibold mb-1.5">
                      Artículos / Cláusulas Vinculadas:
                    </div>
                    <div className="space-y-1">
                      {norma.articulosClave.slice(0, 2).map((art, i) => (
                        <div
                          key={i}
                          className="text-xs text-slate-300 bg-zinc-900/90 px-2.5 py-1.5 rounded-lg border border-slate-800/70 truncate"
                        >
                          <span className="text-amber-400 font-mono font-semibold">
                            {art.art.split('—')[0]}
                          </span>
                          — {art.art.split('—')[1]}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-900 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {norma.vigencia}
                  </span>
                  <button
                    onClick={() => setSelectedNorma(norma)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500 text-amber-400 hover:text-slate-950 border border-amber-500/40 text-xs font-bold transition-all"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Ver Documento / Articulado
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2 & 3: Alertas Regulatorias & Registro de Auditorías con mayor separación */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-4">
        {/* Columna Izquierda: Calendario de Vencimientos Legales */}
        <div className="lg:col-span-6 bg-zinc-900/90 border border-slate-800 rounded-3xl p-8 shadow-lg">
          <div className="mb-7 pb-4 border-b border-slate-800">
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
              <Calendar className="w-5 h-5 text-amber-400 shrink-0" />
              <span>2. Calendario de Vencimientos Legales & Permisos</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Semáforo de permisos obligatorios (Calderas, Extintores, Licencias MOPC y Pólizas IDOPPRIL). Cuando un permiso está por vencer, presiona <strong>"Registrar Renovación"</strong> para actualizarlo por 1 año.
            </p>
          </div>

          <div className="space-y-5">
            {regulatoryAlerts.map((item) => (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border transition-all ${
                  item.estado === 'Vencido'? 'bg-rose-950/20 border-rose-500/40': item.estado.includes('Por Vencer')
                    ? 'bg-amber-950/15 border-amber-500/30': 'bg-slate-950/80 border-slate-800'}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400">
                        {item.id}
                      </span>
                      <span className="text-xs text-amber-400/90 font-medium">
                        • {item.referenciaLegal}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white leading-snug">
                      {item.titulo}
                    </h3>
                    <p className="text-xs text-slate-400 pt-0.5">
                      Entidad: <strong className="text-slate-300">{item.entidad}</strong> | Resp: {item.responsable}
                    </p>
                  </div>
                  <div className="flex sm:flex-col items-end justify-between gap-2 shrink-0">
                    {getStatusBadge(item.estado)}
                    <span className="text-[11px] font-mono text-slate-400">
                      Vence: {item.fechaVencimiento}
                    </span>
                  </div>
                </div>

                {item.estado !== 'Vigente'&& (
                  <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-slate-400">
                      {item.diasRestantes < 0
                        ? ` Vencido hace ${Math.abs(item.diasRestantes)} días — Requiere gestión inmediata`
                        : ` Próximo a vencer en ${item.diasRestantes} días`}
                    </span>
                    <button
                      onClick={() => handleRenewAlert(item.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 border border-emerald-500/40 text-xs font-bold transition-all"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Registrar Renovación
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Columna Derecha: Registro de Auditorías Digitales */}
        <div className="lg:col-span-6 bg-zinc-900/90 border border-slate-800 rounded-3xl p-8 shadow-lg flex flex-col justify-between">
          <div>
            <div className="mb-7 pb-4 border-b border-slate-800 space-y-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
                  <Building2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>3. Registro de Auditorías Digitales (MT & ISO)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Historial auditable de inspecciones internas y del Ministerio de Trabajo. Agrega nuevas inspecciones o exporta el acta oficial consolidada en PDF o Excel (.CSV).
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={() => setShowNewAuditModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all"
                >
                  <PlusCircle className="w-4 h-4 text-amber-400" />
                  + Nueva Auditoría
                </button>
                <button
                  onClick={() => setShowOfficialReportModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md transition-all"
                >
                  <Download className="w-4 h-4" />
                  Exportar Reporte Oficial PDF / Excel
                </button>
              </div>
            </div>

            <div className="space-y-5">
              {audits.map((audit) => (
                <div
                  key={audit.id}
                  className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-slate-800 text-amber-400 font-mono text-xs font-bold">
                        {audit.id}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {audit.fecha}
                      </span>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      Cumplimiento: {audit.cumplimiento}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">
                    {audit.tipo}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Inspector: <strong className="text-slate-200">{audit.inspector}</strong> • Sede: {audit.sede}
                  </p>
                  <p className="text-xs text-slate-300 bg-zinc-900/80 p-3.5 rounded-xl border border-slate-800/80 leading-relaxed">
                    {audit.hallazgos}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-7 pt-5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-slate-400">
              Formatos avalados para inspección DGT / Ministerio de Trabajo RD
            </div>
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleExportExcelCSV}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                Descargar Excel (.CSV)
              </button>
              <button
                onClick={() => setShowOfficialReportModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 text-xs font-bold transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                Vista Oficial PDF / Imprimir
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: Ver Documento / Articulado */}
      {selectedNorma && (
        <div
          onClick={() => setSelectedNorma(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-zinc-900 border border-slate-700 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
          >
            <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-start justify-between gap-4 shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono text-xs font-bold border border-amber-500/30">
                    {selectedNorma.codigo}
                  </span>
                  <span className="text-xs text-slate-400">
                    {selectedNorma.entidad}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-white">
                  {selectedNorma.titulo}
                </h3>
                <p className="text-xs text-amber-400/90 mt-0.5">
                  {selectedNorma.subtitulo}
                </p>
              </div>
              <button
                onClick={() => setSelectedNorma(null)}
                className="p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white border border-slate-800 shrink-0"
                title="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-5">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Objeto y Alcance Normativo
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {selectedNorma.resumen}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Extracto de Artículos y Cláusulas de Cumplimiento Obligatorio
                </h4>
                <div className="space-y-3">
                  {selectedNorma.articulosClave.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-950/90 border border-slate-800/90"
                    >
                      <div className="text-sm font-bold text-white font-mono mb-1">
                        {item.art}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {item.texto}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  Aplicación Directa en SafeWork 4.0 — TECIROMAQ
                </div>
                <p className="text-xs text-emerald-200/90 leading-relaxed">
                  {selectedNorma.aplicacionTeciromaq}
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-400 font-mono">
                Documento verificado por Dirección HSE TECIROMAQ
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Imprimir Extracto
                </button>
                <button
                  onClick={() => setSelectedNorma(null)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
                >
                  Cerrar Ficha
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Reporte Oficial PDF / Excel */}
      {showOfficialReportModal && (
        <div
          onClick={() => setShowOfficialReportModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-zinc-900 border border-slate-700 rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
          >
            <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div>
                <span className="text-xs font-mono text-amber-400 uppercase">
                  REPORTE OFICIAL DE CUMPLIMIENTO SST • REPÚBLICA DOMINICANA
                </span>
                <h3 className="text-lg font-extrabold text-white">
                  Acta Consolidada de Auditorías y Vencimientos Regulatorios — TECIROMAQ
                </h3>
              </div>
              <button
                onClick={() => setShowOfficialReportModal(false)}
                className="p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div>
                  <div className="text-xs text-slate-400">Razón Social</div>
                  <div className="font-bold text-white">TECIROMAQ S.R.L. (RNC 1-30-88492-1)</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Sede Principal</div>
                  <div className="font-bold text-white">Santo Domingo / Punta Cana</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Marco Regulatorio</div>
                  <div className="font-bold text-emerald-400">Decreto 522-06 / ISO 45001</div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase text-amber-400 mb-2">
                  I. Historial de Auditorías Oficiales Registradas
                </h4>
                <div className="overflow-x-auto border border-slate-800 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="p-3">Código</th>
                        <th className="p-3">Fecha</th>
                        <th className="p-3">Tipo / Entidad</th>
                        <th className="p-3">Inspector</th>
                        <th className="p-3">Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-zinc-900/60">
                      {audits.map((a) => (
                        <tr key={a.id}>
                          <td className="p-3 font-mono font-bold text-amber-400">{a.id}</td>
                          <td className="p-3 font-mono text-slate-300">{a.fecha}</td>
                          <td className="p-3 text-white font-medium">{a.tipo}</td>
                          <td className="p-3 text-slate-300">{a.inspector}</td>
                          <td className="p-3 font-bold text-emerald-400">{a.cumplimiento}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase text-amber-400 mb-2">
                  II. Estado de Certificaciones y Vencimientos Legales
                </h4>
                <div className="space-y-2">
                  {regulatoryAlerts.map((r) => (
                    <div
                      key={r.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs"
                    >
                      <div>
                        <span className="font-bold text-white">{r.titulo}</span>
                        <span className="text-slate-400 ml-2">({r.referenciaLegal})</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-slate-400">{r.fechaVencimiento}</span>
                        {getStatusBadge(r.estado)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-400 font-mono">
                Hash Auditable: SHA256-9F82A1D0-TECIROMAQ-SST
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportExcelCSV}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                >
                  <Download className="w-4 h-4" />
                  Descargar Excel (CSV)
                </button>
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
                >
                  <Printer className="w-4 h-4" />
                  Imprimir / Guardar PDF Oficial
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Nueva Auditoría */}
      {showNewAuditModal && (
        <div
          onClick={() => setShowNewAuditModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleCreateAudit}
            className="bg-zinc-900 border border-slate-700 rounded-3xl max-w-xl w-full p-8 space-y-5 shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  Bitácora Oficial SST
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">
                  Registrar Nueva Auditoría Digital
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Elige una plantilla rápida o completa los datos de la inspección:
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowNewAuditModal(false)}
                className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Plantillas rápidas de 1 clic para entender y usar al instante */}
            <div className="flex flex-wrap gap-2">
              {[
                {
                  label: 'Inspección Ministerio de Trabajo',
                  tipo: 'Inspección Oficial Ministerio de Trabajo (DGT)',
                  inspector: 'Insp. Roberto Santana (MT-RD)',
                  cumplimiento: '98.5%',
                  hallazgos: 'Revisión de extintores, botiquines y licencias de operadores pesados conforme al Decreto 522-06.'},
                {
                  label: 'Auditoría Interna LOTO',
                  tipo: 'Auditoría Interna ISO 45001 — Bloqueo LOTO',
                  inspector: 'Ing. Laura Báez (HSE TECIROMAQ)',
                  cumplimiento: '100%',
                  hallazgos: 'Verificación de candados LOTO y doble firma en taller mecánico central sin desviaciones.'}
              ].map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() =>
                    setNewAuditForm({
                      ...newAuditForm,
                      tipo: preset.tipo,
                      inspector: preset.inspector,
                      cumplimiento: preset.cumplimiento,
                      hallazgos: preset.hallazgos
                    })
                  }
                  className="px-3.5 py-1.5 rounded-full bg-slate-800 hover:bg-amber-500 text-xs font-bold transition-all border border-slate-700"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Tipo de Auditoría / Inspección
                </label>
                <input
                  type="text"
                  required
                  value={newAuditForm.tipo}
                  onChange={(e) => setNewAuditForm({ ...newAuditForm, tipo: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Inspector / Entidad
                  </label>
                  <input
                    type="text"
                    required
                    value={newAuditForm.inspector}
                    onChange={(e) => setNewAuditForm({ ...newAuditForm, inspector: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    % Cumplimiento Obtenido
                  </label>
                  <input
                    type="text"
                    required
                    value={newAuditForm.cumplimiento}
                    onChange={(e) => setNewAuditForm({ ...newAuditForm, cumplimiento: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Hallazgos y Observaciones
                </label>
                <textarea
                  rows={3}
                  required
                  value={newAuditForm.hallazgos}
                  onChange={(e) => setNewAuditForm({ ...newAuditForm, hallazgos: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowNewAuditModal(false)}
                className="px-5 py-2.5 rounded-full bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md"
              >
                Guardar Auditoría
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
