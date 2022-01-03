import { Component, OnInit } from '@angular/core';
import { onValue } from 'firebase/database';
import { map } from 'rxjs';
import { FirebaseStorageService } from 'src/app/services/firebase-storage/firebase-storage.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  constructor(private firebaseStoreService: FirebaseStorageService) {}
  _imageList: any = [];
  _fileList: any[] = [];
  ngOnInit(): void {
    this.getAllImages();
    this.getFile();
  }

  getAllImages() {
    this._imageList = [];
    this.firebaseStoreService
      .getAllFiles()
      .stateChanges()
      .subscribe((data: any) => {
        let obj = {
          key: data.key || null,
          name: data.payload.val().name || null,
          url: data.payload.val().url || null,
        };
        this._imageList.push(obj);
      });
    console.log('_imageList:::', this._imageList);
  }

  /**
   * get files
   * set limits of file
   */
  getFile() {
    this._fileList = [];
    this.firebaseStoreService
      .getFiles(5)
      .stateChanges()
      .subscribe((data) => {
        let obj = {
          id: data.key || null,
          name: data.payload.val().name || null,
          url: data.payload.val().url || null,
        };
        this._fileList.push(obj);
      });
    console.log('_File List', this._fileList);
  }
}
