import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss']
})
export class GamePageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  firstImgClicked() {
    console.log("first image clicked");
  }

  secondImgClicked() {
    console.log("second image clicked");
  }
}
