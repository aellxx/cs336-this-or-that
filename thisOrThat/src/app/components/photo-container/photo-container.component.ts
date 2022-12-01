import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-photo-container',
  templateUrl: './photo-container.component.html',
  styleUrls: ['./photo-container.component.scss']
})
export class PhotoContainerComponent {
  constructor(private dataSvc: DataService) { }

  ngOnInit(): void {
  }

  firstImgClicked() {
    console.log("first image clicked");
  }

  secondImgClicked() {
    console.log("second image clicked");
  }
}
