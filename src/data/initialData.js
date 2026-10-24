// Datos iniciales para SafeWork 4.0 en TECTROMAQ (Equipos y Maquinarias Industriales)
// Especialistas en: Panaderías 🥐 | Reposterías 🥮 | Pizzerías 🍕 | Plantas de Agua 💧 y Más

export const INITIAL_MACHINES = [
  {
    id: 'EQ-HORNO-ROT',
    nombre: 'Horno Rotativo Industrial 36 Bandejas (Gas / Eléctrico)',
    sector: 'Panadería & Pizzería 🥐🍕',
    marca: 'TECTROMAQ Thermal Pro',
    modelo: 'TR-HR3600-X',
    serie: 'TEC-HR-2026-9041',
    horometro: 2410.5,
    ubicacion: 'Planta de Producción Panadería Central (Línea de Horneado 1)',
    operadorAsignado: 'Op. José Luis Santana',
    estado: 'OPERATIVO',
    lotoCode: null,
    workOrder: null,
    motivoBloqueo: null,
    fechaBloqueo: null,
    ultimaInspeccion: '2026-10-18 06:30',
    presionHidraulica: 'Válvula Gas 3.5 kPa (Nominal)',
    temperaturaCamara: '210 °C',
    saludBomba: 94
  },
  {
    id: 'EQ-AMAS-ESP',
    nombre: 'Amasadora Espiral Industrial 120 Kg con Rejilla de Seguridad',
    sector: 'Panadería & Repostería 🥐🥮',
    marca: 'TECTROMAQ Spiral Master',
    modelo: 'TR-AE120-HD',
    serie: 'TEC-AE-2026-4412',
    horometro: 1850.2,
    ubicacion: 'Área de Amasado y Formación de Masas',
    operadorAsignado: 'Op. Carlos M. Castillo',
    estado: 'BLOQUEADO_LOTO',
    lotoCode: 'LOTO-2026-TEC-4092',
    workOrder: 'OT-MANT-2026-0891',
    motivoBloqueo: 'Enclavamiento electromagnético de micro-switch en rejilla de protección inoperativo y desgaste en faja de transmisión.',
    fechaBloqueo: '2026-10-18 11:20',
    ultimaInspeccion: '2026-10-18 11:20',
    presionHidraulica: 'Transmisión Mecánica 120 Nm',
    temperaturaCamara: '28 °C',
    saludBomba: 58
  },
  {
    id: 'EQ-PLANTA-AGUA',
    nombre: 'Sistema de Filtración Ósmosis Inversa & Llenado de Botellones',
    sector: 'Plantas de Agua Purificada 💧',
    marca: 'TECTROMAQ AquaPure Industrial',
    modelo: 'TR-RO4000-UV',
    serie: 'TEC-RO-2026-8821',
    horometro: 3920.0,
    ubicacion: 'Nave de Purificación y Embotellado Sanitario',
    operadorAsignado: 'Téc. Ramón Alcántara',
    estado: 'OPERATIVO',
    lotoCode: null,
    workOrder: null,
    motivoBloqueo: null,
    fechaBloqueo: null,
    ultimaInspeccion: '2026-10-19 07:45',
    presionHidraulica: 'Bomba Multi-etapa 1,450 kPa (210 PSI)',
    temperaturaCamara: '22 °C',
    saludBomba: 92
  }
];

