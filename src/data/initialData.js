// Datos iniciales para SafeWork 4.0 - TECIROMAQ (República Dominicana)

export const INITIAL_MACHINES = [
  {
    id: 'EQ-CAT-320D',
    nombre: 'Excavadora Hidráulica CAT 320D',
    marca: 'Caterpillar',
    modelo: '320D L',
    serie: 'CAT0320DJK89412',
    horometro: 4820.5,
    ubicacion: 'Patio Central Santo Domingo (18.4861° N, 69.9312° W)',
    operadorAsignado: 'Op. Carlos M. Castillo',
    estado: 'OPERATIVO', // 'OPERATIVO'| 'BLOQUEADO_LOTO'lotoCode: null,
    workOrder: null,
    motivoBloqueo: null,
    fechaBloqueo: null,
    ultimaInspeccion: '2026-10-15 07:30',
    presionHidraulica: '34,800 kPa',
    saludBomba: 78,
  },
  {
    id: 'EQ-JCB-3CX',
    nombre: 'Retroexcavadora JCB 3CX Eco',
    marca: 'JCB',
    modelo: '3CX-14',
    serie: 'JCB3CXSM44120',
    horometro: 3190.2,
    ubicacion: 'Frente de Obra Punta Cana (18.5601° N, 68.3725° W)',
    operadorAsignado: 'Op. Ramón Alcántara',
    estado: 'BLOQUEADO_LOTO',
    lotoCode: 'LOTO-2026-SD-4092',
    workOrder: 'OT-MANT-2026-0891',
    motivoBloqueo: 'Fuga activa en manguera de alta presión del cilindro de pluma y desgaste en freno de estacionamiento.',
    fechaBloqueo: '2026-10-15 16:45',
    ultimaInspeccion: '2026-10-15 16:45',
    presionHidraulica: '21,500 kPa (Anomalía)',
    saludBomba: 62,
  },
  {
    id: 'EQ-DYN-CA250',
    nombre: 'Rodillo Compactador Dynapac CA250',
    marca: 'Dynapac',
    modelo: 'CA250D-II',
    serie: 'DYN250RD99201',
    horometro: 2105.0,
    ubicacion: 'Patio Central Santo Domingo (18.4861° N, 69.9312° W)',
    operadorAsignado: 'Op. Julio César Méndez',
    estado: 'OPERATIVO',
    lotoCode: null,
    workOrder: null,
    motivoBloqueo: null,
    fechaBloqueo: null,
    ultimaInspeccion: '2026-10-14 08:15',
    presionHidraulica: '28,000 kPa',
    saludBomba: 91,
  },
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
    resumen: 'Marco regulatorio nacional que establece las condiciones mínimas de seguridad y salud en el trabajo, obligaciones patronales, comités mixtos de SST, equipos de protección personal y parada de emergencia en maquinaria.',
    articulosClave: [
      {
        art: 'Art. 2.1 — Obligaciones del Empleador',
        texto: 'El empleador está obligado a garantizar la seguridad y la salud de los trabajadores en todos los aspectos relacionados con el trabajo, mediante la prevención de riesgos laborales y mantenimiento preventivo de equipos pesados.'},
      {
        art: 'Art. 2.8 — Prevención y Protección contra Incendios',
        texto: 'Todo equipo móvil pesado y área de taller deberá contar con extintores portátiles certificados, con carga vigente, marchamo intacto y fácil acceso para el operador.'},
      {
        art: 'Art. 3.4.1 — Equipos de Trabajo y Parada de Emergencia',
        texto: 'Toda maquinaria pesada deberá estar provista de dispositivos de frenado de servicio, freno de emergencia y órganos de accionamiento de parada inmediata claramente identificados e inspeccionados antes de cada turno.'},
      {
        art: 'Art. 4.1 — Equipos de Protección Personal (EPP)',
        texto: 'El empleador deberá proporcionar gratuitamente cascos dieléctricos/impacto, botas con puntera de acero, protección auditiva (>85 dB) y chalecos de alta visibilidad en patios de maquinaria.'}
    ],
    aplicacionTeciromaq: 'Vinculado directamente a los puntos críticos del Checklist Pre-Operacional (Módulo 2), límites de ruido IoT de 85 dB (Módulo 4) y Certificación de EPP (Módulo 5).'},
  {
    id: 'NORM-RD-04-2007',
    titulo: 'Resolución 04-2007 sobre Condiciones de Higiene y Seguridad Industrial',
    subtitulo: 'Ministerio de Trabajo de la República Dominicana',
    categoria: 'Leyes Dominicanas',
    entidad: 'Ministerio de Trabajo (DGT / Higiene y Seguridad)',
    vigencia: 'Vigente (Obligatorio Nacional)',
    codigo: 'Res. 04-2007 MT',
    resumen: 'Establece los parámetros técnicos ambientales e higiénicos en centros de trabajo industriales: niveles máximos de ruido continuo (85 dB para 8h), estrés térmico, ventilación, iluminación y señalización.',
    articulosClave: [
      {
        art: 'Cap. III, Art. 14 — Exposición Ocupacional a Ruido',
        texto: 'Ningún trabajador deberá estar expuesto a niveles de presión sonora continua superiores a 85 dB(A) para una jornada de 8 horas sin protección auditiva certificada y controles de ingeniería.'},
      {
        art: 'Cap. IV, Art. 18 — Señalización Acústica y Luminosa',
        texto: 'Los vehículos y maquinarias industriales en movimiento dentro de talleres y frentes de obra deben poseer alarma sonora de retroceso y baliza estroboscópica ámbar operativa.'},
      {
        art: 'Cap. V, Art. 22 — Estrés Térmico y Ventilación en Talleres',
        texto: 'En naves de mantenimiento mecánico se monitoreará la temperatura efectiva y concentración de gases de combustión (CO < 25 ppm), asegurando extracción forzada.'}
    ],
    aplicacionTeciromaq: 'Regula los umbrales de la red de sensores IoT en planta y cabina (Módulo 4) y las inspecciones de alarmas audiovisuales (Módulo 2).'},
  {
    id: 'NORM-INT-ISO45001',
    titulo: 'Norma ISO 45001:2018 — Sistemas de Gestión de la Seguridad y Salud en el Trabajo',
    subtitulo: 'Estándar Internacional de Gestión Preventiva y Mejora Continua',
    categoria: 'Estándares Internacionales',
    entidad: 'International Organization for Standardization (ISO)',
    vigencia: 'Certificación Corporativa Vigente',
    codigo: 'ISO 45001:2018',
    resumen: 'Especifica los requisitos para un sistema de gestión de la SST que permita a TECIROMAQ proporcionar lugares de trabajo seguros y saludables, eliminar peligros y minimizar riesgos mediante jerarquía de controles.',
    articulosClave: [
      {
        art: 'Cláusula 6.1.2 — Identificación de Peligros y Evaluación de Riesgos',
        texto: 'La organización debe establecer, implementar y mantener procesos continuos y proactivos para la identificación de peligros en campo y la valoración metodológica del nivel de riesgo.'},
      {
        art: 'Cláusula 8.1.2 — Eliminar Peligros y Reducir Riesgos para la SST',
        texto: 'Aplicación estricta de la jerarquía de controles: 1) Eliminación, 2) Sustitución, 3) Controles de ingeniería (bloqueo automático LOTO), 4) Controles administrativos, 5) EPP.'},
      {
        art: 'Cláusula 9.1 — Seguimiento, Medición, Análisis y Evaluación del Desempeño',
        texto: 'Implementación de indicadores proactivos, telemetría instrumental calibrada y trazabilidad auditable de incidentes y acciones correctivas.'}
    ],
    aplicacionTeciromaq: 'Sustenta la matriz de riesgo dinámica (Módulo 3), el bloqueo preventivo de activos críticos (Módulo 2) y la trazabilidad de auditorías.'},
  {
    id: 'NORM-INT-OSHA1926',
    titulo: 'Estándares OSHA 29 CFR 1926 — Seguridad en Construcción y Maquinaria Pesada',
    subtitulo: 'Subpartes O (Vehículos Motorizados y Equipo Mecanizado) y W (ROPS/FOPS)',
    categoria: 'Estándares Internacionales',
    entidad: 'Occupational Safety and Health Administration (OSHA)',
    vigencia: 'Estándar de Referencia Técnica',
    codigo: 'OSHA 29 CFR 1926',
    resumen: 'Directrices técnicas internacionales para la operación segura de excavadoras, retroexcavadoras y compactadores, incluyendo integridad hidráulica, estructuras antivuelco (ROPS) y bloqueo de energía peligrosa (LOTO).',
    articulosClave: [
      {
        art: 'OSHA 1926.600(a)(3) — Sistemas Hidráulicos y Bloqueo Mecánico',
        texto: 'Las cucharas, brazos de excavación y accesorios hidráulicos deben bajarse completamente al suelo o bloquearse mecánicamente antes de realizar cualquier reparación o cuando la máquina no esté en uso.'},
      {
        art: 'OSHA 1926.1000 — Estructuras de Protección contra Vuelcos (ROPS/FOPS)',
        texto: 'Todo equipo de movimiento de tierras (excavadoras, retroexcavadoras, rodillos) debe contar con cabina ROPS/FOPS certificada sin fisuras estructurales y cinturón de seguridad funcional.'},
      {
        art: 'OSHA 1910.147 / 1926.417 — Control de Energía Peligrosa (Lockout / Tagout)',
        texto: 'Ningún colaborador realizará mantenimiento en equipos con energía hidráulica, neumática o eléctrica residual sin aplicar candado físico y tarjeta nominal de bloqueo (LOTO).'}
    ],
    aplicacionTeciromaq: 'Define el protocolo técnico de bloqueo y doble firma de liberación en el Módulo 6.'},
  {
    id: 'NORM-INT-TECIROMAQ-01',
    titulo: 'Manual Interno de Operación y Mantenimiento Seguro TECIROMAQ v4.2',
    subtitulo: 'Protocolo Corporativo Stop-Work Authority & Mantenimiento 4.0',
    categoria: 'Manuales Internos TECIROMAQ',
    entidad: 'Dirección de Operaciones y HSE — TECIROMAQ S.R.L.',
    vigencia: 'Revisión Octubre 2026',
    codigo: 'MAN-SST-TECI-001',
    resumen: 'Reglamento operativo interno de TECIROMAQ Santo Domingo y Punta Cana. Otorga autoridad total de Parada de Trabajo (Stop-Work) ante fallas críticas en frenos o hidráulica y exige doble firma para retorno a operación.',
    articulosClave: [
      {
        art: 'Sec. 3.1 — Regla de Oro de Inspección Pre-Turno',
        texto: 'Ninguna máquina pesada de la flota TECIROMAQ puede encender motor para operación productiva sin haber completado y firmado digitalmente el Checklist Dinámico en SafeWork 4.0.'},
      {
        art: 'Sec. 4.2 — Bloqueo Automático por No Conformidad Crítica',
        texto: 'Si un operador reporta "No Conforme" en frenos o mangueras hidráulicas de alta presión, el sistema genera automáticamente un código LOTO, inhabilita el despacho del equipo y abre Orden de Trabajo prioritaria.'},
      {
        art: 'Sec. 6.4 — Protocolo de Liberación de Doble Firma (Mantenimiento + HSE)',
        texto: 'El desbloqueo de un activo crítico requiere verificación física de reemplazo de pieza, retiro de candado LOTO, prueba de frenos al 100% y firma mancomunada de Mantenimiento Técnico y Supervisor HSE.'}
    ],
    aplicacionTeciromaq: 'Integra el flujo completo de los 6 módulos de la plataforma SafeWork 4.0.'}
];

