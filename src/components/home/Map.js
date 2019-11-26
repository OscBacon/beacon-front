import React from 'react';
import mapboxgl from 'mapbox-gl';
// import '../../styles/mapbox-gl.css';
import '../../styles/Map.css'
import { getEvents } from "../../api/events"
import beacon from '../../static/beacon.png'

mapboxgl.accessToken = 'pk.eyJ1IjoiYmFyYWNvc28iLCJhIjoiY2szMjNza3c2MGZ4eTNobjloZnBidmNzOSJ9.M-UB-TOrqlzL7MIRd6tB2A';

class Map extends React.Component {
  map;

  constructor(props) {
    super(props);
    this.state = {
      lng: 5,
      lat: 34,
      zoom: 2
    };
  }

  componentDidMount() {
    getEvents().then((events) => {
      const map = new mapboxgl.Map({
        container: this.mapContainer,
        style: 'mapbox://styles/mapbox/light-v10',
        center: [this.state.lng, this.state.lat],
        zoom: this.state.zoom
      });

      map.on('load', function () {
        map.loadImage(beacon, function (error, image) {
          if (error) throw error;
          map.addImage('beacon', image)
          map.addSource('beacons', {
            type: 'geojson',
            data: {
              "type": "FeatureCollection",
              "features": events.map((event) => {
                console.log("coordinates: ", event.coordinates)
                return {
                  "type": "Feature",
                  "geometry": {
                    "type": "Point",
                    "coordinates": event.coordinates
                  },
                  "properties": {
                    "title": event.title,
                    "_id": event._id
                  }
                }
              })
            }
          });

          map.addLayer({
            "id": "beacons",
            "type": "symbol",
            "source": "beacons",
            "layout": {
              "icon-image": "beacon",
              "icon-size": 0.1,
              // get the title name from the source's "title" property
              "text-field": ["get", "title"],
              "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
              "text-offset": [0, 0.6],
              "text-anchor": "top"
            }
          });
        })
      });

      map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true
      }));
    
    });
  }

  render() {
      return(
      <div>
    <div ref={el => this.mapContainer = el} className='mapContainer' />
      </div >
    )
  }
}

export default Map;