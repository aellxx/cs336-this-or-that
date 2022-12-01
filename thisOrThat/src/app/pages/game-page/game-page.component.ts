import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ImageRec } from 'src/app/services/data.service';

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent implements OnInit {
  imageArr: ImageRec[] = [];
  currentPair: ImageRec[] = [];
  chosenImage: ImageRec[] = [];

  roundFinished: boolean = false;

  startIdx = 0;
  endIdx = 2;

  constructor(private dataSvc: DataService) {
    this.dataSvc.imageRecords$.subscribe((res) => {
      this.imageArr = res;
      this.currentPair = this.imageArr.slice(0, 2);
    });
  }

  ngOnInit(): void {}

  onChooseImage = (i: number): void => {
    // Play round
    if (this.startIdx < this.imageArr.length) {
      console.log(this.startIdx, this.endIdx);
      // add to chosen images
      this.chosenImage.push(this.currentPair[i]);
      // update indices
      this.startIdx = this.endIdx;
      this.endIdx += 2;
      // render next pair
      this.currentPair = this.imageArr.slice(this.startIdx, this.endIdx);

      if (this.chosenImage.length * 2 === this.imageArr.length) {
        console.log('reset mode!!');
        this.imageArr = [...this.chosenImage];
        console.log(this.imageArr);
        this.chosenImage = this.imageArr.slice(0, 2);
        this.currentPair = [];
        this.startIdx = 0;
        this.endIdx = 2;
      }
    }
  };
}