export const INITIAL_REGULATORY_ALERTS = [
  {
    id: 'VENC-01',
    titulo: 'Inspección Certificada de Calderas y Tanques Compresores (Taller SD)',
    entidad: 'Ministerio de Trabajo / Empresa Certificadora',
    fechaVencimiento: '2026-10-10',
    diasRestantes: -6,
    estado: 'Vencido',
    responsable: 'Ing. Marcos Tejada (Mantenimiento Planta)',
    referenciaLegal: 'Reglamento 522-06 Art. 3.6'},
  {
    id: 'VENC-02',
    titulo: 'Certificación y Recarga de Extintores PQS / CO2 en Flota Pesada',
    entidad: 'Cuerpo de Bomberos DN / Proveedor NFPA-10',
    fechaVencimiento: '2026-10-25',
    diasRestantes: 9,
    estado: 'Por Vencer (< 15 días)',
    responsable: 'Ing. Laura Báez (Coordinadora HSE)',
    referenciaLegal: 'Reglamento 522-06 Art. 2.8'},
  {
    id: 'VENC-03',
    titulo: 'Vencimiento de Licencias de Operadores Pesados (MOPC Categoría 05)',
    entidad: 'INTRANT / MOPC República Dominicana',
    fechaVencimiento: '2026-10-28',
    diasRestantes: 12,
    estado: 'Por Vencer (< 15 días)',
    responsable: 'Lic. Patricia Gómez (RRHH & Cumplimiento)',
    referenciaLegal: 'Ley 63-17 / Manual TECIROMAQ Sec. 2'},
  {
    id: 'VENC-04',
    titulo: 'Renovación de Pólizas de Riesgo Laboral y Cobertura Suplementaria',
    entidad: 'IDOPPRIL / TSS República Dominicana',
    fechaVencimiento: '2027-03-15',
    diasRestantes: 150,
    estado: 'Vigente',
    responsable: 'Dirección Financiera & Legal TECIROMAQ',
    referenciaLegal: 'Ley 87-01 Seguridad Social RD'}
];

