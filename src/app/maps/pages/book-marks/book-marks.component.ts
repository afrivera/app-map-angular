import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface ColorMarker {
  color  : string;
  marker?: mapboxgl.Marker;
  center?: [ number, number ];
}

@Component({
  selector: 'app-book-marks',
  templateUrl: './book-marks.component.html',
  styles: [`
    .map-container {
      height: 100%;
      width: 100%;
    }

    .list-group {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 99;
    }

    li {
      cursor: pointer;
    }
  `
  ]
})
export class BookMarksComponent implements AfterViewInit {

  @ViewChild('map') divMap!: ElementRef;
  map!: mapboxgl.Map;
  zoomLevel: number = 15;
  center: [number, number] = [ -76.51609221980365 , 3.4364607764846533 ];
  // Marker array
  markers: ColorMarker [] = [];


  constructor() { }
  ngAfterViewInit(): void {
    this.map = new mapboxgl.Map({
      container: this.divMap.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
    });

    this.readMarkerLS();

    // const maker = new mapboxgl.Marker()
    //   .setLngLat( this.center )
    //   .addTo( this.map );

    
  }

  addMarker(){
    // generate color hexa
    const color = '#xxxxxx'.replace(/x/g, y=> ( Math.random()*16|0).toString(16));

    const newMarker = new mapboxgl.Marker({
      draggable: true,
      color
    })
      .setLngLat( this.center )
      .addTo( this.map );
    
    this.markers.push( {
      color,
      marker: newMarker
    } );

    this.saveMarkerLS();

    newMarker.on( 'dragend', ()=> {
      this.saveMarkerLS();
    })
  }

  goMarker( marker: mapboxgl.Marker ){
    this.map.flyTo({
      center: marker.getLngLat()
    })
  }

  saveMarkerLS(){

    const lngLatArr: ColorMarker [] = [];
    this.markers.forEach( m => {
      const color = m.color;
      const { lat, lng } = m.marker!.getLngLat();
      lngLatArr.push( {
        color,
        center: [ lng, lat ]
      });
    });

    localStorage.setItem('markers', JSON.stringify( lngLatArr ) );
  }

  readMarkerLS(){

    if( !localStorage.getItem('markers')){
      return;
    }
    const lngLatArr: ColorMarker[] = JSON.parse( localStorage.getItem('markers')! );

    lngLatArr.forEach( m => {
      const newMarker = new mapboxgl.Marker({
        color: m.color,
        draggable: true
      })
        .setLngLat( m.center!)
        .addTo( this.map );
      this.markers.push({
        marker: newMarker,
        color: m.color
      })

      newMarker.on( 'dragend', ()=> {
        this.saveMarkerLS();
      })
    })

  }

  deleteMarker( id: number ){
    this.markers[id].marker?.remove();
    this.markers.splice( id, 1 );
    this.saveMarkerLS();
  }

}
