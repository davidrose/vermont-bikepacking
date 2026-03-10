import re
import os

with open('/Users/davidrose/.gemini/antigravity/playground/crystal-filament/styles.css', 'r') as f:
    css = f.read()
    
if '.svg-icon' not in css:
    css += """
.timeline-svg {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  background: #1a1a1a;
  border-radius: 50%;
  color: #fff;
  border: 2px solid #fff;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  margin-right: -2px;
}
.timeline-svg svg {
  width: 14px;
  height: 14px;
}
"""
    with open('/Users/davidrose/.gemini/antigravity/playground/crystal-filament/styles.css', 'w') as f:
        f.write(css.replace('.timeline-emoji', '/* replaced */'))

SVGS = {
    'camp': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M12 3l9 18M12 3L3 21m9-18v18"/></svg>',
    'food': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3"/></svg>',
    'swim': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12c-2.66 0-2.66-2-5.33-2-2.66 0-2.66 2-5.33 2-2.66 0-2.66-2-5.33-2-2.66 0-2.66 2-5.34 2M22 18c-2.66 0-2.66-2-5.33-2-2.66 0-2.66 2-5.33 2-2.66 0-2.66-2-5.33-2-2.66 0-2.66 2-5.34 2"/></svg>',
    'park': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    'ferry': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 17.5a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0M2 15h20l-1-6H3l-1 6z"/><path d="M10 9V5"/><path d="M14 9V5"/><path d="M7 5h10"/></svg>',
    'bike': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2"/></svg>',
    'bridge': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22V8a8 8 0 0 1 16 0v14M2 14h20M2 18h20m-13-4v8m6-8v8"/></svg>',
    'point': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/></svg>',
    'finish': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"/></svg>'
}

EMOJI_TO_TYPE = {
    '⛺': 'camp', '🍽': 'food', '🥪': 'food', '🥐': 'food', '🍺': 'food',
    '☕': 'food', '🏪': 'food', '🅿️': 'park', '⛴️': 'ferry', '🏊': 'swim',
    '🚲': 'bike', '📍': 'point', '🎉': 'finish', '🌉': 'bridge'
}

with open('/Users/davidrose/.gemini/antigravity/playground/crystal-filament/index.html', 'r') as f:
    html = f.read()

def repl_html(m):
    t = EMOJI_TO_TYPE.get(m.group(1), 'point')
    return f'<span class="timeline-svg">{SVGS[t]}</span>'

html = re.sub(r'<span class="timeline-emoji">(.*?)</span>', repl_html, html)
with open('/Users/davidrose/.gemini/antigravity/playground/crystal-filament/index.html', 'w') as f:
    f.write(html)

with open('/Users/davidrose/.gemini/antigravity/playground/crystal-filament/script.js', 'r') as f:
    js = f.read()

# Update map style to CartoDB Positron
js = re.sub(r'https://\{s\}\.tile\.opentopomap\.org/\{z\}/\{x\}/\{y\}\.png', r'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', js)
js = re.sub(r'OpenTopoMap', r'CartoDB', js)

# Inject svgIcons object
if 'const svgIcons = {' not in js:
    svg_js = 'const svgIcons = {\n' + ',\n'.join(f"  {k}: `{v}`" for k,v in SVGS.items()) + '\n};\n\n'
    js = js.replace('const trailColor =', svg_js + 'const trailColor =')

# Update makeIcon function definition perfectly
def replace_make_icon(match):
    return """function makeIcon(type, size) {
  const s = size || 16;
  const discSize = s + 14;
  const svg = svgIcons[type] || svgIcons.point;
  return L.divIcon({
    html: `<div style="width:${discSize}px;height:${discSize}px;background:#1a1a1a;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 8px rgba(0,0,0,0.4);border:2px solid #fff;"><div style="width:${s}px;height:${s}px;color:#fff">${svg}</div></div>`,
    className: 'svg-marker',
    iconSize: [discSize, discSize],
    iconAnchor: [discSize / 2, discSize / 2]
  });
}"""

js = re.sub(r'function makeIcon\(emoji, size\)\s*\{.*?\n\}', replace_make_icon, js, flags=re.DOTALL)

# Update emoji usages in L.marker
def repl_js(m):
    t = EMOJI_TO_TYPE.get(m.group(1), 'point')
    return f"makeIcon('{t}',"
js = re.sub(r"makeIcon\('([^']+)',", repl_js, js)

# Update line animation in addRoute
def replace_add_route(match):
    return """function addRoute(map, coords, color, dashed) {
  const outline = L.polyline(coords, {
    color: '#000', weight: 8, opacity: 0.15,
    lineCap: 'round', lineJoin: 'round'
  }).addTo(map);

  const line = L.polyline(coords, {
    color: color, weight: 5, opacity: 0.9,
    dashArray: dashed ? '8,8' : null,
    lineCap: 'round', lineJoin: 'round'
  }).addTo(map);

  setTimeout(() => {
    const el = line._path;
    const outEl = outline._path;
    if (el && outEl) {
      const len = el.getTotalLength() + 50; // extra buffer
      
      // animate main line
      el.style.strokeDasharray = `${len} ${len}`;
      el.style.strokeDashoffset = len;
      
      // animate outline
      outEl.style.strokeDasharray = `${len} ${len}`;
      outEl.style.strokeDashoffset = len;
      
      el.getBoundingClientRect(); // flush layout
      
      el.style.transition = 'stroke-dashoffset 2s cubic-bezier(0.3, 0.1, 0.3, 1)';
      outEl.style.transition = 'stroke-dashoffset 2s cubic-bezier(0.3, 0.1, 0.3, 1)';
      
      el.style.strokeDashoffset = '0';
      outEl.style.strokeDashoffset = '0';
      
      // if dashed, restore dashes after animation completes
      if(dashed) {
        setTimeout(() => { el.style.strokeDasharray = '8,8'; }, 2000);
      }
    }
  }, 300);

  return line;
}"""

js = re.sub(r'function addRoute\(map, coords, color, dashed\)\s*\{.*?\n\}', replace_add_route, js, flags=re.DOTALL)

with open('/Users/davidrose/.gemini/antigravity/playground/crystal-filament/script.js', 'w') as f:
    f.write(js)
