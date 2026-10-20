import fs from 'fs';

// Paleta de colores adaptada a la identidad oficial de TECTROMAQ
// Azul marino institucional oscuro (#0d1b2a / #1b2a47) con blanco puro y acentos de ingeniería
const COLORS = {
  slate: {
    50: '#0d1b2a',
    100: '#1b2a47',
    200: '#23385d',
    300: '#324a75',
    400: '#466292',
    500: '#647ea9',
    600: '#8ba2c7',
    700: '#b8c9e4',
    800: '#e2ebf8',
    900: '#f0f4fa',
    950: '#ffffff'
  },
  zinc: {
    50: '#0d1b2a',
    100: '#1b2a47',
    200: '#23385d',
    300: '#324a75',
    400: '#466292',
    500: '#647ea9',
    600: '#8ba2c7',
    700: '#b8c9e4',
    800: '#e2ebf8',
    900: '#f0f4fa',
    950: '#ffffff'
  },
  amber: {
    200: '#78350f',
    300: '#92400e',
    400: '#b45309',
    500: '#f59e0b',
    600: '#d97706',
    900: '#fef3c7',
    950: '#fffbeb'
  },
  emerald: {
    200: '#064e3b',
    300: '#065f46',
    400: '#047857',
    500: '#10b981',
    600: '#059669',
    900: '#d1fae5',
    950: '#ecfdf5'
  },
  rose: {
    200: '#881337',
    300: '#9f1239',
    400: '#be123c',
    500: '#ef4444',
    600: '#dc2626',
    900: '#fee2e2',
    950: '#fef2f2'
  },
  sky: {
    300: '#0c4a6e',
    400: '#0284c7',
    500: '#0ea5e9',
    600: '#0284c7',
    900: '#e0f2fe',
    950: '#f0f9ff'
  },
  indigo: {
    300: '#1e3a8a',
    400: '#2563eb',
    500: '#1d4ed8',
    600: '#1e40af',
    900: '#dbeafe',
    950: '#eff6ff'
  },
  white: '#ffffff',
  black: '#0d1b2a',
  transparent: 'transparent'
};

const SPACING = {
  '0': '0px',
  '0.5': '0.125rem',
  '1': '0.25rem',
  '1.5': '0.375rem',
  '2': '0.5rem',
  '2.5': '0.625rem',
  '3': '0.75rem',
  '3.5': '0.875rem',
  '4': '1rem',
  '5': '1.25rem',
  '6': '1.5rem',
  '7': '1.75rem',
  '8': '2rem',
  '9': '2.25rem',
  '10': '2.5rem',
  '11': '2.75rem',
  '12': '3rem',
  '14': '3.5rem',
  '16': '4rem',
  '20': '5rem',
  '24': '6rem',
  '28': '7rem',
  '32': '8rem',
  '36': '9rem',
  '40': '10rem',
  '48': '12rem',
  '56': '14rem',
  '64': '16rem',
  '72': '18rem',
  '80': '20rem',
  '96': '24rem',
  'px': '1px',
  'full': '100%',
  'screen': '100vh'
};

