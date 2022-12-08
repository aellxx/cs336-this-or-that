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
  imageList: string[] = [];
  currentPair: string[] = []
  chosenImages: string[] = [];
  gameOver = false;

  startIdx = 0; 
  endIdx = 2; 
  currentRound = 16;


  constructor(private actRt: ActivatedRoute, private dataSvc: DataService) {
    // get the route parameter
    this.gameVersion = <string>this.actRt.snapshot.paramMap.get('gameName');

    if (localStorage.getItem("imageList")) {
      this.imageList = JSON.parse(localStorage.getItem("imageList") || "{}");
    }

    this.currentPair = [...this.imageList].slice(0,2);
  }

  ngOnInit(): void {
    this.dataSvc.games$.subscribe(res => {
      if (res) {
        this.imageList = res[this.gameVersion];
        console.log(this.imageList);
        console.log(this.imageList[0]);
        if (!localStorage.getItem("imageList")) {
          localStorage.setItem("imageList", JSON.stringify(this.imageList));
        }
      }
    })
  }

  ngOnChanges(): void {

  }

  onChooseImage = (i: number): void => {
    console.log(this.imageList ? this.imageList.length : null);
    // Play round
    if (this.imageList && this.startIdx < this.imageList.length) {
      // add to chosen images
      this.chosenImages.push(this.currentPair[i]);
      // update indices
      this.startIdx = this.endIdx;
      this.endIdx += 2;
      // render next pair
      this.currentPair = this.imageList.slice(2, 4);

      // reset for next round
      if (this.chosenImages.length * 2 === this.imageList.length) {
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
    this.imageList = [...this.chosenImages];
    this.chosenImages = [];
    this.currentPair = this.imageList.slice(0, 2);
    // reset index
    this.startIdx = 0;
    this.endIdx = 2;
    this.currentRound = this.imageList.length;
  };
};
