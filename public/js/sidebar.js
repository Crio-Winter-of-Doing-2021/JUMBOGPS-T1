let assetViewContainer = document.querySelector('#assetViewContainer')
let timelineViewContainer = document.querySelector('#timelineViewContainer')

document.querySelector('#viewSelector').addEventListener('change', function() {
 const view = this.value

 if(view == 'Asset'){
    timelineViewContainer.style.display = "none"
    assetViewContainer.style.display = "block"
    showAssetsView()
 }else if(view == 'Timeline'){
    assetViewContainer.style.display = "none"
    timelineViewContainer.style.display = "block"
 }

})

document.querySelector('#assetViewBtn').addEventListener('click', (e) => {

  e.preventDefault() 

  clearAssetViewErrorMessage()
  const id = document.querySelector('#assetViewID').value
  let assetType = document.querySelector('#assetType').value
  let markers = document.querySelector('#numAssets').value

  assetType = assetType == 'all' ? undefined : assetType
  markers = markers == "" ? undefined : markers

  try{
    setAllAssets(markers, assetType, id)
  }catch (e){
    console.log(e)
  }

})

document.querySelector('#timelineViewBtn').addEventListener('click', (e) => {
 e.preventDefault()

clearTimelineViewErrorMessage()
const assetID = document.querySelector('#timelineViewID').value ;
const startDateTime = document.querySelector('#startDateTime').value ;
const endDateTime = document.querySelector('#endDateTime').value ;

const startDateTimeData = startDateTime.split('T')
const startDate = startDateTimeData[0]
const startTime = startDateTimeData[1]

const endDateTimeData = endDateTime.split('T')
const endDate = endDateTimeData[0]
const endTime = endDateTimeData[1]

let startTimeStamp, endTimeStamp

if(startDate){
  startTimeStamp = getTimeStamp(startDate, startTime)
}

if(endDate){
  endTimeStamp =  getTimeStamp(endDate, endTime)
}

if((startTimeStamp && endTimeStamp) && (startTimeStamp>endTimeStamp)){
  setTimelineViewErrorMessage('End Date Time should be a time after Start Date Time')
  return
}

if(assetID.length !== 0){

  setTimeLine(assetID, startTimeStamp, endTimeStamp)

}else{
  setTimelineViewErrorMessage('Asset Id is required')
}

})