export const INITIAL_AUDITS = [
  {
    id: 'AUD-2026-089',
    fecha: '2026-10-08',
    tipo: 'Inspección Oficial Ministerio de Trabajo (DGT)',
    inspector: 'Insp. Roberto Santana (MT-RD)',
    sede: 'TECIROMAQ Santo Domingo',
    cumplimiento: '96.4%',
    hallazgos: '1 Observación menor en demarcación de pasillo peatonal de nave de soldadura (Subsanada).',
    estado: 'Aprobada / Conforme'},
  {
    id: 'AUD-2026-084',
    fecha: '2026-09-22',
    tipo: 'Auditoría Interna ISO 45001:2018 — Control Operacional y LOTO',
    inspector: 'Ing. Laura Báez (Líder HSE TECIROMAQ)',
    sede: 'TECIROMAQ Santo Domingo / Punta Cana',
    cumplimiento: '98.0%',
    hallazgos: 'Trazabilidad digital LOTO al 100% en flota de excavadoras y compactadores.',
    estado: 'Aprobada / Conforme'},
  {
    id: 'AUD-2026-071',
    fecha: '2026-08-14',
    tipo: 'Auditoría de Higiene Industrial (Ruido, Gases y Estrés Térmico)',
    inspector: 'Consultora Ambiental & SST Caribe S.R.L.',
    sede: 'Taller Central Santo Domingo',
    cumplimiento: '92.5%',
    hallazgos: 'Se recomendó instalación de sensores IoT continuos en bahía de pruebas hidráulicas (Implementado en SafeWork 4.0).',
    estado: 'Cerrada con Mejora'}
];

