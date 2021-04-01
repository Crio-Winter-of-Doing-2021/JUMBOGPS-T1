let geoRouteCoords = []
let previousMode = draw.getMode()

function getPolygonPoints(e){
    let data = draw.getAll();
    
    // clear the previous Route 
    geoRouteCoords = []
    const turfFeatures = []
    if(data.features.length>=1){
        const lineCoordinates = data.features[0].geometry.coordinates
              
            lineCoordinates.forEach(coordinate => {

            turfFeatures.push(turf.point([coordinate[0], coordinate[1]]))

                geoRouteCoords.push({
                    latitude: coordinate[1],
                    longitude: coordinate[0]
                })                  
            });
        }

        console.log(geoRouteCoords)
          
}
        
    geoRouteMap.on('draw.create', getPolygonPoints);
    
    geoRouteMap.on('draw.delete', () => {
        draw.deleteAll()
    });
    
    geoRouteMap.on('draw.modechange', () => {
        
        const data = draw.getAll()

        let currentMode = draw.getMode()

        if(currentMode === 'draw_line_string'){
        // we are specifying a new route now, clear previous route
        geoRouteCoords = []
        }

          // mapbox-draw-gl-js rigid blue polygon bug workaround  
        if(data.features.length > 1){
            let n = data.features.length 
            for(let i=0 ; i< n-1 ; i++){
                let id = data.features[i].id
                draw.delete(id)
            }
        }
         
    })