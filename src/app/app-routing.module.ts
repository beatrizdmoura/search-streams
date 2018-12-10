import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StreamsComponent } from './streams/streams.component';
import {StreamDetailComponent} from './stream-detail/stream-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '/streams', pathMatch: 'full' },
  { path: 'streams', component: StreamsComponent },
  { path: 'streams/:user_id', component: StreamDetailComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes)],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
