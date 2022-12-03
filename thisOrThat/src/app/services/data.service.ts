import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject } from 'rxjs';
import { GamePageComponent } from '../pages/game-page/game-page.component';

export interface ImageRec {
  imageUrl: string;
  imageId: number;
  winCount: number;
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private imageRecords: ImageRec[] = [];
  public imageRecords$: BehaviorSubject<ImageRec[]> = new BehaviorSubject<
    ImageRec[]
  >([]);
  public top3Records: ImageRec[] = [];
  public top3Records$: BehaviorSubject<ImageRec[]> = new BehaviorSubject<ImageRec[]>([]);
  public chosenImage?: ImageRec;

  constructor(private db: AngularFirestore) {
    db.collection<ImageRec>('/sampleCollection')
      .valueChanges()
      .subscribe((res) => {
        if (res) {
          this.imageRecords = res;
          this.imageRecords$.next(this.imageRecords);
        }
      });
  }

  updateWinCount = (chosenImage: ImageRec) => {
    this.chosenImage = chosenImage;
    console.log(this.chosenImage.imageId);
    console.log("current win count: ", this.chosenImage.winCount);
    // update
    this.db
      .doc<ImageRec>(`/sampleCollection/${this.chosenImage.imageId}`)
      .update({
        winCount: ++this.chosenImage.winCount,
      });

    this.db
      .collection<ImageRec>('/sampleCollection', (ref) =>
        ref.orderBy('winCount', 'desc'))
      .valueChanges()
      .subscribe((res) => {
        if (res) {
          this.top3Records$.next(res.slice(0, 3));
        }
      });
  };
}