export const NORMATIVAS_DATA = [
  {
    id: 'NORM-RD-522-06',
    titulo: 'Reglamento 522-06 de Seguridad y Salud en el Trabajo',
    subtitulo: 'Decreto Presidencial No. 522-06 — República Dominicana',
    categoria: 'Leyes Dominicanas',
    entidad: 'Ministerio de Trabajo (MT) - Rep. Dominicana',
    vigencia: 'Vigente (Obligatorio Nacional)',
    codigo: 'Decreto 522-06',
    resumen: 'Marco regulatorio nacional que establece las condiciones obligatorias de SST en plantas industriales, alimentarias y de embotellado: protección de órganos móviles en mezcladoras/amasadoras, calderas, hornos y comités mixtos.',
    articulosClave: [
      {
        art: 'Art. 3.4.1 — Dispositivos de Enclavamiento en Maquinaria',
        texto: 'Toda máquina industrial (amasadoras, laminadoras, batidoras) debe poseer paradas de emergencia accesibles y enclavamiento que detenga el giro inmediatamente si se levanta la rejilla o guarda de seguridad.'
      },
      {
        art: 'Art. 3.4.4 — Prevención de Quemaduras y Líneas Térmicas en Hornos',
        texto: 'Los hornos industriales rotativos, túnel y pisos deben contar con aislamiento térmico de fibra de roca, válvulas solenoides de corte automático de gas por llama apagada y presostatos calibrados.'
      },
      {
        art: 'Art. 4.1.2 — Saneamiento y Grado Alimentario en Plantas de Agua',
        texto: 'Líneas presurizadas, tanques de ozono y membranas de ósmosis inversa deben cumplir grado alimentario (acero inox AISI 304/316L) y estar libres de fugas eléctricas o filtraciones contaminantes.'
      }
    ],
    aplicacionTeciromaq: 'Aplica a todas las inspecciones pre-operacionales de hornos, amasadoras y plantas de agua comercializadas por TECTROMAQ.'
  },
  {
    id: 'NORM-RD-RES-04-2007',
    titulo: 'Resolución 04-2007 sobre Condiciones Sanitarias y Ambientales',
    subtitulo: 'Reglamento de Higiene Industrial y Comités de Seguridad — MT',
    categoria: 'Leyes Dominicanas',
    entidad: 'Ministerio de Trabajo (MT) - Rep. Dominicana',
    vigencia: 'Vigente (Fiscalizable por DGT)',
    codigo: 'Res. 04-2007 MT',
    resumen: 'Fija los límites máximos permisibles de ruido ambiental en plantas de alimentos (< 85 dB), control de calor radiante en panaderías/pizzerías (Índice WBGT) y ventilación forzada.',
    articulosClave: [
      {
        art: 'Art. 14 — Exposición a Ruido en Plantas y Sala de Máquinas',
        texto: 'Nivel sonoro continuo máximo de 85 dB(A) para 8 horas en áreas de envasado y molinos. Uso estricto de EPP auditivo si supera el umbral.'
      },
      {
        art: 'Art. 22 — Estrés Térmico por Radiación en Hornos Industriales',
        texto: 'Obligatoriedad de campanas de extracción forzada y extractores axiales sobre hornos rotativos y de convección para disipar calor ambiental.'
      }
    ],
    aplicacionTeciromaq: 'Monitoreo constante en el Módulo 04 de sensores IoT para hornos y plantas TECTROMAQ.'
  },
  {
    id: 'NORM-ISO-45001',
    titulo: 'ISO 45001:2018 — Gestión de Seguridad y Salud en Maquinarias',
    subtitulo: 'Estándar Internacional para Plantas Industriales y de Alimentos',
    categoria: 'Estándares Internacionales',
    entidad: 'Organización Internacional de Normalización (ISO)',
    vigencia: 'Vigente Internacional',
    codigo: 'ISO 45001:2018',
    resumen: 'Marco para eliminar peligros de atrapamiento mecánico, quemaduras, descargas eléctricas y paradas no programadas en plantas industriales alimentarias y plantas potabilizadoras.',
    articulosClave: [
      {
        art: 'Cláusula 8.1.2 — Jerarquía de Controles de Seguridad',
        texto: 'Priorizar protección de ingeniería (guardas físicas, barreras fotoeléctricas, micro-switches) sobre advertencias visuales y EPP.'
      },
      {
        art: 'Cláusula 8.1.4 — Control de Contratistas e Instalación de Maquinarias',
        texto: 'Todo técnico de montaje de hornos rotativos, batidoras o bombas de agua debe validar puesta en marcha con checklist digital.'
      }
    ],
    aplicacionTeciromaq: 'Estructura la trazabilidad y autorizaciones del sistema SafeWork 4.0 en TECTROMAQ.'
  },
  {
    id: 'NORM-MAN-TECTROMAQ',
    titulo: 'Manual de Seguridad de Maquinarias & Equipos Industriales TECTROMAQ',
    subtitulo: 'Panaderías • Reposterías • Pizzerías • Plantas de Agua Purificada',
    categoria: 'Manuales Internos TECTROMAQ',
    entidad: 'Dirección Técnica & Servicio Posventa — TECTROMAQ S.R.L.',
    vigencia: 'Edición Oficial 2026',
    codigo: 'MAN-SST-TECTRO-2026',
    resumen: 'Protocolo de operación y mantenimiento preventivo seguro para hornos rotativos, amasadoras espirales, sobadoras, batidoras planetarias, hornos de pizza y trenes de ósmosis inversa.',
    articulosClave: [
      {
        art: 'Sec. 2.1 — Regla de Enclavamiento en Rejillas de Amasado',
        texto: 'Queda estrictamente prohibido puentear o anular el sensor magnético de la rejilla de protección de amasadoras y sobadoras de masa.'
      },
      {
        art: 'Sec. 3.4 — Verificación Pre-Encendido de Gas y Seguridad Térmica',
        texto: 'Verificar hermeticidad de mangueras flexibles de gas GLP/GN y tiro del extractor antes de encender quemadores de hornos rotativos.'
      },
      {
        art: 'Sec. 5.2 — Protocolo LOTO de Desconexión Eléctrica en Mantenimiento',
        texto: 'Antes de limpiar espirales, cambiar rodamientos o sustituir membranas de ósmosis, desconectar el disyuntor principal y aplicar candado LOTO.'
      }
    ],
    aplicacionTeciromaq: 'Guía técnica que rige los 6 módulos de SafeWork 4.0 en TECTROMAQ.'
  }
];

