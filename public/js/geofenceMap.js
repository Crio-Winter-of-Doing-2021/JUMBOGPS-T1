const params = new URLSearchParams(window.location.search)

if(params.has('id')){
    const id = params.get('id')
    document.querySelector('#geoFenceViewID').value = id
}

let zoom, cLat, cLon;

if(params.has('zoom') && params.has('cLat') && params.has('cLon')){

     zoom = params.get('zoom').trim()
     cLat = params.get('cLat').trim()
     cLon = params.get('cLon').trim()

}

zoom = zoom ? zoom : 4
cLat = cLat ? cLat : 19.0452754
cLon = cLon ? cLon : 72.8925973

var geoFencingMap = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [cLon, cLat],
    zoom
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

    stopPreLoader()

    })