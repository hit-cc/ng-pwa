import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import {
  AngularFireDatabase,
  AngularFireList,
} from '@angular/fire/compat/database';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {
  onValue,
  query,
  ref,
  getDatabase,
  limitToLast,
} from 'firebase/database';
import { finalize, map, Observable } from 'rxjs';
import { FileUpload } from 'src/app/models/firebase-store/storeFile.model';

@Injectable({
  providedIn: 'root',
})
export class FirebaseStorageService {
  selectedFile: File = null;
  _url: string;
  downloadURL: Observable<string>;
  basePath = '/ngpwa_Images';
  _curr_date = new Date();
  formatedDate = formatDate(this._curr_date, 'yyyy_MM_dd_HH_mm_ss', 'en-US');
  filelist = [];
  _dbs = getDatabase();
  _imagesList: any[] = [];
  constructor(
    private angularFireStorage: AngularFireStorage,
    private db: AngularFireDatabase,
    private afstore: AngularFirestore
  ) {}

  ngOnInit(): void {}

  /**
   * Upload file to firebase storage
   * @param fileUpload
   * @returns
   */
  uploadFileToStorage(fileUpload: FileUpload): Observable<number> {
    const filePath = `${this.basePath}/${this.formatedDate}_${fileUpload.file.name}`;
    const storageRef = this.angularFireStorage.ref(filePath);
    const uploadTask = this.angularFireStorage.upload(
      filePath,
      fileUpload.file
    );

    uploadTask
      .snapshotChanges()
      .pipe(
        finalize(() => {
          let randomNumb = Math.floor(100000 + Math.random() * 900000);
          storageRef.getDownloadURL().subscribe((downloadURL) => {
            fileUpload.url = downloadURL;
            fileUpload.name = `${randomNumb}_${fileUpload.file.name}`;
            this.saveFileData(fileUpload);
          });
        })
      )
      .subscribe();

    return uploadTask.percentageChanges();
  }

  /**
   * save file in firebase Realtime Database
   * @param fileUpload
   */
  saveFileData(fileUpload: FileUpload): void {
    this.db.list(this.basePath).push(fileUpload);
  }

  /**
   * get number of files as per params you pass number from realtime Database
   * number of files return as per number para pass to limitToLast
   * @param numberItems
   * @returns
   */
  getFiles(numberItems): AngularFireList<FileUpload> {
    return this.db.list(this.basePath, (ref) => ref.limitToLast(numberItems));
  }

  getAllFiles() {
    return this.db.list(this.basePath, (ref) => ref);
  }

  /**
   * Delete selected file
   * @param fileUpload
   */
  deleteFile(fileUpload: FileUpload): void {
    this.deleteFileDatabase(fileUpload.key)
      .then(() => {
        this.deleteFileStorage(fileUpload.name);
      })
      .catch((error) => console.log(error));
  }

  /**
   *
   * @param key
   * @returns
   */
  deleteFileDatabase(key: string): Promise<void> {
    return this.db.list(this.basePath).remove(key);
  }

  /**
   *
   * @param name
   */
  deleteFileStorage(name: string): void {
    const storageRef = this.angularFireStorage.ref(this.basePath);
    storageRef.child(name).delete();
  }

  /**
   * get list of images form Firebase Realtime Storage..
   * collection naem :-  ngpwa_Images
   * @returns
   */
  getAllImages() {
    this._imagesList = [];
    const starCountRef = ref(this._dbs, 'ngpwa_Images/');
    this.db, 'ngpwa_Images/';
    onValue(starCountRef, (snapshot) => {
      this._imagesList.push(snapshot.val());
    });
    return this._imagesList;
  }

  /**
   * get user list from firebase storage
   * @returns
   */
  getUsers() {
    return this.afstore.collection('users').snapshotChanges();
  }

  /**
   * delete user through id
   * @param userId
   */
  deleteUser(userId: string) {
    try {
      this.afstore.doc('users/' + userId).delete();
    } catch (error) {
      console.log('catch error', error);
    }
  }
}
