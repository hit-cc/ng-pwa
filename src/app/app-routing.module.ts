import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './components/users/users.component';

const appRoutes: Routes = [
  {
    path: 'users',
    component:UsersComponent
    // loadChildren:()=> import('./modules/angular-material').then((m)=>m.AngularMaterialModule)
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