export const CHECKLIST_TEMPLATE = [
  {
    id: 'CHK-01',
    critico: true,
    titulo: 'Sistema de frenos de servicio, parqueo y parada de emergencia',
    normativa: 'Art. 3.4.1 Reg. 522-06 / ISO 45001 Cláusula 8.1.2',
    exigenciaLegal: 'El Reglamento 522-06 Art. 3.4.1 exige que todo equipo pesado disponga de sistema de frenado principal y de estacionamiento capaz de sostener la máquina con carga máxima en pendiente, además de dispositivo de parada de emergencia de corte inmediato.',
    descripcion: 'Verificar respuesta de pedal, freno hidrostático y botón rojo de corte de motor en cabina.',
    requisitos: [
      { id: 'CHK-01-A', texto: 'Pedal de freno de servicio con presión firme y recorrido sin caída libre (Prueba de retención estática).' },
      { id: 'CHK-01-B', texto: 'Freno de parqueo / bloqueo hidrostático sujeta la unidad al 100% en rampa o terreno irregular.' },
      { id: 'CHK-01-C', texto: 'Botón rojo de Parada de Emergencia (Stop-Work) en cabina corta la inyección de forma instantánea.' }
    ]
  },
  {
    id: 'CHK-02',
    critico: true,
    titulo: 'Fugas en mangueras de alta presión hidráulica y cilindros',
    normativa: 'OSHA 1926.600 / Manual TECIROMAQ Sec. 4.2',
    exigenciaLegal: 'La norma OSHA 1926.600 y el Manual TECIROMAQ Sec. 4.2 prohíben operar maquinaria con fugas activas, sudoración en racores o mangueras con malla de acero expuesta en circuitos sometidos a más de 15,000 kPa.',
    descripcion: 'Inspección visual de racores, distribuidor principal y mangueras de pluma/brazo sin goteo ni abrasión.',
    requisitos: [
      { id: 'CHK-02-A', texto: 'Mangueras hidráulicas de pluma, brazo y cucharón sin grietas, ampollas ni alambre trenzado expuesto.' },
      { id: 'CHK-02-B', texto: 'Racores, acoples rápidos y banco de válvulas secos, sin goteo ni pérdida de presión hidráulica.' },
      { id: 'CHK-02-C', texto: 'Vástagos de cilindros hidráulicos limpios, sin rayaduras profundas ni retenes reventados.' }
    ]
  },
  {
    id: 'CHK-03',
    critico: false,
    titulo: 'Alarma de retroceso audible (102 dB) y baliza estroboscópica ámbar',
    normativa: 'Res. 04-2007 Art. 18 / OSHA 1926.601',
    exigenciaLegal: 'La Resolución 04-2007 y OSHA 1926.601 establecen que todo vehículo de obra con visión trasera restringida debe activar automáticamente una señal acústica superior al ruido ambiental y señal luminosa omnidireccional.',
    descripcion: 'Comprobar activación automática al engranar reversa y visibilidad de luz estroboscópica.',
    requisitos: [
      { id: 'CHK-03-A', texto: 'Alarma acústica de retroceso (102 dB) se activa automáticamente al colocar selector en reversa.' },
      { id: 'CHK-03-B', texto: 'Baliza estroboscópica ámbar superior enciende con destello continuo visible a 360 grados.' },
      { id: 'CHK-03-C', texto: 'Espejos retrovisores laterales y cámara/visibilidad de contrapeso limpios y sin roturas.' }
    ]
  },
  {
    id: 'CHK-04',
    critico: false,
    titulo: 'Estructura ROPS/FOPS de cabina y cinturón de seguridad retráctil',
    normativa: 'OSHA 1926.1000 / Reg. 522-06 Art. 4.1',
    exigenciaLegal: 'OSHA 1926.1000 exige que las cabinas de excavadoras, retroexcavadoras y compactadores cuenten con estructura certificada contra vuelcos (ROPS) y caída de objetos (FOPS) sin alteraciones ni soldaduras no autorizadas.',
    descripcion: 'Cabina sin deformaciones ni fisuras en montantes; hebilla de cinturón con bloqueo firme.',
    requisitos: [
      { id: 'CHK-04-A', texto: 'Pórtico y columnas estructurales ROPS/FOPS sin fisuras, golpes estructurales ni perforaciones.' },
      { id: 'CHK-04-B', texto: 'Cinturón de seguridad retráctil sin deshilachado y con cierre de hebilla positivo.' },
      { id: 'CHK-04-C', texto: 'Peldaños y pasamanos de acceso (3 puntos de apoyo) firmes y libres de grasa o lodo.' }
    ]
  },
  {
    id: 'CHK-05',
    critico: false,
    titulo: 'Extintor de incendios PQS ABC con carga y marchamo al día',
    normativa: 'Obligatorio Reg. 522-06 Art. 2.8',
    exigenciaLegal: 'El Reglamento 522-06 Art. 2.8 obliga a portar extintor portátil de Polvo Químico Seco (ABC) presurizado, accesible desde el puesto del operador y con inspección vigente.',
    descripcion: 'Manómetro en zona verde (195 PSI), pasador de seguridad con precinto intacto y tarjeta vigente.',
    requisitos: [
      { id: 'CHK-05-A', texto: 'Aguja del manómetro ubicada dentro de la franja verde operativa (195 PSI).' },
      { id: 'CHK-05-B', texto: 'Pasador metálico de seguridad asegurado con marchamo intacto y boquilla despejada.' },
      { id: 'CHK-05-C', texto: 'Etiqueta de certificación y recarga vigente (No vencida) y soporte de cabina fijo.' }
    ]
  }
];

