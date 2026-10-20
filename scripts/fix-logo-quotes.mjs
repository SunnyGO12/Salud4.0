import fs from 'fs';

const buffer = fs.readFileSync('public/tectromaq-logo.png');
const base64 = buffer.toString('base64');
const dataUri = `data:image/png;base64,${base64}`;
const fileContent = `export const TECTROMAQ_LOGO = "${dataUri}";\n`;

fs.writeFileSync('src/data/tectromaqLogo.js', fileContent, 'utf8');
console.log('Successfully wrote src/data/tectromaqLogo.js with proper quotes. Length:', fileContent.length);