function hexToRgba(hex, alpha) {
  if (!hex || hex === 'transparent') return 'transparent';
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function resolveColor(colorSpec) {
  let [colorPart, alphaPart] = colorSpec.split('/');
  let alpha = alphaPart ? parseInt(alphaPart, 10) / 100 : 1;

  if (colorPart === 'white') return alpha < 1 ? hexToRgba('#ffffff', alpha) : '#ffffff';
  if (colorPart === 'black') return alpha < 1 ? hexToRgba('#4d1d6a', alpha) : '#4d1d6a';
  if (colorPart === 'transparent') return 'transparent';

  const parts = colorPart.split('-');
  if (parts.length === 2) {
    const [palette, shade] = parts;
    const shadeNum = parseInt(shade, 10);

    if ((palette === 'slate' || palette === 'zinc') && shadeNum >= 800 && alpha < 1) {
      if (shadeNum === 950) return hexToRgba('#ffffff', Math.max(alpha, 0.96));
      if (shadeNum === 900) return hexToRgba('#ffffff', Math.max(alpha, 0.95));
      if (shadeNum === 800) return hexToRgba('#d3ffe5', Math.max(alpha, 0.85));
    }

    if ((palette === 'amber' || palette === 'emerald' || palette === 'rose' || palette === 'sky' || palette === 'indigo') && shadeNum === 500 && alpha <= 0.3) {
      const hex = COLORS[palette]?.[shade];
      if (hex) return hexToRgba(hex, Math.min(alpha * 1.4, 0.28));
    }

    const hex = COLORS[palette]?.[shade];
    if (hex) {
      return alpha < 1 ? hexToRgba(hex, alpha) : hex;
    }
  }
  return null;
}

function escapeSelector(cls) {
  return cls.replace(/([:/[\].#%(),])/g, '\\$1');
}

function generateRuleForToken(baseToken) {
  if (baseToken === 'flex') return 'display: flex;';
  if (baseToken === 'inline-flex') return 'display: inline-flex;';
  if (baseToken === 'grid') return 'display: grid;';
  if (baseToken === 'block') return 'display: block;';
  if (baseToken === 'inline-block') return 'display: inline-block;';
  if (baseToken === 'hidden') return 'display: none;';
  if (baseToken === 'relative') return 'position: relative;';
  if (baseToken === 'absolute') return 'position: absolute;';
  if (baseToken === 'fixed') return 'position: fixed;';
  if (baseToken === 'sticky') return 'position: sticky;';
  if (baseToken === 'inset-0') return 'top: 0; right: 0; bottom: 0; left: 0;';

  const posMatch = baseToken.match(/^(-?)(top|bottom|left|right)-([0-9.]+|px|full)$/);
  if (posMatch && SPACING[posMatch[3]]) {
    const neg = posMatch[1] === '-' ? '-' : '';
    return `${posMatch[2]}: ${neg}${SPACING[posMatch[3]]};`;
  }
  if (baseToken === 'top-1/2') return 'top: 50%;';
  if (baseToken === '-translate-y-1/2') return 'transform: translateY(-50%);';

  if (baseToken === 'z-10') return 'z-index: 10;';
  if (baseToken === 'z-20') return 'z-index: 20;';
  if (baseToken === 'z-30') return 'z-index: 30;';
  if (baseToken === 'z-40') return 'z-index: 40;';
  if (baseToken === 'z-50') return 'z-index: 200;';

  if (baseToken === 'flex-col') return 'flex-direction: column;';
  if (baseToken === 'flex-row') return 'flex-direction: row;';
  if (baseToken === 'flex-wrap') return 'flex-wrap: wrap;';
  if (baseToken === 'flex-1') return 'flex: 1 1 0%;';
  if (baseToken === 'shrink-0') return 'flex-shrink: 0;';
  if (baseToken === 'items-center') return 'align-items: center;';
  if (baseToken === 'items-start') return 'align-items: flex-start;';
  if (baseToken === 'items-end') return 'align-items: flex-end;';
  if (baseToken === 'items-stretch') return 'align-items: stretch;';
  if (baseToken === 'justify-between') return 'justify-content: space-between;';
  if (baseToken === 'justify-center') return 'justify-content: center;';
  if (baseToken === 'justify-end') return 'justify-content: flex-end;';
  if (baseToken === 'justify-start') return 'justify-content: flex-start;';

  const gridColsMatch = baseToken.match(/^grid-cols-(\d+)$/);
  if (gridColsMatch) {
    return `grid-template-columns: repeat(${gridColsMatch[1]}, minmax(0, 1fr));`;
  }
  const colSpanMatch = baseToken.match(/^col-span-(\d+)$/);
  if (colSpanMatch) {
    return `grid-column: span ${colSpanMatch[1]} / span ${colSpanMatch[1]};`;
  }

  const gapMatch = baseToken.match(/^gap-([0-9.]+)$/);
  if (gapMatch && SPACING[gapMatch[1]]) {
    return `gap: ${SPACING[gapMatch[1]]};`;
  }

  const spaceYMatch = baseToken.match(/^space-y-([0-9.]+)$/);
  if (spaceYMatch && SPACING[spaceYMatch[1]]) {
    return `--tw-space-y: ${SPACING[spaceYMatch[1]]};`;
  }

  const padMatch = baseToken.match(/^(p|px|py|pt|pb|pl|pr)-([0-9.]+)$/);
  if (padMatch && SPACING[padMatch[2]]) {
    const val = SPACING[padMatch[2]];
    const dir = padMatch[1];
    if (dir === 'p') return `padding: ${val};`;
    if (dir === 'px') return `padding-left: ${val}; padding-right: ${val};`;
    if (dir === 'py') return `padding-top: ${val}; padding-bottom: ${val};`;
    if (dir === 'pt') return `padding-top: ${val};`;
    if (dir === 'pb') return `padding-bottom: ${val};`;
    if (dir === 'pl') return `padding-left: ${val};`;
    if (dir === 'pr') return `padding-right: ${val};`;
  }

  if (baseToken === 'mx-auto') return 'margin-left: auto; margin-right: auto;';
  if (baseToken === 'ml-auto') return 'margin-left: auto;';
  const marMatch = baseToken.match(/^(m|mx|my|mt|mb|ml|mr)-([0-9.]+)$/);
  if (marMatch && SPACING[marMatch[2]]) {
    const val = SPACING[marMatch[2]];
    const dir = marMatch[1];
    if (dir === 'm') return `margin: ${val};`;
    if (dir === 'mx') return `margin-left: ${val}; margin-right: ${val};`;
    if (dir === 'my') return `margin-top: ${val}; margin-bottom: ${val};`;
    if (dir === 'mt') return `margin-top: ${val};`;
    if (dir === 'mb') return `margin-bottom: ${val};`;
    if (dir === 'ml') return `margin-left: ${val};`;
    if (dir === 'mr') return `margin-right: ${val};`;
  }

  if (baseToken === 'w-full') return 'width: 100%;';
  if (baseToken === 'h-full') return 'height: 100%;';
  if (baseToken === 'min-h-screen') return 'min-height: 100vh;';
  if (baseToken === 'min-w-0') return 'min-width: 0px;';
  if (baseToken === 'max-w-md') return 'max-width: 28rem;';
  if (baseToken === 'max-w-lg') return 'max-width: 32rem;';
  if (baseToken === 'max-w-xl') return 'max-width: 36rem;';
  if (baseToken === 'max-w-2xl') return 'max-width: 42rem;';
  if (baseToken === 'max-w-3xl') return 'max-width: 48rem;';
  if (baseToken === 'max-w-4xl') return 'max-width: 56rem;';
  if (baseToken === 'max-w-5xl') return 'max-width: 64rem;';
  if (baseToken === 'max-w-7xl') return 'max-width: 80rem;';
  if (baseToken === 'max-w-[1440px]') return 'max-width: 1440px;';
  if (baseToken === 'max-w-[260px]') return 'max-width: 260px;';
  if (baseToken === 'max-w-[92vw]') return 'max-width: 92vw;';
  if (baseToken === 'max-h-[90vh]') return 'max-height: 85vh;';
  if (baseToken === 'max-h-[88vh]') return 'max-height: 85vh;';
  if (baseToken === 'max-h-[85vh]') return 'max-height: 85vh;';
  if (baseToken === 'max-h-[80vh]') return 'max-height: 80vh;';
  const maxHVhMatch = baseToken.match(/^max-h-\[(\d+)vh\]$/);
  if (maxHVhMatch) return `max-height: ${maxHVhMatch[1]}vh;`;
  if (baseToken === 'min-w-[600px]') return 'min-width: 600px;';

  const whMatch = baseToken.match(/^(w|h)-([0-9.]+|px|full|screen)$/);
  if (whMatch && SPACING[whMatch[2]]) {
    const prop = whMatch[1] === 'w' ? 'width' : 'height';
    return `${prop}: ${SPACING[whMatch[2]]};`;
  }

  if (baseToken === 'font-sans') return "font-family: 'Helvetica Neue LT Pro Roman', 'Plus Jakarta Sans', 'Inter', system-ui, sans-serif;";
  if (baseToken === 'font-mono') return "font-family: 'JetBrains Mono', monospace;";
  if (baseToken === 'font-display') return "font-family: larken, 'Fraunces', Georgia, serif;";
  if (baseToken === 'font-medium') return "font-family: 'Helvetica Neue LT Pro Medium', 'Plus Jakarta Sans', sans-serif; font-weight: 500;";
  if (baseToken === 'font-semibold') return 'font-weight: 600;';
  if (baseToken === 'font-bold') return "font-family: 'Helvetica Neue LT Pro Bold', 'Plus Jakarta Sans', sans-serif; font-weight: 700;";
  if (baseToken === 'font-extrabold') return 'font-weight: 800;';
  if (baseToken === 'font-black') return 'font-weight: 900;';
  if (baseToken === 'italic') return 'font-style: italic;';
  if (baseToken === 'uppercase') return 'text-transform: uppercase;';
  if (baseToken === 'underline') return 'text-decoration: underline;';
  if (baseToken === 'line-through') return 'text-decoration: line-through;';
  if (baseToken === 'truncate') return 'overflow: hidden; text-overflow: ellipsis; white-space: nowrap;';
  if (baseToken === 'whitespace-nowrap') return 'white-space: nowrap;';
  if (baseToken === 'whitespace-pre-line') return 'white-space: pre-line;';
  if (baseToken === 'text-left') return 'text-align: left;';
  if (baseToken === 'text-center') return 'text-align: center;';
  if (baseToken === 'text-right') return 'text-align: right;';
  if (baseToken === 'leading-none') return 'line-height: 1;';
  if (baseToken === 'leading-tight') return 'line-height: 1.15;';
  if (baseToken === 'leading-snug') return 'line-height: 1.35;';
  if (baseToken === 'leading-relaxed') return 'line-height: 1.6;';
  if (baseToken === 'tracking-tight') return 'letter-spacing: -0.02em;';
  if (baseToken === 'tracking-wide') return 'letter-spacing: 0.025em;';
  if (baseToken === 'tracking-wider') return 'letter-spacing: 0.05em;';
  if (baseToken === 'tracking-widest') return 'letter-spacing: 0.1em;';

  const textSizes = {
    'xs': 'font-size: 0.78rem; line-height: 1.1rem;',
    'sm': 'font-size: 0.9rem; line-height: 1.35rem;',
    'base': 'font-size: 1rem; line-height: 1.5rem;',
    'lg': 'font-size: 1.125rem; line-height: 1.65rem;',
    'xl': 'font-size: 1.25rem; line-height: 1.75rem;',
    '2xl': 'font-size: 1.5rem; line-height: 1.9rem;',
    '3xl': 'font-size: 1.875rem; line-height: 2.2rem;',
    '4xl': 'font-size: 2.35rem; line-height: 2.6rem;',
    '5xl': 'font-size: 3rem; line-height: 1.08;'
  };
  const textMatch = baseToken.match(/^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl)$/);
  if (textMatch) return textSizes[textMatch[1]];

  const textPxMatch = baseToken.match(/^text-\[(\d+)px\]$/);
  if (textPxMatch) {
    return `font-size: ${textPxMatch[1]}px; line-height: 1.35;`;
  }

  if (baseToken.startsWith('text-')) {
    const colorVal = resolveColor(baseToken.slice(5));
    if (colorVal) return `color: ${colorVal};`;
  }

  if (baseToken.startsWith('bg-')) {
    const colorVal = resolveColor(baseToken.slice(3));
    if (colorVal) return `background-color: ${colorVal};`;
  }

  if (baseToken === 'bg-gradient-to-r') return 'background-image: linear-gradient(to right, var(--tw-gradient-from, #d3ffe5), var(--tw-gradient-to, #dcffd3));';
  if (baseToken === 'bg-gradient-to-br') return 'background-image: linear-gradient(to bottom right, var(--tw-gradient-from, #d3ffe5), var(--tw-gradient-to, #ffffff));';
  if (baseToken.startsWith('from-')) {
    const c = resolveColor(baseToken.slice(5));
    if (c) return `--tw-gradient-from: ${c};`;
  }
  if (baseToken.startsWith('via-')) {
    const c = resolveColor(baseToken.slice(4));
    if (c) return `--tw-gradient-via: ${c};`;
  }
  if (baseToken.startsWith('to-')) {
    const c = resolveColor(baseToken.slice(3));
    if (c) return `--tw-gradient-to: ${c};`;
  }

  if (baseToken === 'border') return 'border-width: 1.5px; border-style: solid;';
  if (baseToken === 'border-2') return 'border-width: 2px; border-style: solid;';
  if (baseToken === 'border-t') return 'border-top-width: 1.5px; border-top-style: solid;';
  if (baseToken === 'border-b') return 'border-bottom-width: 1.5px; border-bottom-style: solid;';
  if (baseToken === 'border-l-4') return 'border-left-width: 4px; border-left-style: solid;';
  if (baseToken === 'border-dashed') return 'border-style: dashed;';
  if (baseToken.startsWith('border-')) {
    const colorVal = resolveColor(baseToken.slice(7));
    if (colorVal) return `border-color: ${colorVal};`;
  }

  if (baseToken === 'rounded') return 'border-radius: 0.5rem;';
  if (baseToken === 'rounded-md') return 'border-radius: 0.65rem;';
  if (baseToken === 'rounded-lg') return 'border-radius: 0.85rem;';
  if (baseToken === 'rounded-xl') return 'border-radius: 1.25rem;';
  if (baseToken === 'rounded-2xl') return 'border-radius: 1.75rem;';
  if (baseToken === 'rounded-3xl') return 'border-radius: 2.25rem;';
  if (baseToken === 'rounded-full') return 'border-radius: 9999px;';

  if (baseToken === 'shadow-sm') return 'box-shadow: 0 2px 6px rgba(77, 29, 106, 0.05);';
  if (baseToken === 'shadow-md') return 'box-shadow: 0 6px 16px -3px rgba(77, 29, 106, 0.08);';
  if (baseToken === 'shadow-lg') return 'box-shadow: 0 12px 24px -4px rgba(77, 29, 106, 0.1);';
  if (baseToken === 'shadow-xl') return 'box-shadow: 0 18px 36px -6px rgba(77, 29, 106, 0.12);';
  if (baseToken === 'shadow-2xl') return 'box-shadow: 0 24px 48px -10px rgba(77, 29, 106, 0.15);';

  if (baseToken === 'backdrop-blur-md') return 'backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);';
  if (baseToken === 'backdrop-blur-xl') return 'backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);';
  if (baseToken === 'backdrop-blur-sm') return 'backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);';

  if (baseToken === 'overflow-hidden') return 'overflow: hidden;';
  if (baseToken === 'overflow-x-auto') return 'overflow-x: auto;';
  if (baseToken === 'overflow-y-auto') return 'overflow-y: auto;';

  if (baseToken === 'cursor-pointer') return 'cursor: pointer;';
  if (baseToken === 'cursor-crosshair') return 'cursor: crosshair;';
  if (baseToken === 'pointer-events-none') return 'pointer-events: none;';
  if (baseToken === 'select-none') return 'user-select: none;';
  if (baseToken === 'touch-none') return 'touch-action: none;';
  if (baseToken === 'object-cover') return 'object-fit: cover;';
  if (baseToken === 'antialiased') return '-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;';

  if (baseToken === 'transition-all') return 'transition: all 0.45s cubic-bezier(.3, 1, .3, 1);';
  if (baseToken === 'transition-colors') return 'transition: color 0.35s cubic-bezier(.3, 1, .3, 1), background-color 0.35s cubic-bezier(.3, 1, .3, 1), border-color 0.35s cubic-bezier(.3, 1, .3, 1);';
  if (baseToken === 'transition-transform') return 'transition: transform 0.5s cubic-bezier(.5, 1.5, .5, 1);';
  if (baseToken === 'duration-300') return 'transition-duration: 300ms;';
  if (baseToken === 'duration-500') return 'transition-duration: 500ms;';
  if (baseToken === 'scale-[1.01]') return 'transform: scale(1.01);';

  if (baseToken === 'opacity-0') return 'opacity: 0;';
  if (baseToken === 'opacity-40') return 'opacity: 0.4;';
  if (baseToken === 'opacity-50') return 'opacity: 0.5;';
  if (baseToken === 'opacity-60') return 'opacity: 0.6;';
  if (baseToken === 'opacity-75') return 'opacity: 0.75;';
  if (baseToken === 'opacity-80') return 'opacity: 0.8;';
  if (baseToken === 'opacity-100') return 'opacity: 1;';

  if (baseToken === 'animate-ping') return 'animation: ping 1.4s cubic-bezier(0, 0, 0.2, 1) infinite;';
  if (baseToken === 'animate-pulse') return 'animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;';
  if (baseToken === 'outline-none') return 'outline: 2px solid transparent; outline-offset: 2px;';

  return null;
}

export function compileProjectCSS(files) {
  const tokenSet = new Set();

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const regex = /className\s*=\s*(?:["']([^"']+)["']|\{`([^`]+)`\})/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      const raw = match[1] || match[2] || '';
      const cleaned = raw.replace(/\$\{[^}]+\}/g, ' ');
      for (const tok of cleaned.split(/\s+/)) {
        if (tok && !tok.includes('${') && !tok.includes('?') && !tok.includes(':')) {
          tokenSet.add(tok.replace(/['"`,]/g, ''));
        } else if (tok && tok.includes(':')) {
          const cleanTok = tok.replace(/['"`,]/g, '');
          if (/^(sm|md|lg|xl|hover|focus|group-hover):/.test(cleanTok)) {
            tokenSet.add(cleanTok);
          }
        }
      }
      const exprMatches = raw.match(/['"]([^'"]+)['"]/g) || [];
      for (const em of exprMatches) {
        for (const t of em.replace(/['"]/g, '').split(/\s+/)) {
          if (t) tokenSet.add(t);
        }
      }
    }
  }

  let baseCSS = `
/* ==========================================================================
   ALTGAGE EXACT TYPOGRAPHY, COLOR SYSTEM & ANIMATIONS + POKA-YOKE UX
   Inspirado 100% en https://www.altgage.com
   ========================================================================== */

@font-face {
  font-family: 'Helvetica Neue LT Pro Roman';
  src: url("https://cdn.prod.website-files.com/65f83f8a635a7f5faa6409bd/65f955567e24e080b0c413e3_HelveticaNeueLTPro-Roman.woff2") format("woff2"),
       url("https://cdn.prod.website-files.com/65f83f8a635a7f5faa6409bd/65f95556c4c55a7a9e11b09d_HelveticaNeueLTPro-Roman.ttf") format("truetype");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Helvetica Neue LT Pro Medium';
  src: url("https://cdn.prod.website-files.com/65f83f8a635a7f5faa6409bd/66fe9cfcfdc898c6dea64ea4_HelveticaNeueLTPro-Md.woff2") format("woff2"),
       url("https://cdn.prod.website-files.com/65f83f8a635a7f5faa6409bd/66fe9cfc588b75e13f5a29a9_HelveticaNeueLTPro-Md.ttf") format("truetype");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Helvetica Neue LT Pro Bold';
  src: url("https://cdn.prod.website-files.com/65f83f8a635a7f5faa6409bd/65f955757e24e080b0c42a01_HelveticaNeueLTPro-Bd.woff2") format("woff2"),
       url("https://cdn.prod.website-files.com/65f83f8a635a7f5faa6409bd/65f955743098590248af8e81_HelveticaNeueLTPro-Bd.ttf") format("truetype");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

:root {
  --color-dark: #0d1b2a;
  --color-secondary: #1b2a47;
  --color-secondary-300: #23385d;
  --color-secondary-400: #324a75;
  --color-secondary-700: #0a111a;
  --color-secondary-275: #1e3a8a;
  --color-secondary-200: #e2ebf8;

  --color-primary-200: #f0f4fa;
  --color-primary-300: #b8c9e4;
  --color-primary: #1b2a47;
  --color-primary-400: #2563eb;
  --color-primary-700: #0d1b2a;

  --color-melon-400: #d97706;
  --color-blue-400: #0284c7;
  --color-blue-200: #e0f2fe;
  --color-apple-200: #d1fae5;
  --color-yellow-200: #fef3c7;
  --color-yellow-400: #fde047;
  --color-pink-200: #fee2e2;
  --color-aqua-200: #e0f2fe;

  --color-light: #ffffff;
  --color-lightgray: #f1f5f9;
  --color-black: #0d1b2a;

  --border-radius: 0.65em;
  --border-radius-medium: 1.25em;
  --border-radius-large: 1.75em;
  --border-radius-xl: 2.5em;
  --btn-height: 3.1em;

  --animation-primary: 0.4s cubic-bezier(.3, 1, .3, 1);
  --animation-smooth: 0.65s cubic-bezier(.3, 1, .3, 1);
  --animation-bounce: 0.5s cubic-bezier(.5, 1.5, .5, 1);
  --animation-bounce-smooth: 0.7s cubic-bezier(.5, 1.5, .5, 1);
}

*, ::before, ::after {
  box-sizing: border-box;
  border-width: 0;
  border-style: solid;
  border-color: #b8c9e4;
}

html, body {
  margin: 0;
  padding: 0;
  background-color: #f0f4fa;
  color: #0d1b2a;
  font-family: 'Poppins', 'Montserrat', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

a {
  text-decoration: none !important;
  color: inherit;
}

::selection {
  background-color: #1b2a47;
  color: #ffffff;
}

h1, h2, h3, h4, .altgage-serif {
  font-family: 'Montserrat', 'Poppins', -apple-system, sans-serif;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: #0d1b2a;
  margin: 0;
}

/* ==========================================================================
   MINIMALIST POPPINS SLIDE MENU & CIRCULAR COLLAPSE BUTTON (IMAGES 2 & 3)
   ========================================================================== */
.nav-slide-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  pointer-events: none;
}

.nav-slide-inner {
  max-width: 1440px;
  margin: 0 auto;
  padding: 1.25rem 2.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-brand-wordmark {
  pointer-events: auto;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 1.35rem;
  letter-spacing: -0.03em;
  color: #111827;
  text-decoration: none !important;
  transition: opacity 0.35s ease, transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.nav-brand-wordmark[data-hidden="true"] {
  opacity: 0;
  transform: translateY(-24px);
  pointer-events: none;
}

.nav-right-cluster {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: relative;
  pointer-events: auto;
}

/* El contenedor slide horizontal con tipografía Poppins (Imagen 2) */
.nav-poppins-slide {
  display: flex;
  align-items: center;
  gap: 2.25rem;
  background-color: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  padding: 0.85rem 2rem;
  border-radius: 9999px;
  box-shadow: 0 8px 30px rgba(15, 23, 42, 0.07);
  font-family: 'Poppins', sans-serif;
  transform-origin: right center;
  transition:
    transform 0.5s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    visibility 0.35s;
}

/* Cuando se oculta (al hacer scroll), se desliza suavemente hacia la derecha y aparece el botón circular */
.nav-poppins-slide[data-collapsed="true"] {
  transform: translateX(28px) scale(0.88);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  position: absolute;
  right: 0;
}

.nav-poppins-link {
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  font-size: 0.98rem;
  color: #111827;
  text-decoration: none !important;
  white-space: nowrap;
  position: relative;
  padding: 0.2rem 0;
  transition: color 0.2s ease, opacity 0.2s ease;
  cursor: pointer;
}

.nav-poppins-link:hover {
  opacity: 0.65;
}

.nav-poppins-link[data-active="true"] {
  font-weight: 500;
}

.nav-poppins-link[data-active="true"]::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -2px;
  height: 1.5px;
  background-color: #111827;
  border-radius: 2px;
}

.nav-poppins-lang {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  font-size: 0.98rem;
  color: #111827;
  padding-left: 0.5rem;
}

/* Botón flotante de 3 líneas limpias (sin círculo, sin borde, 100% transparente) */
.nav-burger-circle {
  width: auto;
  height: auto;
  min-width: 32px;
  min-height: 32px;
  border-radius: 0;
  background: transparent;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  box-shadow: none;
  border: none;
  outline: none;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  padding: 6px;
  gap: 5px;
  cursor: pointer;
  flex-shrink: 0;
  transition:
    transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.28s cubic-bezier(0.22, 1, 0.36, 1),
    visibility 0.28s;
}

.nav-burger-circle[data-visible="false"] {
  transform: scale(0.6);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  position: absolute;
  right: 0;
}

.nav-burger-circle[data-visible="true"] {
  transform: scale(1);
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.nav-burger-circle:hover {
  transform: scale(1.1);
  background: transparent;
  border: none;
  box-shadow: none;
}

.nav-burger-line {
  height: 2px;
  background-color: #111827;
  border-radius: 2px;
  transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

.nav-burger-line.line-1 {
  width: 18px;
}

/* Línea central ligeramente más corta como en la Imagen 3 */
.nav-burger-line.line-2 {
  width: 12px;
}

.nav-burger-line.line-3 {
  width: 18px;
}

button, input, select, textarea {
  font-family: inherit;
  font-size: 100%;
  line-height: inherit;
  color: var(--color-dark);
  margin: 0;
  padding: 0;
  background: transparent;
}

button {
  cursor: pointer;
}

input, select, textarea {
  background-color: #ffffff !important;
  color: #0d1b2a !important;
  border: 1.5px solid #b8c9e4 !important;
  border-radius: 0.75rem !important;
  font-family: 'Poppins', 'Montserrat', sans-serif;
  transition: all 0.25s cubic-bezier(.3, 1, .3, 1);
}

input:focus, select:focus, textarea:focus {
  border-color: #1b2a47 !important;
  box-shadow: 0 0 0 4px rgba(27, 42, 71, 0.15) !important;
  outline: none !important;
}

/* ==========================================================================
   CLEAN MODERN BUTTON (.alt-btn-clean) — POPPINS & RELIABLE CLICKS
   ========================================================================== */
.alt-btn-clean {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  min-height: 3.15rem;
  padding: 0 1.65rem;
  border-radius: 9999px;
  font-family: 'Poppins', 'Montserrat', sans-serif;
  font-weight: 600;
  font-size: 0.95rem;
  line-height: 1.2;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  text-decoration: none !important;
  background-color: #1b2a47;
  color: #ffffff;
  border: 1.5px solid transparent;
  box-shadow: 0 8px 22px rgba(13, 27, 42, 0.18);
  transition:
    transform 0.25s cubic-bezier(0.22, 1, 0.36, 1),
    background-color 0.25s ease,
    color 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;
}

.alt-btn-clean:hover {
  transform: translateY(-2px);
  background-color: #0d1b2a;
  box-shadow: 0 12px 28px rgba(13, 27, 42, 0.26);
}

.alt-btn-clean:active {
  transform: translateY(0px) scale(0.98);
}

.alt-btn-clean[data-btn-theme="light"] {
  background-color: #ffffff;
  color: #0d1b2a;
  border-color: #b8c9e4;
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.08);
}

.alt-btn-clean[data-btn-theme="light"]:hover {
  background-color: #f0f4fa;
  border-color: #1b2a47;
  box-shadow: 0 12px 28px rgba(27, 42, 71, 0.18);
}

.alt-btn-clean[data-btn-theme="mint"] {
  background-color: #059669;
  color: #ffffff;
  box-shadow: 0 8px 22px rgba(5, 150, 105, 0.25);
}

.alt-btn-clean[data-btn-theme="mint"]:hover {
  background-color: #047857;
  color: #ffffff;
}

.alt-btn-clean[data-btn-theme="orange"] {
  background-color: #d97706;
  color: #ffffff;
}

.alt-btn-clean[data-btn-theme="danger"] {
  background-color: #dc2626;
  color: #ffffff;
}

/* ==========================================================================
   CLEAN PILL STEP SELECTOR (.draw-nav) — POPPINS & NO SCROLLBARS
   ========================================================================== */
.draw-nav {
  background-color: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.4rem;
  gap: 0.5rem;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.95);
}

.draw-nav-toggle {
  width: 2.85rem;
  height: 2.85rem;
  background-color: #f0f4fa;
  color: #0d1b2a;
  border-radius: 9999px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.25s ease;
  border: 1px solid #b8c9e4;
}

.draw-nav-toggle:hover {
  background-color: #1b2a47;
  color: #ffffff;
  border-color: #1b2a47;
}

.draw-nav-select {
  flex: 1 1 auto;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  align-items: center;
  gap: 0.35rem;
  overflow: visible;
}

.draw-nav-select-btn {
  position: relative;
  height: 2.85rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  cursor: pointer;
  padding: 0 1.1rem;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  color: #0d1b2a;
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  border: none;
  background: transparent;
}

.draw-nav-select-btn:hover {
  background-color: rgba(27, 42, 71, 0.08);
}

.draw-nav-select-btn[data-active="true"] {
  background-color: #1b2a47;
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(27, 42, 71, 0.3);
}

.draw-nav-select-btn[data-active="true"][data-theme="purple"] {
  background-color: #0d1b2a;
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(13, 27, 42, 0.35);
}

.draw-nav-select-btn[data-active="true"][data-theme="orange"] {
  background-color: #d97706;
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(217, 119, 6, 0.35);
}

.draw-nav-select-btn[data-active="true"][data-theme="blue"] {
  background-color: #0284c7;
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(2, 132, 199, 0.35);
}

.elipse-draw-svg {
  display: none;
}

/* ==========================================================================
   ALTGAGE LAYERED STACK CARDS (.single-stack)
   ========================================================================== */
.altgage-stack-card {
  border-radius: var(--border-radius-large);
  padding: 2.5rem;
  transition: transform var(--animation-bounce), box-shadow var(--animation-primary);
}

.altgage-stack-green {
  background-color: #0d1b2a;
  color: #ffffff;
}

.altgage-stack-purple {
  background-color: #1b2a47;
  color: #ffffff;
}

.altgage-stack-orange {
  background-color: #d97706;
  color: #ffffff;
}

.altgage-stack-blue {
  background-color: #0284c7;
  color: #ffffff;
}

/* ==========================================================================
   TECTROMAQ PASTEL SCROLL CARDS (.single-scroll-card)
   ========================================================================== */
.altgage-pastel-mint {
  background-color: #f0f4fa;
  color: #0d1b2a;
  border-radius: var(--border-radius-large);
  border: 1.5px solid #b8c9e4;
}

.altgage-pastel-blue {
  background-color: #e0f2fe;
  color: #0d1b2a;
  border-radius: var(--border-radius-large);
  border: 1.5px solid #7dd3fc;
}

.altgage-pastel-apple {
  background-color: #d1fae5;
  color: #0d1b2a;
  border-radius: var(--border-radius-large);
  border: 1.5px solid #6ee7b7;
}

.altgage-pastel-yellow {
  background-color: #fef3c7;
  color: #0d1b2a;
  border-radius: var(--border-radius-large);
  border: 1.5px solid #fde047;
}

.altgage-pastel-purple {
  background-color: #e2ebf8;
  color: #0d1b2a;
  border-radius: var(--border-radius-large);
  border: 1.5px solid #b8c9e4;
}

.altgage-pastel-pink {
  background-color: #fee2e2;
  color: #0d1b2a;
  border-radius: var(--border-radius-large);
  border: 1.5px solid #fca5a5;
}

/* ==========================================================================
   ALTGAGE ROTATING BADGE & INFINITE MARQUEE
   ========================================================================== */
svg g#rotate, .altgage-rotate-slow {
  transform-origin: center center;
  animation: rotate360 14s linear infinite;
}

@keyframes rotate360 {
  to {
    transform: rotate(-360deg);
  }
}

.altgage-marquee-wrap {
  overflow: hidden;
  width: 100%;
  position: relative;
}

.altgage-marquee-track {
  display: flex;
  width: max-content;
  animation: altgageMarquee 26s linear infinite;
}

.altgage-marquee-track:hover {
  animation-play-state: paused;
}

@keyframes altgageMarquee {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}

/* ==========================================================================
   ALTGAGE 15-DAY INTERACTIVE CALENDAR (.calendar-module)
   ========================================================================== */
.altgage-calendar-module {
  border-radius: var(--border-radius-large);
  background-color: var(--color-dark);
  overflow: hidden;
  box-shadow: 0 20px 45px rgba(77, 29, 106, 0.18);
}

.altgage-calendar-body {
  border-radius: var(--border-radius-large);
  background-color: var(--color-primary-400);
  padding: 1.5rem;
}

.altgage-calendar-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  border: 1.5px solid var(--color-dark);
  border-radius: 1rem;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.35);
}

.altgage-calendar-cell {
  aspect-ratio: 1;
  border-right: 1px dashed var(--color-dark);
  border-bottom: 1px dashed var(--color-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  padding: 0.4rem;
  transition: background-color 0.2s ease;
}

.altgage-calendar-cell:hover {
  background-color: rgba(255, 255, 255, 0.45);
}

.altgage-calendar-circle {
  background-color: #e3ffb5;
  color: var(--color-dark);
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.95rem;
  transition: var(--animation-bounce);
}

.altgage-calendar-cell[data-active="true"] .altgage-calendar-circle {
  background-color: var(--color-dark);
  color: #ffffff;
  transform: scale(1.1);
}

/* ==========================================================================
   POKA-YOKE VISUAL SYSTEM (A PRUEBA DE ERRORES)
   ========================================================================== */
.poka-yoke-bar {
  background-color: #ffffff;
  border: 2px solid var(--color-primary);
  border-radius: 1.5rem;
  padding: 1rem 1.4rem;
  box-shadow: 0 8px 24px rgba(55, 206, 142, 0.14);
}

.poka-yoke-step-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.95rem;
  border-radius: 9999px;
  font-weight: 700;
  font-size: 0.82rem;
  transition: var(--animation-bounce);
}

.poka-yoke-step-done {
  background-color: var(--color-primary-200);
  color: var(--color-primary-700);
  border: 1.5px solid var(--color-primary);
}

.poka-yoke-step-current {
  background-color: var(--color-dark);
  color: #ffffff;
  transform: scale(1.03);
}

.poka-yoke-step-pending {
  background-color: #f4fff8;
  color: #702987;
  border: 1.5px dashed #a4f0d0;
}

/* Mapeo de clases existentes para que todos los módulos adopten la identidad TECTROMAQ */
.bg-slate-950 {
  background-color: #f0f4fa !important;
}
.bg-slate-900, .bg-slate-900\\/90, .bg-slate-900\\/80, .bg-slate-900\\/70, .bg-slate-900\\/60, .bg-slate-900\\/50, .bg-zinc-900, .bg-zinc-900\\/90 {
  background-color: #ffffff !important;
  border-color: #b8c9e4 !important;
  box-shadow: 0 10px 28px -6px rgba(13, 27, 42, 0.08);
}
.bg-slate-950\\/90, .bg-slate-950\\/80, .bg-slate-950\\/70, .bg-slate-950\\/60, .bg-slate-950\\/50 {
  background-color: #f8fafc !important;
}
.text-white, .text-slate-100, .text-slate-200 {
  color: #0d1b2a !important;
}
.text-slate-300, .text-slate-400 {
  color: #324a75 !important;
}
.text-slate-500 {
  color: #647ea9 !important;
}

/* Excepción cuando un botón o tarjeta tiene fondo oscuro TECTROMAQ */
.bg-emerald-600, .bg-emerald-500 {
  background-color: #059669 !important;
  color: #ffffff !important;
}
.bg-rose-600, .bg-rose-500 {
  background-color: #dc2626 !important;
  color: #ffffff !important;
}
.bg-amber-500 {
  background-color: #d97706 !important;
  color: #ffffff !important;
}
.bg-sky-500, .bg-sky-600 {
  background-color: #1b2a47 !important;
  color: #ffffff !important;
}
.bg-emerald-600 *, .bg-emerald-500 *, .bg-rose-600 *, .bg-rose-500 *, .bg-sky-500 *, .bg-sky-600 * {
  color: #ffffff !important;
}
.bg-amber-500 * {
  color: #ffffff !important;
}

@keyframes ping {
  75%, 100% { transform: scale(1.8); opacity: 0; }
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .55; }
}

.space-y-1 > :not([hidden]):not(.fixed) ~ :not([hidden]):not(.fixed) { margin-top: 0.25rem; }
.space-y-1\\.5 > :not([hidden]):not(.fixed) ~ :not([hidden]):not(.fixed) { margin-top: 0.375rem; }
.space-y-2 > :not([hidden]):not(.fixed) ~ :not([hidden]):not(.fixed) { margin-top: 0.5rem; }
.space-y-2\\.5 > :not([hidden]):not(.fixed) ~ :not([hidden]):not(.fixed) { margin-top: 0.625rem; }
.space-y-3 > :not([hidden]):not(.fixed) ~ :not([hidden]):not(.fixed) { margin-top: 0.75rem; }
.space-y-4 > :not([hidden]):not(.fixed) ~ :not([hidden]):not(.fixed) { margin-top: 1rem; }
.space-y-5 > :not([hidden]):not(.fixed) ~ :not([hidden]):not(.fixed) { margin-top: 1.25rem; }
.space-y-6 > :not([hidden]):not(.fixed) ~ :not([hidden]):not(.fixed) { margin-top: 1.5rem; }
.space-y-8 > :not([hidden]):not(.fixed) ~ :not([hidden]):not(.fixed) { margin-top: 2rem; }
.space-y-10 > :not([hidden]):not(.fixed) ~ :not([hidden]):not(.fixed) { margin-top: 2.5rem; }
.space-y-12 > :not([hidden]):not(.fixed) ~ :not([hidden]):not(.fixed) { margin-top: 3rem; }
.space-y-14 > :not([hidden]):not(.fixed) ~ :not([hidden]):not(.fixed) { margin-top: 3.5rem; }
.space-y-16 > :not([hidden]):not(.fixed) ~ :not([hidden]):not(.fixed) { margin-top: 4rem; }

/* Overlay modal de pantalla completa limpio (sin huecos arriba, blur suave) */
.fixed.inset-0 {
  margin-top: 0 !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  background-color: rgba(15, 23, 42, 0.55) !important;
  backdrop-filter: blur(8px) !important;
  -webkit-backdrop-filter: blur(8px) !important;
}

/* Inputs, selects y textareas siempre blancos y limpios dentro de formularios */
input.bg-slate-950, select.bg-slate-950, textarea.bg-slate-950 {
  background-color: #ffffff !important;
  border: 1.5px solid #cbd5e1 !important;
  color: #111827 !important;
}
input.bg-slate-950:focus, select.bg-slate-950:focus, textarea.bg-slate-950:focus {
  border-color: var(--color-dark) !important;
  box-shadow: 0 0 0 3px rgba(77, 29, 106, 0.12) !important;
}

/* Alineación vertical exacta de iconos, símbolos y botones junto al texto */
button, label, a, span.inline-flex, div.inline-flex {
  line-height: 1.25;
  vertical-align: middle;
}
button svg, a svg, span svg, h1 svg, h2 svg, h3 svg, h4 svg, label svg, div.flex svg {
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
}
h1.flex, h2.flex, h3.flex, h4.flex, label.flex, span.inline-flex, button.inline-flex {
  display: inline-flex;
  align-items: center;
}
`;

  const mediaBuckets = {
    sm: [],
    md: [],
    lg: [],
    xl: []
  };
  const regularRules = [];

  for (const fullToken of tokenSet) {
    const parts = fullToken.split(':');
    const baseToken = parts[parts.length - 1];
    const prefix = parts.length > 1 ? parts[0] : null;

    const declaration = generateRuleForToken(baseToken);
    if (!declaration) continue;

    const escaped = escapeSelector(fullToken);

    if (!prefix) {
      regularRules.push(`.${escaped} { ${declaration} }`);
    } else if (prefix === 'hover') {
      regularRules.push(`.${escaped}:hover { ${declaration} }`);
    } else if (prefix === 'focus') {
      regularRules.push(`.${escaped}:focus { ${declaration} }`);
    } else if (prefix === 'group-hover') {
      regularRules.push(`.group:hover .${escaped} { ${declaration} }`);
    } else if (mediaBuckets[prefix]) {
      mediaBuckets[prefix].push(`  .${escaped} { ${declaration} }`);
    }
  }

  let out = baseCSS + '\n' + regularRules.join('\n') + '\n';
  const breakpoints = { sm: '640px', md: '768px', lg: '1024px', xl: '1280px' };
  for (const [bp, rules] of Object.entries(mediaBuckets)) {
    if (rules.length > 0) {
      out += `\n@media (min-width: ${breakpoints[bp]}) {\n${rules.join('\n')}\n}\n`;
    }
  }
  return out;
}