export const INITIAL_RISK_REPORTS = [
  {
    id: 'RSK-2026-104',
    fecha: '2026-10-15 14:20',
    reportadoPor: 'Téc. Miguel Ángel Rosario',
    condicion: 'Derrame de aceite hidráulico ISO VG 68 en bahía de mantenimiento #2 (Piso resbaladizo)',
    categoria: 'Físico',
    ubicacion: 'Área de Taller — Nave Principal SD',
    probabilidad: 3, // Alta
    consecuencia: 2, // Grave
    score: 6,
    nivel: 'Riesgo Crítico / Inadmisible',
    accionCorrectiva: 'Aplicación inmediata de material absorbente oleofílico, señalización con conos y reparación de acople rápido.',
    responsable: 'Ing. Marcos Tejada',
    slaFecha: '2026-10-16',
    estado: 'En Mitigación',
    evidenciaTipo: 'oil_spill'},
  {
    id: 'RSK-2026-103',
    fecha: '2026-10-14 09:50',
    reportadoPor: 'Op. Julio César Méndez',
    condicion: 'Cable de alimentación trifásico 220V de máquina soldadora con aislamiento desgastado en paso peatonal',
    categoria: 'Mecánico',
    ubicacion: 'Área de Taller — Zona de Soldadura',
    probabilidad: 2, // Media
    consecuencia: 3, // Catastrófico
    score: 6,
    nivel: 'Riesgo Crítico / Inadmisible',
    accionCorrectiva: 'Desenergización inmediata, reemplazo de cable blindado tipo SOOW y canalización aérea.',
    responsable: 'Sup. Eléctrico Pedro Nolasco',
    slaFecha: '2026-10-15',
    estado: 'Cerrado / Verificado',
    evidenciaTipo: 'exposed_cable'},
  {
    id: 'RSK-2026-102',
    fecha: '2026-10-13 11:10',
    reportadoPor: 'Aux. Almacén Kelvin Peña',
    condicion: 'Postura forzada en levantamiento manual de cubetas de grasa de 20 kg sin carretilla hidráulica',
    categoria: 'Ergonómico',
    ubicacion: 'Almacén Central de Lubricantes',
    probabilidad: 2, // Media
    consecuencia: 2, // Grave
    score: 4,
    nivel: 'Riesgo Moderado',
    accionCorrectiva: 'Dotación de transpaleta manual y reubicación de cubetas en nivel inferior de estantería.',
    responsable: 'Ing. Laura Báez (HSE)',
    slaFecha: '2026-10-18',
    estado: 'Abierto',
    evidenciaTipo: 'ergonomic_load'}
];

