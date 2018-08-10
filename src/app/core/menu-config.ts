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
        title : '商品详情',
        key   : '/home/commodity/detail',
        isLeaf: true
      }
    ]
  }
];