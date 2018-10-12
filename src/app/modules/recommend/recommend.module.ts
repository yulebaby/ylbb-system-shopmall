import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecommendRoutingModule } from './recommend-routing.module';
import { ListComponent } from './list/list.component';
import { NgRelaxModule } from 'src/app/ng-relax/ng-relax.module';

@NgModule({
  imports: [
    CommonModule,
    RecommendRoutingModule,
    NgRelaxModule
  ],
  declarations: [ListComponent]
})
export class RecommendModule { }
