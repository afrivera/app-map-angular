import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FullScreenComponent } from './pages/full-screen/full-screen.component';
import { ZoomRangeComponent } from './pages/zoom-range/zoom-range.component';
import { BookMarksComponent } from './pages/book-marks/book-marks.component';
import { PropertiesComponent } from './pages/properties/properties.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'fullscreen', component: FullScreenComponent },
      { path: 'zoom-range', component: ZoomRangeComponent },
      { path: 'bookmark', component: BookMarksComponent },
      { path: 'properties', component: PropertiesComponent },
      { path: '**', redirectTo: 'fullscreen' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapsRoutingModule { }
