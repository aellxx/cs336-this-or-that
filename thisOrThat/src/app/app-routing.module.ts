import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GamePageComponent } from './pages/game-page/game-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ResultPageComponent } from './pages/result-page/result-page.component';

const routes: Routes = [
  {path: '', component: HomePageComponent},
  {path: 'game', component: GamePageComponent},
  {path: 'results', component: ResultPageComponent},
  {path: '**', component: GamePageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
