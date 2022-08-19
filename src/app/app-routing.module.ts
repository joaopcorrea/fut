import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FieldComponent } from './field/field.component';
import { PackComponent } from './pack/pack.component';

const routes: Routes = [
  { path: 'pack', component: PackComponent},
  { path: '**', component: FieldComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
