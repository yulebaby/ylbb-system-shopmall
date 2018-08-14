import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/ng-relax/services/http.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  queryNode = [
    {
      label       : '商品编号',
      key         : 'productNum',
      type        : 'input'
    },
    {
      label       : '品牌',
      key         : 'brandId',
      type        : 'select',
      optionsUrl  : '/brand/listShopBrand'
    },
    {
      label       : '状态',
      key         : 'productStatus',
      type        : 'select',
      options     : [ { name: '上架', id: 1 }, { name: '下架', id: 0 } ],
    },
    {
      label       : '是否推荐',
      key         : 'recommentStatus',
      type        : 'select',
      options     : [ { name: '推荐', id: 1 }, { name: '不推荐', id: 0 } ]
    }
  ];

  
  tableNode = ['序号', '商品编码', '商品名称', '品牌', '推荐', '规格', '原价', '活动价', '库存', '限购', '分润', '操作'];

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
