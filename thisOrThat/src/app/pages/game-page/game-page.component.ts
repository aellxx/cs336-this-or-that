import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ImageRec } from 'src/app/services/data.service';


@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss']
})
export class GamePageComponent implements OnInit {
  imageArr: ImageRec[] = [];
  sampleImg: ImageRec[] = [];

  constructor(private dataSvc: DataService) {
    this.dataSvc.imageRecords$.subscribe((res) => {
      this.imageArr = res;
      this.sampleImg = this.imageArr.slice(1, 3);
    })
  }

  ngOnInit(): void {
  }

  onClick = () => {
    console.log("image clicked!");
  }
}
