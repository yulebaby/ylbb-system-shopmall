import { environment } from './../../../../environments/environment';
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { QueryNode } from 'src/app/ng-relax/components/query/query.component';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  showRemark: boolean;

  remark: string;
  status: number;

  domain = environment.domain;



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

  
  tableNode = [ '下单时间', '订单编号', '商品编号', '商品名称', '数量', '单价', '运费', '总价', '会员ID', '收货人信息', '所属门店' ];

  checkedItems: any[] = [];

  @ViewChild('EaTable') table;

  constructor(
    private http    : HttpService,
    private message : NzMessageService
  ) { }

  ngOnInit() {
  }

  operation(): void {
    if (!this.checkedItems.length) {
      this.message.warning('请选择一条需要修改的数据');
    } else if (this.checkedItems.length > 1) {
      this.message.warning('只可以选择一条数据');
    } else {
      this.showRemark = true;
      this.remark = '';
      this.status = null;
    }
  }

  enterRemark() {
    if (!this.remark) {
      this.message.warning('请输入备注');
    } else if (!this.status) {
      this.message.warning('请选择退换货');
    } else {
      this.http.post('/order/updateOrderItemStatus', { paramJson: JSON.stringify({ 
        id: this.checkedItems[0],
        status: this.status,
        remark: this.remark
      })
      }).then(res => {
        this.showRemark = false;
     })
    }
  }

}
