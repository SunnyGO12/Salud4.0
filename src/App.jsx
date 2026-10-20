import { TECTROMAQ_LOGO } from './data/tectromaqLogo.js';
import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  ArrowUpRight,
  Globe,
  X
} from 'lucide-react';
import {
  INITIAL_MACHINES,
  INITIAL_REGULATORY_ALERTS,
  INITIAL_AUDITS,
  INITIAL_RISK_REPORTS,
  INITIAL_COURSES,
  INITIAL_LOTO_HISTORY,
  INITIAL_WORKERS
} from './data/initialData';

import Module1Normativa from './components/Module1Normativa';
import Module2Checklists from './components/Module2Checklists';
import Module3Riesgos from './components/Module3Riesgos';
import Module4IoT from './components/Module4IoT';
import Module5Capacitacion from './components/Module5Capacitacion';
import Module6Loto from './components/Module6Loto';

const STORAGE_KEY = 'SAFEWORK_4_TECTROMAQ_STATE_V2';

// Componente reutilizable del SVG de doble elipse dibujada a mano de Altgage
const HandDrawnEllipse = ({ className = 'elipse-draw-svg'}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 94 68"
    fill="none"
    preserveAspectRatio="none"
    className={className}
  >
    <path
      d="M88.0171 39.5133C87.3588 46.9971 82.2341 53.1978 74.3573 57.1406C66.4842 61.0816 55.9122 62.7341 44.5112 61.1318C33.1102 59.5295 23.0837 54.982 16.0877 48.9513C9.08845 42.9179 5.1665 35.4458 5.82482 27.9619C6.48313 20.478 11.6078 14.2773 19.4846 10.3345C27.3577 6.39356 37.9297 4.74104 49.3306 6.34335C60.7316 7.94565 70.7582 12.4931 77.7542 18.5238C84.7534 24.5573 88.6754 32.0294 88.0171 39.5133Z"
      stroke="currentColor"
      vectorEffect="non-scaling-stroke"
      strokeWidth="1.75"
    />
    <path
      d="M88.0171 27.9619C89.4471 35.3373 86.2301 42.7103 79.7452 48.6715C73.2634 54.6299 63.5564 59.1325 52.1555 60.7348C40.7545 62.3371 29.8629 60.7295 21.4756 56.8608C13.0844 52.9902 7.25485 46.8887 5.82482 39.5132C4.39479 32.1378 7.61179 24.7648 14.0967 18.8036C20.5785 12.8451 30.2854 8.34262 41.6864 6.74031C53.0874 5.13801 63.979 6.7456 72.3663 10.6143C80.7574 14.4848 86.587 20.5864 86.0171 27.9619Z"
      stroke="currentColor"
      vectorEffect="non-scaling-stroke"
      strokeWidth="1.75"
    />
  </svg>
);

// Botón limpio, moderno y sólido con tipografía Poppins y respuesta inmediata al clic
const AltgageButton = ({ children, onClick, href, theme = 'primary', className = ''}) => {
  const Tag = href ? 'a': 'button';
  return (
    <Tag
      href={href}
      type={href ? undefined : 'button'}
      onClick={onClick}
      className={`alt-btn-clean ${className}`}
      data-btn-theme={theme}
    >
      {children}
    </Tag>
  );
};

// Rutas multi-página reales con guías paso a paso claras
const PAGE_ROUTES = {
  home: {
    path: '/',
    file: 'index.html',
    num: '00',
    title: 'TECTROMAQ — Equipos Industriales (Panaderías, Reposterías, Pizzerías, Plantas de Agua)',
    shortTitle: 'Inicio'},
  normativa: {
    path: '/normativa',
    file: 'normativa.html',
    num: '01',
    title: 'Normativa & Vigilancia SST',
    shortTitle: 'Normativa',
    subtitle: 'Leyes Dominicanas (Reg. 522-06 / Res. 04-2007), ISO 45001 y Alertas de Vencimiento',
    pastelClass: 'altgage-pastel-mint',
    pokaYokeSteps: [
      '1. Filtra o busca la norma dominicana con 1 clic',
      '2. Haz clic en "Ver Documento" para leer los artículos clave',
      '3. Revisa el semáforo de vencimientos o descarga el CSV oficial'],
    pokaYokeTip: 'Todos los artículos legales están resumidos en lenguaje claro y las alertas críticas se resaltan automáticamente en rojo.'},
  inspecciones: {
    path: '/inspecciones',
    file: 'inspecciones.html',
    num: '02',
    title: 'Inspección Pre-Operacional de Equipos',
    shortTitle: 'Inspecciones',
    subtitle: 'Checklist Pre-Operacional con Bloqueo Automático LOTO ante Fallas Críticas',
    pastelClass: 'altgage-pastel-blue',
    pokaYokeSteps: [
      '1. Elige el equipo (Horno Rotativo, Amasadora Espiral, Planta de Agua)',
      '2. Marca cada punto: "Conforme" (Verde) o "No Conforme" (Rojo)',
      '3. Firma con el mouse/dedo y Guarda'],
    pokaYokeTip: 'Si marcas "No Conforme" en frenos o hidráulica, el sistema impide operar la máquina y activa el candado LOTO automáticamente.'},
  riesgos: {
    path: '/riesgos',
    file: 'riesgos.html',
    num: '03',
    title: 'Triaje & Matriz de Riesgos',
    shortTitle: 'Riesgos',
    subtitle: 'Reporte Rápido de Peligros en Campo y Cálculo Automático del Nivel de Riesgo',
    pastelClass: 'altgage-pastel-apple',
    pokaYokeSteps: [
      '1. Usa un botón de plantilla rápida o describe el peligro',
      '2. Elige Probabilidad y Consecuencia en el semáforo visual',
      '3. El sistema calcula sola la prioridad y asigna el SLA'],
    pokaYokeTip: 'Cero cálculos manuales: La matriz 3×3 colorea automáticamente la celda activa para que cualquier trabajador entienda la gravedad al instante.'},
  monitoreo: {
    path: '/monitoreo',
    file: 'monitoreo.html',
    num: '04',
    title: 'Bio-Telemetría & Sensores IoT',
    shortTitle: 'Monitoreo',
    subtitle: 'Vigilancia en Vivo de Ruido (85 dB), Temperatura, Monóxido (CO) y Predicción IA',
    pastelClass: 'altgage-pastel-yellow',
    pokaYokeSteps: [
      '1. Observa las 4 tarjetas con límites legales preconfigurados',
      '2. Presiona "Simular Pico Crítico" para probar las alarmas visuales',
      '3. Consulta el Mapa de Calor por zona de planta'],
    pokaYokeTip: 'Umbrales automáticos según Reg. 522-06: Cuando el ruido supera 85 dB o sube el CO, la tarjeta cambia de color y emite alerta sin intervención humana.'},
  capacitacion: {
    path: '/capacitacion',
    file: 'capacitacion.html',
    num: '05',
    title: 'Escuela SST & Certificado QR',
    shortTitle: 'Capacitación',
    subtitle: 'Micro-Cursos Interactivos y Examen Normativo con Emisión Instantánea de QR',
    pastelClass: 'altgage-pastel-purple',
    pokaYokeSteps: [
      '1. Avanza o completa cualquier curso con 1 clic',
      '2. Responde las 3 preguntas normativas del examen',
      '3. Al lograr 100%, descarga o imprime tu Certificado con QR'],
    pokaYokeTip: 'Evaluación guiada: Puedes usar el botón de autocompletado demostrativo para validar el certificado QR en 1 segundo.'},
  loto: {
    path: '/liberacion-loto',
    file: 'liberacion-loto.html',
    num: '06',
    title: 'Alta Técnica & Liberación LOTO',
    shortTitle: 'Liberación',
    subtitle: 'Protocolo de Doble Llave (Mantenimiento + HSE) para Retorno Seguro a Operación',
    pastelClass: 'altgage-pastel-pink',
    pokaYokeSteps: [
      '1. Selecciona el equipo bloqueado en la columna izquierda',
      '2. Asigna el Técnico Mecánico y el Supervisor HSE',
      '3. Marca las 3 casillas físicas obligatorias para habilitar el botón'],
    pokaYokeTip: 'Doble Llave de Seguridad: Es imposible liberar una máquina por accidente; el botón permanece inactivo hasta completar las 3 verificaciones y 2 firmas.'}
};

