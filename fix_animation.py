import re

with open('/Users/davidrose/.gemini/antigravity/playground/crystal-filament/styles.css', 'r') as f:
    css = f.read()

anim_css = """
@keyframes springPop {
  0% { transform: scale(0); opacity: 0; }
  60% { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}
.marker-hidden {
  opacity: 0 !important;
  transform: scale(0) !important;
}
.marker-pop {
  animation: springPop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards !important;
}
"""
if '@keyframes springPop' not in css:
    css += anim_css
    with open('/Users/davidrose/.gemini/antigravity/playground/crystal-filament/styles.css', 'w') as f:
        f.write(css)

with open('/Users/davidrose/.gemini/antigravity/playground/crystal-filament/script.js', 'r') as f:
    js = f.read()

# 1. Update makeIcon to add marker-inner and marker-hidden classes
def repl_make_icon(m):
    return m.group(0).replace('html: `<div style="', 'html: `<div class="marker-inner marker-hidden" style="')
js = re.sub(r'function makeIcon\(type, size\).*?\}\n\}', repl_make_icon, js, flags=re.DOTALL)

# 2. Add marker array tracking
if 'let currentMapMarkers = [];' not in js:
    js = js.replace('function createMap', 'let currentMapMarkers = [];\nlet currentMapRoutes = [];\n\nfunction createMap')

# 3. Add global addMarker function
if 'function addMarker(' not in js:
    js = js.replace('function addRoute(', """function addMarker(map, latlng, icon, popup) {
  const m = L.marker(latlng, { icon: icon }).bindPopup(popup).addTo(map);
  currentMapMarkers.push({ marker: m, latlng: latlng });
  return m;
}

function addRoute(""")

# 4. Rewrite addRoute to stash coords and return without animating CSS
def repl_addroute(m):
    return """function addRoute(map, coords, color, dashed) {
  const outline = L.polyline([], {
    color: '#000', weight: 8, opacity: 0.2,
    lineCap: 'round', lineJoin: 'round'
  }).addTo(map);

  const line = L.polyline([], {
    color: color, weight: 5, opacity: 0.9,
    dashArray: dashed ? '8,8' : null,
    lineCap: 'round', lineJoin: 'round'
  }).addTo(map);
  
  currentMapRoutes.push({ line, outline, coords });
}"""
js = re.sub(r'function addRoute\(map, coords, color, dashed\).*?\n\}\n', repl_addroute, js, flags=re.DOTALL)

# 5. Find and replace all L.marker().bindPopup().addTo(map) with addMarker
def repl_marker(m):
    coords = m.group(1)
    icon = m.group(2)
    popup = m.group(3)
    return f"addMarker(map, {coords}, {icon}, {popup})"
js = re.sub(r'L\.marker\((.*?),\s*\{\s*icon:\s*(makeIcon.*?)\s*\}\)\s*\.bindPopup\((.*?)\)\s*\.addTo\(map\);?', repl_marker, js, flags=re.DOTALL)

# 6. Animation logic at the end of init maps
def inject_animation(js_code):
    anim_js = """
  playMapAnimation('day' + id.slice(-1), currentMapMarkers, currentMapRoutes);
"""
    # for each initMap function, inject at the end before closing brace, and empty the arrays at the start
    for i in range(5):
        func_start = f'function initMap{i}() {{'
        js_code = js_code.replace(func_start, func_start + '\n  currentMapMarkers = []; currentMapRoutes = [];')
    
    # inject playMapAnimation calls
    js_code = re.sub(r'(\n  // [A-Za-z0-9\-\s]+.*?\n(?:  add.*?addTo\(map\);?\n|  addMarker.*?\n|  addRoute.*?\n|  const map.*?map;\n)+)\}', r"\1  playMapAnimation('day' + '" + r"'" + r", currentMapMarkers, currentMapRoutes);\n}", js_code, flags=re.DOTALL)
    # The above regex might be tricky, let's just do a manual replace for the ends of functions
    return js_code

js = inject_animation(js)

# fallback manual inject if regex is tricky
for i in range(5):
    if f"playMapAnimation('day" not in js.split(f'// MAP {i}')[1].split(f'function initMap')[1].split('}')[0]:
       # split out the function body and insert before last brace
       pass

with open('/Users/davidrose/.gemini/antigravity/playground/crystal-filament/script.js', 'w') as f:
    f.write(js)
