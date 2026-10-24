import fs from 'fs';

// 1. In App.jsx
let app = fs.readFileSync('src/App.jsx', 'utf8');
app = app.replace(/Protege vidas con TECTROMAQ/g, 'Protege vidas con SafeWork 4.0 en TECTROMAQ');
app = app.replace(/protocolo exacto que ejecuta TECTROMAQ/g, 'protocolo exacto que ejecuta SafeWork 4.0 en TECTROMAQ');
app = app.replace(
  /<strong style=\{\{ color: 'var\(--color-primary-400\)'\}\}>TECTROMAQ Santo Domingo<\/strong>/g,
  `<strong style={{ color: 'var(--color-primary-400)'}}>SafeWork 4.0 en TECTROMAQ Santo Domingo</strong>`
);
fs.writeFileSync('src/App.jsx', app, 'utf8');

// 2. In scripts/build-standalone.mjs
let builder = fs.readFileSync('scripts/build-standalone.mjs', 'utf8');
builder = builder.replace(
  /<title>\${pageTitle} \| TECTROMAQ — Poka-Yoke SST<\/title>/g,
  '<title>${pageTitle} | SafeWork 4.0 en TECTROMAQ</title>'
);
fs.writeFileSync('scripts/build-standalone.mjs', builder, 'utf8');

// 3. In server/server.mjs
let server = fs.readFileSync('server/server.mjs', 'utf8');
server = server.replace(
  /TECTROMAQ \(SQLITE DATABASE & MULTI-PAGE SERVER\)/g,
  'SafeWork 4.0 en TECTROMAQ (SQLITE DATABASE & MULTI-PAGE SERVER)'
);
fs.writeFileSync('server/server.mjs', server, 'utf8');

// 4. In Module1Normativa.jsx
let mod1 = fs.readFileSync('src/components/Module1Normativa.jsx', 'utf8');
mod1 = mod1.replace(/Aplicación Directa en TECTROMAQ/g, 'Aplicación Directa en SafeWork 4.0 en TECTROMAQ');
fs.writeFileSync('src/components/Module1Normativa.jsx', mod1, 'utf8');

// 5. In Module2Checklists.jsx
let mod2 = fs.readFileSync('src/components/Module2Checklists.jsx', 'utf8');
mod2 = mod2.replace(/política interna de TECTROMAQ/g, 'política interna de SafeWork 4.0 en TECTROMAQ');
fs.writeFileSync('src/components/Module2Checklists.jsx', mod2, 'utf8');

// 6. In Module5Capacitacion.jsx
let mod5 = fs.readFileSync('src/components/Module5Capacitacion.jsx', 'utf8');
mod5 = mod5.replace(
  /<div class="sub">República Dominicana • Sistema TECTROMAQ<\/div>/g,
  '<div class="sub">República Dominicana • SafeWork 4.0 en TECTROMAQ</div>'
);
fs.writeFileSync('src/components/Module5Capacitacion.jsx', mod5, 'utf8');

// 7. In initialData.js
let data = fs.readFileSync('src/data/initialData.js', 'utf8');
data = data.replace(/\/\/ Datos iniciales para TECTROMAQ/g, '// Datos iniciales para SafeWork 4.0 en TECTROMAQ');
data = data.replace(/autorizaciones del sistema TECTROMAQ\./g, 'autorizaciones del sistema SafeWork 4.0 en TECTROMAQ.');
data = data.replace(/los 6 módulos de TECTROMAQ\./g, 'los 6 módulos de SafeWork 4.0 en TECTROMAQ.');
data = data.replace(/generado por TECTROMAQ\./g, 'generado por SafeWork 4.0 en TECTROMAQ.');
fs.writeFileSync('src/data/initialData.js', data, 'utf8');

console.log('Successfully set name to: SafeWork 4.0 en TECTROMAQ');
