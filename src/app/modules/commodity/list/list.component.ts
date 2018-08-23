import { TableComponent } from './../../../ng-relax/components/table/table.component';
import { NzMessageService } from 'ng-zorro-antd';
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/ng-relax/services/http.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  showDetail: boolean;
  editCommodityId: number;

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

  
  tableNode = ['序号', '商品编码', '商品名称', '品牌', '推荐', '状态', '是否特惠', '规格', '原价', '活动价', '库存', '限购', '分润', '子编码'];

  checkedItems: any[] = [];


  showSort: boolean;
  editSortId: number;
  sortNum;

  @ViewChild('EaTable') table: TableComponent

  constructor(
    private http    : HttpService,
    private message : NzMessageService
  ) { }

  ngOnInit() {
  }

  operation(type?, value?): void {
    if (!this.checkedItems.length) {
      this.message.warning('请选择一条需要修改的数据');
    } else if (this.checkedItems.length > 1) {
      this.message.warning('只可以选择一条数据');
    } else {
      let params: any = {};
      this.table.dataSet.map(res => {
        if (res.skuId === this.checkedItems[0]){
          params.id = res.id;
          params.productNum = res.productNum;
        }
      });
      if (type && typeof value === 'number') {
        params[type] = value;
        this.http.post('/shop/updateProductStatusAndRecommentStatus', { paramJson: JSON.stringify(params) }).then(res => {
          this.table._request();
          this.checkedItems = [];
        })
      } else if (type) {
        this.showSort = true;
        this.editSortId = params.productNum
      } else  {
        this.editCommodity(params.id);
      }
    }
  }

  editCommodity(id) {
    this.showDetail = true;
    this.editCommodityId = id;
  }

  editComplate(boolean) {
    this.showDetail = false;
    if (boolean) {
      this.table._request();
    }
  }

  enterSort() {
    if (this.sortNum && parseInt(this.sortNum) > 0) {
      this.http.post('/shop/sortProduct', { paramJson: JSON.stringify({ productNum: this.editSortId, sort: this.sortNum}) }).then(res => {
        this.table._request();
        this.checkedItems = [];
        this.showSort = false;
        this.sortNum = null;
      })
    } else {
      this.message.warning('请输入正确的排名，正整数并大于0');
    }
  }

  ready(data) {
    let arr = [];
    data.map((res, index) => {
      res.productSkuList.map((list, idx) => {
        let newCell = JSON.parse(JSON.stringify(res));
        if (idx === 0) {
          newCell.hasChildren = res.productSkuList.length;
          newCell.sort = (this.table._pageInfo.pageNum - 1) * this.table._pageInfo.pageSize + index + 1;
        }
        delete newCell.productSkuList;
        delete newCell.activityPrice;
        delete newCell.price;
        arr.push(Object.assign(list, newCell))
      })
    })
    let l = data.length;
    for (let i = 0; i < l; i++) {
      data.splice(0, 1)
    }
    arr.map(res => {
      res.checked = this.checkedItems.indexOf(res.skuId) > -1;
      data.push(res)
    });
  } 

}
