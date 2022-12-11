import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  imports: [MatButtonModule, MatIconModule, CommonModule, MatListModule],
})
export class HomePageComponent implements OnInit {
  gameNames: string[] = [];

  constructor(private router: Router, private dataSvc: DataService) {}

  /**
   * Get available games every time user navigates to the home page
   */
  ngOnInit (): void {
    this.dataSvc.getGames();
    this.dataSvc.gameNames$.subscribe((res) => {
      if (res) {
        this.gameNames = res;
      }
    });
  }

  /**
   * Play a random game
   */
  onClickPlayRandomGame = (): void => {
    if (this.gameNames.length != 0) {
      const randGame = this.gameNames[Math.floor(Math.random() * this.gameNames.length)];
      this.router.navigate(['/game', {gameName: randGame}]);
    }
  }

  /**
   * Play a game the user chooses to play
   * @param gn name of game listed in the list of games
   */
  onClickPlay = (gn: string): void => {
    this.router.navigate(['/game', {gameName: gn}]);
  }

  /**
   * Create a new game (navigate to new page)
   */
  createGame = (): void => {
    this.router.navigate(["/create-game"]);
  }
}
