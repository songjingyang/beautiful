import { isUrl } from '../utils/utils';

const menuData = [
  // {
  //   name: "主页",
  //   icon: "home",
  //   path: "/menu",
  //   children: [
  //     {
  //       name: '主页',
  //       path: 'home',
  //     },
  //   ]
  // },
  {
    name: '资源库',
    icon: 'appstore',
    path: '/resources',
    children: [
      {
        name: '景点',
        path: 'scenicSpot'
      },
      {
        name: '酒店',
        path: 'hotel'
      },
      {
        name: '餐厅',
        path: 'restaurant'
      },
      {
        name: '出行方式',
        path: 'tripmode'
      },
      {
        name: '图片',
        path: 'picture'
      },
      {
        name: '视频',
        path: 'video'
      },
      {
        name: '基础产品',
        path: 'basicProducts'
      }
    ]
  },
  {
    name: '系统配置',
    icon: 'setting',
    path: '/system',
    children: [
      {
        name: '权限管理',
        path: 'privilege'
      },
      // {
      //   name :"账号管理",
      //   path :"account"
      // },
      // {
      //   name :"操作记录",
      //   path:"operationRecord"
      // },
      {
        name: '供应商管理',
        path: 'supply'
      }
    ]
  }
];

function formatter(data: any[], parentPath: string) {
  return data.map(item => {
    let path: string = item.path;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || false
    };
    if (item.children) {
      result.children = formatter(
        item.children,
        `${parentPath}${item.path}/`
        // item.authority
      );
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData, '');
