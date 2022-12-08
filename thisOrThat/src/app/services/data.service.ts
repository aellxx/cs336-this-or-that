import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { BehaviorSubject, map } from 'rxjs';
import {
  getDownloadURL,
  getStorage,
  listAll,
  ref,
} from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';

export interface Game {
  [k: string]: string[];
}

export interface ImageRec {
  imageUrl: string;
  winCount: number;
  downloadUrl?: string;
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  games: Game = {};
  gameNames: string[] = [];
  games$: BehaviorSubject<Game | null> = new BehaviorSubject<Game | null>(null);
  gameNames$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  constructor(private db: AngularFirestore, private fs: AngularFireStorage) {
    db.collection<ImageRec>('sampleGame').doc('id').ref.get()
    .then((docSnapshot) => {
      if (!docSnapshot.exists) {
        db.collection('sampleGame').doc('id').set({})
      }
    })
    this.getData();
  }

  getFireStoreData = (folderName: string) => {
    return this.db.collection<ImageRec>(folderName)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data};
        })))
  }


  private getData = async () => {
    const storage = getStorage();
    const storageRef = ref(storage);

    listAll(storageRef)
      .then((res) => {
        res.prefixes.forEach((folderRef, idx) => {
          // get path to folder (a.k.a. each individual game)
          const folderFullPath = folderRef.fullPath;
          this.games[folderFullPath] = [];

          // get all the images in the folder
          listAll(folderRef).then((res) => res.items.forEach((itemRef) => {
            getDownloadURL(ref(storage, itemRef.fullPath)).then((url) => {
              this.games[folderFullPath].push(url);
            });
          })
          );
        });
        //console.log("GAMES: ", this.games);
        // send the games to Observer components
        this.games$.next(this.games);
        this.gameNames$.next(Object.keys(this.games));
      })
      .catch((error) => {
        alert(error);
      });
  }
  // updateWinCount = (chosenImage: ImageRec) => {
  //   this.chosenImage = chosenImage;
  //   console.log(this.chosenImage.imageId);
  //   console.log('current win count: ', this.chosenImage.winCount);
  //   // update
  //   this.db
  //     .doc<ImageRec>(`/sampleCollection/${this.chosenImage.imageId}`)
  //     .update({
  //       winCount: ++this.chosenImage.winCount,
  //     });

  //   this.db
  //     .collection<ImageRec>('/sampleCollection', (ref) =>
  //       ref.orderBy('winCount', 'desc')
  //     )
  //     .valueChanges()
  //     .subscribe((res) => {
  //       if (res) {
  //         this.top3Records$.next(res.slice(0, 3));
  //       }
  //     });
  // };
}
