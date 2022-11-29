import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject } from 'rxjs';

export interface ImageRec {
  imageUrl: string;
  imageId: number;
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private imageRecords: ImageRec[] = [];
  public imageRecords$ = new BehaviorSubject<ImageRec[]>([]);

  constructor(private db: AngularFirestore) {
    db.collection<ImageRec>('/sampleCollection')
      .valueChanges()
      .subscribe((res) => {
        if (res) {
          this.imageRecords = res;
          this.imageRecords$.next(this.imageRecords);
          // console.log(this.imageRecords);
        }
      });
  }
}