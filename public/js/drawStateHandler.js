let fencingCoords = []
    
    function getPolygonPoints(e){

      let data = draw.getAll();
      
      if(data.features && data.features.length > 0){

        // clear the coordinates if already exists
        fencingCoords = []
        let coordinates = data.features[0].geometry.coordinates

        if(coordinates.length == 2){
          // this is circle mode 
          const featureID = data.features[0].id

          // remove the helper line string
          draw.delete(featureID)

          const fenceSource = geoFencingMap.getSource('fence');

          // Circle represented by 64 polygon points 
          const circle64Polygon = fenceSource._data.features[0].geometry.coordinates[0]

          circle64Polygon.forEach(coordinate => fencingCoords.push({latitude: coordinate[1], longitude: coordinate[0]}))

        }else if(coordinates.length > 0 && coordinates[0].length > 2){

          coordinates = coordinates[0]

          coordinates.forEach(coordinate => fencingCoords.push({latitude: coordinate[1], longitude: coordinate[0]}))
        }
        
        
      }

      console.log(fencingCoords)
}
    
    geoFencingMap.on('draw.create', getPolygonPoints);

    geoFencingMap.on('draw.delete', () => {
      draw.trash()
      fencingCoords = []
      const features = []
      geoFencingMap.getSource('fence').setData({ 'type': 'FeatureCollection', features })
    });

    geoFencingMap.on('draw.modechange', () => {

      const currentMode = draw.getMode()  

      if(currentMode === 'draw_polygon'){
        // remove the circle if it exists
        const features = []
        geoFencingMap.getSource('fence').setData({ 'type': 'FeatureCollection', features })

        // clear stale polygon if any
        draw.deleteAll()
      }else if(currentMode == 'draw_line_string'){

        // remove the polygon if it exists
        draw.deleteAll()
      }

      draw.changeMode(currentMode)

    })