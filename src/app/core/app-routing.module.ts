import { HomeComponent } from './../base/home/home.component';
import { UserInfoResolver } from './userInfo-resolver.service';
import { BaseComponent } from '../base/base.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'home',
    component: BaseComponent,
    resolve: { userInfo: UserInfoResolver },
    children: [
      {
        path: '',
        data: { title: '工作台', hideTitle: true },
        component: HomeComponent
      },
      {
        path: 'commodity',
        data: { title: '商品管理' },
        loadChildren: 'src/app/modules/commodity/commodity.module#CommodityModule'
      },
      {
        path: 'order',
        data: { title: '订单管理' },
        loadChildren: 'src/app/modules/order/order.module#OrderModule'
      },
      {
        path: 'distribution',
        data: { title: '分润管理' },
        loadChildren: 'src/app/modules/distribution/distribution.module#DistributionModule'
      },
      {
        path: 'aftersale',
        data: { title: '售后管理' },
        loadChildren: 'src/app/modules/aftersale/aftersale.module#AftersaleModule'
      },
      {
        path: 'broadcast',
        data: { title: '轮播管理' },
        loadChildren: 'src/app/modules/broadcast/broadcast.module#BroadcastModule'
      },
      {
        path: 'recommend',
        data: { title: '推荐管理' },
        loadChildren: 'src/app/modules/recommend/recommend.module#RecommendModule'
      },
    ]
  },
  {
    path: 'system',
    data: { title: '系统管理' },
    loadChildren: 'src/app/modules/system/system.module#SystemModule'
  },
  {
    path: '**',
    redirectTo: '/system/error/404',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
