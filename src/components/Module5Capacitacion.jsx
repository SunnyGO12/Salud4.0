import React, { useState, useRef } from 'react';
import {
  GraduationCap,
  Award,
  CheckCircle2,
  BookOpen,
  PlayCircle,
  Download,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  UserCheck,
  PlusCircle,
  AlertCircle,
  Eye,
  X
} from 'lucide-react';
import { QUIZ_QUESTIONS, INITIAL_WORKERS, INITIAL_COURSES } from '../data/initialData';

export default function Module5Capacitacion({
  courses,
  setCourses,
  workers = INITIAL_WORKERS,
  setWorkers,
  activeWorkerId = 'OP-001',
  setActiveWorkerId,
  userCoursesMap,
  setUserCoursesMap,
  certificates,
  setCertificates,
  addNotification
}) {
  const currentWorker = workers.find((w) => w.id === activeWorkerId) || workers[0];
  const workerName = currentWorker?.nombre || 'Op. Carlos M. Castillo';
  const workerCedula = currentWorker?.cedula || '001-1849201-4';
  const workerPosition = currentWorker?.cargo || 'Operador de Maquinaria Pesada';

  // Modal para agregar nuevo operador manualmente
  const [isAddWorkerModalOpen, setIsAddWorkerModalOpen] = useState(false);
  const [newWorkerForm, setNewWorkerForm] = useState({
    nombre: '',
    cedula: '',
    cargo: 'Operador de Maquinaria Pesada',
    departamento: 'Operaciones & Movimiento de Tierras'
  });

  const handleCreateNewWorker = (e) => {
    e.preventDefault();
    if (!newWorkerForm.nombre.trim() || !newWorkerForm.cedula.trim()) return;

    // Generar ID único incremental (e.g. OP-005)
    const nextNum = workers.length + 1;
    const newId = `OP-${String(nextNum).padStart(3, '0')}`;

    const newWorker = {
      id: newId,
      nombre: newWorkerForm.nombre.trim(),
      cedula: newWorkerForm.cedula.trim(),
      cargo: newWorkerForm.cargo.trim() || 'Operador de Maquinaria Pesada',
      departamento: newWorkerForm.departamento.trim() || 'Operaciones'
    };

    if (setWorkers) {
      setWorkers((prev) => [...prev, newWorker]);
    }

    // Inicializar cursos vacíos propios para el nuevo operador
    if (setUserCoursesMap) {
      setUserCoursesMap((prev) => ({
        ...prev,
        [newId]: INITIAL_COURSES.map((course) => ({
          ...course,
          modulosLeidos: [false, false, false],
          respuestaCorrectaRespondida: false,
          progreso: 0,
          completado: false,
          ultimaActualizacion: 'No iniciado'
        }))
      }));
    }

    if (setActiveWorkerId) {
      setActiveWorkerId(newId);
    }

    setNewWorkerForm({
      nombre: '',
      cedula: '',
      cargo: 'Operador de Maquinaria Pesada',
      departamento: 'Operaciones & Movimiento de Tierras'
    });
    setIsAddWorkerModalOpen(false);

    addNotification(
      `Operador Registrado: ${newWorker.nombre}`,
      `Se creó el expediente oficial (${newId}) en la Base de Datos SQLite y se habilitó su registro individual de cursos.`,
      'success',
      'capacitacion'
    );
  };

  // Respuestas seleccionadas en el Examen General de 3 preguntas
  const [selectedAnswers, setSelectedAnswers] = useState({
    Q1: null,
    Q2: null,
    Q3: null
  });
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [quizResult, setQuizResult] = useState(null);

  // Modal de estudio por curso individual con seguimiento de scroll real
  const [activeCourseId, setActiveCourseId] = useState(null);
  const [courseQuizSelection, setCourseQuizSelection] = useState(null);
  const [courseQuizError, setCourseQuizError] = useState(false);
  const readingContainerRef = useRef(null);

  // Modal del Examen General y Modal de Simulación Oficial del Certificado
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isCertificatePreviewOpen, setIsCertificatePreviewOpen] = useState(false);

  const completedCoursesCount = courses.filter((c) => c.progreso === 100).length;
  const totalProgress = Math.round(
    courses.reduce((acc, c) => acc + c.progreso, 0) / courses.length
  );

  const activeCourse = activeCourseId
    ? courses.find((c) => c.id === activeCourseId)
    : null;

  const openCourseStudyModal = (course) => {
    setActiveCourseId(course.id);
    setCourseQuizSelection(
      course.respuestaCorrectaRespondida && course.preguntaCurso
        ? course.preguntaCurso.correctaIndex
        : null
    );
    setCourseQuizError(false);
  };

  // Detectar el movimiento real del scroll dentro del lector del curso para registrar progreso automáticamente
  const handleReadingScroll = (e) => {
    if (!activeCourse) return;
    const el = e.currentTarget;
    const maxScroll = el.scrollHeight - el.clientHeight;
    const ratio = maxScroll <= 10 ? 1 : el.scrollTop / maxScroll;

    const prevLeidos = Array.isArray(activeCourse.modulosLeidos)
      ? [...activeCourse.modulosLeidos]
      : [false, false, false];

    const nextLeidos = [...prevLeidos];
    if (ratio >= 0.05) nextLeidos[0] = true;
    if (ratio >= 0.45) nextLeidos[1] = true;
    if (ratio >= 0.88) nextLeidos[2] = true;

    const changed =
      nextLeidos[0] !== prevLeidos[0] ||
      nextLeidos[1] !== prevLeidos[1] ||
      nextLeidos[2] !== prevLeidos[2];

    if (changed) {
      const readCount = nextLeidos.filter(Boolean).length;
      // La lectura por scroll aporta hasta 75% (25% por capítulo). El 25% final SOLO se suma si la respuesta es correcta.
      const qScore = activeCourse.respuestaCorrectaRespondida ? 25 : 0;
      const newProgress = Math.min(activeCourse.respuestaCorrectaRespondida ? 100 : 75, readCount * 25 + qScore);
      const isCompleted = newProgress === 100 && activeCourse.respuestaCorrectaRespondida;
      const nowStr = new Date().toLocaleTimeString('es-DO', {
        hour: '2-digit',
        minute: '2-digit'
      });

      setCourses((prev) =>
        prev.map((c) =>
          c.id === activeCourse.id
            ? {
                ...c,
                modulosLeidos: nextLeidos,
                progreso: newProgress,
                completado: isCompleted,
                ultimaActualizacion: isCompleted
                  ? `Completado a las ${nowStr}`
                  : `Lectura en curso (${readCount}/3 capítulos leídos • ${nowStr})`
              }
            : c
        )
      );
    }
  };

  // Validar la pregunta del curso una vez que el scroll llegó hasta el final de los 3 capítulos
  const handleValidateCourseQuestion = (course) => {
    const currentLeidos = Array.isArray(course.modulosLeidos)
      ? course.modulosLeidos
      : [false, false, false];
    const allTopicsRead = currentLeidos.every(Boolean);

    if (!allTopicsRead) {
      setCourseQuizError('Deslice la lectura hasta el final para leer los 3 capítulos antes de responder.');
      return;
    }

    if (courseQuizSelection === null) {
      setCourseQuizError('Seleccione una respuesta para validar el curso.');
      return;
    }

    const isCorrect = courseQuizSelection === course.preguntaCurso.correctaIndex;
    if (!isCorrect) {
      setCourseQuizError('Respuesta incorrecta. Revise el texto superior e intente de nuevo.');
      return;
    }

    const nowStr = new Date().toLocaleTimeString('es-DO', {
      hour: '2-digit',
      minute: '2-digit'
    });

    setCourses((prev) =>
      prev.map((c) =>
        c.id === course.id
          ? {
              ...c,
              modulosLeidos: [true, true, true],
              respuestaCorrectaRespondida: true,
              progreso: 100,
              completado: true,
              ultimaActualizacion: `Completado al 100% (${nowStr})`
            }
          : c
      )
    );

    setCourseQuizError(false);
    setActiveCourseId(null);
    addNotification(
      `Curso ${course.id} Completado (100%)`,
      `Se registró la lectura completa por scroll y la respuesta correcta de ${workerName}.`,
      'success',
      'capacitacion'
    );
  };

  const handleAutoFillCorrectDemo = () => {
    setSelectedAnswers({
      Q1: QUIZ_QUESTIONS[0].correctaIndex,
      Q2: QUIZ_QUESTIONS[1].correctaIndex,
      Q3: QUIZ_QUESTIONS[2].correctaIndex
    });
    setQuizResult(null);
  };

  const allCoursesCompleted = courses.every((c) => c.progreso === 100);
  const activeCert =
    quizResult?.certificate ||
    certificates.find((c) => c.cedula === workerCedula || c.trabajador === workerName) ||
    null;
  const isCertificateUnlocked = allCoursesCompleted && Boolean(activeCert);

  const handleEvaluateQuiz = (e) => {
    if (e) e.preventDefault();
    if (!allCoursesCompleted) {
      addNotification(
        'Cursos Obligatorios Incompletos',
        `Debe completar primero los 4 cursos al 100% (${completedCoursesCount}/4 completados) antes de emitir el Certificado Oficial.`,
        'critical',
        'capacitacion'
      );
      return;
    }

    let correctCount = 0;
    QUIZ_QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctaIndex) {
        correctCount += 1;
      }
    });

    const scorePct = Math.round((correctCount / QUIZ_QUESTIONS.length) * 100);
    const passed = scorePct === 100;

    if (passed) {
      const issueDate = new Date().toISOString().slice(0, 10);
      const validUntil = '2027-10-18';
      const certId = `CERT-SST-RD-${Math.floor(10000 + Math.random() * 89999)}`;

      const newCert = {
        id: certId,
        trabajador: workerName,
        cedula: workerCedula,
        cargo: workerPosition,
        fechaEmision: issueDate,
        fechaVigencia: validUntil,
        calificacion: '100% (Aprobado)',
        marcoLegal: 'Decreto 522-06 (RD) • Res. 04-2007 • ISO 45001:2018 • Protocolo LOTO'
      };

      setCertificates((prev) => [newCert, ...prev]);
      setQuizResult({
        scorePct,
        correctCount,
        passed: true,
        certificate: newCert
      });
      setIsQuizModalOpen(false);
      setIsCertificatePreviewOpen(true);

      addNotification(
        `Certificado Emitido: ${certId}`,
        `${workerName} aprobó con 100% el examen de seguridad y desbloqueó su Certificado Oficial.`,
        'success',
        'capacitacion'
      );
    } else {
      setQuizResult({
        scorePct,
        correctCount,
        passed: false,
        certificate: null
      });
      addNotification(
        `Examen No Aprobado (${scorePct}%)`,
        'Se requiere responder correctamente las 3 preguntas (100%) para emitir el certificado.',
        'critical',
        'capacitacion'
      );
    }
  };

  // Descargar el certificado únicamente si los 4 cursos están al 100% y el examen fue aprobado
  const handleDownloadStandaloneCertificate = () => {
    if (!isCertificateUnlocked || !activeCert) {
      addNotification(
        'Descarga Bloqueada',
        'Debe completar los 4 cursos al 100% y aprobar el Examen de Certificación (3/3) para poder descargar el Certificado Oficial.',
        'critical',
        'capacitacion'
      );
      return;
    }

    const certHtml = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<title>Certificado Oficial SST - ${activeCert.id}</title>
<style>
  body { font-family: 'Segoe UI', Arial, sans-serif; background: #090d16; color: #f8fafc; margin: 0; padding: 40px; display: flex; justify-content: center; }
  .diploma { max-width: 820px; width: 100%; background: #0f172a; border: 4px solid #f59e0b; border-radius: 20px; padding: 44px; box-sizing: border-box; box-shadow: 0 25px 50px rgba(0,0,0,0.6); }
  .top { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #1e293b; padding-bottom: 20px; }
  .sub { color: #f59e0b; font-size: 12px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; }
  .title { font-size: 24px; font-weight: 900; margin: 6px 0 0; color: #ffffff; }
  .badge { background: rgba(16,185,129,0.18); border: 1.5px solid #10b981; color: #34d399; padding: 8px 16px; border-radius: 10px; font-weight: 800; font-size: 13px; }
  .worker-box { margin: 28px 0; padding: 24px; background: #020617; border: 1px solid #1e293b; border-radius: 14px; text-align: center; }
  .worker-name { font-size: 30px; font-weight: 900; color: #fbbf24; margin: 8px 0; }
  .worker-meta { font-size: 14px; color: #cbd5e1; font-family: monospace; }
  .body-text { font-size: 14px; line-height: 1.7; color: #e2e8f0; text-align: center; margin-bottom: 24px; }
  .legal { background: #020617; border: 1px solid #1e293b; padding: 14px; border-radius: 10px; text-align: center; font-family: monospace; color: #34d399; font-weight: 700; font-size: 13px; }
  .signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 36px; padding-top: 24px; border-top: 1px solid #1e293b; text-align: center; }
  .sig-line { font-family: Georgia, serif; font-style: italic; font-size: 18px; color: #fbbf24; margin-bottom: 6px; }
  .sig-role { font-size: 12px; color: #94a3b8; text-transform: uppercase; font-weight: 700; }
  .footer { margin-top: 28px; display: flex; justify-content: space-between; font-family: monospace; font-size: 12px; color: #94a3b8; }
</style>
</head>
<body>
  <div class="diploma">
    <div class="top">
      <div>
        <div class="sub">República Dominicana • Sistema SafeWork 4.0</div>
        <h1 class="title">TECTROMAQ S.R.L. — CERTIFICADO DE HABILITACIÓN SST</h1>
      </div>
      <div class="badge">CALIFICACIÓN: ${activeCert.calificacion}</div>
    </div>
    <div class="worker-box">
      <div style="font-size:12px;color:#94a3b8;text-transform:uppercase;font-weight:700;">Se otorga la presente habilitación técnica a:</div>
      <div class="worker-name">${activeCert.trabajador}</div>
      <div class="worker-meta">Cédula RD: ${activeCert.cedula} &nbsp;|&nbsp; Cargo: ${activeCert.cargo}</div>
    </div>
    <p class="body-text">
      Por haber completado al 100% la lectura de los manuales técnicos y aprobado la Evaluación de Seguridad y Salud en el Trabajo para la inspección pre-operacional, bloqueo de energía peligrosa (<strong>LOTO</strong>) y operación segura de la flota <strong>Excavadora CAT 320D</strong>, <strong>Retroexcavadora JCB 3CX</strong> y <strong>Rodillo Compactador Dynapac CA250</strong>.
    </p>
    <div class="legal">${activeCert.marcoLegal}</div>
    <div class="signatures">
      <div>
        <div class="sig-line">Ing. Marcos Tejada</div>
        <div class="sig-role">Jefe de Mantenimiento y Flota Pesada</div>
      </div>
      <div>
        <div class="sig-line">Ing. Laura Báez</div>
        <div class="sig-role">Coordinadora Corporativa HSE — TECTROMAQ</div>
      </div>
    </div>
    <div class="footer">
      <span>FOLIO OFICIAL: <strong>${activeCert.id}</strong></span>
      <span>EMISIÓN: <strong>${activeCert.fechaEmision}</strong></span>
      <span>VIGENCIA: <strong>HASTA ${activeCert.fechaVigencia}</strong></span>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([certHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeCert.id}_${activeCert.trabajador.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addNotification(
      'Certificado Oficial Descargado',
      `Se descargó el Certificado Oficial ${activeCert.id}.`,
      'info',
      'capacitacion'
    );
  };

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIdx];
  const answeredCount = Object.values(selectedAnswers).filter((v) => v !== null).length;

  return (
    <div className="space-y-6">
      {/* Encabezado Principal */}
      <div className="rounded-2xl bg-zinc-900 border border-slate-800 p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Capacitación y Certificación de Operadores
            </h1>
          </div>

          <button
            type="button"
            onClick={() => {
              if (!allCoursesCompleted) {
                addNotification(
                  'Complete los 4 Cursos Primero',
                  `Lleva ${completedCoursesCount} de 4 cursos al 100%. Debe terminar las lecturas antes del examen final.`,
                  'critical',
                  'capacitacion'
                );
                return;
              }
              setCurrentQuestionIdx(0);
              setIsQuizModalOpen(true);
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all shrink-0 inline-flex items-center gap-2 ${
              allCoursesCompleted
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            <Award className="w-4 h-4" />
            {allCoursesCompleted
              ? 'Tomar Examen de Certificación (3 Preguntas)'
              : `Examen Bloqueado (${completedCoursesCount}/4 Cursos al 100%)`}
          </button>
        </div>
        <p className="text-slate-400 text-sm mt-2">
          Abra cada curso y deslice la lectura hasta el final: el movimiento del scroll desbloquea los capítulos y la pregunta del curso. Al completar los 4 cursos y aprobar el examen general, se habilita la descarga del Certificado Oficial.
        </p>
      </div>

      {/* 3 Tarjetas de Resumen Rápido */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-zinc-900/90 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Cursos Completados
            </span>
            <span className="text-3xl font-extrabold font-mono text-white mt-1 block">
              {completedCoursesCount} / {courses.length}
            </span>
            <span className="text-xs text-slate-400 mt-1 block">
              Progreso guardado: <strong className="text-amber-400">{totalProgress}%</strong>
            </span>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-zinc-900/90 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Nota Mínima Exigida
            </span>
            <span className="text-3xl font-extrabold font-mono text-emerald-400 mt-1 block">
              100% (3/3)
            </span>
            <span className="text-xs text-slate-400 mt-1 block">
              4 cursos al 100% + Examen aprobado
            </span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-zinc-900/90 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Estado del Certificado
            </span>
            <span className={`text-2xl font-extrabold font-mono mt-1 block ${isCertificateUnlocked ? 'text-emerald-400' : 'text-amber-400'}`}>
              {isCertificateUnlocked ? 'HABILITADO' : 'PENDIENTE'}
            </span>
            <span className="text-xs text-slate-400 mt-1 block">
              {isCertificateUnlocked ? `Folio: ${activeCert.id}` : 'Requiere aprobar cursos y examen'}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-amber-400">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* PASO 1: Selector y Expediente Individual de Cada Usuario */}
      <div className="bg-zinc-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <UserCheck className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <h2 className="text-base font-bold text-white">
                1. Selección de Usuario / Expediente de Capacitación SST
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Cada usuario tiene su propio registro independiente de progreso, lecturas, cursos aprobados y certificados.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsAddWorkerModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Registrar Nuevo Operador</span>
            </button>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400">
              Usuario Activo: {currentWorker.id}
            </span>
          </div>
        </div>

        {/* Selector interactivo de usuarios con fichas de estado individual + Botón para agregar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {workers.map((w) => {
            const isSelected = w.id === activeWorkerId;
            const wCourses = userCoursesMap?.[w.id] || [];
            const wCompleted = wCourses.filter((c) => c.progreso === 100).length;
            const wProg = wCourses.length
              ? Math.round(wCourses.reduce((acc, c) => acc + (c.progreso || 0), 0) / wCourses.length)
              : 0;
            const wHasCert = certificates.some((cert) => cert.cedula === w.cedula || cert.trabajador === w.nombre);

            return (
              <button
                key={w.id}
                type="button"
                onClick={() => {
                  if (setActiveWorkerId) setActiveWorkerId(w.id);
                  setActiveCourseId(null);
                  setSelectedAnswers({ Q1: null, Q2: null, Q3: null });
                  setQuizResult(null);
                  addNotification(
                    `Expediente Activo: ${w.nombre}`,
                    `Se cargó el historial individual de cursos (${wCompleted}/4 completados).`,
                    'info',
                    'capacitacion'
                  );
                }}
                className={`p-4 rounded-xl text-left transition-all border flex flex-col justify-between gap-2.5 ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/10 ring-1 ring-amber-500/50'
                    : 'bg-slate-950/80 hover:bg-slate-900 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                      isSelected ? 'bg-amber-500 text-slate-950' : 'bg-zinc-800 text-slate-400'
                    }`}>
                      {w.id}
                    </span>
                    {wHasCert && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                        <Award className="w-3 h-3" /> Certificado
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-white leading-snug">{w.nombre}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{w.cargo}</p>
                </div>

                <div className="pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Cursos: {wCompleted}/4</span>
                    <span className={wCompleted === 4 ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                      {wProg}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 mt-1 overflow-hidden">
                    <div
                      className={`h-full transition-all ${wCompleted === 4 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                      style={{ width: `${wProg}%` }}
                    />
                  </div>
                </div>
              </button>
            );
          })}

          {/* Tarjeta de añadir operador rápido */}
          <button
            type="button"
            onClick={() => setIsAddWorkerModalOpen(true)}
            className="p-4 rounded-xl text-center transition-all border-2 border-dashed border-slate-700 hover:border-amber-500/60 hover:bg-amber-500/5 flex flex-col items-center justify-center gap-2 group min-h-[140px]"
          >
            <div className="w-10 h-10 rounded-full bg-slate-800 group-hover:bg-amber-500 group-hover:text-slate-950 text-amber-400 flex items-center justify-center transition-all">
              <PlusCircle className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-300 group-hover:text-amber-400">
              + Agregar Otro Operador
            </span>
            <span className="text-[10px] text-slate-400">
              Crea expediente propio en SQLite
            </span>
          </button>
        </div>

        {/* Ficha editable del operador seleccionado */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Nombre Completo del Operador / Técnico
            </label>
            <input
              type="text"
              value={workerName}
              onChange={(e) => {
                const val = e.target.value;
                if (setWorkers) {
                  setWorkers((prev) =>
                    prev.map((w) => (w.id === activeWorkerId ? { ...w, nombre: val } : w))
                  );
                }
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm font-bold text-white focus:border-amber-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Cédula de Identidad (Rep. Dominicana)
            </label>
            <input
              type="text"
              value={workerCedula}
              onChange={(e) => {
                const val = e.target.value;
                if (setWorkers) {
                  setWorkers((prev) =>
                    prev.map((w) => (w.id === activeWorkerId ? { ...w, cedula: val } : w))
                  );
                }
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm font-mono text-white focus:border-amber-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Cargo / Especialidad Asignada
            </label>
            <input
              type="text"
              value={workerPosition}
              onChange={(e) => {
                const val = e.target.value;
                if (setWorkers) {
                  setWorkers((prev) =>
                    prev.map((w) => (w.id === activeWorkerId ? { ...w, cargo: val } : w))
                  );
                }
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-amber-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* PASO 2: Los 4 Cursos Obligatorios (Lectura por Scroll + Pregunta) */}
      <div className="bg-zinc-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-amber-400 shrink-0" />
            <h2 className="text-base font-bold text-white">
              2. Cursos Cortos Obligatorios (Lectura por Scroll)
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            El avance sube automáticamente al bajar el scroll leyendo los 3 capítulos
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {courses.map((course) => {
            const leidos = Array.isArray(course.modulosLeidos)
              ? course.modulosLeidos.filter(Boolean).length
              : course.progreso === 100
              ? 3
              : 0;

            return (
              <div
                key={course.id}
                className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-slate-800 font-mono text-xs font-bold text-amber-400">
                      {course.id} • {course.duracion}
                    </span>

                    {course.progreso === 100 ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        COMPLETADO (100%)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        EN LECTURA ({course.progreso}%)
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-white mt-3">
                    {course.titulo}
                  </h3>
                  <p className="text-xs font-mono text-slate-400 mt-1">
                    Norma: {course.norma}
                  </p>

                  {/* Desglose del progreso guardado */}
                  <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Capítulos leídos con scroll: {leidos}/3</span>
                    <span>
                      Evaluación: {course.respuestaCorrectaRespondida ? 'Aprobada' : 'Pendiente'}
                    </span>
                  </div>

                  {/* Barra de progreso */}
                  <div className="mt-1.5 w-full h-2 rounded-full bg-zinc-900 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full transition-all duration-500 ${
                        course.progreso === 100 ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${course.progreso}%` }}
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono text-slate-400 truncate">
                    {course.ultimaActualizacion || `Avance: ${course.progreso}%`}
                  </span>

                  <button
                    type="button"
                    onClick={() => openCourseStudyModal(course)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-extrabold inline-flex items-center gap-1.5 shrink-0 transition-all ${
                      course.progreso === 100
                        ? 'bg-zinc-900 hover:bg-zinc-800 text-slate-200 border border-slate-700'
                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    {course.progreso === 100 ? 'Abrir Lectura' : 'Continuar Lectura'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PASO 3: Certificado Oficial de Habilitación SST (Bloqueado hasta aprobar todo) */}
      <div className="bg-zinc-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-emerald-400 shrink-0" />
            <h2 className="text-base font-bold text-white">
              3. Certificado Oficial de Habilitación SST
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (!allCoursesCompleted) {
                  addNotification(
                    'Cursos Pendientes',
                    `Complete primero los 4 cursos cortos (${completedCoursesCount}/4 completados) para habilitar el examen.`,
                    'critical',
                    'capacitacion'
                  );
                  return;
                }
                setCurrentQuestionIdx(0);
                setIsQuizModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 text-xs font-extrabold inline-flex items-center gap-1.5"
            >
              <PlayCircle className="w-3.5 h-3.5" />
              Realizar Examen General
            </button>

            <button
              type="button"
              disabled={!isCertificateUnlocked}
              onClick={() => {
                if (!isCertificateUnlocked) return;
                setIsCertificatePreviewOpen(true);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold inline-flex items-center gap-1.5 transition-all ${
                isCertificateUnlocked
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg cursor-pointer'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Certificado Oficial
            </button>
          </div>
        </div>

        {isCertificateUnlocked && activeCert ? (
          <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-mono text-emerald-400 font-bold block">
                CERTIFICADO APROBADO • FOLIO: {activeCert.id} • {activeCert.calificacion}
              </span>
              <h3 className="text-base font-extrabold text-white">
                {activeCert.trabajador} — {activeCert.cargo}
              </h3>
              <p className="text-xs text-slate-400">
                Cédula: <strong className="text-slate-200">{activeCert.cedula}</strong> • Vigencia legal hasta: <strong className="text-emerald-400">{activeCert.fechaVigencia}</strong>
              </p>
            </div>

            <button
              type="button"
              onClick={handleDownloadStandaloneCertificate}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold inline-flex items-center gap-2 shrink-0 shadow-lg"
            >
              <Download className="w-4 h-4" />
              Descargar Certificado Oficial
            </button>
          </div>
        ) : (
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-mono text-amber-400 font-bold block">
                CERTIFICADO BLOQUEADO — REQUISITOS PENDIENTES
              </span>
              <h3 className="text-sm font-bold text-white">
                Para ver o descargar el Certificado Oficial debe aprobar los 4 cursos ({completedCoursesCount}/4) y el Examen General (3/3).
              </h3>
              <p className="text-xs text-slate-400">
                Complete primero los cursos pendientes arriba deslizando la lectura hasta el final y respondiendo su evaluación.
              </p>
            </div>

            <button
              type="button"
              disabled
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-500 border border-slate-700 text-xs font-bold inline-flex items-center gap-2 shrink-0 cursor-not-allowed opacity-60"
            >
              <Download className="w-4 h-4" />
              Descargar Certificado Oficial (Bloqueado)
            </button>
          </div>
        )}

        {/* Tabla de Historial General de Certificados Emitidos por Operador */}
        {certificates.length > 0 && (
          <div className="pt-4 border-t border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Historial de Certificados Oficiales Emitidos en la Plataforma ({certificates.length})
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Folio</th>
                    <th className="py-2.5 px-3">Trabajador</th>
                    <th className="py-2.5 px-3">Cédula</th>
                    <th className="py-2.5 px-3">Emisión</th>
                    <th className="py-2.5 px-3">Vigencia</th>
                    <th className="py-2.5 px-3">Calificación</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {certificates.map((cert) => {
                    const isCurrent = cert.cedula === workerCedula;
                    return (
                      <tr key={cert.id} className={isCurrent ? 'bg-amber-500/10' : 'hover:bg-slate-950/60'}>
                        <td className="py-2.5 px-3 font-bold text-amber-400">{cert.id}</td>
                        <td className="py-2.5 px-3 font-bold text-white flex items-center gap-1.5">
                          {cert.trabajador}
                          {isCurrent && (
                            <span className="text-[10px] bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded font-extrabold">
                              Activo
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-slate-300">{cert.cedula}</td>
                        <td className="py-2.5 px-3 text-slate-400">{cert.fechaEmision}</td>
                        <td className="py-2.5 px-3 text-emerald-400 font-bold">{cert.fechaVigencia}</td>
                        <td className="py-2.5 px-3 text-emerald-400 font-bold">{cert.calificacion}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: Lector Real con Scroll Automático + Pregunta Desbloqueable al Final */}
      {activeCourse && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setActiveCourseId(null)}
        >
          <div
            className="bg-zinc-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col p-5 space-y-3.5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabecera alineada */}
            <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-amber-400 shrink-0" />
                <h3 className="text-sm sm:text-base font-extrabold text-white">
                  {activeCourse.id} — {activeCourse.titulo}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveCourseId(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Indicador de Progreso por Scroll en Tiempo Real */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 shrink-0">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold">
                  Deslice hacia abajo para leer los 3 capítulos:
                </span>
                <span className="font-mono font-extrabold text-amber-400">
                  Avance del Curso: {activeCourse.progreso}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden border border-slate-800">
                <div
                  className={`h-full transition-all duration-300 ${
                    activeCourse.progreso === 100 ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${activeCourse.progreso}%` }}
                />
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1">
                {[0, 1, 2].map((idx) => {
                  const read = Array.isArray(activeCourse.modulosLeidos)
                    ? activeCourse.modulosLeidos[idx]
                    : false;
                  return (
                    <div
                      key={idx}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold text-center border ${
                        read
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                          : 'bg-zinc-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      Capítulo {idx + 1}: {read ? 'Leído (25%)' : 'Por leer'}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Contenedor de Lectura con Scroll Real que dispara el progreso */}
            <div
              ref={readingContainerRef}
              onScroll={handleReadingScroll}
              className="flex-1 overflow-y-auto pr-2 space-y-4 bg-slate-950/90 border border-slate-800 rounded-xl p-4"
              style={{ maxHeight: '42vh' }}
            >
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 font-mono">
                Norma de Referencia: {activeCourse.norma} • Lea hasta el final del documento para habilitar la evaluación.
              </div>

              {(activeCourse.seccionesLectura || []).map((sec, idx) => {
                const isRead = Array.isArray(activeCourse.modulosLeidos)
                  ? activeCourse.modulosLeidos[idx]
                  : false;
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border transition-all space-y-2 ${
                      isRead
                        ? 'bg-zinc-900/90 border-emerald-500/40'
                        : 'bg-zinc-900/50 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs sm:text-sm font-extrabold text-white">
                        {sec.titulo}
                      </h4>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${
                          isRead
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {isRead ? 'Leído' : 'Baje el scroll'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {sec.contenido}
                    </p>
                  </div>
                );
              })}

              {/* Al llegar al final de la lectura, aparece la pregunta de comprobación dentro del mismo flujo de scroll */}
              {activeCourse.preguntaCurso && (
                <div className="p-4 rounded-xl bg-zinc-900 border-2 border-amber-500/50 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-extrabold text-amber-400 uppercase">
                      Evaluación Final del Curso (Último 25%)
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {(activeCourse.modulosLeidos || []).every(Boolean)
                        ? 'Lectura completada • Puede responder'
                        : 'Lea los 3 capítulos primero'}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-bold text-white leading-snug">
                    {activeCourse.preguntaCurso.enunciado}
                  </p>

                  <div className="space-y-2">
                    {activeCourse.preguntaCurso.opciones.map((op, idx) => {
                      const isSelected = courseQuizSelection === idx;
                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            setCourseQuizSelection(idx);
                            setCourseQuizError(false);
                          }}
                          className={`flex items-center justify-between gap-3 p-2.5 rounded-xl border cursor-pointer text-xs transition-all ${
                            isSelected
                              ? 'bg-amber-500/15 border-amber-500 text-white font-bold'
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <span>{op}</span>
                          <span
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold shrink-0 ${
                              isSelected
                                ? 'bg-amber-500 text-slate-950'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {isSelected ? 'Elegida' : 'Elegir'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {courseQuizError && (
              <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500 text-xs text-rose-200 flex items-center gap-2 shrink-0">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{courseQuizError}</span>
              </div>
            )}

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800 shrink-0">
              <button
                type="button"
                onClick={() => setActiveCourseId(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
              >
                Guardar Avance y Cerrar
              </button>

              <button
                type="button"
                onClick={() => handleValidateCourseQuestion(activeCourse)}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold"
              >
                Validar Respuesta y Completar 100%
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Examen General de Certificación Compacto */}
      {isQuizModalOpen && currentQuestion && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setIsQuizModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-zinc-900 border border-slate-700 rounded-2xl max-w-xl w-full max-h-[85vh] overflow-y-auto p-5 space-y-3.5 shadow-2xl"
          >
            <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400 shrink-0" />
                <h3 className="text-sm sm:text-base font-extrabold text-white">
                  Examen de Certificación SST
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsQuizModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950 border border-slate-800 rounded-xl p-2.5">
              <div className="flex items-center gap-1.5">
                {QUIZ_QUESTIONS.map((q, idx) => {
                  const isCurrent = currentQuestionIdx === idx;
                  const isAnswered = selectedAnswers[q.id] !== null;
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setCurrentQuestionIdx(idx)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all ${
                        isCurrent
                          ? 'bg-amber-500 text-slate-950'
                          : isAnswered
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-zinc-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      Pregunta {idx + 1}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleAutoFillCorrectDemo}
                className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 text-xs font-bold inline-flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Autocompletar Correctas
              </button>
            </div>

            {quizResult && !quizResult.passed && (
              <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500 text-xs text-rose-200 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>
                    Obtuvo <strong>{quizResult.scorePct}% ({quizResult.correctCount}/3)</strong>. Se necesita 3/3.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleAutoFillCorrectDemo}
                  className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold shrink-0"
                >
                  Corregir
                </button>
              </div>
            )}

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-amber-400">
                <span>PREGUNTA {currentQuestionIdx + 1} DE {QUIZ_QUESTIONS.length}</span>
                <span>{answeredCount}/3 respondidas</span>
              </div>

              <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
                {currentQuestion.pregunta}
              </h4>

              <div className="space-y-1.5 pt-0.5">
                {currentQuestion.opciones.map((opcion, idx) => {
                  const isSelected = selectedAnswers[currentQuestion.id] === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() =>
                        setSelectedAnswers((prev) => ({
                          ...prev,
                          [currentQuestion.id]: idx
                        }))
                      }
                      className={`flex items-center justify-between gap-3 p-2.5 rounded-xl border cursor-pointer text-xs transition-all ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500 text-white font-bold'
                          : 'bg-zinc-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span>{opcion}</span>
                      <span
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold shrink-0 ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {isSelected ? 'Seleccionada' : 'Elegir'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {currentQuestionIdx > 0 && (
                  <button
                    type="button"
                    onClick={() => setCurrentQuestionIdx((prev) => prev - 1)}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
                  >
                    Anterior
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAnswers({ Q1: null, Q2: null, Q3: null });
                    setQuizResult(null);
                    setCurrentQuestionIdx(0);
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reiniciar
                </button>
              </div>

              <div className="flex items-center gap-2">
                {currentQuestionIdx < QUIZ_QUESTIONS.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentQuestionIdx((prev) => prev + 1)}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition-all"
                  >
                    Siguiente Pregunta
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleEvaluateQuiz}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-lg transition-all"
                  >
                    Calificar y Emitir Certificado
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Certificado Oficial (Diploma Interactivo con Firmas y Descarga Directa) */}
      {isCertificatePreviewOpen && isCertificateUnlocked && activeCert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setIsCertificatePreviewOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-zinc-900 border-2 border-amber-500 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-5 shadow-2xl"
          >
            {/* Barra superior del visor de certificado */}
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-xs font-mono uppercase font-extrabold text-emerald-400">
                  DOCUMENTO OFICIAL VERIFICADO • EXPEDIENTE {activeCert.id}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsCertificatePreviewOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cuerpo del Diploma Simulado */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-center">
              <div className="text-[11px] font-mono text-amber-400 uppercase font-bold tracking-wider">
                REPÚBLICA DOMINICANA • MINISTERIO DE TRABAJO (REG. 522-06)
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white">
                TECTROMAQ S.R.L. — CERTIFICADO DE HABILITACIÓN SST
              </h3>

              <div className="p-4 rounded-xl bg-zinc-900 border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400 uppercase font-bold block">
                  Se certifica que el operador / técnico:
                </span>
                <div className="text-xl sm:text-2xl font-extrabold text-amber-400">
                  {activeCert.trabajador}
                </div>
                <div className="text-xs font-mono text-slate-300">
                  Cédula RD: <strong>{activeCert.cedula}</strong> • Cargo: <strong>{activeCert.cargo}</strong>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed max-w-xl mx-auto">
                Aprobó con calificación perfecta (<strong>{activeCert.calificacion}</strong>) los módulos obligatorios de <strong>Inspección Pre-Operacional</strong>, <strong>Bloqueo de Energía Peligrosa (LOTO)</strong> y <strong>Operación Segura de Excavadora CAT 320D, Retroexcavadora JCB 3CX y Compactador Dynapac CA250</strong>.
              </p>

              {/* Firmas Autorizadas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-800">
                <div className="p-3 rounded-xl bg-zinc-900/70 border border-slate-800">
                  <div className="text-sm font-display italic text-amber-400 font-bold">
                    Ing. Marcos Tejada
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase mt-0.5">
                    Jefe de Mantenimiento y Flota Pesada
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900/70 border border-slate-800">
                  <div className="text-sm font-display italic text-emerald-400 font-bold">
                    Ing. Laura Báez
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase mt-0.5">
                    Coordinadora Corporativa HSE — TECTROMAQ
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] font-mono text-slate-400">
                <span>Folio: <strong className="text-white">{activeCert.id}</strong></span>
                <span>Emisión: <strong className="text-white">{activeCert.fechaEmision}</strong></span>
                <span>Vigencia: <strong className="text-emerald-400">Hasta {activeCert.fechaVigencia}</strong></span>
              </div>
            </div>

            {/* Acciones del Certificado Simulado */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={() => setIsCertificatePreviewOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
              >
                Cerrar Vista Previa
              </button>

              <button
                type="button"
                onClick={handleDownloadStandaloneCertificate}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold inline-flex items-center gap-2 shadow-lg"
              >
                <Download className="w-4 h-4" />
                Descargar Certificado Oficial Independiente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PARA AGREGAR NUEVO OPERADOR MANUALMENTE A LA BASE DE DATOS */}
      {isAddWorkerModalOpen && (
        <div
          onClick={() => setIsAddWorkerModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-zinc-900 border-2 border-amber-500/70 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Registrar Nuevo Operador / Trabajador
                  </h3>
                  <p className="text-xs text-slate-400">
                    Se almacena de forma persistente en SQLite con expediente individual de cursos
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddWorkerModalOpen(false)}
                className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewWorker} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Nombre Completo del Operador *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Op. Nelson Batista Rosario"
                  value={newWorkerForm.nombre}
                  onChange={(e) =>
                    setNewWorkerForm({ ...newWorkerForm, nombre: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Cédula de Identidad y Electoral (República Dominicana) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. 402-2849103-5"
                  value={newWorkerForm.cedula}
                  onChange={(e) =>
                    setNewWorkerForm({ ...newWorkerForm, cedula: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-sm font-mono text-white focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Cargo / Especialidad de Maquinaria
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Operador de Excavadora / Pavimentadora"
                  value={newWorkerForm.cargo}
                  onChange={(e) =>
                    setNewWorkerForm({ ...newWorkerForm, cargo: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Departamento / Frente de Obra
                </label>
                <input
                  type="text"
                  placeholder="Ej. Frente de Obra Bávaro / Santo Domingo"
                  value={newWorkerForm.departamento}
                  onChange={(e) =>
                    setNewWorkerForm({ ...newWorkerForm, departamento: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-amber-500 outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddWorkerModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-lg inline-flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Guardar y Habilitar Expediente</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
