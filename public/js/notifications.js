toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": true,
    "progressBar": true,
    "positionClass": "toast-bottom-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "8000",
    "extendedTimeOut": "2500",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  }

    const socket = io()

    socket.on('geoFenceBreach', notification => {

      const assetId = notification.asset_id

      const lastLocation = notification.last_location

      const lastLocationLink = `<a href="https://maps.google.com?q=${lastLocation.latitude},${lastLocation.longitude}">here</a>`

      const message = `<p style='font-size:12px'><b>Geofence Breach</b><br> ID: ${assetId} <br> Last Location: ${lastLocationLink} </p>`

      toastr["error"](message)

    })

    socket.on('geoRouteBreach', notification => {

      const assetId = notification.asset_id

      const lastLocation = notification.last_location

      const lastLocationLink = `<a href="https://maps.google.com?q=${lastLocation.latitude},${lastLocation.longitude}">here</a>`

      const message = `<p style='font-size:12px'><b>Geroute Breach</b><br> ID: ${assetId} <br> Last Location: ${lastLocationLink} </p>`
      
      toastr["error"](message)
    })

    socket.on('assetMovement', assetID => {

      if(document.querySelector('#assetViewRealTime').checked){

        // update the asset view 
        setTimeout(() => {

          try{

            // if still in realtime asset tracking 
            if(document.querySelector('#assetViewRealTime').checked){

                setAllAssets(100, undefined, undefined, 'silent')

            }

          }catch (e){

              console.log(e)

          }

        }, 5000)

      }else if(document.querySelector('#timelineViewRealTime').checked){

        if(document.querySelector('#currentTimelineID').value === assetID){

          // update the time line view 

          setTimeout(() => {

            try{

              // if still realtime asset timeline tracking
              if(document.querySelector('#timelineViewRealTime').checked){
                setTimeLine(assetID, undefined, undefined, 'silent')
              }

            }catch (e){
              console.log(e)
            }

          }, 5000)

        }
        
      }
    

    })