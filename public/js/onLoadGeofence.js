const params = new URLSearchParams(window.location.search)

if(params.has('id')){
    const id = params.get('id')
    document.querySelector('#geoFenceViewID').value = id
}

if(params.has('zoom') && params.has('cLat') && params.has('cLon')){

    const zoom = params.get('zoom').trim()
    const cLat = params.get('cLat').trim()
    const cLon = params.get('cLon').trim()
    geoFencingMap.setCenter([cLon, cLat])
    geoFencingMap.setZoom(zoom)

}