export const INITIAL_REGULATORY_ALERTS = [
  {
    id: 'VENC-01',
    titulo: 'Certificación Anual de Seguridad en Quemadores y Líneas de Gas GLP',
    entidad: 'Cuerpo de Bomberos / Ministerio de Industria y Comercio (MICM)',
    fechaVencimiento: '2026-10-28',
    diasRestantes: 9,
    estado: 'Por Vencer (< 15 días)',
    responsable: 'Ing. Marcos Tejada (Jefe Técnico TECTROMAQ)',
    referenciaLegal: 'Reg. 522-06 Art. 3.6 / NFPA 54'
  },
  {
    id: 'VENC-02',
    titulo: 'Análisis Microbiológico y Físico-Químico en Planta de Agua',
    entidad: 'Laboratorio Nacional Dr. Defilló / Salud Pública (DIGEMAPS)',
    fechaVencimiento: '2026-10-24',
    diasRestantes: 5,
    estado: 'Por Vencer (< 15 días)',
    responsable: 'Lic. Laura Báez (Calidad & HSE TECTROMAQ)',
    referenciaLegal: 'Norma Dominicana NORDOM 477 (Agua Purificada)'
  },
  {
    id: 'VENC-03',
    titulo: 'Inspección de Guardas Mecánicas y Paradas de Emergencia en Amasadoras',
    entidad: 'Ministerio de Trabajo (DGT) — Inspección SST',
    fechaVencimiento: '2026-11-15',
    diasRestantes: 27,
    estado: 'Vigente',
    responsable: 'Dpto. Seguridad Industrial TECTROMAQ',
    referenciaLegal: 'Reglamento 522-06 Art. 3.4.1'
  },
  {
    id: 'VENC-04',
    titulo: 'Renovación de Recarga de Extintores Clase K (Cocinas) y PQS (Planta)',
    entidad: 'NFPA 10 / Bomberos Distrito Nacional',
    fechaVencimiento: '2027-02-10',
    diasRestantes: 114,
    estado: 'Vigente',
    responsable: 'Administración TECTROMAQ',
    referenciaLegal: 'Reglamento 522-06 Art. 2.8'
  }
];

export const INITIAL_AUDITS = [
  {
    id: 'AUD-2026-089',
    fecha: '2026-10-12',
    tipo: 'Inspección Oficial Ministerio de Trabajo (DGT) — Sector Alimentos',
    inspector: 'Insp. Roberto Santana (MT-RD)',
    sede: 'TECTROMAQ Planta Central Santo Domingo',
    cumplimiento: '97.8%',
    hallazgos: 'Verificación de guardas de protección y enclavamiento en amasadoras y tren de llenado de agua conforme al 100%.',
    estado: 'Aprobada / Conforme'
  },
  {
    id: 'AUD-2026-084',
    fecha: '2026-09-28',
    tipo: 'Auditoría Técnica ISO 45001 & Buenas Prácticas de Manufactura (BPM)',
    inspector: 'Ing. Laura Báez (Auditor Senior HSE TECTROMAQ)',
    sede: 'Línea de Ensamble y Showroom TECTROMAQ',
    cumplimiento: '98.5%',
    hallazgos: 'Trazabilidad digital LOTO en hornos rotativos y amasadoras industriales validada sin observaciones.',
    estado: 'Aprobada / Conforme'
  },
  {
    id: 'AUD-2026-071',
    fecha: '2026-08-19',
    tipo: 'Auditoría de Higiene Industrial (Estrés Térmico y Ruido)',
    inspector: 'Consultora de Higiene & SST Dominicana',
    sede: 'Área de Pruebas de Hornos y Calderas',
    cumplimiento: '94.2%',
    hallazgos: 'Se instalaron sensores IoT continuos para calor radiante y corte automático por sobretemperatura (TECTROMAQ).',
    estado: 'Cerrada con Mejora'
  }
];

