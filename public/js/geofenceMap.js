

var geoFencingMap = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [72.8925973,19.0452754],
    zoom:4
});

geoFencingMap.on('load', function () {
    geoFencingMap.addSource('fence', {
                'type': 'geojson',
                'data': {
                'type': 'FeatureCollection',
                'features': []
              }
          })

    geoFencingMap.addLayer({
              'id': 'circularFence',
              'type': 'fill',
              'source': 'fence',
              "paint": {
                  "fill-color": "#cac2e7",
                  'fill-opacity': 0.4
                }
            })

    })