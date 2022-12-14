// Reference to https://fireship.io/lessons/angular-firebase-storage-uploads-multi/

import { Component, EventEmitter, Output } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { getStorage, uploadBytesResumable, ref, getDownloadURL } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss']
})
export class UploaderComponent {
  isHovering: boolean = false;
  event: boolean = false;
  files: File[] = [];
  file!: File;
  warning_state: boolean = false;
  images_limit_state: boolean = false;
  game_name: string = "";
  // download_url: (<Observable>() => string) | undefined;
  result: boolean = false;

  // check existing games
  games: string[] = [];
  gameExists: boolean = false; 
  gamesLoaded: boolean = true; 

  @Output() dropped = new EventEmitter<File[]>();
  
  onSelect(event: { addedFiles: any; }) {
    if (this.files.length + event.addedFiles.length <= 16) {
      this.files.push(...event.addedFiles);        
    } else {
      this.images_limit_state = true;
    }
	}

	onRemove(event: File) {
		console.log(event);
    this.images_limit_state = false;
		this.files.splice(this.files.indexOf(event), 1);
	}

  uploadImages() {
    if (this.files.length !== 16) {
      this.warning_state = true;
    }
    else {
      this.startUpload();
    }
  }

  loading: boolean = false;
  uploaded_num: number = 0;
  task!: AngularFireUploadTask;

  percentage: Observable<number> | undefined;
  snapshot!: Observable<any>;
  downloadURL: string = "";
  constructor(private storage: AngularFireStorage, private db: AngularFirestore, public dialog: MatDialog, private router: Router, private dataSvc: DataService) {
    this.dataSvc.getGames();
    this.dataSvc.gameNames$.subscribe((res) => {
      if (res) {
        this.games = res;
        this.gamesLoaded = !this.gamesLoaded;
      }
    })
  }

  /**
   * Checks if the game name is already in use
   * @param gameName the user input for their custom game
   */
  checkDuplicateGame = (gameName: string) => {
    this.game_name = gameName;
    // if the game exists, set the related variable to true, else false
    this.gameExists = (this.gamesLoaded && this.games.includes(gameName)) ? true : false; 
  }
  
  /**
   * Upload photos to cloud storage and log update staus
   */
  startUpload() {
    this.loading = true;
    for (let i = 0; i < this.files.length; i++) {
      this.file = this.files[i];
      // The storage path
      const path = `${this.game_name}/${Date.now()}-${this.file.name}`;

      // The main task
      this.task = this.storage.upload(path, this.file);

      // storage set up
      const storage = getStorage();
      const storageRef = ref(storage, path)
      const uploadTask = uploadBytesResumable(storageRef, this.file);

      uploadTask.on("state_changed",
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        (error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break;
            case 'storage/canceled':
              // User canceled the upload
              break;
      
            // ...
      
            case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        }, 
        async () => {
          // get download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // set a document of an uploaded image
            this.db.collection(this.game_name).doc(i.toString()).set({
              "imageUrl": path,
              "downloadUrl": downloadURL,
              "winCount": 0
            }, { merge : true });
            this.uploaded_num = this.uploaded_num + 1;
            console.log("uploaded_num: ", this.uploaded_num);
            if (this.uploaded_num === 16) {
              this.loading = false;
              this.confirmDialog();
            }    
          })
        }
      )  
    }

  }

  /**
   * confirmation that images have uploaded
   */
  confirmDialog(): void {
    const title = "Game was successfully created."
    const message = "Would you like to go to Main page?";
    const no_bool = false;
    const yes_bool = true;

    const dialogData = new ConfirmDialogModel(title, message, no_bool, yes_bool);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      this.result = dialogResult;
      // if the user wants to play the game right away
      this.router.navigateByUrl("home");
      if(this.result === true) {
        this.router.navigateByUrl("home");
      }
    });
  }

  /**
   * navigate home
   */
  goToHomePage() {
    this.router.navigateByUrl("home");
  }

}
