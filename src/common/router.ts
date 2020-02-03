import Login from '../modules/User/Login';
import PrivilegeManagement from '../modules/System/PrivilegeManagement';
import SupplierManagement from '../modules/System/SupplierManagement';
import ScenicSpot from '../modules/Resource/ScenicSpot';
import Hotel from '../modules/Resource/Hotel';
import Restaurant from '../modules/Resource/Restaurant';
import TripMode from '../modules/Resource/TripMode';
import Picture from '../modules/Resource/Picture';
import Video from '../modules/Resource/Video';
import BasicProducts from '../modules/Resource/BasicProducts';
import Tourism from '../modules/Tourism/Tourism';
import TagPage from '../modules/Admin/TagPage';
import AdvertisementPage from '../modules/Admin/AdvertisementPage';
import PictureStrategy from '../modules/PictureStrategy/PictureStrategy';
import VideoStrategy from '../modules/VideoStrategy/VideoStrategy';
import CommentPage from '../modules/Comment/CommentPage';
import CityStrategyPage from '../modules/CityStrategy/CityStrategy';
import AnswerPage from '../modules/Answer/AnswerPage';
import BroadcastPage from '../modules/Admin/BroadcastPage';
import Journey from '../modules/Journey/Journey';
import Order from '../modules/Order/Order';
import UserList from '../modules/UserList';
const routerData: any[] = [
  {
    path: '/user/login',
    component: Login,
    meta: {
      title: '登录'
    }
  },
  {
    path: '/admin/client',
    component: PrivilegeManagement,
    meta: {
      title: '菜单管理'
    }
  },
  {
    path: '/admin/supply',
    component: SupplierManagement,
    meta: {
      title: '供应商管理'
    }
  },
  {
    path: '/resources/basescenery',
    component: ScenicSpot,
    meta: {
      title: '景点'
    }
  },
  {
    path: '/resources/basehotel',
    component: Hotel,
    meta: {
      title: '酒店'
    }
  },
  {
    path: '/resources/baserestaurant',
    component: Restaurant,
    meta: {
      title: '餐厅'
    }
  },
  {
    path: '/resources/basetirp',
    component: TripMode,
    meta: {
      title: '出行方式'
    }
  },
  {
    path: '/resources/baseimage',
    component: Picture,
    meta: {
      title: '图片'
    }
  },
  {
    path: '/resources/basevideo',
    component: Video,
    meta: {
      title: '视频'
    }
  },
  {
    path: '/resources/baseproduct',
    component: BasicProducts,
    meta: {
      title: '基础产品'
    }
  },
  {
    path: '/bmtourproduct/tourism',
    component: Tourism,
    meta: {
      title: '基础产品'
    }
  },
  {
    path: '/admin/bmtourtag',
    component: TagPage,
    meta: {
      title: '出行标签管理'
    }
  },
  {
    path: '/admin/bmadvert',
    component: AdvertisementPage,
    meta: {
      title: '广告管理'
    }
  },
  {
    path: '/strategy/picture',
    component: PictureStrategy,
    meta: {
      title: '图集攻略'
    }
  },
  {
    path: '/strategy/video',
    component: VideoStrategy,
    meta: {
      title: '视频攻略'
    }
  },

  {
    path: '/admin/bmcarousel',
    component: BroadcastPage,
    meta: {
      title: '首页轮播管理'
    }
  },

  {
    path: '/usercompose/usercompose',
    component: CommentPage,
    meta: {
      title: '评论管理'
    }
  },
  {
    path: '/strategy/city',
    component: CityStrategyPage,
    meta: {
      title: '城市攻略'
    }
  },
  {
    path: '/useranswers/useranswers',
    component: AnswerPage,
    meta: {
      title: '问答管理'
    }
  },
  {
    path: '/usertravels/usertravels',
    component: Journey,
    meta: {
      title: '游记管理'
    }
  },
  {
    path: '/shoppingorder/shoppingorder',
    component: Order,
    meta: {
      title: '订单管理'
    }
  },
  {
    path: '/userlist/userlist',
    component: UserList,
    meta: {
      title: '用户列表'
    }
  }
];
export function getRouterData(): any[] {
  return routerData;
}
export default getRouterData;