export const CHECKLIST_TEMPLATE = [
  {
    id: 'CHK-01',
    critico: true,
    titulo: 'Micro-switch de Enclavamiento en Rejilla de Seguridad & Parada de Emergencia',
    normativa: 'Art. 3.4.1 Reg. 522-06 / ISO 45001 Cláusula 8.1.2',
    exigenciaLegal: 'El Art. 3.4.1 del Reglamento 522-06 exige que toda máquina con órganos rotativos (amasadoras, sobadoras, batidoras) cuente con paro inmediato al levantar la guarda y botón tipo hongo de parada de emergencia.',
    descripcion: 'Verificar que al levantar 2 cm la rejilla de la amasadora el motor corte de inmediato la rotación del gancho espiral.',
    requisitos: [
      { id: 'CHK-01-A', texto: 'Botón de Parada de Emergencia tipo hongo frontal corta la alimentación eléctrica al instante.' },
      { id: 'CHK-01-B', texto: 'Micro-switch de seguridad en rejilla protectora apaga el motor al elevarse sin retardo.' },
      { id: 'CHK-01-C', texto: 'Freno electro-mecánico detiene el giro del tazón y gancho espiral en menos de 0.8 segundos.' }
    ]
  },
  {
    id: 'CHK-02',
    critico: true,
    titulo: 'Sistema de Gas GLP/GN, Válvula Solenoide y Detector de Llama en Hornos',
    normativa: 'NFPA 54 / Reg. 522-06 Art. 3.4.4 (Seguridad Térmica)',
    exigenciaLegal: 'Se prohíbe operar hornos rotativos y de convección con fugas en mangueras de gas, termocuplas inoperativas o tiros de evacuación de monóxido obstruidos.',
    descripcion: 'Inspección de estanqueidad en línea de gas, encendido por chispero automático y tiro del extractor de humos.',
    requisitos: [
      { id: 'CHK-02-A', texto: 'Línea flexible y racores de gas GLP sin fugas (prueba con detector de gas/burbuja).' },
      { id: 'CHK-02-B', texto: 'Válvula solenoide de seguridad corta el paso de gas si la llama del quemador se extingue.' },
      { id: 'CHK-02-C', texto: 'Extractor de tiro forzado evacúa humos y monóxido sin reflujo hacia la zona de trabajo.' }
    ]
  },
  {
    id: 'CHK-03',
    critico: true,
    titulo: 'Presión Hidráulica / Manométrica en Sistema de Ósmosis Inversa & Llenado',
    normativa: 'NORDOM 477 / Reg. 522-06 Art. 4.1.2 (Líneas Presurizadas)',
    exigenciaLegal: 'Las líneas de alta presión en bombas multi-etapa y carcasas de membranas de ósmosis deben operar sin cavitación ni sobrepasar 250 PSI.',
    descripcion: 'Verificar manómetros de entrada/rechazo, sellos sanitarios y presostatos de corte por alta y baja presión.',
    requisitos: [
      { id: 'CHK-03-A', texto: 'Manómetros de presión diferencial en membranas dentro del rango óptimo (180-220 PSI).' },
      { id: 'CHK-03-B', texto: 'Presostato de corte automático por baja presión protege la bomba de trabajo en seco.' },
      { id: 'CHK-03-C', texto: 'Lámpara germicida UV y dosificador de ozono operando con sellos sanitarios sin goteo.' }
    ]
  },
  {
    id: 'CHK-04',
    critico: false,
    titulo: 'Puesta a Tierra Eléctrica y Protección Diferencial en Paneles de Control',
    normativa: 'Reg. 522-06 Art. 3.2 / NFPA 70 (Código Eléctrico)',
    exigenciaLegal: 'Todo equipo industrial trifásico (220V/480V) con motores eléctricos debe tener conexión a tierra física y relé de sobrecarga térmico calibrado.',
    descripcion: 'Revisión visual de cables de alimentación, prensaestopas estancos y aterramiento de chasis de acero inoxidable.',
    requisitos: [
      { id: 'CHK-04-A', texto: 'Chasis de acero inoxidable conectado a varilla de puesta a tierra (< 5 Ohms).' },
      { id: 'CHK-04-B', texto: 'Panel digital y variador de frecuencia sin alertas de sobrecorriente ni cables pelados.' },
      { id: 'CHK-04-C', texto: 'Pulsadores luminosos de marcha y parada en cabina de control en perfecto estado.' }
    ]
  },
  {
    id: 'CHK-05',
    critico: false,
    titulo: 'Extintor Especial para Grasas/Cocina (Clase K) y PQS ABC de 20 lbs',
    normativa: 'Reglamento 522-06 Art. 2.8 / NFPA 10',
    exigenciaLegal: 'En áreas de panaderías, pizzerías y freidoras es obligatorio extintor Clase K de acetato de potasio, con manómetro presurizado e inspección al día.',
    descripcion: 'Verificar extintor accesible a menos de 5 metros de los hornos, pasador con marchamo y fecha vigente.',
    requisitos: [
      { id: 'CHK-05-A', texto: 'Manómetro en zona verde de presión (195 PSI) y boquilla difusora libre de residuos.' },
      { id: 'CHK-05-B', texto: 'Pasador metálico asegurado con precinto de plástico intacto y señalización fotoluminiscente.' },
      { id: 'CHK-05-C', texto: 'Tarjeta de inspección mensual al día firmada por el supervisor de planta.' }
    ]
  }
];

