import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UsersComponent } from 'src/app/components/users/users.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



@NgModule({
  declarations: [
    UsersComponent
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatToolbarModule,
    BrowserAnimationsModule
    
  ],
  exports:[
    MatTableModule,
    MatPaginatorModule,
    MatToolbarModule,
  ]
})
export class AngularMaterialModule { }
