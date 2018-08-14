import { NgRelaxModule } from './../../ng-relax/ng-relax.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AftersaleRoutingModule } from './aftersale-routing.module';
import { ListComponent } from './list/list.component';

@NgModule({
  imports: [
    CommonModule,
    AftersaleRoutingModule,
    NgRelaxModule
  ],
  declarations: [ListComponent]
})
export class AftersaleModule { }
