import { Component, OnInit } from '@angular/core';
import { FirebaseStorageService } from 'src/app/services/firebase-storage/firebase-storage.service';
import { FileUpload } from 'src/app/models/firebase-store/storeFile.model';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.css'],
})
export class ProductAddComponent implements OnInit {
  selectedFiles: FileList;
  currentFileUpload: FileUpload;
  percentage: number;


  // new 
  error: string;
  dragAreaClass: string;
  draggedFiles: any;
  
  constructor(
    private storeService: FirebaseStorageService,
    private _snakBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  /**
   * select file
   * @param event 
   */
  onFileSelected(event) {
    this.selectedFiles = event.target.files;
  }

  /**
   * Upload file
   */
  upload(): void {
    const file = this.selectedFiles.item(0);
    this.selectedFiles = undefined;
    this.currentFileUpload = new FileUpload(file);
    this.storeService.uploadFileToStorage(this.currentFileUpload).subscribe(
      (percentage) => {
        this.percentage = Math.round(percentage);
        if (percentage == 100) {
          this._snakBar.open('File Uploaded ..!', 'close', {
            duration: 2000,
          });
        }
      },
      (error) => {
        console.log(error);
        this._snakBar.open(error, 'close', {
          duration: 3000,
        });
      }
    );
  }
}
