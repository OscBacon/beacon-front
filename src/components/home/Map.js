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
      lng: -79.4019,
      lat: 43.6554,
      zoom: 12,
      loaded: false,
    };
  }

  componentDidUpdate(prevProps, prevState){
    if(prevProps.events && (this.props.events !== prevProps.events)){
      this.refreshMap();
    }
  }

  refreshMap(){
    const {events} = this.props;
    const {loaded} = this.state;

    console.log("refreshing map", events)

    if(loaded){
      const data = {
        "type": "FeatureCollection",
        "features": events.map((event) => {
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

      if(this.map.getSource('beacons')){
        this.map.getSource('beacons').setData(data);
      }
      else{
        this.map.addSource('beacons', {
          type: 'geojson',
          data
        });
      }      
    }
  }

  componentDidMount() {
    
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom
    });

    this.map.on('load', () => {
      this.map.loadImage(beacon, (error, image) => {
        if (error) throw error;
        this.map.addImage('beacon', image)


        this.map.addLayer({
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

      this.setState({loaded: true}, this.refreshMap)
    });

    this.map.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    }));
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