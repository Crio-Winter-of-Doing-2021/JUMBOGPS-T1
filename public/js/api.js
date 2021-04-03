

// get timeline data for an asset 
async function getTimeLine(id, startTime=undefined, endTime=undefined){

    let queryParams = ''

    if(startTime && endTime){
        queryParams = `?startTime=${startTime}&endTime=${endTime}`
    }else if(startTime){
        queryParams = `?startTime=${startTime}`
    }else if(endTime){
        queryParams = `?endTime=${endTime}`
    }

    let response = await fetch(`assets/${id}/timeline${queryParams}`, {
        method: "GET"
    })

    if(response.status>=400 && response.status<=499){

        const message = (await response.json()).message
        return JSON.stringify({ status: response.status , message })

    }

    response = await response.json()

    return JSON.stringify({timeline: response})
}

// set asset Timeline by id for an asset
async function setTimeLine(id,startTime=undefined,endTime=undefined, mode=undefined){

    // do not change view if asset View Realtime is On 
    if(document.querySelector('#assetViewRealTime').checked){
        return
    }

try{
    let response = await getTimeLine(id, startTime, endTime);
    response = JSON.parse(response)

    if(response.status>=400 && response.status<=499){
        setTimelineViewErrorMessage(response.message)
        document.querySelector('#currentTimelineID').value = 'none'
        return
    }

    // set this for realtime tracking purposes
    document.querySelector('#currentTimelineID').value = id

    const center = response.timeline.center
    response = response.timeline.data

    let features = []
    
    const {_id, assetType, geofence, presetroute} = response

    response.location.forEach(location => {

        const dateTime = toDateTime(location.timestamp)

      features.push({
            'type': 'Feature',
            'properties': {
            'description':
            `<p><strong>Asset Id:</strong> ${_id}<br>
                <strong>Asset Type:</strong> ${assetType}<br>
                <strong>Time:</strong> ${dateTime.time}<br>
                <strong>Date:</strong> ${dateTime.date}<br>
            </p>`
            },
            'geometry': {
            'type': 'Point',
            'coordinates': [location.longitude, location.latitude]
            }
        })

        })

        if(mode === 'silent'){
            const lastLocation = response.location[response.location.length -1]
            const center = [lastLocation.longitude, lastLocation.latitude]
            setTimeLineViewSilent(features, center, geofence, presetroute)
        }else{
            setTimeLineView(features, center, geofence, presetroute)
            document.querySelector('#timelineViewID').value = _id
            clearTimelineViewErrorMessage()
        }

        

    }
    catch (e){
        console.log(e)
    }


}

// should be configures to a particular city or location something in future
async function getAllAssets(markers=100, type, id){

    let queryParams = '?markers='+markers

    if(type){
        queryParams += '&type='+type
    }

    if(id){
        queryParams += '&id='+id
    }
    
    let response = await fetch('/assets/list/location'+queryParams, {
            method: "GET"
        })


    if(response.status>=400 && response.status<=499){

        const message = (await response.json()).message
        return JSON.stringify({ status: response.status , message })

    }

    response = await response.json()
    
    const center = response.center
    response = response.data

    return JSON.stringify({ response, center })

}

async function setAllAssets(markers=100, assetType=undefined, id=undefined, mode=undefined){

        
        try{
            let response = await getAllAssets(markers, assetType, id)

            response = JSON.parse(response)

            if(response.status>=400 && response.status<=499){
                setAssetViewErrorMessage(response.message)
                return
            }

            const center = response.center
            const assetData = response.response

            if(!assetData || assetData.length == 0){
                setAssetViewErrorMessage('No Matches for Given Filter')
                return
            }

            const features = []

            assetData.forEach(asset => {

                const dateTime = toDateTime(asset.time)

                features.push({
                    'type': 'Feature',
                    'properties': {
                    'description':
                    `<p>
                    <strong>Asset Id:</strong> ${asset._id}<br>
                    <strong>Asset Type:</strong> ${asset.type}<br>
                    <strong>Time:</strong> ${dateTime.time}<br>
                    <strong>Date:</strong> ${dateTime.date}<br>
                    <center>
                    <a class='timelineLink' href='javascript:void(0)' onclick='setTimeLine("${asset._id}")'>Get Timeline</a>
                    </center>
                    </p>`
                    },
                    'geometry': {
                    'type': 'Point',
                    'coordinates': [asset.longitude, asset.latitude]
                    }
                })

            })

            if(mode === 'silent'){
                setAllAssetsViewSilent(features)
            }else{
                setAllAssetsView(features, center)
            }
            

            // update the center for asset view state
            allAssetViewState.center = [center.longitude, center.latitude]

            clearAssetViewErrorMessage()

        }catch (e){
            console.log(e)
        }

    

}