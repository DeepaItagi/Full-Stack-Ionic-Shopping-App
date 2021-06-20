import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HometabPageRoutingModule } from './hometab-routing.module';

import { HometabPage } from './hometab.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HometabPageRoutingModule
  ],
  declarations: [HometabPage]
})
export class HometabPageModule {}