export const INITIAL_RISK_REPORTS = [
  {
    id: 'RSK-2026-001',
    titulo: 'Pérdida de hermeticidad en sello de puerta de Horno Rotativo',
    area: 'Panadería & Repostería 🥐',
    tipoPeligro: 'Físico (Calor Radiante)',
    probabilidad: 2,
    severidad: 2,
    frecuencia: 3,
    fineScore: 120,
    nivelRiesgo: 'MEDIO',
    estado: 'EN_PROCESO',
    reportadoPor: 'Op. José Luis Santana',
    fecha: '2026-10-18',
    accionesPropuestas: 'Reemplazar empaque de silicona grado alimentario para 300°C y calibrar aldaba de cierre.'
  },
  {
    id: 'RSK-2026-002',
    titulo: 'Goteo de condensado cerca de conexión eléctrica en Planta de Agua',
    area: 'Purificación & Embotellado 💧',
    tipoPeligro: 'Eléctrico / Resbalones',
    probabilidad: 3,
    severidad: 3,
    frecuencia: 2,
    fineScore: 180,
    nivelRiesgo: 'ALTO',
    estado: 'ABIERTO',
    reportadoPor: 'Téc. Ramón Alcántara',
    fecha: '2026-10-19',
    accionesPropuestas: 'Canalizar drenaje sanitario hacia rejilla perimetral y colocar prensaestopa IP65 en motor.'
  }
];

