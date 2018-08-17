import { environment } from './../../../../environments/environment';
import { TableComponent } from './../../../ng-relax/components/table/table.component';
import { NzMessageService } from 'ng-zorro-antd';
import { QueryNode } from './../../../ng-relax/components/query/query.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/ng-relax/services/http.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

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

  
  tableNode = [ '下单时间', '订单编号', '订单状态', '物流编号', '商品子编号', '商品名称', '数量', '单价', '运费', '总价', '会员ID', '收货人信息', '所属门店', '备注' ];

  checkedItems: any[] = [];

  @ViewChild('EaTable') table: TableComponent;

  constructor(
    private http    : HttpService,
    private message : NzMessageService
  ) { }

  ngOnInit() {
  }

  showModal: any;
  modalTitle: string;
  modalForm = { remark: null, orderStatus: null, logisticNum: null };
  operation(source): void {
    if (!this.checkedItems.length) {
      this.message.warning('请选择数据')
    } else if (this.checkedItems.length > 1) {
      this.message.warning('请选择一条数据')
    } else {
      this.showModal = source;
      this.modalForm = { remark: null, orderStatus: null, logisticNum: null };
      if (source == 1) {
        this.table.dataSet.map(res => {
          if (res.id == this.checkedItems[0]) {
            this.modalForm.remark = res.remark;
          }
        })
      }
    }
  }
  enterModal() {
    if (this.showModal == 1 && !this.modalForm.remark) {
      this.message.warning('请输入备注信息');
    } else if (this.showModal == 2 && !(typeof this.modalForm.orderStatus === 'number')) {
      this.message.warning('请选择订单状态');
    } else if (this.showModal == 3 && !this.modalForm.logisticNum) {
      this.message.warning('请输入物流编号');
    } else {
      let params: any = this.modalForm;
      params.orderItemId = this.checkedItems[0];
      this.http.post(this.showModal == 1 ? '/order/updateRemark' : this.showModal == 2 ? '/order/updateOrderStatus' : '/order/uploadLogisticNum', {
        paramJson: JSON.stringify(params)
      }).then(res => {
        this.showModal = false;
        this.table._request();
        this.checkedItems = [];
      })
    }
  }

}