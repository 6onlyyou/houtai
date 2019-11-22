/**
 * 账单管理 账单列表
 */
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>账单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="搜索：">
        <el-input size="small" v-model="formInline.userId" placeholder="输入用户ID"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input size="small" v-model="formInline.nickName" placeholder="输入用户昵称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select size="small" v-model="formInline.type" placeholder="请选择">
          <el-option v-for="type in type" :label="type.key" :value="type.value" :key="type.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table size="small" :data="listData" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column align="center" type="index" width="60">
      </el-table-column>
      <el-table-column sortable prop="userId" label="用户ID" width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column sortable prop="name" label="消费名称" width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column sortable prop="count" label="虚拟币数量" width="150" show-overflow-tooltip>
      </el-table-column>
      <el-table-column sortable prop="time" label="时间" width="300" show-overflow-tooltip>
        <template slot-scope="scope">
          <div>{{scope.row.time|time}}</div>
        </template>
      </el-table-column>
  <!--    <el-table-column align="center" label="操作" min-width="100">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">预览</el-button>
        </template>
      </el-table-column>-->
    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
  </div>
</template>

<script>
import { OrderList} from '../../api/payMG'
import Pagination from '../../components/Pagination'
export default {
  data() {
    return {
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      title: '预览',
      type: [
        { key: '请选择', value: "" },
        { key: '微信充值', value: '微信充值' },
        { key: '支付宝充值', value: '支付宝充值' },
        { key: '公众号微信支付', value:'公众号微信支付'  },
        { key: '招聘虚拟币领取', value: '招聘虚拟币领取'},
        { key: '广告虚拟币领取', value: '广告虚拟币领取' },
        { key: '发布广告', value: '发布广告' },
        { key: '发布招聘', value: '发布招聘' },
        { key: '开启广告', value:'开启广告' },
        { key: '开启招聘', value: '开启招聘' },
        { key: '关闭广告', value:'关闭广告' },
        { key: '关闭招聘', value: '关闭招聘' },
        { key: '邀请码奖励', value: '邀请码奖励'},
      ],
      formInline: {
        page: 1,
        limit: 10,
        type: '',
        token: localStorage.getItem('logintoken')
      },
      userparm: [], //搜索权限
      listData: [], //用户数据
      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 10
      }
    }
  },
  // 注册组件
  components: {
    Pagination
  },
  /**
   * 数据发生改变
   */

  /**
   * 创建完毕
   */
  created() {
    this.getdata(this.formInline)
  },

  /**
   * 里面的方法只有被调用才会执行
   */
  methods: {
    // 获取公司列表
    getdata(parameter) {
     this.loading = true
      /***
       * 调用接口，注释上面模拟数据 取消下面注释
       */
      OrderList(parameter)
        .then(res => {
          this.loading = false
          if (res.success == false) {
            this.$message({
              type: 'info',
              message: res.msg
            })
          } else {
            this.listData = res.data
            // 分页赋值
            this.pageparm.currentPage = this.formInline.page
            this.pageparm.pageSize = this.formInline.limit
            this.pageparm.total = res.count
          }
        })
        .catch(err => {
          this.loading = false
          this.$message.error('菜单加载失败，请稍后再试！')
        })
    },
    // 分页插件事件
    callFather(parm) {
      this.formInline.page = parm.currentPage
      this.formInline.limit = parm.pageSize
      this.getdata(this.formInline)
    },
    // 搜索事件
    search() {
      this.getdata(this.formInline)
    },
    // 关闭编辑、增加弹出框
    closeDialog(formName) {
      this.editFormVisible = false
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>
.user-search {
  margin-top: 20px;
}
.userRole {
  width: 100%;
}
</style>

 
 