export const INITIAL_COURSES = [
  {
    id: 'CUR-01',
    titulo: 'Seguridad en Maquinarias de Panadería, Pizzería y Repostería',
    norma: 'Reglamento 522-06 Art. 3.4 / TECTROMAQ Safety',
    duracion: '25 min',
    progreso: 50,
    completado: false,
    modulos: [
      'Enclavamientos mecánicos en amasadoras, sobadoras y batidoras',
      'Prevención de quemaduras y control de fugas de gas en hornos',
      'Procedimiento de limpieza segura con desconexión eléctrica'
    ],
    seccionesLectura: [
      {
        titulo: '1. Enclavamientos mecánicos obligatorios en amasadoras y batidoras',
        contenido:
          'En amasadoras espirales y batidoras industriales TECTROMAQ, los atrapamientos de manos constituyen el riesgo más severo. La norma exige que la rejilla protectora tenga un micro-switch magnético que corte el movimiento al levantarse. Queda estrictamente prohibido introducir espátulas o rasquetas con el gancho en rotación.'
      },
      {
        titulo: '2. Prevención de quemaduras y control térmico en hornos rotativos',
        contenido:
          'Los hornos rotativos de 36 bandejas operan a temperaturas de hasta 260 °C. Es obligatorio esperar 5 segundos al abrir la puerta para que el extractor evacúe el golpe de calor antes de retirar los carros porta-bandejas, utilizando guantes de fibra de aramida/Kevlar con aislamiento térmico certificado.'
      },
      {
        titulo: '3. Limpieza y desinfección higiénica sin riesgo eléctrico',
        contenido:
          'Toda limpieza húmeda en amasadoras y cortadoras debe realizarse con la máquina apagada y desenchufada del tomacorriente trifásico. Nunca se debe dirigir chorros de agua a presión directamente hacia los tableros digitales o botones de mando.'
      }
    ],
    modulosLeidos: [true, true, false],
    respuestaCorrectaRespondida: false,
    ultimaActualizacion: 'En progreso (2/3 capítulos leídos)',
    preguntaCurso: {
      enunciado: '¿Cuál es la regla obligatoria al limpiar el tazón o gancho de una amasadora espiral?',
      opciones: [
        'A) Mantener el motor a velocidad lenta para ayudar a lavar',
        'B) Desconectar la máquina de la energía eléctrica y esperar parada total',
        'C) Retirar la rejilla protectora y puentear el sensor'
      ],
      correctaIndex: 1
    },
    resumenContenido: 'El Reglamento 522-06 exige aislamiento de energía antes de cualquier limpieza en amasadoras industriales.'
  },
  {
    id: 'CUR-02',
    titulo: 'Operación Segura en Plantas de Purificación y Embotellado de Agua',
    norma: 'NORDOM 477 / Reg. 522-06 Art. 4.1.2',
    duracion: '30 min',
    progreso: 25,
    completado: false,
    modulos: [
      'Control de presión en bombas multi-etapa y ósmosis inversa',
      'Manejo seguro de ozono y radiación ultravioleta germicida',
      'Ergonomía en manipulación manual de botellones de 5 galones'
    ],
    seccionesLectura: [
      {
        titulo: '1. Control de líneas presurizadas y despresurización de filtros',
        contenido:
          'Las plantas de ósmosis inversa TECTROMAQ operan con bombas de acero inoxidable que alcanzan hasta 200 PSI. Antes de abrir carcasas porta-membranas o sustituir cartuchos de sedimentos, se debe purgar la presión hidráulica mediante las llaves de alivio de aire.'
      },
      {
        titulo: '2. Seguridad en generadores de ozono y lámparas UV',
        contenido:
          'El ozono utilizado en la desinfección es un gas oxidante potente. Debe verificarse la hermeticidad del venturi y destructor de ozono residual para evitar concentraciones mayores a 0.1 ppm en el ambiente de envasado.'
      },
      {
        titulo: '3. Levantamiento ergonómico de botellones de agua',
        contenido:
          'Un botellón de 5 galones pesa aproximadamente 19 kg. El personal de llenado debe flexionarse usando las piernas y mantener la carga pegada al cuerpo para evitar lesiones lumbares crónicas.'
      }
    ],
    modulosLeidos: [true, false, false],
    respuestaCorrectaRespondida: false,
    ultimaActualizacion: 'En progreso (1/3 capítulos leídos)',
    preguntaCurso: {
      enunciado: 'Antes de abrir un filtro o membrana de ósmosis inversa presurizada, ¿qué se debe hacer?',
      opciones: [
        'A) Desatornillar la abrazadera con la bomba encendida',
        'B) Apagar la bomba multi-etapa y purgar la presión residual mediante la válvula de alivio',
        'C) Golpear la carcasa con un martillo de acero'
      ],
      correctaIndex: 1
    },
    resumenContenido: 'Las líneas presurizadas de plantas de agua deben despresurizarse antes de cualquier mantenimiento.'
  },
  {
    id: 'CUR-03',
    titulo: 'Bloqueo y Etiquetado LOTO en Maquinarias Industriales TECTROMAQ',
    norma: 'OSHA 1910.147 / Manual TECTROMAQ Sec. 5',
    duracion: '35 min',
    progreso: 50,
    completado: false,
    modulos: [
      'Corte de energía eléctrica trifásica y cierre de válvula principal de gas',
      'Colocación de candado personal rojo y tarjeta auditable LOTO',
      'Prueba de Energía Cero y liberación autorizada con doble firma'
    ],
    seccionesLectura: [
      {
        titulo: '1. Desconexión de fuentes múltiples de energía (Electricidad + Gas + Presión)',
        contenido:
          'En hornos industriales TECTROMAQ convergen dos energías peligrosas: gas combustible y electricidad trifásica. Para intervenir el motor de giro o el quemador se debe cortar el disyuntor eléctrico y cerrar la llave de paso de gas con bloqueo mecánico.'
      },
      {
        titulo: '2. Colocación de candado y tarjeta oficial LOTO',
        contenido:
          'El técnico asignado coloca su candado rojo personal y etiqueta identificada con el número LOTO generado por SafeWork 4.0 en TECTROMAQ. La llave permanece en su poder hasta que se concluya el cambio de piezas.'
      },
      {
        titulo: '3. Verificación de Energía Cero y Doble Firma de Retorno',
        contenido:
          'Se intenta arrancar la máquina para constatar ausencia total de energía. Concluida la labor, solo se libera el equipo si firman conjuntamente el Técnico Mecánico y el Supervisor HSE en la plataforma.'
      }
    ],
    modulosLeidos: [true, true, false],
    respuestaCorrectaRespondida: false,
    ultimaActualizacion: 'En progreso (2/3 capítulos leídos)',
    preguntaCurso: {
      enunciado: 'En un horno rotativo industrial, ¿cuáles energías deben bloquearse antes de una reparación?',
      opciones: [
        'A) Solo la luz del tablero digital',
        'B) El suministro de gas combustible y la energía eléctrica trifásica',
        'C) No es necesario bloquear si la máquina está fría'
      ],
      correctaIndex: 1
    },
    resumenContenido: 'El protocolo LOTO protege la vida de los técnicos al aislar todas las energías peligrosas.'
  },
  {
    id: 'CUR-04',
    titulo: 'Higiene, Inocuidad y Prevención de Atrapamientos Mecánicos',
    norma: 'ISO 22000 / Reg. 522-06 Art. 3.4',
    duracion: '20 min',
    progreso: 25,
    completado: false,
    modulos: [
      'Cero uso de prendas sueltas, cadenas o anillos cerca de ejes rotativos',
      'Materiales sanitarios de acero inoxidable AISI 304/316L',
      'Protocolos de sanitización diaria y parada de emergencia'
    ],
    seccionesLectura: [
      {
        titulo: '1. Reglas estrictas de vestimenta en líneas de producción de alimentos',
        contenido:
          'El 90% de los accidentes por atrapamiento en sobadoras y amasadoras ocurren por mangas holgadas, delantales desamarrados o cabello suelto. Es obligatorio uniforme ajustado, redecilla para el pelo y cero joyas metálicas.'
      },
      {
        titulo: '2. Acero inoxidable de grado alimentario y prevención de contaminación',
        contenido:
          'Todos los equipos TECTROMAQ emplean acero inoxidable que evita la corrosión por harinas o aguas minerales. La sanitización con agentes desinfectantes debe realizarse protegiendo los cojinetes y rodamientos sellados.'
      },
      {
        titulo: '3. Prueba diaria del botón de parada de emergencia',
        contenido:
          'Al iniciar el primer turno de producción, el operador debe presionar el botón de parada de emergencia para confirmar que el corte de giro es inmediato antes de cargar harinas o agua.'
      }
    ],
    modulosLeidos: [true, false, false],
    respuestaCorrectaRespondida: false,
    ultimaActualizacion: 'En progreso (1/3 capítulos leídos)',
    preguntaCurso: {
      enunciado: '¿Qué indumentaria está prohibida al operar amasadoras, sobadoras o batidoras?',
      opciones: [
        'A) Delantales ajustados y redecilla para el cabello',
        'B) Mangas holgadas, bufandas, cadenas y anillos que puedan ser atrapados',
        'C) Botas de seguridad con suela antideslizante'
      ],
      correctaIndex: 1
    },
    resumenContenido: 'La prevención de atrapamientos exige vestimenta ceñida sin elementos colgantes cerca de rodillos.'
  }
];

