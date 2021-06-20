import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HometabPage } from './hometab.page';

const routes: Routes = [
  {
    path: '',
    component: HometabPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HometabPageRoutingModule {}
