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
  imageArr: ImageRec[] = []; // initially holds all 16 images
  currentPair: ImageRec[] = []; // holds the pair of images shown on the screen
  chosenImages: ImageRec[] = []; // holds the chosen images for each round
  gameOver = false;

  // game setup
  startIdx = 0;
  endIdx = 2;
  currentRound = 16;

  // styling
  classNames = ['first', 'second', 'third'];
  rankings = ['1st', '2nd', '3rd'];

  // game results
  chosenImage: ImageRec = {
    imageUrl: '',
    downloadUrl: '',
    winCount: 0,
    id: '-1',
  };
  top3Records: ImageRec[] = [];
  result: boolean = false;

  constructor(private router: Router, private actRt: ActivatedRoute, private dataSvc: DataService, public dialog: MatDialog) {
    // get the route parameter
    this.gameVersion = <string>this.actRt.snapshot.paramMap.get('gameName');

    // get the images from firestore and set up the first pair to render on screen 
    this.dataSvc.getFireStoreData(this.gameVersion).subscribe((res) => {
      this.imageArr = res;
      this.currentPair = this.imageArr.slice(0, 2);
    });
  }

  ngOnInit(): void {}

  /**
   * Runs when the user picks an image
   * @param item the image chosen by the user
   */
  onClick = (item: ImageRec) => {
    this.chosenImages.push(item);
    this.startIdx += 2;
    this.endIdx += 2;
    this.currentPair = this.imageArr.slice(this.startIdx, this.endIdx);

    if (this.chosenImages.length * 2 === this.imageArr.length) {
      console.log('DONE WITH ROUND: ', this.currentRound);
      // if game is over
      if (this.chosenImages.length === 1) {
        // get the winner
        this.chosenImage = { ...this.chosenImages[0] };
        // update winCount
        this.dataSvc.updateWinCount(this.gameVersion, <string>this.chosenImage.id, this.chosenImage.winCount);
        // get top3 images
        this.dataSvc.getTop3Records(this.gameVersion);
        this.dataSvc.top3Records$.subscribe((res) => (this.top3Records = res));

        this.gameOver = !this.gameOver;
      } else {
        // set a new round once user is finished with current round
        this.setNewRound();
      }
    }
  };

  /**
   * sets up variables for new round 
   */
  setNewRound = () => {
    // reset the set of images for a new round
    this.imageArr = [...this.chosenImages];
    this.chosenImages = [];
    this.currentPair = this.imageArr.slice(0, 2);

    // reset index
    this.startIdx = 0;
    this.endIdx = 2;
    this.currentRound = this.imageArr.length;
  };

  /**
   * Runs when user wants to go back to the home screen
   */
  confirmDialog(): void {
    const title = 'Go to Main page';
    const message = `Your game will be lost.\nWould you like to proceed?`;
    const no_bool = true;
    const yes_bool = true;

    const dialogData = new ConfirmDialogModel(
      title,
      message,
      no_bool,
      yes_bool
    );

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      this.result = dialogResult;
      if (this.result === true) {
        this.router.navigateByUrl('home');
      }
    });
  }
}
