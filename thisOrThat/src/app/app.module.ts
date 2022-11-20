import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GamePageComponent } from './pages/game-page/game-page.component';
import { ResultPageComponent } from './pages/result-page/result-page.component';

@NgModule({
  declarations: [
    AppComponent,
    GamePageComponent,
    ResultPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
