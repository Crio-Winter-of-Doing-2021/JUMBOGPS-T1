document.querySelector('#geoFenceViewBtn').addEventListener('click', async function (e){

    this.disabled = true
    
    e.preventDefault()

    // clear all displayed errors if exist
    errorBox.innerHTML = ''
    errorBox.style.display = 'none'
    successBox.innerHTML = ''
    successBox.style.display = 'none'

    const id = document.querySelector('#geoFenceViewID').value.trim()
    
    if(!id){
      errorBox.style.display = 'block'
      errorBox.innerHTML += '<p>Asset Id is required</p>'
      this.disabled = false 
      return
    }

    if(fencingCoords.length === 0){
      errorBox.style.display = 'block'
      errorBox.innerHTML += '<p>No Geofence defined to be set</p>'
      this.disabled = false
      return
    }

    // process fencing coords here 
    let ok = await setGeoFence(id, fencingCoords)

    if(ok){
      // remove drawn fence 
      draw.deleteAll()
      const features = []
      geoFencingMap.getSource('fence').setData({ 'type': 'FeatureCollection', features })
      fencingCoords = []
    }

    this.disabled = false

  })