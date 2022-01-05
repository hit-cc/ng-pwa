import { Component, OnInit } from '@angular/core';
import { GalleryService } from 'src/app/services/gallery/gallery.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  imageList: any[] = [];
  rowImageArray: any[] = [];
  constructor(private galleryService: GalleryService) {}

  ngOnInit(): void {
    this.getAllFiles();
  }

  getAllFiles() {
    this.imageList = [];
    let obj = {};
    this.galleryService
      .getAllFiles()
      .snapshotChanges()
      .subscribe((val: any) => {
        val.forEach((element) => {
          if (element.payload.val().category) {
            obj = {
              key: element.key,
              caption: element.payload.val().caption || null,
              category: element.payload.val().category || null,
              imageUrl: element.payload.val().imageUrl || null,
            };
            this.imageList.push(obj);
            this.rowImageArray = Array.from(
              Array(Math.ceil(this.imageList.length / 3)).keys()
            );
          }
        });
      });
    console.log('Img List::', this.imageList);
  }
}
