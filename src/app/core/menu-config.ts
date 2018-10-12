export const MenuConfig = [
  {
    title : '首页',
    key   : '/home',
    icon  : 'anticon-home',
    disabled: true,
    isLeaf: true
  },
  {
    title : '商品管理',
    key   : '/home/commodity',
    icon  : 'anticon-team',
    children : [
      {
        title : '商品列表',
        key   : '/home/commodity/list',
        isLeaf: true
      },
      {
        title : '新增商品',
        key   : '/home/commodity/detail',
        isLeaf: true
      }
    ]
  },
  {
    title : '订单管理',
    key   : '/home/order',
    icon  : 'anticon-database',
    disabled: true,
    isLeaf: true
  },
  {
    title : '分润管理',
    key   : '/home/distribution',
    icon  : 'anticon-shop',
    disabled: true,
    isLeaf: true
  },
  {
    title : '售后管理',
    key   : '/home/aftersale',
    icon  : 'anticon-warning',
    disabled: true,
    isLeaf: true
  },
  {
    title : '轮播管理',
    key   : '/home/broadcast',
    icon  : 'anticon-desktop',
    disabled: true,
    isLeaf: true
  },
  {
    title : '推荐管理',
    key   : '/home/recommend',
    icon  : 'anticon-link',
    disabled: true,
    isLeaf: true
  },
];