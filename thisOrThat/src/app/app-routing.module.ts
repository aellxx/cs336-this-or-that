import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GamePageComponent } from './pages/game-page/game-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { UploaderComponent } from './pages/create-game-page/uploader.component';

const routes: Routes = [
  { path: '', component: HomePageComponent},
  { path: 'game/:gameName', component: GamePageComponent },
  { path: 'create-game', component: UploaderComponent },
  { path: '**', redirectTo: '', component: HomePageComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
