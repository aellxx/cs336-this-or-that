import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HomePageComponent } from './home-page.component';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    HomePageComponent
  ],
  imports: [
    MatButtonModule,
    MatSlideToggleModule,
  ],
  providers: [],
  bootstrap: [HomePageComponent]
})
export class HomePageModule { }
