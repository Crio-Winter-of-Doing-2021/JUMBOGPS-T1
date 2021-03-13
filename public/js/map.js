var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [72.8925973,19.0452754],
    zoom:4
    });

    map.on('load', async function () {

        let response = await getAllAssets()
        response = JSON.parse(response)


        // ALL ASSETS CODE

        const assetData = response.response
        let features = []
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
                <a href='javascript:void(0)' onclick='setTimeLine("${asset._id}")'>Get Timeline</a>
                </center>
                </p>`,
                'icon': 'theatre'
                },
                'geometry': {
                'type': 'Point',
                'coordinates': [asset.latitude, asset.longitude]
                }
            })

        })

        map.addSource('places', {
        'type': 'geojson',
        'data': {
        'type': 'FeatureCollection',
        features
        }
        });

        // Add a layer showing the places.
        map.addLayer({
        'id': 'places',
        'type': 'symbol',
        'source': 'places',
        'layout': {
        'icon-image': '{icon}-15',
        'icon-allow-overlap': true
        }
        });

        map.addSource('timeline', {
            'type': 'geojson',
            'data': {
            'type': 'FeatureCollection',
            'features': []
            }
            });

            map.addLayer({
                'id': 'timeline',
                'type': 'symbol',
                'source': 'timeline',
                'layout': {
                'icon-image': '{icon}-15',
                'icon-allow-overlap': true
                }
                });

        const allLayers = ['places', 'timeline']

    for(let i=0 ; i<allLayers.length ; i++){

        const layer = allLayers[i]
         
        // When a click event occurs on a feature in the places layer, open a popup at the
        // location of the feature, with description HTML from its properties.
        map.on('click', layer, function (e) {
        var coordinates = e.features[0].geometry.coordinates.slice();
        var description = e.features[0].properties.description;
         
        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
         
        let popup = new mapboxgl.Popup()

        popup.setLngLat(coordinates)
        .setHTML(description)
        .addTo(map);
        });

        map.on('closePopup', () => {
            popup.remove()
        })
         
        // Change the cursor to a pointer when the mouse is over the places layer.
        map.on('mouseenter', layer, function () {
        map.getCanvas().style.cursor = 'pointer';
        });
         
        // Change it back to a pointer when it leaves.
        map.on('mouseleave', layer, function () {
        map.getCanvas().style.cursor = '';
        });

    }


});