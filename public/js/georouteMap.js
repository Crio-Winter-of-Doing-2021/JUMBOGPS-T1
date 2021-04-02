const params = new URLSearchParams(window.location.search)

if(params.has('id')){
    const id = params.get('id').trim()
    document.querySelector('#geoRouteViewID').value = id
}

let zoom, cLat, cLon

if(params.has('zoom') && params.has('cLat') && params.has('cLon')){

    zoom = params.get('zoom').trim()
    cLat = params.get('cLat').trim()
    cLon = params.get('cLon').trim()

}

zoom = zoom ? zoom : 4
cLat = cLat ? cLat : 19.0452754
cLon = cLon ? cLon : 72.8925973

var geoRouteMap = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [cLon, cLat],
    zoom
});

geoRouteMap.on('load', () => {
    stopPreLoader()
})