import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getStorage, listAll, ref } from '@angular/fire/storage';
import { BehaviorSubject, map, Observable } from 'rxjs';

export interface ImageRec {
  id?: string;
  imageUrl: string;
  winCount: number;
  downloadUrl?: string;
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  gameNames: string[] = [];
  gameNames$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  top3Records$: BehaviorSubject<ImageRec[]> = new BehaviorSubject<ImageRec[]>([]);

  constructor(private db: AngularFirestore, private fs: AngularFireStorage) {}

  /**
   * Used in home-page.component to load all possible games
   */
  getGames = (): void => {
    // access to firebase storage
    const storage = getStorage();
    const storageRef = ref(storage);

    // access all folders in the firebase storage
    listAll(storageRef)
      .then((res) => {
        res.prefixes.forEach((folderRef) => {
          // get path to folder (a.k.a. each individual game)
          const folderFullPath = folderRef.fullPath;

          // add to the list of games
          if (!this.gameNames.find((item) => item === folderFullPath)){
            this.gameNames.push(folderFullPath);
          }
        });

        // send data to Observer (home-page.component)
        this.gameNames$.next(this.gameNames);
      })
      .catch((error) => {
        alert(error);
      })
  };

  /**
   * Used in game-page.component to load images and related information
   * @param folderName name of the game
   * @returns Observable object containing an array of imageRec[] 
   */
  getFireStoreData = (folder: string): Observable<ImageRec[]> => {
    return this.db
      .collection<ImageRec>(folder)
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  };

  /**
   * Used in game-page.component to update the win-count of the user's favorite image
   * @param folder name of the game
   * @param imageID image identifier
   * @param imageWinCount current win count
   */
  updateWinCount = async (folder: string, imageID: string, imageWinCount: number): Promise<void> => {
    // get image document
    const imageDoc = this.db.collection<ImageRec>(folder).doc(imageID);
    // update win count
    await imageDoc.update({
      winCount: ++imageWinCount,
    });
  };

  /**
   * Used in game-page.component to get the overall top 3 images
   * @param folder name of the game
   */
  getTop3Records = (folder: string): void => {
    // read data in descending winCount order
    this.db
      .collection<ImageRec>(folder, (ref) => ref.orderBy('winCount', 'desc'))
      .valueChanges()
      .subscribe((res) => {
        // send top 3 images to Observer in game-page.component
        this.top3Records$.next(res.slice(0, 3));
      });
  };
}
