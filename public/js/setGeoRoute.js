const errorBox = document.querySelector('#geoRouteViewErrorBox')
const successBox = document.querySelector('#geoRouteViewSuccessBox')

  // api calls here

  async function setGeoRoute(id, geoRouteCoords){

  try{

    let response = await fetch(`assets/${id}/georoute`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({data: geoRouteCoords})
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