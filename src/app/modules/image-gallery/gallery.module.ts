import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GalleryRoutingModule } from './gallery-routing.module';
import { GalleryComponent } from './gallery/gallery.component';
import { ImageComponent } from './gallery/image/image.component';
import { ReactiveFormsModule } from '@angular/forms';
import { GalleryService } from 'src/app/services/gallery/gallery.service';

@NgModule({
  declarations: [GalleryComponent, ImageComponent],
  imports: [CommonModule, GalleryRoutingModule, ReactiveFormsModule],
  providers: [GalleryService],
})
export class GalleryModule {}
