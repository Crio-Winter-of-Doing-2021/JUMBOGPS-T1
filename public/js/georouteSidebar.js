document.querySelector('#geoRouteViewBtn').addEventListener('click', async function (e){

    this.disabled = true
    
    e.preventDefault()

    // clear all displayed errors if exist
    errorBox.innerHTML = ''
    errorBox.style.display = 'none'
    successBox.innerHTML = ''
    successBox.style.display = 'none'

    const id = document.querySelector('#geoRouteViewID').value.trim()
    
    if(!id){
      errorBox.style.display = 'block'
      errorBox.innerHTML += '<p>Asset Id is required</p>'
      this.disabled = false 
      return
    }

    if(geoRouteCoords.length === 0){
      errorBox.style.display = 'block'
      errorBox.innerHTML += '<p>No Georoute defined to be set</p>'
      this.disabled = false
      return
    }

    // process route coords here 
    let ok = await setGeoRoute(id, geoRouteCoords)

    if(ok){
      // remove drawn route
      draw.deleteAll()
      geoRouteCoords = []
    }

    this.disabled = false

  })