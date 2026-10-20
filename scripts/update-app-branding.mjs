import fs from 'fs';

let app = fs.readFileSync('src/App.jsx', 'utf8');

// Replace wordmark
const targetWordmark = `<a
            href={PAGE_ROUTES.home.path}
            onClick={(e) => {
              e.preventDefault();
              navigateToPage('home');
            }}
            className="nav-brand-wordmark"
            data-hidden={isScrolled ? 'true': 'false'}
          >
            TECTROMAQ
          </a>`;

const replacementWordmark = `<a
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
          </a>`;

if (app.includes(targetWordmark)) {
  app = app.replace(targetWordmark, replacementWordmark);
}

// Replace hero paragraph
const targetHeroText = `Plataforma integral para <strong>TECTROMAQ Santo Domingo</strong>:
                      inspecciones pre-operacionales en 60 segundos, bloqueo preventivo de maquinaria pesada y cumplimiento normativo en tiempo real.`;

const replacementHeroText = `Solución integral para <strong>TECTROMAQ</strong>: Equipos Industriales de alta exigencia para 🥐 Panaderías | 🥮 Reposterías | 🍕 Pizzerías | 💧 Plantas de Agua y más. Inspecciones pre-operacionales en 60s, micro-switches, seguridad térmica y bloqueo LOTO bajo el Reglamento 522-06.`;

if (app.includes(targetHeroText)) {
  app = app.replace(targetHeroText, replacementHeroText);
}

// Update Page Title
app = app.replace(
  "title: 'Inicio — Portal TECTROMAQ'",
  "title: 'TECTROMAQ — Equipos Industriales (Panaderías, Reposterías, Pizzerías, Plantas de Agua)'"
);

// Update Quick Demo text
app = app.replace(
  "motivoBloqueo: 'Fuga en manguera de alta presión hidráulica (Simulación 1-Clic)'",
  "motivoBloqueo: 'Falla crítica de micro-switch / termostato de seguridad (Simulación 1-Clic)'"
);

fs.writeFileSync('src/App.jsx', app, 'utf8');
console.log('Successfully updated App.jsx branding and logo');
