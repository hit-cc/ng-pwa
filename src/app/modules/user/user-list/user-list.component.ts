import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FirebaseStorageService } from 'src/app/services/firebase-storage/firebase-storage.service';
import { MainService } from 'src/app/services/main.service';
export interface TableElement {
  id: string;
  name: string;
  email: string;
  website: string;
}

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {
  Data: any[] = [];
  col: string[] = ['id', 'name', 'email', 'website'];
  dataSource = new MatTableDataSource<TableElement>(this.Data);
  _userData: any[] = [];
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  fireUserData: any;
  constructor(
    private mainService: MainService,
    private firebaseStorageService: FirebaseStorageService
  ) {}

  ngOnInit(): void {
    this.getDummyUserList();
    this.getUserList();
  }

  /**
   * get all list of users from firestore database
   */
  getUserList() {
    this.firebaseStorageService.getUsers().subscribe(
      (res) => {
        if (res) {
          this._userData = res.map((e) => {
            return {
              id: e.payload.doc.id,
              data: e.payload.doc.data(),
            };
          });
          console.log('_userData', this._userData);
        }
      },
      (error) => console.log(error)
    );
  }

  /**
   * get dummy users list from
   */
  getDummyUserList() {
    this.mainService.getUsers().subscribe((res) => {
      this.dataSource = new MatTableDataSource<TableElement>(res);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
      }, 0);
    });
  }
}
