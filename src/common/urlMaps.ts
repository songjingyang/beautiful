import { CityRecommend } from './../models/Strategy';
import { HotelPage } from './../models/Resource';
const urlMaps: {
  [key: string]: string;
} = {
  getPolicy: '/file/basematerial/aliyun/oss/policy',
  login: '/auth/oauth/token',
  logout: '/auth/token/logout',
  getCode: '/code',
  getCityList: '/admin/basecity/list',
  getMenuInfo: '/admin/menu/tree',
  getScenicSpotPage: '/admin/basescenery/page',
  CreateScenicSpot: '/admin/basescenery',
  getScenicSpotSingle: '/admin/basescenery',
  DeleteScenic: '/admin/basescenery',
  baseHotelUrl: '/admin/basehotel/page',
  HotelUrl: '/admin/basehotel',
  baseRestaurantUrl: '/admin/baserestaurant/page',
  RestaurantUrl: '/admin/baserestaurant',
  baseTripModeUrl: '/admin/basetirp/page',
  TripModeUrl: '/admin/basetirp',
  basePictureUrl: '/admin/baseimage/page',
  PictureUrl: '/admin/baseimage',
  baseVideoUrl: '/admin/basevideo/page',
  VideoUrl: '/admin/basevideo',
  baseBasicProductsUrl: '/admin/baseproduct/page',
  BasicProductsUrl: '/admin/baseproduct',
  baseTouris: '/admin/bmtourproduct/page',
  baseTourisUrl: '/admin/bmtourproduct',
  EditTourRecommoned: '/admin/bmtourproduct/recommendById',
  baseTag: '/admin/bmtourtag/page',
  baseTagUrl: '/admin/bmtourtag',
  editTag: '/admin/bmtourtag/updateStateById',
  baseRoleUrl: '/admin/role/page',

  baseOwnPicture: '/admin/bmmaterial/page',
  deleteImg: '/admin/bmmaterial',
  baseRecommend: '/admin/bmtourproduct/recommendById',
  baseUp: '/admin/bmtourproduct/stateById',
  baseCalendarPrice: '/admin/bmtourproductdays/page',
  basePictuerStrategy: '/admin/bmstrategyimage/page',
  PictuerStrategyUrl: '/admin/bmstrategyimage',

  getPictureCity: '/admin/baseimage/listCityByType',

  baseAdvertisement: '/admin/bmadvert/page',
  AdvertisementUrl: '/admin/bmadvert',
  baseComment: '/admin/usercompose/page',
  baseCommentUrl: '/admin/usercompose',
  baseVideoStrategy: '/admin/bmstrategyvideo/page',
  VideoStrategyUrl: '/admin/bmstrategyvideo',
  baseCityStraegyPage: '/admin/bmstrategycity/page',
  CityStraegyUrl: '/admin/bmstrategycity',
  baseAnswer: '/admin/useranswers/getUserAnswersPage',
  baseAnswerUrl: '/admin/useranswers',
  userAnswer: '/admin/useranswers/page',
  baseBroadcast: '/admin/bmcarousel/page',
  BroadcastUrl: '/admin/bmcarousel',
  baseRelation: '/admin/bmtourproductdays/getRelationProductPage',

  videoUp: '/admin/bmstrategyvideo/operation',
  imageUp: '/admin/bmstrategyimage/operation',
  CityRecommend: '/admin/bmstrategycity/recommend',
  CityState: '/admin/bmstrategycity/operation',
  EditProducts: '/admin/bmstrategycityproduct/relationProductById',
  baseUserAnswer: '/admin/useranswers/page',
  upOrDown: '/admin/useranswers/updateShelfById',
  editState: '/admin/useranswers/updateStateById',

  travelsPage: '/admin/usertravels/page',
  baseTravels: '/admin/usertravels',
  travelsUpOrDown: '/admin/usertravels/updateShelfById',
  travelsPass: '/admin/usertravels/updateStateById',
  travelsCommend: '/admin/usertravels/updateRecommendById',
  getOrderPage: '/admin/order/page',
  getSearchOrder: '/admin/order',
  getAfterSales: '/admin/order/getByRunningNumber',
  getUserList: '/admin/user/page',
  EnableShutdown: ''
};

// export const baseUrl =
export const baseUrl =
  // 'http://miramartravel-gateway:9950';
  // "http://192.168.1.20:9950"//内网测试
  'http://120.77.207.21'; //线上
// 'http://192.168.1.35:9950'
// 'http://192.168.1.201:9950'

export const OssUrl = 'http://miramartravel.oss-cn-shenzhen.aliyuncs.com/';
export default urlMaps;
