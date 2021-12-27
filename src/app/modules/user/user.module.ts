import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UsersComponent } from 'src/app/components/users/users.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
  declarations: [
    UsersComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatToolbarModule,
  ],
  exports:[
    MatTableModule,
    MatPaginatorModule,
    MatToolbarModule,
  ]
})
export class UserModule { }
