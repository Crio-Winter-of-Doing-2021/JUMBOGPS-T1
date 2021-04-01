const draw = new MapboxDraw({
    displayControlsDefault: false,
    controls: {
    line_string: true
  }
});

geoRouteMap.addControl(draw);