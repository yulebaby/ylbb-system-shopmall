import { QueryNode } from './../../../ng-relax/components/query/query.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/ng-relax/services/http.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  queryNode: QueryNode[] = [
    {
      label       : '订单编号',
      key         : 'packageOrderNum',
      type        : 'input'
    },
    {
      label       : '收货手机号',
      key         : 'mobilePhone',
      type        : 'input'
    },
    {
      label       : '订单状态',
      key         : 'orderStatus',
      type        : 'select',
      options     : [ 
        { id: 0, name: '未支付' },
        { id: 1, name: '已支付(待发货)' },
        { id: 2, name: '已关闭(过期/取消)' },
        { id: 3, name: '已删除' },
        { id: 4, name: '已发货' },
        { id: 5, name: '已签收' },
        { id: 6, name: '已完成' },
        { id: 7, name: '售后未处理' },
        { id: 8, name: '售后处理中(换)' },
        { id: 9, name: '售后处理已完成(换)' },
        { id: 10, name: '售后处理中(退)' },
        { id: 11, name: '售后处理已完成 (退)' }
      ]
    },
    {
      label       : '下单时间',
      key         : 'orderCreateTime',
      type        : 'datepicker'
    },
    {
      label       : '商品编号',
      key         : 'subcode',
      type        : 'input'
    },
    {
      label       : '商品名称',
      key         : 'productName',
      type        : 'input'
    },
  ];

  
  tableNode = [ '下单时间', '订单编号', '订单状态', '物流编号', '商品编号', '商品名称', '数量', '单价', '运费', '总价', '会员ID', '收货人信息', '所属门店', '备注' ];

  checkedItems: any[] = [];

  @ViewChild('EaTable') table;

  constructor(
    private http    : HttpService
  ) { }

  ngOnInit() {
  }

  operation(): void {
    if (!this.checkedItems.length) {
      console.log('请选择数据')
    } else if (this.checkedItems.length > 1) {
      console.log('请选择一条数据')
    } else {

    }
  }

}
