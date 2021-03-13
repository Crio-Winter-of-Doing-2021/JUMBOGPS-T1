const toDateTime = (timestamp) => {
    const months_arr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    
    // Convert timestamp to milliseconds
    const date = new Date(timestamp*1000);

    // Year
    const year = date.getFullYear();

    // Month
    const month = months_arr[date.getMonth()];

    // Day
    const day = date.getDate();

    // Hours
    const hours = date.getHours();

    // Minutes
    let minutes = date.getMinutes() ;
    minutes = minutes < 10 ? '0'+minutes : minutes

    // Seconds
    let seconds = date.getSeconds() ;
    seconds = seconds < 10 ? '0'+seconds : seconds

    const amPm = hours >= 12 ? 'PM' : 'AM'

    const formattedTime = `${hours}:${minutes} ${amPm}`

    const formattedDate = `${month}. ${day}, ${year}`

    return {
        time: formattedTime,
        date: formattedDate
    }

}

const getTimeStamp = (date, time) => {
    
    const dateComponents = date.split('-')

    const year = dateComponents[0]
    const month = dateComponents[1]
    const day = dateComponents[2]

    const timeComponents = time.split(':')
    const hours = timeComponents[0]
    const minutes = timeComponents[1]

	//Month: 0 = January - 11 = December.
	var d = new Date(year,month-1,day,hours,minutes);

    
	return d.getTime() / 1000;
}

const closePopups = () => {
    // close the popups if any, returns HTMLCollection
    let popups = document.getElementsByClassName('mapboxgl-popup')
    for(popup of popups){ popup.remove() }
}

const setTimeLineView = (features, center) => {

    closePopups()
    
    // hide a layer
    map.setLayoutProperty('places','visibility','none')
            
    // setData() only requires geoJSON data variable
    map.getSource('timeline').setData({'type': 'FeatureCollection', features})
    
    map.setCenter([center.latitude,center.longitude])
    
    map.setZoom(13)
    
    map.setLayoutProperty('timeline','visibility','visible')
}

const setAllAssetsView = (features, center) => {
    
    closePopups()

    // hide a layer
    map.setLayoutProperty('timeline','visibility','none')
            
    // setData() only requires geoJSON data variable
    map.getSource('places').setData({'type': 'FeatureCollection', features})
    
    map.setCenter([center.latitude,center.longitude])
    
    map.setZoom(4)
    
    map.setLayoutProperty('places','visibility','visible')

}

const showAssetsView = () => {

    closePopups()

    // hide a layer
    map.setLayoutProperty('timeline','visibility','none')

    map.setCenter([allAssetState.centerLatitude,allAssetState.centerLongitude])
    map.setZoom(allAssetState.zoomLevel)

    // show a layer
    map.setLayoutProperty('places','visibility','visible')

}

const setAssetViewErrorMessage = (message) => {

    const errorBox = document.querySelector('#assetViewErrorBox')
    errorBox.innerHTML += `<p>${message}</p>`
    errorBox.style.display = 'block'

}

const clearAssetViewErrorMessage = () => {

    const errorBox = document.querySelector('#assetViewErrorBox')
    errorBox.innerHTML = ''
    errorBox.style.display = 'none'

}

const setTimelineViewErrorMessage = (message) => {

    const errorBox = document.querySelector('#timelineViewErrorBox')
    errorBox.innerHTML += `<p>${message}</p>`
    errorBox.style.display = 'block'

}

const clearTimelineViewErrorMessage = () => {

    const errorBox = document.querySelector('#timelineViewErrorBox')
    errorBox.innerHTML = ''
    errorBox.style.display = 'none'

}