import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import {
  AngularFireDatabase,
  AngularFireList,
} from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize, Observable } from 'rxjs';
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
  constructor(
    private angularFireStorage: AngularFireStorage,
    private db: AngularFireDatabase
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
   * @param numberItems
   * @returns
   */
  getFiles(numberItems): AngularFireList<FileUpload> {
    console.log(
      'filesss',
      this.db.list(this.basePath, (ref) => ref.limitToLast(numberItems))
    );

    return this.db.list(this.basePath, (ref) => ref.limitToLast(numberItems));
  }

  /**
   * Delete file selected file
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

  getFileList() {
    try {
      const ref = this.angularFireStorage.ref(this.basePath);
      const myurlsubscription = ref.listAll().subscribe((data) => {
        console.log("Data::",data);
        
        for (let i = 0; i < data.items.length; i++) {
          let name = data.items[i].name;
          let key = this.angularFireStorage.ref(data.items[i].name);
          let url = key.getDownloadURL().subscribe((data) => {
            this.filelist.push({
              name: name,
              key: key,
              url: url,
            });
          });
        }
      });
    } catch (error) {
      console.log('Error', error);
    }
  }
}
