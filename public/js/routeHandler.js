const setDestinationView = (id, zoom, lat, lng, destinationView) => {

  if(zoom && lng && lat){
    window.location.replace(`/${destinationView}?id=${id}&zoom=${zoom}&cLat=${lat}&cLon=${lng}`)
    return
  }

  window.location.replace(`/${destinationView}?id=${id}`)
  return

}

const setViewWithID = (id, currentView, destinationView) => {

  if(id && id!== ''){

    if(currentView === 'home'){
      const zoom = map.getZoom()
      const center = map.getCenter()
      const {lng, lat} = center

      setDestinationView(id, zoom, lat, lng, destinationView);
      return

    }else if(currentView === 'geofence'){
      const zoom = geoFencingMap.getZoom()
      const center = geoFencingMap.getCenter()
      const {lng, lat} = center

      setDestinationView(id, zoom, lat, lng, destinationView);
      return

    }else if(currentView === 'georoute'){
      const zoom = geoRouteMap.getZoom()
      const center = geoRouteMap.getCenter()
      const {lng, lat} = center

      setDestinationView(id, zoom, lat, lng, destinationView);
      return
    }

  }

  window.location.replace(`${destinationView}/`)
  return

}


const homeRouter = () => {

    const path = window.location.pathname

    if(path === '/'){
      return
    }

    window.location.replace('/')

  }

  const geoFenceRouter = () => {

    const path = window.location.pathname

    if(path === '/geofence'){
      return
    }else if(path === '/georoute'){

    const params = new URLSearchParams(window.location.search)

      if(params.has('id')){
          const id = params.get('id')
          setViewWithID(id, 'georoute', 'geofence')
          return
      }

    }else if(path === '/'){

        const id = document.querySelector('#timelineViewID').value.trim()
        setViewWithID(id, 'home', 'geofence')
        return
        

    }

    window.location.replace(`/geofence`)

  }

  const geoRouteRouter = () => {

    const path = window.location.pathname

    if(path === '/georoute'){
      return
    }else if(path === '/geofence'){

        const params = new URLSearchParams(window.location.search)

        if(params.has('id')){
            const id = params.get('id')
            setViewWithID(id, 'geofence', 'georoute')
            return
        }

    }else if(path === '/'){

        const id = document.querySelector('#timelineViewID').value.trim()
        setViewWithID(id, 'home', 'georoute')
        return
        

    }
    
    window.location.replace(`/georoute`)
    
  }