export const QUIZ_QUESTIONS = [
  {
    id: 'Q1',
    pregunta: '1. Según el Reglamento 522-06 y la Resolución 04-2007 de Rep. Dominicana, ¿a partir de qué nivel de ruido continuo en una nave de panadería o embotellado se activa la alerta obligatoria de protección auditiva?',
    opciones: [
      'A) 70 dB(A) en oficinas administrativas',
      'B) 85 dB(A) como límite permisible para 8 horas de trabajo',
      'C) 120 dB(A) únicamente si la amasadora está vacía',
      'D) No existe regulación en la República Dominicana'
    ],
    correctaIndex: 1,
    explicacion: 'Correcto: El límite legal en RD (Res. 04-2007 y Reg. 522-06) para 8 horas continuas es de 85 dB(A).'
  },
  {
    id: 'Q2',
    pregunta: '2. En el Checklist Pre-Operacional de una Amasadora Espiral TECTROMAQ, la rejilla de seguridad no detiene el motor al levantarse ([CRÍTICO]). ¿Cuál es el protocolo obligatorio?',
    opciones: [
      'A) Seguir amasando con cuidado y tapar la máquina con un paño',
      'B) Bajar la velocidad de amasado para evitar accidentes',
      'C) Marcar "No Conforme", lo cual bloquea la máquina con candado LOTO y emite Orden de Trabajo a Taller',
      'D) Omitir el reporte para no atrasar la producción de pan'
    ],
    correctaIndex: 2,
    explicacion: 'Correcto: La falla de un micro-switch de seguridad en partes móviles activa de inmediato el bloqueo LOTO.'
  },
  {
    id: 'Q3',
    pregunta: '3. Para liberar un Horno Rotativo o Amasadora bloqueada por LOTO en TECTROMAQ, ¿qué requisito indispensable exige el sistema?',
    opciones: [
      'A) Solo la orden verbal del panadero encargado',
      'B) Doble firma auditable (Técnico Mecánico/Eléctrico + Supervisor HSE) tras verificar física de 3 pruebas',
      'C) Dejar la máquina apagada durante 2 horas sin revisarla',
      'D) Desconectar el sensor IoT de la computadora'
    ],
    correctaIndex: 1,
    explicacion: 'Correcto: El protocolo exige verificación técnica presencial y doble aprobación mancomunada.'
  }
];