export const INITIAL_COURSES = [
  {
    id: 'CUR-01',
    titulo: 'Uso Obligatorio de EPP según Reg. 522-06',
    norma: 'Decreto 522-06 Art. 4.1 / OSHA 1926.95',
    duracion: '25 min',
    progreso: 50,
    completado: false,
    modulos: [
      'Clasificación de cascos Clase E/G y calzado ASTM F2413',
      'Protección auditiva obligatoria en entornos > 85 dB(A)',
      'Inspección diaria y descarte de EPP degradado'
    ],
    seccionesLectura: [
      {
        titulo: '1. Clasificación de cascos Clase E/G y calzado de seguridad ASTM F2413',
        contenido:
          'De acuerdo con el Reglamento 522-06 de Seguridad y Salud en el Trabajo de la República Dominicana (Art. 4.1) y la norma OSHA 1926.95, todo operador de excavadora CAT 320D, retroexcavadora JCB 3CX o rodillo compactador Dynapac CA250 debe portar casco dieléctrico Clase E (probado a 20,000 V) con barbiquejo de 3 puntos y botas con puntera de acero o composite certificadas bajo ASTM F2413 contra impacto y compresión (I/75 C/75) y suela antideslizante resistente a hidrocarburos.'
      },
      {
        titulo: '2. Protección auditiva obligatoria en entornos mayores a 85 dB(A)',
        contenido:
          'La Resolución 04-2007 del Ministerio de Trabajo establece que el límite máximo permisible de ruido ocupacional continuo para una jornada de 8 horas es de 85 dB(A). En la bahía de pruebas hidráulicas del Taller Central Santo Domingo y durante la operación con martillo demoledor hidráulico (donde se superan los 98 dB), es obligatorio el uso de protectores auditivos tipo copa con tasa de reducción de ruido mínima de NRR 28 dB.'
      },
      {
        titulo: '3. Inspección diaria pre-turno y descarte inmediato de EPP degradado',
        contenido:
          'Antes de iniciar el turno, el colaborador debe verificar que el arnés de suspensión de su casco no presente fisuras ni vencimiento (vida útil máxima de 2 años en campo solar), que los lentes de policarbonato ANSI Z87.1+ estén libres de rayaduras centrales y que los guantes de nitrilo/anticorte para manipulación de mangueras hidráulicas SAE 100R12 no estén impregnados de fluido ISO VG 68. Todo EPP dañado se reemplaza sin costo en Almacén.'
      }
    ],
    modulosLeidos: [true, true, false],
    respuestaCorrectaRespondida: false,
    ultimaActualizacion: 'En progreso (2/3 capítulos leídos)',
    preguntaCurso: {
      enunciado: '¿Cuándo es obligatorio utilizar protectores auditivos certificados en el taller o patio de máquinas?',
      opciones: [
        'A) Solo si el operador siente molestia auditiva',
        'B) Siempre que el nivel de ruido alcance o supere los 85 dB(A)',
        'C) Únicamente durante auditorías del Ministerio de Trabajo'
      ],
      correctaIndex: 1
    },
    resumenContenido: 'El Reglamento 522-06 establece la obligatoriedad del uso y suministro gratuito de Equipos de Protección Personal certificados en todas las operaciones con maquinaria pesada.'
  },
  {
    id: 'CUR-02',
    titulo: 'Derechos y Deberes Laborales en SST',
    norma: 'Ley 16-92 Código de Trabajo RD & Reg. 522-06',
    duracion: '30 min',
    progreso: 25,
    completado: false,
    modulos: [
      'Derecho a la autoridad de Parada de Trabajo (Stop-Work Authority)',
      'Participación activa en el Comité Mixto de Seguridad y Salud',
      'Deber de reportar condiciones inseguras e incidentes en campo'
    ],
    seccionesLectura: [
      {
        titulo: '1. Derecho a la Autoridad de Parada de Trabajo (Stop-Work Authority)',
        contenido:
          'El Reglamento 522-06 y el Manual Corporativo TECIROMAQ otorgan a todo operador y mecánico la autoridad legal e inmediata de detener cualquier equipo pesado (Stop-Work) cuando detecte una falla en frenos, fuga hidráulica de alta presión o inestabilidad de talud en excavación. Ningún supervisor puede obligar a encender una máquina bloqueada ni aplicar sanciones por ejercer este derecho.'
      },
      {
        titulo: '2. Participación en el Comité Mixto de Seguridad y Salud en el Trabajo',
        contenido:
          'En cumplimiento de la Resolución 04-2007 del Ministerio de Trabajo, TECIROMAQ mantiene un Comité Mixto paritario integrado por representantes de los operadores/técnicos y de la Dirección. Los trabajadores tienen derecho a participar en las inspecciones mensuales de taller, revisar las estadísticas de incidentes y proponer mejoras ergonómicas y de ventilación.'
      },
      {
        titulo: '3. Deber legal de cumplir protocolos y reportar condiciones inseguras',
        contenido:
          'Así como el empleador está obligado a garantizar un entorno seguro, el Artículo 4.2 del Decreto 522-06 establece como obligación del trabajador completar el Checklist Pre-Operacional antes de encender su unidad, utilizar correctamente los EPP entregados y reportar de inmediato en SafeWork 4.0 cualquier derrame de aceite, cable expuesto o cuasi-accidente.'
      }
    ],
    modulosLeidos: [true, false, false],
    respuestaCorrectaRespondida: false,
    ultimaActualizacion: 'En progreso (1/3 capítulos leídos)',
    preguntaCurso: {
      enunciado: '¿Qué derecho otorga el protocolo Stop-Work Authority a cualquier operador de TECIROMAQ?',
      opciones: [
        'A) Detener la máquina de inmediato si detecta un riesgo grave para su vida, sin represalias',
        'B) Omitir el checklist pre-turno cuando hay prisa en la obra',
        'C) Autorizar reparaciones hidráulicas sin avisar a Mantenimiento'
      ],
      correctaIndex: 0
    },
    resumenContenido: 'Todo trabajador en la República Dominicana tiene el derecho legal de interrumpir una tarea si existe riesgo grave e inminente para su vida o salud, sin sufrir represalias.'
  },
  {
    id: 'CUR-03',
    titulo: 'Protocolo LOTO de Bloqueo de Energía Peligrosa',
    norma: 'OSHA 1910.147 / Manual Interno TECIROMAQ Sec. 6',
    duracion: '35 min',
    progreso: 50,
    completado: false,
    modulos: [
      'Alivio de presión hidráulica residual y corte de energía eléctrica',
      'Colocación de candado personal e intransferible + tarjeta LOTO',
      'Protocolo de liberación técnica con doble firma (Mantenimiento + HSE)'
    ],
    seccionesLectura: [
      {
        titulo: '1. Alivio de presión hidráulica residual y corte de energía eléctrica/mecánica',
        contenido:
          'Cuando una Excavadora CAT 320D o Retroexcavadora JCB 3CX presenta una falla crítica, apagar el motor diésel no es suficiente: el circuito hidráulico retiene más de 15,000 kPa de presión acumulada y el brazo puede desplomarse por gravedad. El paso 1 obligatorio consiste en apoyar el cucharón y la hoja topadora firmemente en el suelo, accionar las palancas para purgar la presión residual de los acumuladores y desconectar el interruptor maestro de batería (Master Switch).'
      },
      {
        titulo: '2. Colocación de candado físico personal e intransferible y tarjeta LOTO',
        contenido:
          'Una vez disipada toda energía, se coloca el candado de seguridad rojo LOTO sobre el cortacorriente maestro y se bloquea la cabina con la etiqueta oficial que indica el código LOTO generado por SafeWork 4.0, el nombre del técnico interviniente y el número de Orden de Trabajo (OT). La llave única permanece en poder exclusivo del mecánico que está debajo o dentro de la máquina.'
      },
      {
        titulo: '3. Verificación de Energía Cero y Liberación con Doble Firma Auditable',
        contenido:
          'Antes de aflojar cualquier racor o cilindro, se intenta accionar el encendido para comprobar Energía Cero. Finalizada la reparación (cambio de manguera SAE 100R12 o bomba de frenos), la máquina solo puede volver a estado Operativo en el sistema cuando se verifican los 3 requisitos físicos y firman conjuntamente el Jefe de Mantenimiento Técnico y el Supervisor HSE.'
      }
    ],
    modulosLeidos: [true, true, false],
    respuestaCorrectaRespondida: false,
    ultimaActualizacion: 'En progreso (2/3 temas leídos)',
    preguntaCurso: {
      enunciado: 'Antes de reparar una manguera hidráulica en una Excavadora CAT 320D bloqueada, ¿qué debe hacer el técnico?',
      opciones: [
        'A) Desmontar la manguera directamente con el motor encendido',
        'B) Aliviar la presión residual, colocar su candado LOTO personal y verificar energía cero',
        'C) Quitar el candado de otro compañero para terminar rápido'
      ],
      correctaIndex: 1
    },
    resumenContenido: 'Antes de intervenir cualquier excavadora o retroexcavadora bloqueada, se debe aliviar la presión hidráulica residual, colocar candado físico y verificar energía cero.'
  },
  {
    id: 'CUR-04',
    titulo: 'Ergonomía y Control de Vibraciones en Maquinaria Pesada',
    norma: 'ISO 2631-1 / Res. 04-2007 MT',
    duracion: '20 min',
    progreso: 25,
    completado: false,
    modulos: [
      'Ajuste neumático del asiento de cabina según peso del operador',
      'Regla de los 3 puntos de apoyo al subir y bajar de la máquina',
      'Pausas activas y monitoreo de vibración de cuerpo entero'
    ],
    seccionesLectura: [
      {
        titulo: '1. Ajuste neumático del asiento de cabina según el peso del operador',
        contenido:
          'La exposición prolongada a vibraciones de cuerpo entero (WBV) en rodillos compactadores Dynapac CA250 y excavadoras sobre orugas puede ocasionar hernias discales y fatiga lumbar severa. Antes de iniciar la jornada, el operador debe regular la válvula de suspensión neumática del asiento al peso exacto de su cuerpo (en kg), ajustar el soporte lumbar y posicionar los joysticks de modo que los codos descansen a 90 grados.'
      },
      {
        titulo: '2. Regla de Oro de los 3 Puntos de Apoyo al subir y bajar de la cabina',
        contenido:
          'Más del 75% de las lesiones incapacitantes en operadores de maquinaria pesada ocurren al subir o bajar del equipo por resbalones con lodo o grasa en los estribos. Es obligatorio ascender y descender de frente a la máquina manteniendo siempre tres puntos de contacto simultáneos con los pasamanos y peldaños antiderrapantes (dos manos y un pie, o dos pies y una mano). Está estrictamente prohibido saltar desde las orugas o neumáticos.'
      },
      {
        titulo: '3. Pausas activas y vigilancia del sensor de vibración en cabina',
        contenido:
          'Según la norma ISO 2631-1 y la Resolución 04-2007, cuando se realizan trabajos continuos de compactación vibratoria o demolición en roca en el Frente de Obra Punta Cana, el operador debe realizar una pausa activa de estiramiento de 10 minutos cada 2 horas de operación continua y reportar cualquier alerta del sensor IoT cuando la vibración supere los 4.5 mm/s.'
      }
    ],
    modulosLeidos: [true, false, false],
    respuestaCorrectaRespondida: false,
    ultimaActualizacion: 'En progreso (1/3 temas leídos)',
    preguntaCurso: {
      enunciado: '¿Cuál es la regla obligatoria al subir o bajar de la cabina de una excavadora o retroexcavadora?',
      opciones: [
        'A) Saltar desde el último peldaño hacia el suelo',
        'B) Mantener siempre 3 puntos de apoyo (dos manos y un pie, o dos pies y una mano) mirando hacia la máquina',
        'C) Subir cargando herramientas pesadas en ambas manos'
      ],
      correctaIndex: 1
    },
    resumenContenido: 'El uso de los 3 puntos de apoyo previene el 80% de las caídas desde maquinaria pesada, mientras que el ajuste del asiento mitiga lesiones lumbares por vibración.'
  }
];

