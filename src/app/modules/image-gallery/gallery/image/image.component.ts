import { Component, OnInit } from '@angular/core';
import { AngularFireAction } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';
import { GalleryService } from 'src/app/services/gallery/gallery.service';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css'],
})
export class ImageComponent implements OnInit {
  imgSrc: string = 'assets/images/default_image.png';
  selectedImage: any;
  isSubmitted: boolean = false;
  imageUploadForm = new FormGroup({
    caption: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required),
    imageUrl: new FormControl('', Validators.required),
  });
  constructor(
    private storage: AngularFireStorage,
    private galleryService: GalleryService,
    private _snakBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  showImagePrev(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => (this.imgSrc = e.target.result);
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = event.target.files[0];
    } else {
      this.imgSrc = 'assets/images/default_image.png';
      this.selectedImage = null;
    }
  }

  onSubmitFileUpload(formValue) {
    this.isSubmitted = true;
    if (this.imageUploadForm.valid) {
      let filePath = `ngpwa_gallery/${
        formValue.category
      }/${this.selectedImage.name
        .split('.')
        .slice(0, -1)
        .join('.')}_${new Date().getTime()}`;
      let fileRef = this.storage.ref(filePath);

      this.storage
        .upload(filePath, this.selectedImage)
        .snapshotChanges()
        .pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe(
              (url) => {
                if (url) {
                  formValue['imageUrl'] = url;
                  this.galleryService.insertImageDetails(formValue);
                  this._snakBar.open('Image Uploaded Successfully !', 'close', {
                    duration: 2000,
                  });
                  this.resetForm();
                }
              },
              (error) => {
                this._snakBar.open(error.message, 'close', {
                  duration: 2000,
                });
              }
            );
          })
        )
        .subscribe((res) => {
          console.log('Response::', res);
        });
    }
  }

  get fc() {
    return this.imageUploadForm.controls;
  }

  resetForm() {
    this.imageUploadForm.reset();
    this.imageUploadForm.setValue({
      caption: '',
      imageUrl: '',
      category: 'animal',
    });
    this.imgSrc = 'assets/images/default_image.png';
    this.selectedImage = null;
    this.isSubmitted = false;
  }
}