// Datos para el Stack Interactivo estilo Altgage (4 tarjetas apiladas con selector de elipse)
const ALTGAGE_STACK_ITEMS = [
  {
    id: 0,
    tabLabel: '1. Inspección',
    theme: 'green',
    cardClass: 'altgage-stack-green',
    btnTheme: 'mint',
    badge: 'CONTROL PRE-OPERACIONAL',
    title: 'Inspección en 60 segundos sin errores',
    bullets: [
      'Botones gigantes Conformidad / Falla para operadores en campo',
      'Bloqueo automático LOTO si fallan frenos o mangueras hidráulicas',
      'Firma digital en pantalla vinculada al Decreto 522-06'],
    ctaText: 'Ir a Página de Inspecciones',
    targetPage: 'inspecciones',
    note: 'Cumple con el Art. 3.4.1 del Reglamento 522-06 y la Cláusula 8.1.2 de ISO 45001.'},
  {
    id: 1,
    tabLabel: '2. Triaje Riesgos',
    theme: 'purple',
    cardClass: 'altgage-stack-purple',
    btnTheme: 'mint',
    badge: 'MATRIZ AUTOMÁTICA FINE',
    title: 'Reporta un peligro en 3 clics simples',
    bullets: [
      'Plantillas visuales rápidas (Piso resbaladizo, cable expuesto, ruido)',
      'Semáforo automático que calcula si el riesgo es Bajo, Medio o Crítico',
      'Asignación inmediata de responsable y fecha límite (SLA)'],
    ctaText: 'Abrir Triaje de Riesgos',
    targetPage: 'riesgos',
    note: 'Cualquier trabajador puede reportar condiciones inseguras desde su móvil o tablet sin conocimientos técnicos.'},
  {
    id: 2,
    tabLabel: '3. Bio-Sensores',
    theme: 'orange',
    cardClass: 'altgage-stack-orange',
    btnTheme: 'primary',
    badge: 'TELEMETRÍA EN VIVO 4.0',
    title: 'Salud ambiental vigilada cada 4 segundos',
    bullets: [
      'Control automático de Ruido (< 85 dB) y Estrés Térmico en taller',
      'Detección temprana de Monóxido de Carbono (CO) en cabina',
      'Alerta predictiva IA: 78% prob. de fallo en bomba hidráulica (40h)'],
    ctaText: 'Ver Monitoreo IoT en Vivo',
    targetPage: 'monitoreo',
    note: 'Los sensores alertan visualmente antes de que el trabajador sufra fatiga o exposición peligrosa.'},
  {
    id: 3,
    tabLabel: '4. Liberación',
    theme: 'blue',
    cardClass: 'altgage-stack-blue',
    btnTheme: 'light',
    badge: 'DOBLE LLAVE DE SEGURIDAD',
    title: 'Ningún equipo vuelve a operar sin verificación',
    bullets: [
      'Candado digital inquebrantable para máquinas con falla crítica',
      'Exige 3 pruebas físicas + Doble firma (Mecánico + Supervisor HSE)',
      'Trazabilidad auditable al 100% ante el Ministerio de Trabajo'],
    ctaText: 'Abrir Protocolo LOTO',
    targetPage: 'loto',
    note: 'El botón de liberación no se activa hasta completar todos los requisitos de seguridad.'}
];

// Hitos del Calendario Interactivo de 15 Días (inspirado exactamente en el módulo Contract-to-Close de Altgage)
const CALENDAR_MILESTONES = {
  1: {
    day: 1,
    title: 'Día 1: Inspección Diaria Pre-Uso',
    desc: 'Antes de encender cualquier excavadora o retroexcavadora, el operador completa los 5 puntos del checklist digital en menos de 1 minuto.',
    page: 'inspecciones',
    tag: 'Reglamento 522-06 • Art. 3.4.1'},
  2: {
    day: 2,
    title: 'Día 2: Calibración de Sensores Ambientales IoT',
    desc: 'Verificación automática de umbrales de ruido ocupacional (85 dB), temperatura WBGT y monóxido de carbono en taller central.',
    page: 'monitoreo',
    tag: 'Resolución 04-2007 MT'},
  3: {
    day: 3,
    title: 'Día 3: Ronda de Triaje de Peligros en Planta',
    desc: 'Recorrido preventivo por nave de soldadura y patio de máquinas para identificar cables expuestos, derrames o falta de EPP.',
    page: 'riesgos',
    tag: 'Método Fine • Matriz 3×3'},
  5: {
    day: 5,
    title: 'Día 5: Micro-Capacitación en Uso de EPP',
    desc: 'Cápsula formativa de 15 minutos sobre protección auditiva, casco dieléctrico y calzado con puntera de acero.',
    page: 'capacitacion',
    tag: 'Escuela Clínica SST'},
  6: {
    day: 6,
    title: 'Día 6: Auditoría de Extintores y Marchamos',
    desc: 'Control de presión y vigencia de cilindros ABC en toda la flota pesada TECTROMAQ Santo Domingo.',
    page: 'normativa',
    tag: 'Alertas Regulatorias'},
  9: {
    day: 9,
    title: 'Día 9: Mantenimiento Preventivo Hidráulico (IA)',
    desc: 'Revisión de mangueras de alta presión y bomba principal guiada por el algoritmo predictivo de micro-vibraciones.',
    page: 'monitoreo',
    tag: 'Analítica Predictiva 4.0'},
  11: {
    day: 11,
    title: 'Día 11: Simulacro de Bloqueo y Etiquetado LOTO',
    desc: 'Práctica de parada de emergencia, colocación de candado físico y protocolo de doble firma técnica.',
    page: 'loto',
    tag: 'OSHA 1926 / ISO 45001'},
  12: {
    day: 12,
    title: 'Día 12: Renovación de Licencias y Pólizas ARL',
    desc: 'Verificación en el repositorio normativo de carnets de operación pesada MOPC y seguro de riesgos laborales IDOPPRIL.',
    page: 'normativa',
    tag: 'Vigilancia Legal RD'},
  13: {
    day: 13,
    title: 'Día 13: Evaluación Normativa del Personal',
    desc: 'Aplicación del quiz interactivo de 3 preguntas clave para validar conocimientos de seguridad.',
    page: 'capacitacion',
    tag: '100% Calificación Requerida'},
  15: {
    day: 15,
    title: 'Día 15: Certificación Oficial QR y Cierre de Ciclo',
    desc: 'Emisión de certificados digitales con código QR y exportación del reporte oficial de auditoría sin accidentes.',
    page: 'normativa',
    tag: 'Meta: Cero Accidentes'}
};