export const QUIZ_QUESTIONS = [
  {
    id: 'Q1',
    pregunta: '1. Según el Reglamento 522-06 (Rep. Dominicana) y la Resolución 04-2007 del Ministerio de Trabajo, ¿a partir de qué nivel de ruido ambiental continuo (jornada 8h) se dispara la alerta obligatoria y el uso estricto de protección auditiva?',
    opciones: [
      'A) 70 dB(A) en cualquier área administrativa',
      'B) 85 dB(A) como límite permisible de exposición ocupacional',
      'C) 115 dB(A) únicamente cuando opera el martillo hidráulico',
      'D) No existe un límite numérico en la normativa dominicana'],
    correctaIndex: 1,
    explicacion: 'Correcto: El límite legal en RD (Res. 04-2007 y Reg. 522-06) para una jornada de 8 horas es de 85 dB(A).'},
  {
    id: 'Q2',
    pregunta: '2. Al realizar el Checklist Pre-Operacional en una Excavadora CAT 320D, el operador detecta una fuga en una manguera hidráulica de alta presión o falla en el sistema de frenos ([CRÍTICO]). ¿Cuál es el protocolo obligatorio en SafeWork 4.0?',
    opciones: [
      'A) Continuar operando a baja revolución hasta terminar el turno y avisar al final del día',
      'B) Rellenar aceite hidráulico provisionalmente y operar solo en terreno plano',
      'C) Marcar "No Conforme", lo cual bloquea automáticamente la máquina, genera código LOTO y emite Orden de Trabajo',
      'D) Borrar el checklist y cambiar de operador sin reportar la falla'],
    correctaIndex: 2,
    explicacion: 'Correcto: Un fallo en un punto [CRÍTICO] activa el bloqueo automático Stop-Work (LOTO) y genera la Orden de Mantenimiento.'},
  {
    id: 'Q3',
    pregunta: '3. Para liberar una máquina bloqueada por protocolo LOTO y regresarla a estado "Operativo" en TECIROMAQ, ¿qué requisito es indispensable?',
    opciones: [
      'A) Solo la autorización verbal del operador de turno',
      'B) Doble aprobación formal (Mantenimiento Técnico + Supervisor HSE) tras verificar pieza reemplazada, retiro de candado LOTO y prueba de frenos al 100%',
      'C) Esperar 24 horas con la máquina apagada sin intervención mecánica',
      'D) Únicamente reiniciar el panel de telemetría IoT'],
    correctaIndex: 1,
    explicacion: 'Correcto: El protocolo LOTO exige verificación física de los 3 puntos críticos y doble firma auditable (Mantenimiento + HSE).'}
];

