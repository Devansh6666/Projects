maptilersdk.config.apiKey = mapKey
;
      const map = new maptilersdk.Map({
        container: 'map', // container's id or the HTML element to render the map
        style: "hybrid",
        zoom: 2, // map zoom level
        geolocate: true
      });

      const gc = new maptilersdkMaptilerGeocoder.GeocodingControl({});

       const marker = new maptilersdk.Marker()
      .setLngLat([78.96288 ,20.59368])
      .addTo(map);

      map.addControl(gc, 'top-left',marker);