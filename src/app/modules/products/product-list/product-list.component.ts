import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { FirebaseStorageService } from 'src/app/services/firebase-storage/firebase-storage.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
  }
}
