import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FAQPage } from './faq.page';

const routes: Routes = [
  {
    path: '',
    component: FAQPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FAQPageRoutingModule {}
