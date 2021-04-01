const draw = new MapboxDraw({
    displayControlsDefault: false,
    controls: {
    polygon: true,
    line_string: true
  },
  modes: Object.assign({
    draw_radius: RadiusMode,
  }, MapboxDraw.modes),
});

geoFencingMap.addControl(draw);

