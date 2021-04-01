const errorBox = document.querySelector('#geoFenceViewErrorBox')
const successBox = document.querySelector('#geoFenceViewSuccessBox')

  // api calls here

  async function setGeoFence(id, fencingCoords){

  try{

    let response = await fetch(`assets/${id}/geofence`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({data: fencingCoords})
    })

    const statusCode = response.status
    response = await response.json()

    if(statusCode === 200){

      errorBox.style.display = 'none'
      successBox.innerHTML = ''
      successBox.style.display = 'block'
      const successMessage = response.message
      successBox.innerHTML += `<p>${successMessage}</p>`
      return true

    }else if(statusCode >= 400 && statusCode <=499){

      successBox.style.display = 'none'
      errorBox.innerHTML = ''
      errorBox.style.display = 'block'
      const errorMessage = response.message
      errorBox.innerHTML += `<p>${errorMessage}</p>`
      return false

    }

  } catch (e){

    console.log(e)
    return false 

  } 
}