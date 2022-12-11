import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/components/confirm-dialog/confirm-dialog.component';
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
  classNames = ["first", "second", "third"];
  rankings = ["1st", "2nd", "3rd"];

  imageArr: ImageRec[] = [];
  chosenImage: ImageRec = {imageUrl: '', downloadUrl: '', winCount: 0, id: "-1"}
  top3Records: ImageRec[] = [];
  result: boolean = false;

  constructor(private router: Router, private actRt: ActivatedRoute, private dataSvc: DataService, public dialog: MatDialog) {
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

  confirmDialog(): void {

    const message = `Your game will be lost.\nWould you like to proceed?`;

    const dialogData = new ConfirmDialogModel("Go to Main page", message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      this.result = dialogResult;
      console.log(this.result);
      console.log(typeof(this.result));
      if(this.result === true) {
        this.router.navigateByUrl("home");
      }

    });
  }
}
