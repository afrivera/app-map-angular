import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';


@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [`
  .map-container {
    height: 100%;
    width: 100%;
  }

  .row {
    background-color: white;
    border-radius: 5px;
    bottom: 50px;
    left:50px;
    padding: 10px;
    position: fixed;
    z-index: 999999;
    width: 400px;
  }
`
  ]
})
export class ZoomRangeComponent implements AfterViewInit, OnDestroy {

  @ViewChild('map') divMap!: ElementRef;
  @ViewChild('zoomInput') input!: ElementRef;
  map!: mapboxgl.Map;
  zoomLevel: number = 10;
  center: [number, number] = [ -76.51609221980365 , 3.4364607764846533 ];

  constructor() { }
  ngOnDestroy(): void {
    // destroy listener
    this.map.off('zoom', ()=> {})
    this.map.off('zoomEnd', ()=> {})
    this.map.off('move', ()=> {})
  }

  ngAfterViewInit(): void {
    console.log('AfterViewInit',this.divMap)
    this.map = new mapboxgl.Map({
      container: this.divMap.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel,
      // maxZoom: 18
      });
    
    this.map.on('zoom', ( e )=> {
      this.zoomLevel = this.map.getZoom();
    })
    
    this.map.on('zoomend', ( e )=> {
      if( this.map.getZoom() > 18){
        this.map.zoomTo( 18 );
      }
    });

    // map move
    this.map.on('move', ( e )=> {
      const target = e.target;
      // console.log(target.getCenter());
      const { lng, lat } = target.getCenter();
      this.center = [ lng, lat];
    })
  }

  zoomOut(){
    this.map.zoomOut();
  }

  zoomIn(){
    this.map.zoomIn();
  }

  zoomChange( value: string ){
    this.map.zoomTo( Number( value ));
  }

}
