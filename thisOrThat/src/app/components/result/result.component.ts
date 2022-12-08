import { Component, Input } from '@angular/core';
import { ImageRec } from 'src/app/services/data.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent {
  @Input()
  winner!: ImageRec;
  
}
