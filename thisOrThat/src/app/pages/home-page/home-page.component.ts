import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  standalone: true,
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  imports: [MatButtonModule, MatIconModule, CommonModule, MatListModule],
})
export class HomePageComponent implements OnInit {
  gameNames: string[] = [];

  constructor(private router: Router, private dataSvc: DataService) {
    // get all the games from service firebaseData
    this.dataSvc.gameNames$.subscribe((res) => {
      if (res) {
        this.gameNames = res;
      }
    });
  }

  ngOnInit(): void {
  }

  onClickPlayRandomGame = (): void => {
    if (this.gameNames.length != 0) {
      const randGame = this.gameNames[Math.floor(Math.random() * this.gameNames.length)];
      this.router.navigate(['/game', {gameName: randGame}]);
    }
  }

  onClickPlay = (gn: string): void => {
    // console.log(gameName);
    this.router.navigate(['/game', {gameName: gn}]);
  }

  createGame = (): void => {
    this.router.navigate(["/create-game"]);
  }
}
