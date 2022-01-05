import { Injectable } from '@angular/core';
import {
  AngularFireDatabase,
  AngularFireList,
} from '@angular/fire/compat/database';
import { ref, getDatabase, onValue } from 'firebase/database';

@Injectable()
export class GalleryService {
  imageDetailsList: AngularFireList<any>;
  constructor(private fireDatabase: AngularFireDatabase) {}

  getImageList() {
    this.fireDatabase.list('imageDetails');
  }

  //this method store image details in realtime database
  insertImageDetails(imageDetails) {
    this.imageDetailsList = this.fireDatabase.list('/ngpwa_gallery');
    this.imageDetailsList.push(imageDetails);
  }

  getAllFiles() {
    return this.fireDatabase.list('ngpwa_gallery/', (ref) => ref);
  }
}
