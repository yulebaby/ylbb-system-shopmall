import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { QueryNode } from 'src/app/ng-relax/components/query/query.component';

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

  
  tableNode = [ '下单时间', '订单编号', '订单状态', '物流编号', '商品编号', '商品名称', '数量', '单价', '运费', '总价', '会员ID', '收货人信息', '所属门店' ];

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
