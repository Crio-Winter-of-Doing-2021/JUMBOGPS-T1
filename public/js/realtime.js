document.querySelector('#assetViewRealTime').addEventListener('change', async function(e){
    if (e.currentTarget.checked) {
    // moving from off state to on state
    
    clearAssetViewErrorMessage()

    document.querySelector('#assetViewID').value = ''
    document.querySelector('#assetType').value = ''
    document.querySelector('#numAssets').value = ''

    await setAllAssets(100,undefined, undefined)

    new bootstrap.Modal(document.getElementById('infoModal1')).show()
    
    document.querySelector('#assetViewID').disabled = true 
    document.querySelector('#assetType').disabled = true 
    document.querySelector('#numAssets').disabled = true 
    document.querySelector('#viewSelector').disabled = true

    

    } else {

    document.querySelector('#assetViewID').disabled = false
    document.querySelector('#assetType').disabled = false
    document.querySelector('#numAssets').disabled = false 
    document.querySelector('#viewSelector').disabled = false

    }
  })

  document.querySelector('#timelineViewRealTime').addEventListener('change', function(e){
    if (e.currentTarget.checked) {
    // moving from off state to on state
    
    clearTimelineViewErrorMessage()

    if(document.querySelector('#currentTimelineID').value === 'none'){
        new bootstrap.Modal(document.getElementById('infoModal2')).show()
        this.checked = false
        return
    }

    document.querySelector('#startDateTime').value = ''
    document.querySelector('#endDateTime').value = ''

    new bootstrap.Modal(document.getElementById('infoModal1')).show()
    
    document.querySelector('#timelineViewID').disabled = true 
    document.querySelector('#startDateTime').disabled = true 
    document.querySelector('#endDateTime').disabled = true 
    document.querySelector('#viewSelector').disabled = true

    } else {

    document.querySelector('#timelineViewID').disabled = false
    document.querySelector('#startDateTime').disabled = false
    document.querySelector('#endDateTime').disabled = false 
    document.querySelector('#viewSelector').disabled = false

    }
  })

 