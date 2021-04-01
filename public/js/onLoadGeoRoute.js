const params = new URLSearchParams(window.location.search)

if(params.has('id')){
    const id = params.get('id').trim()
    document.querySelector('#geoRouteViewID').value = id
}

if(params.has('zoom') && params.has('cLat') && params.has('cLon')){

    const zoom = params.get('zoom').trim()
    const cLat = params.get('cLat').trim()
    const cLon = params.get('cLon').trim()
    geoRouteMap.setCenter([cLon, cLat])
    geoRouteMap.setZoom(zoom)

}