function resolveInitialPage() {
  if (typeof window === 'undefined') return 'home';
  if (window.__INITIAL_PAGE__ && PAGE_ROUTES[window.__INITIAL_PAGE__]) {
    return window.__INITIAL_PAGE__;
  }
  const path = window.location.pathname.toLowerCase();
  if (path.includes('normativa')) return 'normativa';
  if (path.includes('inspecciones')) return 'inspecciones';
  if (path.includes('riesgos')) return 'riesgos';
  if (path.includes('monitoreo')) return 'monitoreo';
  if (path.includes('capacitacion')) return 'capacitacion';
  if (path.includes('liberacion-loto') || path.includes('loto')) return 'loto';
  return 'home';
}

export default function App() {
  const [currentPage, setCurrentPage] = useState(resolveInitialPage);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeStackIndex, setActiveStackIndex] = useState(0);
  const [activeCalendarDay, setActiveCalendarDay] = useState(1);

  // Efecto para ocultar el menú horizontal dentro del botón circular al hacer scroll hacia abajo (igual que Imagen 2 -> Imagen 3)
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY || 0;
      if (y > 90) {
        setIsScrolled(true);
        setIsMenuCollapsed(true);
      } else {
        setIsScrolled(false);
        setIsMenuCollapsed(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateToPage = (pageKey) => {
    const mapLegacyTab = {
      1: 'normativa',
      2: 'inspecciones',
      3: 'riesgos',
      4: 'monitoreo',
      5: 'capacitacion',
      6: 'loto',
      checklists: 'inspecciones',
      iot: 'monitoreo'};
    const resolvedKey = mapLegacyTab[pageKey] || (PAGE_ROUTES[pageKey] ? pageKey : 'home');
    const target = PAGE_ROUTES[resolvedKey] || PAGE_ROUTES.home;
    setCurrentPage(resolvedKey);
    try {
      if (window.location.protocol !== 'file:') {
        window.history.pushState({ page: resolvedKey }, '', target.path);
      }
      window.scrollTo({ top: 0, behavior: 'smooth'});
    } catch (e) {
      // Fallback silencioso
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(resolveInitialPage());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const loadStoredState = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  };

  const saved = loadStoredState();

  const [machines, setMachines] = useState(() => saved?.machines || INITIAL_MACHINES);
  const [regulatoryAlerts, setRegulatoryAlerts] = useState(
    () => saved?.regulatoryAlerts || INITIAL_REGULATORY_ALERTS
  );
  const [audits, setAudits] = useState(() => saved?.audits || INITIAL_AUDITS);
  const [checklistLogs, setChecklistLogs] = useState(() => saved?.checklistLogs || []);
  const [iotForceAlert, setIotForceAlert] = useState(() => saved?.iotForceAlert || false);
  const [riskReports, setRiskReports] = useState(() => saved?.riskReports || INITIAL_RISK_REPORTS);
  const [workers, setWorkers] = useState(() => saved?.workers || INITIAL_WORKERS);
  const [activeWorkerId, setActiveWorkerId] = useState(() => saved?.activeWorkerId || 'OP-001');

  // Registro de cursos por usuario individual: { [workerId]: coursesArray }
  const [userCoursesMap, setUserCoursesMap] = useState(() => {
    if (saved?.userCoursesMap && typeof saved.userCoursesMap === 'object') {
      return saved.userCoursesMap;
    }
    // Inicializar cada trabajador con una copia independiente de INITIAL_COURSES
    const initialMap = {};
    INITIAL_WORKERS.forEach((w, index) => {
      initialMap[w.id] = INITIAL_COURSES.map((course) => {
        // Para OP-001 dejamos el progreso previo guardado o cursos por defecto
        if (w.id === 'OP-001' && saved?.courses) {
          const found = saved.courses.find((c) => c.id === course.id);
          if (found) return { ...course, ...found };
        }
        return {
          ...course,
          modulosLeidos: [false, false, false],
          respuestaCorrectaRespondida: false,
          progreso: 0,
          completado: false,
          ultimaActualizacion: 'No iniciado'
        };
      });
    });
    return initialMap;
  });

  // Los cursos activos corresponden al trabajador seleccionado
  const activeWorkerCourses = userCoursesMap[activeWorkerId] || INITIAL_COURSES;

  const handleUpdateActiveWorkerCourses = (updater) => {
    setUserCoursesMap((prev) => {
      const currentList = prev[activeWorkerId] || INITIAL_COURSES;
      const nextList = typeof updater === 'function' ? updater(currentList) : updater;
      return {
        ...prev,
        [activeWorkerId]: nextList
      };
    });
  };

  const [certificates, setCertificates] = useState(() => saved?.certificates || []);
  const [lotoHistory, setLotoHistory] = useState(() => saved?.lotoHistory || INITIAL_LOTO_HISTORY);
  const [notifications, setNotifications] = useState(
    () =>
      saved?.notifications || [
        {
          id: 'NOTIF-INIT-1',
          type: 'warning',
          title: 'Alerta Regulatoria Próxima a Vencer',
          message: 'Certificación y Recarga de Extintores vence en 9 días (Reg. 522-06 Art. 2.8).',
          time: 'Hace 15 min'},
        {
          id: 'NOTIF-INIT-2',
          type: 'critical',
          title: 'Alerta Predictiva IA Hidráulica',
          message: 'Probabilidad de fallo en bomba hidráulica estimada en 78% en las próximas 40h.',
          time: 'Hace 5 min'}
      ]
  );

  useEffect(() => {
    // Sincronizar desde la base de datos SQLite al iniciar
    fetch('/api/state')
      .then((res) => res.json())
      .then((res) => {
        if (res?.success && res.data) {
          const dbData = res.data;
          if (dbData.machines) setMachines(dbData.machines);
          if (dbData.regulatoryAlerts) setRegulatoryAlerts(dbData.regulatoryAlerts);
          if (dbData.audits) setAudits(dbData.audits);
          if (dbData.checklistLogs) setChecklistLogs(dbData.checklistLogs);
          if (typeof dbData.iotForceAlert === 'boolean') setIotForceAlert(dbData.iotForceAlert);
          if (dbData.workers) setWorkers(dbData.workers);
          if (dbData.activeWorkerId) setActiveWorkerId(dbData.activeWorkerId);
          if (dbData.userCoursesMap) setUserCoursesMap(dbData.userCoursesMap);
          if (dbData.certificates) setCertificates(dbData.certificates);
          if (dbData.lotoHistory) setLotoHistory(dbData.lotoHistory);
          if (dbData.notifications) setNotifications(dbData.notifications);
        }
      })
      .catch(() => {});
  }, []);

  const saveTimeoutRef = useRef(null);
  useEffect(() => {
    const payload = {
      machines,
      regulatoryAlerts,
      audits,
      checklistLogs,
      iotForceAlert,
      riskReports,
      workers,
      activeWorkerId,
      userCoursesMap,
      certificates,
      lotoHistory,
      notifications
    };

    // 1. Persistencia rápida en localStorage para disponibilidad instantánea
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.error('Error guardando estado en LocalStorage:', e);
    }

    // 2. Persistencia en base de datos SQLite (con debounce para alto rendimiento)
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch((err) => console.warn('SQLite sync:', err.message));
    }, 400);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [
    machines,
    regulatoryAlerts,
    audits,
    checklistLogs,
    iotForceAlert,
    riskReports,
    workers,
    activeWorkerId,
    userCoursesMap,
    certificates,
    lotoHistory,
    notifications
  ]);

  // Función unificada de notificaciones compatible con todos los módulos
  const addNotification = (title, message, type = 'info', actionPage = null) => {
    const mapPage = {
      loto: 'loto',
      checklists: 'inspecciones',
      iot: 'monitoreo',
      normativa: 'normativa',
      riesgos: 'riesgos',
      capacitacion: 'capacitacion'};
    const resolvedActionPage = mapPage[actionPage] || actionPage;
    setToast({
      type,
      title,
      message,
      actionPage: resolvedActionPage,
      actionLabel:
        resolvedActionPage === 'loto'? 'Ir a Página 06: Liberar Equipo': resolvedActionPage
          ? `Ir a ${PAGE_ROUTES[resolvedActionPage]?.shortTitle || 'Página'}`
          : null
    });

    setNotifications((prev) => [
      {
        id: `NOTIF-${Date.now()}`,
        type,
        title,
        message,
        time: new Date().toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit'})
      },
      ...prev.slice(0, 14)
    ]);
  };

  // Simular un bloqueo crítico con 1 solo clic para pruebas rápidas
  const handleQuickDemoLockout = () => {
    const targetMachine = machines.find((m) => m.estado === 'OPERATIVO') || machines[0];
    if (!targetMachine) return;
    const lotoCode = `LOTO-2026-SD-${Math.floor(1000 + Math.random() * 9000)}`;
    const woCode = `OT-MANT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowStr = new Date().toLocaleString('es-DO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'});

    setMachines((prev) =>
      prev.map((m) =>
        m.id === targetMachine.id
          ? {
              ...m,
              estado: 'BLOQUEADO_LOTO',
              lotoCode,
              workOrder: woCode,
              motivoBloqueo: 'Falla crítica de micro-switch / termostato de seguridad (Simulación 1-Clic)',
              fechaBloqueo: nowStr,
              presionHidraulica: '19,200 kPa (Caída Crítica)',
              saludBomba: 48
            }
          : m
      )
    );

    setIotForceAlert(true);

    addNotification(
      ` EQUIPO BLOQUEADO: ${targetMachine.nombre}`,
      `Se detectó falla crítica y se generó el candado ${lotoCode} y Orden ${woCode}. Haz clic abajo para ir a la Página 06 y liberarla.`,
      'critical',
      'loto');
  };

  const handleResetDemo = () => {
    localStorage.removeItem(STORAGE_KEY);
    fetch('/api/state', { method: 'DELETE' }).catch(() => {});
    setMachines(INITIAL_MACHINES);
    setRegulatoryAlerts(INITIAL_REGULATORY_ALERTS);
    setAudits(INITIAL_AUDITS);
    setChecklistLogs([]);
    setIotForceAlert(false);
    setRiskReports(INITIAL_RISK_REPORTS);
    setWorkers(INITIAL_WORKERS);
    setActiveWorkerId('OP-001');
    const resetMap = {};
    INITIAL_WORKERS.forEach((w) => {
      resetMap[w.id] = INITIAL_COURSES.map((c) => ({
        ...c,
        modulosLeidos: [false, false, false],
        respuestaCorrectaRespondida: false,
        progreso: 0,
        completado: false,
        ultimaActualizacion: 'No iniciado'
      }));
    });
    setUserCoursesMap(resetMap);
    setCertificates([]);
    setLotoHistory(INITIAL_LOTO_HISTORY);
    addNotification(
      'Plataforma Reiniciada a Estado Inicial',
      'Todos los datos fueron restaurados tanto en LocalStorage como en la base de datos SQLite.',
      'success');
  };

  const lockedMachinesCount = machines.filter((m) => m.estado === 'BLOQUEADO_LOTO').length;

  const pageOrder = ['home', 'normativa', 'inspecciones', 'riesgos', 'monitoreo', 'capacitacion', 'loto'];
  const currentIndex = pageOrder.indexOf(currentPage);
  const prevPageKey = currentIndex > 0 ? pageOrder[currentIndex - 1] : null;
  const nextPageKey = currentIndex < pageOrder.length - 1 ? pageOrder[currentIndex + 1] : null;
  const activeRouteInfo = PAGE_ROUTES[currentPage] || PAGE_ROUTES.home;
  const activeMilestone = CALENDAR_MILESTONES[activeCalendarDay] || CALENDAR_MILESTONES[1];

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-primary-200)', color: 'var(--color-dark)'}}>
      {/* =====================================================================
          MENÚ SLIDE CON TIPOGRAFÍA POPPINS (IMAGEN 2) + BOTÓN CIRCULAR COLAPSABLE (IMAGEN 3)
          Sin escudos, sin insignias ni botones innecesarios en la cabecera
          ===================================================================== */}
      <header className="nav-slide-header">
        <div className="nav-slide-inner">
          {/* Marca tipográfica limpia a la izquierda (se oculta suavemente al hacer scroll) */}
          <a
            href={PAGE_ROUTES.home.path}
            onClick={(e) => {
              e.preventDefault();
              navigateToPage('home');
            }}
            className="nav-brand-wordmark flex items-center gap-3"
            data-hidden={isScrolled ? 'true': 'false'}
          >
            <img src={TECTROMAQ_LOGO} alt="TECTROMAQ Logo" className="w-10 h-10 object-contain rounded-full shadow-md bg-white p-0.5" />
            <span className="font-extrabold tracking-wider text-xl" style={{ fontFamily: "'Montserrat', 'Poppins', sans-serif" }}>TECTROMAQ</span>
          </a>

          {/* Cluster derecho: Slide horizontal Poppins + Botón Circular de 3 líneas */}
          <div className="nav-right-cluster">
            <nav
              className="nav-poppins-slide"
              data-collapsed={isMenuCollapsed ? 'true': 'false'}
              aria-label="Navegación Principal"
            >
              {[
                { key: 'home', label: 'Inicio'},
                { key: 'normativa', label: 'Normativa'},
                { key: 'inspecciones', label: 'Inspecciones'},
                { key: 'riesgos', label: 'Riesgos'},
                { key: 'monitoreo', label: 'Monitoreo'},
                { key: 'capacitacion', label: 'Capacitación'},
                { key: 'loto', label: 'Liberación'}
              ].map((item) => {
                const isActive = currentPage === item.key;
                return (
                  <a
                    key={item.key}
                    href={PAGE_ROUTES[item.key].path}
                    onClick={(e) => {
                      e.preventDefault();
                      navigateToPage(item.key);
                    }}
                    className="nav-poppins-link"
                    data-active={isActive ? 'true': 'false'}
                  >
                    {item.label}
                  </a>
                );
              })}

              {/* Indicador de globo e idioma/país idéntico al de la Imagen 2 */}
              <div className="nav-poppins-lang" title="República Dominicana">
                <Globe className="w-4 h-4" />
                <span>DO</span>
              </div>
            </nav>

            {/* Botón circular idéntico a la Imagen 3: se oculta cuando las opciones están afuera */}
            <button
              type="button"
              onClick={() => setIsMenuCollapsed(false)}
              className="nav-burger-circle"
              data-visible={isMenuCollapsed ? 'true': 'false'}
              aria-label="Mostrar menú"
              title="Mostrar menú"
            >
              <span className="nav-burger-line line-1" />
              <span className="nav-burger-line line-2" />
              <span className="nav-burger-line line-3" />
            </button>
          </div>
        </div>
      </header>

      {/* Espaciador superior para que el contenido respire debajo del menú flotante */}
      <div className="h-24" />

      {/* =====================================================================
          NOTIFICACIÓN FLOTANTE (ESQUINA INFERIOR DERECHA, NUNCA TAPA EL TÍTULO NI EL LOGO)
          ===================================================================== */}
      {toast && (
        <div
          className="max-w-md w-full p-5 rounded-3xl shadow-2xl border-2 transition-all"
          style={{
            position: 'fixed',
            bottom: '1.5rem',
            right: '1.5rem',
            left: 'auto',
            top: 'auto',
            zIndex: 120,
            backgroundColor: '#ffffff',
            borderColor: toast.type === 'critical'? '#e11d48': '#118d70',
            color: 'var(--color-dark)'}}
        >
          <div className="flex items-start gap-3.5">
            <div
              className="p-2.5 rounded-2xl shrink-0"
              style={{
                backgroundColor: toast.type === 'critical'? '#ffe4e6': '#d3ffe5',
                color: toast.type === 'critical'? '#e11d48': '#118d70'}}
            >
              {toast.type === 'critical'? <ShieldAlert className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-bold text-sm leading-snug" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {toast.title}
                </h4>
                <button
                  type="button"
                  onClick={() => setToast(null)}
                  className="p-1 rounded-full hover:bg-slate-800 shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: '#5c3178'}}>
                {toast.message}
              </p>
              {toast.actionPage && (
                <button
                  type="button"
                  onClick={() => {
                    navigateToPage(toast.actionPage);
                    setToast(null);
                  }}
                  className="mt-3 px-4 py-2 rounded-full text-xs font-bold inline-flex items-center gap-1.5"
                  style={{ backgroundColor: 'var(--color-dark)', color: '#ffffff'}}
                >
                  {toast.actionLabel || 'Continuar'} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          CONTENIDO PRINCIPAL MULTI-PÁGINA
          ===================================================================== */}
      <main className="flex-1">
        {currentPage === 'home'? (
          <div>
            {/* ---------------------------------------------------------------
                SECCIÓN 1: HERO ALTGAGE (FONDO MINT #D3FFE5 + SILUETA + SELLO GIRATORIO)
                --------------------------------------------------------------- */}
            <section
              className="relative overflow-hidden pt-4 pb-16 sm:py-12"
              style={{ backgroundColor: 'var(--color-primary-200)'}}
            >
              {/* Silueta de fondo estilo Altgage (canvas-house-svg) */}
              <div className="pointer-events-none absolute right-0 bottom-0 w-[520px] max-w-[48vw] opacity-45">
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 993 682" fill="none">
                  <path
                    d="M0.203125 220.116C0.203125 207.961 7.53739 197.007 18.776 192.378L477.897 3.23731C485.121 0.26113 493.222 0.220933 500.475 3.12527L973.394 192.482C984.779 197.04 992.243 208.069 992.243 220.332V651.15C992.243 667.718 978.811 681.15 962.243 681.15H30.2032C13.6346 681.15 0.203125 667.718 0.203125 651.15V220.116Z"
                    fill="#4de8a6"
                  />
                </svg>
              </div>

              <div className="max-w-[1320px] mx-auto px-4 sm:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                  <div className="lg:col-span-7 space-y-6">
                    <div
                      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold"
                      style={{ backgroundColor: '#ffffff', color: 'var(--color-dark)', border: '1.5px solid #37ce8e'}}
                    >
                      <span>PLATAFORMA DE SEGURIDAD OCUPACIONAL • DECRETO 522-06 RD</span>
                    </div>

                    <h1
                      className="altgage-serif"
                      style={{
                        fontSize: 'clamp(2.75rem, 5.4vw, 4.75rem)',
                        lineHeight: 1.04,
                        color: 'var(--color-dark)'}}
                    >
                      ¡Seguridad laboral en tus términos, sin errores!
                    </h1>

                    {/* Botones principales con animación Altgage */}
                    <div className="flex flex-wrap items-center gap-4 pt-2">
                      <AltgageButton
                        theme="primary"
                        onClick={() => navigateToPage('inspecciones')}
                      >
                        <span>Iniciar Inspección de Equipo</span>
                        <ArrowRight className="w-4 h-4" />
                      </AltgageButton>

                      <AltgageButton
                        theme="light"
                        onClick={handleQuickDemoLockout}
                      >
                        <span> Simular Falla y Bloqueo en 1-Clic</span>
                      </AltgageButton>
                    </div>

                    {/* Sello Circular Giratorio original de Altgage (svg-rotate-house) */}
                    <div className="pt-4 flex flex-wrap items-center gap-6">
                      <div className="w-28 h-28 shrink-0" style={{ color: 'var(--color-dark)'}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 150 150" fill="none">
                          <g id="house">
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M100.166 67.4559L75.3364 50.7981C75.1442 50.6685 74.8522 50.6647 74.6657 50.7887L49.4465 67.6625V74.5165H52.7831V94.7102H97.2303V74.5597H100.544V67.7959L100.166 67.4559ZM91.7159 87.8581H58.3541V70.8828L74.905 59.5535L91.7309 70.8622V87.8581H91.7159ZM66.2329 84.6999H83.8388V77.8862H66.2329V84.6999ZM66.1897 68.73H83.7542L83.822 75.5508H66.1897V68.73Z"
                              fill="currentColor"
                            />
                          </g>
                          <g id="rotate">
                            <circle cx="75" cy="75" r="64" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
                            <circle cx="75" cy="11" r="4" fill="#37ce8e" />
                            <circle cx="75" cy="139" r="4" fill="#f8964f" />
                            <circle cx="11" cy="75" r="4" fill="#3d9fbe" />
                            <circle cx="139" cy="75" r="4" fill="#4d1d6a" />
                          </g>
                        </svg>
                      </div>

                      <div className="space-y-1.5 max-w-md">
                        <div className="text-xs font-extrabold uppercase tracking-wider" style={{ color: '#118d70'}}>
                          Flujo Intuitivo 1-2-3
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-dark)'}}>
                          Cada módulo cuenta con semáforos visuales, plantillas de un solo clic y validaciones automáticas que evitan errores humanos en planta.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Tarjeta Derecha: Semáforo de Estado de Flota en Vivo (Interactivo) */}
                  <div className="lg:col-span-5">
                    <div
                      className="rounded-3xl p-6 sm:p-8 shadow-2xl border-2"
                      style={{ backgroundColor: '#ffffff', borderColor: 'var(--color-dark)'}}
                    >
                      <div className="flex items-center justify-between mb-5">
                        <div>
                          <span
                            className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full"
                            style={{ backgroundColor: 'var(--color-primary-200)', color: '#118d70'}}
                          >
                            Estado en Vivo • Santo Domingo
                          </span>
                          <h2 className="altgage-serif text-2xl mt-2">Flota Pesada TECTROMAQ</h2>
                        </div>
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg"
                          style={{
                            backgroundColor: lockedMachinesCount > 0 ? '#ffe4e6': '#d3ffe5',
                            color: lockedMachinesCount > 0 ? '#e11d48': '#118d70'}}
                        >
                          {machines.length - lockedMachinesCount}/{machines.length}
                        </div>
                      </div>

                      <div className="space-y-3">
                        {machines.map((m) => {
                          const isLocked = m.estado === 'BLOQUEADO_LOTO';
                          return (
                            <div
                              key={m.id}
                              onClick={() => navigateToPage(isLocked ? 'loto': 'inspecciones')}
                              className="p-4 rounded-2xl border-2 cursor-pointer transition-all hover:scale-[1.01] flex items-center justify-between gap-3"
                              style={{
                                backgroundColor: isLocked ? '#fff1f2': '#f4fff8',
                                borderColor: isLocked ? '#e11d48': '#a4f0d0'}}
                            >
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-sm">{m.nombre}</span>
                                  <span className="text-xs font-mono opacity-75">({m.id})</span>
                                </div>
                                <p className="text-xs mt-0.5" style={{ color: '#5c3178'}}>
                                  {isLocked
                                    ? ` ${m.lotoCode}: ${m.motivoBloqueo}`
                                    : ` ${m.ubicacion} • ${m.horometro} hrs`}
                                </p>
                              </div>
                              <span
                                className="px-3 py-1 rounded-full text-xs font-extrabold shrink-0"
                                style={{
                                  backgroundColor: isLocked ? '#e11d48': '#118d70',
                                  color: '#ffffff'}}
                              >
                                {isLocked ? 'Liberar →': 'Inspeccionar →'}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <div
                        className="mt-5 pt-4 border-t flex items-center justify-between text-xs font-bold"
                        style={{ borderColor: '#a4f0d0', color: '#5c3178'}}
                      >
                        <span>Haz clic en cualquier máquina para actuar</span>
                        <button
                          onClick={handleQuickDemoLockout}
                          className="underline"
                          style={{ color: 'var(--color-dark)'}}
                        >
                          Probar bloqueo automático
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ---------------------------------------------------------------
                SECCIÓN 2: STACK DE TARJETAS APILADAS + SELECTOR DE ELIPSE ALTGAGE
                --------------------------------------------------------------- */}
            <section className="py-12 sm:py-16" style={{ backgroundColor: 'var(--color-primary-200)'}}>
              <div className="max-w-[1320px] mx-auto px-4 sm:px-8">
                {(() => {
                  const activeItem = ALTGAGE_STACK_ITEMS[activeStackIndex];
                  return (
                    <div className="relative">
                      <div
                        className={`altgage-stack-card ${activeItem.cardClass} shadow-2xl`}
                        style={{ minHeight: '360px'}}
                      >
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                          <div className="lg:col-span-5 flex justify-center">
                            <div
                              className="w-full max-w-sm rounded-3xl p-6 flex flex-col justify-between"
                              style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.16)',
                                border: '2px solid rgba(255, 255, 255, 0.3)',
                                minHeight: '250px'}}
                            >
                              <div className="flex items-center justify-between">
                                <span
                                  className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider"
                                  style={{ backgroundColor: '#ffffff', color: 'var(--color-dark)'}}
                                >
                                  {activeItem.badge}
                                </span>
                                <span className="altgage-serif text-2xl font-bold">0{activeItem.id + 1}</span>
                              </div>

                              <div className="my-6 space-y-2.5">
                                <div
                                  className="p-3 rounded-2xl flex items-center gap-3"
                                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.92)', color: 'var(--color-dark)'}}
                                >
                                  <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: '#118d70'}} />
                                  <span className="text-xs font-bold">Paso 1: Selección guiada con 1 clic</span>
                                </div>
                                <div
                                  className="p-3 rounded-2xl flex items-center gap-3"
                                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.92)', color: 'var(--color-dark)'}}
                                >
                                  <ShieldCheck className="w-5 h-5 shrink-0" style={{ color: '#4d1d6a'}} />
                                  <span className="text-xs font-bold">Paso 2: Validación normativa automática</span>
                                </div>
                              </div>

                              <div className="text-xs opacity-90 font-medium">
                                {activeItem.note}
                              </div>
                            </div>
                          </div>

                          <div className="lg:col-span-7 space-y-5">
                            <h2
                              className="altgage-serif"
                              style={{
                                fontSize: 'clamp(2rem, 3.6vw, 3.1rem)',
                                color: activeItem.theme === 'orange'? 'var(--color-dark)': '#ffffff'}}
                            >
                              {activeItem.title}
                            </h2>

                            <ul className="space-y-3 pl-1">
                              {activeItem.bullets.map((b, i) => (
                                <li key={i} className="flex items-start gap-3 text-base sm:text-lg font-medium">
                                  <span
                                    className="w-2.5 h-2.5 rounded-full mt-2 shrink-0"
                                    style={{
                                      backgroundColor:
                                        activeItem.theme === 'orange'? 'var(--color-dark)': 'var(--color-primary-400)'}}
                                  />
                                  <span>{b}</span>
                                </li>
                              ))}
                            </ul>

                            <div className="pt-2">
                              <AltgageButton
                                theme={activeItem.btnTheme}
                                onClick={() => navigateToPage(activeItem.targetPage)}
                              >
                                <span>{activeItem.ctaText}</span>
                                <ArrowRight className="w-4 h-4" />
                              </AltgageButton>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Barra de Navegación Draw-Nav con Elipses Dibujadas a Mano (Idéntica a Altgage) */}
                      <div className="mt-8 max-w-3xl mx-auto">
                        <div className="draw-nav">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveStackIndex(
                                (prev) => (prev - 1 + ALTGAGE_STACK_ITEMS.length) % ALTGAGE_STACK_ITEMS.length
                              )
                            }
                            className="draw-nav-toggle"
                            title="Anterior"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" viewBox="0 0 25 20" fill="none" style={{ transform: 'rotate(180deg)'}}>
                              <path d="M0.390381 9.81982L23.1895 9.81982" stroke="currentColor" strokeWidth="2" />
                              <path d="M13.8884 18.6519L23.5236 9.81961L13.8884 0.953915" stroke="currentColor" strokeWidth="2" />
                            </svg>
                          </button>

                          <div className="draw-nav-select">
                            {ALTGAGE_STACK_ITEMS.map((item, idx) => (
                              <button
                                key={item.id}
                                type="button"
                                data-active={activeStackIndex === idx ? 'true' : 'false'}
                                data-theme={item.theme}
                                onClick={() => setActiveStackIndex(idx)}
                                className="draw-nav-select-btn"
                              >
                                <span className="relative z-10">{item.tabLabel}</span>
                              </button>
                            ))}
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              setActiveStackIndex((prev) => (prev + 1) % ALTGAGE_STACK_ITEMS.length)
                            }
                            className="draw-nav-toggle"
                            title="Siguiente"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" viewBox="0 0 25 20" fill="none">
                              <path d="M0.390381 9.81982L23.1895 9.81982" stroke="currentColor" strokeWidth="2" />
                              <path d="M13.8884 18.6519L23.5236 9.81961L13.8884 0.953915" stroke="currentColor" strokeWidth="2" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </section>

            {/* ---------------------------------------------------------------
                SECCIÓN 3: MARQUESINA GIGANTE ANIMADA ALTGAGE
                --------------------------------------------------------------- */}
            <section
              className="py-12 relative overflow-hidden"
              style={{
                backgroundColor: '#ffffff',
                borderTopLeftRadius: '3rem',
                borderTopRightRadius: '3rem'}}
            >
              <div className="altgage-marquee-wrap py-2">
                <div className="altgage-marquee-track items-center">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="flex items-center">
                      <span
                        className="altgage-serif px-6 whitespace-nowrap"
                        style={{
                          fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                          color: 'var(--color-primary)'}}
                      >
                        Protege vidas con SafeWork 4.0
                      </span>
                      <span
                        className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 mx-4"
                        style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff'}}
                      >
                        <ShieldCheck className="w-8 h-8" />
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="max-w-[1320px] mx-auto px-4 sm:px-8 pt-6 text-center">
                <p className="text-lg sm:text-xl font-bold" style={{ color: 'var(--color-dark)'}}>
                  Inspecciona en 1 minuto • Bloquea fallas al instante • Audita en 1 clic
                </p>
              </div>
            </section>

            {/* ---------------------------------------------------------------
                SECCIÓN 4: LAS 6 PÁGINAS DEL PRODUCTO EN TARJETAS PASTEL ALTGAGE
                --------------------------------------------------------------- */}
            <section className="py-12 sm:py-16" style={{ backgroundColor: '#ffffff'}}>
              <div className="max-w-[1320px] mx-auto px-4 sm:px-8">
                <div className="text-center max-w-3xl mx-auto mb-12">
                  <span
                    className="px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider"
                    style={{ backgroundColor: 'var(--color-primary-200)', color: '#118d70'}}
                  >
                    Arquitectura Multi-Página
                  </span>
                  <h2
                    className="altgage-serif mt-3"
                    style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)'}}
                  >
                    Explora las 6 Páginas Especializadas
                  </h2>
                  <p className="text-base mt-2" style={{ color: '#5c3178'}}>
                    Cada módulo vive en su propia página independiente con instrucciones paso a paso para que cualquier usuario lo domine al instante.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                  {['normativa', 'inspecciones', 'riesgos', 'monitoreo', 'capacitacion', 'loto'].map((key) => {
                    const page = PAGE_ROUTES[key];
                    return (
                      <div
                        key={key}
                        onClick={() => navigateToPage(key)}
                        className={`${page.pastelClass} p-7 sm:p-9 cursor-pointer transition-all hover:scale-[1.01] shadow-md flex flex-col justify-between border-2`}
                        style={{ borderColor: 'rgba(77, 29, 106, 0.12)'}}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-3 mb-4">
                            <span
                              className="px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider"
                              style={{ backgroundColor: '#ffffff', color: 'var(--color-dark)'}}
                            >
                              {page.shortTitle}
                            </span>
                            {key === 'loto'&& lockedMachinesCount > 0 && (
                              <span
                                className="px-3 py-1 rounded-full text-xs font-extrabold"
                                style={{ backgroundColor: '#e11d48', color: '#ffffff'}}
                              >
                                {lockedMachinesCount} Bloqueada(s)
                              </span>
                            )}
                          </div>

                          <h3 className="altgage-serif text-2xl sm:text-3xl mb-2">
                            {page.title}
                          </h3>
                          <p className="text-sm font-medium mb-5" style={{ color: '#40165a'}}>
                            {page.subtitle}
                          </p>

                          {/* Lista de 3 pasos simples */}
                          <div
                            className="rounded-2xl p-4 space-y-2 mb-6"
                            style={{ backgroundColor: 'rgba(255, 255, 255, 0.78)'}}
                          >
                            <div className="text-[11px] font-extrabold uppercase tracking-wider" style={{ color: '#118d70'}}>
                              Guía Rápida (3 Pasos Simples):
                            </div>
                            {page.pokaYokeSteps.map((step, i) => (
                              <div key={i} className="text-xs font-bold flex items-center gap-2">
                                <span
                                  className="w-2 h-2 rounded-full shrink-0"
                                  style={{ backgroundColor: 'var(--color-dark)'}}
                                />
                                <span>{step}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <AltgageButton
                            theme="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigateToPage(key);
                            }}
                          >
                            <span>Abrir {page.shortTitle}</span>
                            <ArrowRight className="w-4 h-4" />
                          </AltgageButton>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* ---------------------------------------------------------------
                SECCIÓN 5: CALENDARIO INTERACTIVO DE 15 DÍAS ALTGAGE (.calendar-module)
                --------------------------------------------------------------- */}
            <section className="py-12 sm:py-16" style={{ backgroundColor: '#ffffff'}}>
              <div className="max-w-[1320px] mx-auto px-4 sm:px-8">
                <div
                  className="rounded-3xl p-7 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
                  style={{ backgroundColor: 'var(--color-primary-200)'}}
                >
                  <div className="lg:col-span-6 space-y-6">
                    <div>
                      <span
                        className="px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider"
                        style={{ backgroundColor: '#ffffff', color: '#118d70'}}
                      >
                        Ciclo Preventivo de 15 Días
                      </span>
                      <h2
                        className="altgage-serif mt-3"
                        style={{ fontSize: 'clamp(2rem, 3.8vw, 3.1rem)'}}
                      >
                        Cumplimiento total en 15 días
                      </h2>
                      <p className="text-base mt-2 leading-relaxed" style={{ color: '#40165a'}}>
                        Haz clic en los días resaltados del calendario interactivo para ver el protocolo exacto que ejecuta SafeWork 4.0 y saltar directo a su página.
                      </p>
                    </div>

                    <div
                      className="rounded-3xl p-6 shadow-lg border-2"
                      style={{ backgroundColor: '#ffffff', borderColor: 'var(--color-dark)'}}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-extrabold"
                          style={{ backgroundColor: 'var(--color-primary-400)', color: 'var(--color-dark)'}}
                        >
                          {activeMilestone.tag}
                        </span>
                        <span className="text-xs font-bold" style={{ color: '#702987'}}>
                          Hito #{activeMilestone.day} de 15
                        </span>
                      </div>
                      <h3 className="altgage-serif text-2xl mb-2">
                        {activeMilestone.title}
                      </h3>
                      <p className="text-sm leading-relaxed mb-5" style={{ color: '#40165a'}}>
                        {activeMilestone.desc}
                      </p>
                      <AltgageButton
                        theme="primary"
                        onClick={() => navigateToPage(activeMilestone.page)}
                      >
                        <span>Ejecutar este paso en Página {PAGE_ROUTES[activeMilestone.page].num}</span>
                        <ArrowRight className="w-4 h-4" />
                      </AltgageButton>
                    </div>
                  </div>

                  <div className="lg:col-span-6">
                    <div className="altgage-calendar-module">
                      <div className="px-6 py-4 flex items-center justify-between">
                        <h3 className="altgage-serif text-xl" style={{ color: '#ffffff'}}>
                          Cronograma Operativo de 15 Días
                        </h3>
                        <span className="text-xs font-bold" style={{ color: 'var(--color-primary-400)'}}>
                          Haz clic en un día
                        </span>
                      </div>
                      <div className="altgage-calendar-body">
                        <div className="altgage-calendar-grid">
                          {Array.from({ length: 15 }, (_, idx) => {
                            const dayNum = idx + 1;
                            const hasMilestone = Boolean(CALENDAR_MILESTONES[dayNum]);
                            const isSelected = activeCalendarDay === dayNum;
                            return (
                              <div
                                key={dayNum}
                                data-active={isSelected ? 'true': 'false'}
                                onClick={() => {
                                  if (hasMilestone) setActiveCalendarDay(dayNum);
                                }}
                                className="altgage-calendar-cell"
                                style={{
                                  opacity: hasMilestone ? 1 : 0.45,
                                  cursor: hasMilestone ? 'pointer': 'default'}}
                              >
                                <div className="altgage-calendar-circle">
                                  <span>{dayNum}</span>
                                </div>
                                {isSelected && (
                                  <div className="absolute inset-1 pointer-events-none flex items-center justify-center">
                                    <HandDrawnEllipse className="w-full h-full" />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ---------------------------------------------------------------
                SECCIÓN 6: MEGA CTA BANNER ALTGAGE (.section-mega-title)
                --------------------------------------------------------------- */}
            <section
              onClick={() => navigateToPage('inspecciones')}
              className="mega-btn-link cursor-pointer text-center py-16 transition-all"
              style={{
                backgroundColor: 'var(--color-primary-400)',
                borderTopLeftRadius: '3rem',
                borderTopRightRadius: '3rem'}}
            >
              <div className="max-w-4xl mx-auto px-4">
                <div className="inline-block">
                  <h2
                    className="altgage-serif"
                    style={{ fontSize: 'clamp(2.5rem, 5vw, 4.25rem)', color: 'var(--color-dark)'}}
                  >
                    Comenzar Recorrido Guiado
                  </h2>
                  <div className="mega-btn-line mx-auto" />
                </div>
                <p className="text-lg font-bold mt-4" style={{ color: 'var(--color-dark)'}}>
                  Prueba el flujo completo de seguridad en menos de 2 minutos →
                </p>
              </div>
            </section>
          </div>
        ) : (
          /* =================================================================
             VISTA DE PÁGINA INDIVIDUAL (01 A 06)
             ================================================================= */
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-4 space-y-6">
            {/* Renderizado de la Página Activa con Props Exactos */}
            <div className="py-2">
              {currentPage === 'normativa'&& (
                <Module1Normativa
                  regulatoryAlerts={regulatoryAlerts}
                  setRegulatoryAlerts={setRegulatoryAlerts}
                  audits={audits}
                  setAudits={setAudits}
                  addNotification={addNotification}
                />
              )}

              {currentPage === 'inspecciones'&& (
                <Module2Checklists
                  machines={machines}
                  setMachines={setMachines}
                  checklistLogs={checklistLogs}
                  setChecklistLogs={setChecklistLogs}
                  workers={workers}
                  setWorkers={setWorkers}
                  activeWorkerId={activeWorkerId}
                  setActiveWorkerId={setActiveWorkerId}
                  addNotification={addNotification}
                  setActiveTab={navigateToPage}
                  triggerIoTAlertFromChecklist={() => setIotForceAlert(true)}
                />
              )}

              {currentPage === 'riesgos'&& (
                <Module3Riesgos
                  riskReports={riskReports}
                  setRiskReports={setRiskReports}
                  machines={machines}
                  setMachines={setMachines}
                  addNotification={addNotification}
                  setActiveTab={navigateToPage}
                />
              )}

              {currentPage === 'monitoreo'&& (
                <Module4IoT
                  machines={machines}
                  riskReports={riskReports}
                  iotForceAlert={iotForceAlert}
                  setIotForceAlert={setIotForceAlert}
                  addNotification={addNotification}
                  setActiveTab={navigateToPage}
                />
              )}

              {currentPage === 'capacitacion'&& (
                <Module5Capacitacion
                  courses={activeWorkerCourses}
                  setCourses={handleUpdateActiveWorkerCourses}
                  workers={workers}
                  setWorkers={setWorkers}
                  activeWorkerId={activeWorkerId}
                  setActiveWorkerId={setActiveWorkerId}
                  userCoursesMap={userCoursesMap}
                  setUserCoursesMap={setUserCoursesMap}
                  certificates={certificates}
                  setCertificates={setCertificates}
                  addNotification={addNotification}
                />
              )}

              {currentPage === 'loto'&& (
                <Module6Loto
                  machines={machines}
                  setMachines={setMachines}
                  lotoHistory={lotoHistory}
                  setLotoHistory={setLotoHistory}
                  setIotForceAlert={setIotForceAlert}
                  addNotification={addNotification}
                  setActiveTab={navigateToPage}
                />
              )}
            </div>

            {/* Paginación Inferior entre páginas */}
            <div
              className="rounded-3xl p-6 flex flex-wrap items-center justify-between gap-4 border-2"
              style={{ backgroundColor: '#ffffff', borderColor: '#a4f0d0'}}
            >
              <div>
                {prevPageKey ? (
                  <AltgageButton theme="light" onClick={() => navigateToPage(prevPageKey)}>
                    <span>← Anterior: {PAGE_ROUTES[prevPageKey].title}</span>
                  </AltgageButton>
                ) : (
                  <span />
                )}
              </div>
              <div className="text-xs font-bold" style={{ color: '#5c3178'}}>
                Página {activeRouteInfo.num} de 06 • Datos sincronizados automáticamente
              </div>
              <div>
                {nextPageKey ? (
                  <AltgageButton theme="primary" onClick={() => navigateToPage(nextPageKey)}>
                    <span>Siguiente: {PAGE_ROUTES[nextPageKey].title} →</span>
                  </AltgageButton>
                ) : (
                  <AltgageButton theme="mint" onClick={() => navigateToPage('home')}>
                    <span>Volver a Portada Principal →</span>
                  </AltgageButton>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* =====================================================================
          FOOTER ESTILO ALTGAGE (FONDO PURPLE PROFUNDO #4D1D6A + TARJETAS INFERIORES)
          ===================================================================== */}
      <footer
        className="pt-14 pb-10 px-4 sm:px-8 mt-12"
        style={{ backgroundColor: 'var(--color-dark)', color: '#ffffff'}}
      >
        <div className="max-w-[1320px] mx-auto space-y-10">
          {/* 4 Tarjetas de Acceso Rápido estilo Footer de Altgage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Normativa 522-06', sub: 'Leyes y Vencimientos', key: 'normativa'},
              { title: 'Inspección Equipos', sub: 'Checklists Pre-Uso', key: 'inspecciones'},
              { title: 'Triaje de Riesgos', sub: 'Matriz Fine 3×3', key: 'riesgos'},
              { title: 'Protocolo LOTO', sub: 'Liberación Doble Firma', key: 'loto'}
            ].map((card) => (
              <div
                key={card.key}
                onClick={() => navigateToPage(card.key)}
                className="rounded-3xl p-5 cursor-pointer transition-transform hover:scale-[1.02]"
                style={{ backgroundColor: 'var(--color-secondary-700)', border: '1px solid #702987'}}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="altgage-serif text-lg" style={{ color: 'var(--color-primary-400)'}}>
                    {card.title}
                  </span>
                  <ArrowUpRight className="w-4 h-4" style={{ color: 'var(--color-primary-400)'}} />
                </div>
                <p className="text-xs opacity-80">{card.sub}</p>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t flex flex-wrap items-center justify-between gap-4 text-xs" style={{ borderColor: '#702987'}}>
            <div>
              <strong style={{ color: 'var(--color-primary-400)'}}>SafeWork 4.0 — TECTROMAQ Santo Domingo</strong> •
              Plataforma de Seguridad y Salud Ocupacional (Decreto 522-06 / ISO 45001)
            </div>
            <button
              onClick={handleResetDemo}
              className="underline font-bold flex items-center gap-1"
              style={{ color: 'var(--color-primary-400)'}}
            >
              <RotateCcw className="w-3.5 h-3.5" /> Restaurar Datos de Demostración
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
