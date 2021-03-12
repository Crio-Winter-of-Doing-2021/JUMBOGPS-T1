module.exports.justGreaterEqual = function (locations, startTime){

    let low = 0 
    let high = locations.length - 1

    let ans = -1 

    while(low <= high){

        let mid = Math.floor((low + high) / 2) 

        if(locations[mid].timestamp >= startTime){
            ans = mid
            high = mid - 1
        }else{
            low = mid + 1
        }

    }

    return ans 

} 

module.exports.justLesserEqual = function(locations, endTime){

    let low = 0 
    let high = locations.length - 1

    let ans = -1 

    while(low <= high){

        let mid = Math.floor((low + high) / 2) 

        if(locations[mid].timestamp <= endTime){
            ans = mid
            low = mid + 1
        }else{
            high = mid - 1
        }

    }

    return ans 

} 