export const INITIAL_LOTO_HISTORY = [
  {
    id: 'REL-2026-019',
    maquinaId: 'EQ-DYN-CA250',
    maquinaNombre: 'Rodillo Compactador Dynapac CA250',
    lotoCode: 'LOTO-2026-SD-3810',
    workOrder: 'OT-MANT-2026-0812',
    motivoOriginal: 'Pérdida de presión en circuito de freno hidrostático secundario.',
    fechaBloqueo: '2026-10-11 08:10',
    fechaLiberacion: '2026-10-12 11:40',
    aprobadoMantenimiento: 'Ing. Marcos Tejada (Jefe Taller)',
    aprobadoHSE: 'Ing. Laura Báez (Supervisor HSE)',
    verificaciones: [
      'Pieza reemplazada y fuga subsanada',
      'Retiro físico de candado y tarjeta LOTO',
      'Prueba funcional de frenos al 100%']
  }
];

export const INITIAL_WORKERS = [
  {
    id: 'OP-001',
    nombre: 'Op. Carlos M. Castillo',
    cedula: '001-1849201-4',
    cargo: 'Operador de Excavadora Hidráulica (CAT 320D)',
    departamento: 'Operaciones Mina & Cantera'
  },
  {
    id: 'OP-002',
    nombre: 'Op. Ramón Alcántara',
    cedula: '002-0941824-1',
    cargo: 'Operador de Retroexcavadora (JCB 3CX)',
    departamento: 'Frente de Obra Punta Cana'
  },
  {
    id: 'OP-003',
    nombre: 'Op. Julio César Méndez',
    cedula: '001-4920158-7',
    cargo: 'Operador de Rodillo Compactador (Dynapac CA250)',
    departamento: 'Movimiento de Tierras'
  },
  {
    id: 'OP-004',
    nombre: 'Téc. Fernando Ruiz',
    cedula: '402-1829045-8',
    cargo: 'Técnico Mecánico Hidráulico Especialista',
    departamento: 'Taller Central de Mantenimiento'
  }
];

