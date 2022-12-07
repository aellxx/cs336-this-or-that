import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss'],

})
export class GamePageComponent implements OnInit {
  // loading game
  gameVersion: string = "";
  imageArr: string[] = [];

  currentPair: string[] = []
  chosenImages: string[] = [];
  gameOver = false;

  startIdx = 0; 
  endIdx = 2; 
  currentRound = 16;

  constructor(private actRt: ActivatedRoute, private dataSvc: DataService) {
    console.log("constructor called!");
    // get the route parameter
    this.gameVersion = <string>this.actRt.snapshot.paramMap.get('gameName');
    // read data
    this.dataSvc.games$.subscribe((res) => {
      if (res) {
        console.log(res);
        this.imageArr = res[this.gameVersion];
        console.log(this.imageArr);
        console.log(this.imageArr.length);
      }
    })
  }

  ngOnInit(): void {
  }

  onChooseImage = (i: number): void => {
    console.log(this.imageArr ? this.imageArr.length : null);
    // Play round
    if (this.imageArr && this.startIdx < this.imageArr.length) {
      // add to chosen images
      this.chosenImages.push(this.currentPair[i]);
      // update indices
      this.startIdx = this.endIdx;
      this.endIdx += 2;
      // render next pair
      this.currentPair = this.imageArr.slice(2, 4);

      // reset for next round
      if (this.chosenImages.length * 2 === this.imageArr.length) {
        if (this.chosenImages.length === 1) {
          this.gameOver = !this.gameOver;
          // this.dataSvc.updateWinCount(this.chosenImages[0]);
          // this.dataSvc.top3Records$.subscribe((res) => {
          //   this.top3Records = res;
          //   console.log(this.top3Records);
          }
        } else {
          this.setNewRound();
        }
      }
    }

  setNewRound = () => {
    this.imageArr = [...this.chosenImages];
    this.chosenImages = [];
    this.currentPair = this.imageArr.slice(0, 2);
    // reset index
    this.startIdx = 0;
    this.endIdx = 2;
    this.currentRound = this.imageArr.length;
  };
};
