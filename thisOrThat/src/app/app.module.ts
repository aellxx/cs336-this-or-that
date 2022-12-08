import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire/compat'; 
import { AngularFirestoreModule } from '@angular/fire/compat/firestore'; 
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PhotoContainerComponent } from './components/photo-container/photo-container.component';
import { ResultComponent } from './components/result/result.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { GamePageComponent } from './pages/game-page/game-page.component';
import { UploaderComponent } from './pages/create-game-page/uploader.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';


@NgModule({
  declarations: [
    AppComponent,
    GamePageComponent,
    PhotoContainerComponent,
    ResultComponent,
    UploaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),    
    AngularFirestoreModule, BrowserAnimationsModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule,
    NgxDropzoneModule,
    MatInputModule,
    FormsModule,
    MatListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