export const INITIAL_LOTO_HISTORY = [
  {
    id: 'REL-2026-019',
    maquinaId: 'EQ-HORNO-ROT',
    maquinaNombre: 'Horno Rotativo Industrial 36 Bandejas',
    lotoCode: 'LOTO-2026-TEC-3810',
    workOrder: 'OT-MANT-2026-0812',
    motivoOriginal: 'Falla en termocupla de seguridad de corte de gas GLP por sobretemperatura.',
    fechaBloqueo: '2026-10-15 09:20',
    fechaLiberacion: '2026-10-16 14:15',
    aprobadoMantenimiento: 'Ing. Marcos Tejada (Jefe Técnico TECTROMAQ)',
    aprobadoHSE: 'Lic. Laura Báez (Supervisor HSE)',
    verificaciones: [
      'Termocupla reemplazada y prueba de llama azul conforme',
      'Retiro físico de candado y tarjeta LOTO en válvula de gas',
      'Prueba funcional de quemador y extractor al 100%'
    ]
  }
];

export const INITIAL_WORKERS = [
  {
    id: 'OP-001',
    nombre: 'Op. José Luis Santana',
    cedula: '001-1849201-4',
    cargo: 'Operador Maestro de Hornos Industriales & Pizzería',
    departamento: 'Planta de Horneado & Cocción'
  },
  {
    id: 'OP-002',
    nombre: 'Op. Carlos M. Castillo',
    cedula: '002-0941824-1',
    cargo: 'Especialista en Amasadoras Espirales & Repostería',
    departamento: 'Área de Masas & Formación'
  },
  {
    id: 'OP-003',
    nombre: 'Téc. Ramón Alcántara',
    cedula: '001-4920158-7',
    cargo: 'Técnico de Planta de Filtración & Ósmosis Inversa',
    departamento: 'Purificación & Llenado de Agua'
  },
  {
    id: 'OP-004',
    nombre: 'Ing. Marcos Tejada',
    cedula: '402-1829045-8',
    cargo: 'Jefe de Mantenimiento Electromecánico TECTROMAQ',
    departamento: 'Servicio Técnico & Posventa'
  }
];
