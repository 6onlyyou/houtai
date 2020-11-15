// 导入组件
import Vue from 'vue';
import Router from 'vue-router';
// 登录
import login from '@/views/login';
// 首页
import index from '@/views/index';
/**
 * 基础菜单
 */
// 商品管理
import Goods from '@/views/goods/Goods';
// 商品管理
import exchangeGoods from '@/views/goods/exchangeGoods';




// 交易订单
import Order from '@/views/pay/Order';

// 广告管理
import guanggao from '@/views/system/guanggao';
// 招聘管理
import zhaopin from '@/views/system/zhaopin';
//求职列表
import qiuzhi from '@/views/system/userqiuzhilist';
//招聘列表
import userlist from '@/views/system/userlist';
//公告栏管理
import gonggaolan from '@/views/notice/gonggaolan';




// 启用路由
Vue.use(Router);

// 导出路由
export default new Router({
  routes: [{
    path: '/',
    name: '',
    component: login,
    hidden: true,
    meta: {
      requireAuth: false
    }
  }, {
    path: '/login',
    name: '登录',
    component: login,
    hidden: true,
    meta: {
      requireAuth: false
    }
  }, {
    path: '/index',
    name: '首页',
    component: index,
    iconCls: 'el-icon-tickets',
    children: [
    {
      path: '/goods/Goods',
      name: '商品管理',
      component: Goods,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/goods/exchangeGoods',
      name: '商品管理',
      component: exchangeGoods,
      meta: {
        requireAuth: true
      }
    }, {
      path: '/pay/Order',
      name: '交易订单',
      component: Order,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/system/guanggao',
      name: '广告管理',
      component: guanggao,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/system/zhaopin',
      name: '招聘管理',
      component: zhaopin,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/system/userlist',
      name: '招聘列表',
      component: userlist,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/system/userqiuzhilist',
      name: '求职列表',
      component: qiuzhi,
      meta: {
        requireAuth: true
      }
    }, {
      path: '/machine/gonggaolan',
      name: '支付配置信息',
      component: gonggaolan,
      meta: {
        requireAuth: true
      }
    }]
  }]
})
