import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { ImageRec } from 'src/app/services/data.service';

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent implements OnInit {
  // loading game
  gameVersion: string = '';
  currentPair: ImageRec[] = [];
  chosenImages: ImageRec[] = [];
  gameOver = false;

  startIdx = 0;
  endIdx = 2;
  currentRound = 16;

  imageArr: ImageRec[] = [];
  chosenImage: ImageRec = {imageUrl: '', downloadUrl: '', winCount: 0, id: "-1"}
  top3Records: ImageRec[] = [];

  constructor(private actRt: ActivatedRoute, private dataSvc: DataService) {
    // get the route parameter
    this.gameVersion = <string>this.actRt.snapshot.paramMap.get('gameName');

    this.dataSvc.getFireStoreData(this.gameVersion).subscribe((res) => {
      this.imageArr = res;
      this.currentPair = this.imageArr.slice(0, 2);
    });
  }

  ngOnInit(): void {}

  ngOnChanges(): void {}
  
  onClick = (item: ImageRec) => {
    this.chosenImages.push(item);
    console.log("chosen images: ", this.chosenImages);
    this.startIdx += 2;
    this.endIdx += 2;
    this.currentPair = this.imageArr.slice(this.startIdx, this.endIdx);

    if (this.chosenImages.length * 2 === this.imageArr.length) {
      console.log("DONE WITH ROUND: ", this.currentRound)
      // if game is over
      if (this.chosenImages.length === 1) {
        // get the winner 
        this.chosenImage = {...this.chosenImages[0]}
        // update winCount
        this.dataSvc.updateWinCount(this.gameVersion, <string>this.chosenImage.id, this.chosenImage.winCount);
        // get top3 images
        this.dataSvc.getTop3Records(this.gameVersion);
        this.dataSvc.top3Records$.subscribe(res => this.top3Records = res)
        
        this.gameOver = !this.gameOver;
      } else {
        this.setNewRound()
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
}
