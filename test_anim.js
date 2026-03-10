const routes = [{
  line: {
    getLatLngs: () => [],
    setLatLngs: function(v) { this.val = v; }
  },
  outline: { setLatLngs: function(v) { this.val = v; } },
  coords: [[0,0], [1,1], [2,2]]
}];
const markers = [];

function playMapAnimation(dayId, markers, routes) {
  const TOTAL_DURATION = 5000;
  let totalPoints = 0;
  routes.forEach(route => {
    totalPoints += route.coords.length - 1;
  });
  if (totalPoints === 0) return;
  const timePerSegment = TOTAL_DURATION / totalPoints;
  const timelineSVGs = [];
  let currentRouteIdx = 0;
  let currentSegmentIdx = 0;
  function drawNext() {
    if (currentRouteIdx >= routes.length) return;
    const r = routes[currentRouteIdx];
    const currentLineCoords = r.line.getLatLngs();
    const nextCoord = r.coords[currentSegmentIdx + 1];
    
    // THE BUG:
    // currentLineCoords is [], we push nextCoord. currentLineCoords is [[1,1]]
    // Next time, getLatLngs() returns []! So it pushes nextCoord, it is [[2,2]].
    // So the line is ONLY EVER ONE POINT LONG! (or two, if getLatLngs actually returns the array).
    
    currentLineCoords.push(nextCoord);
    r.line.setLatLngs(currentLineCoords);
    r.outline.setLatLngs(currentLineCoords);
    console.log("drew to", nextCoord, "length is", currentLineCoords.length);
    currentSegmentIdx++;
    if (currentSegmentIdx >= r.coords.length - 1) {
      currentRouteIdx++;
      currentSegmentIdx = 0;
      if (currentRouteIdx < routes.length) {
        const nextR = routes[currentRouteIdx];
        const startPoint = nextR.coords[0];
        nextR.line.setLatLngs([startPoint]);
        nextR.outline.setLatLngs([startPoint]);
      }
    }
    setTimeout(drawNext, 1);
  }
  if (routes.length > 0) {
    const r = routes[0];
    const startPoint = r.coords[0];
    r.line.setLatLngs([startPoint]);
    r.outline.setLatLngs([startPoint]);
    setTimeout(drawNext, 1);
  }
}
playMapAnimation('dummy', markers, routes);
