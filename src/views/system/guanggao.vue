/**
* 广告管理
*/
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>广告列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="搜索：">
        <el-select size="small" v-model="formInline.isLock" placeholder="请选择" clearable @change="search">
          <el-option label="全部" value=""></el-option>
          <el-option label="开启" value="N"></el-option>
          <el-option label="关闭" value="Y"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-input size="small" v-model="formInline.city" placeholder="输入地区"></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-input size="small" v-model="formInline.id" placeholder="输入用户id"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table size="small" @selection-change="selectChange" :data="userData" highlight-current-row v-loading="loading"
      border element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column align="center" type="selection" width="50">
      </el-table-column>
      <el-table-column align="center" sortable prop="userId" label="用户账号" width="120">
      </el-table-column>
      <el-table-column align="center" sortable prop="companyName" label="公司名称" width="120">
      </el-table-column>
      <el-table-column align="center" sortable prop="numberOfVirtualCoins" label="虚拟币数量" width="150">
      </el-table-column>
      <el-table-column align="center" sortable prop="unclaimedVirtualCoins" label="剩余虚拟币数量" width="170">
      </el-table-column>
      <el-table-column align="center" sortable prop="redEnvelopeNumber" label="红包的数量" width="150">
      </el-table-column>
      <el-table-column align="center" sortable prop="advertisementContent" label="广告内容" min-width="150">
      </el-table-column>
      <el-table-column align="center" sortable prop="advertisementImg" label="广告图片" min-width="120">
      </el-table-column>
      <el-table-column align="center" sortable prop="city" label="城市" min-width="120">
      </el-table-column>
      <el-table-column align="center" sortable prop="publichDate" label="发布时间" min-width="120">
      </el-table-column>
      <el-table-column align="center" sortable prop="state" label="状态" min-width="50">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.state=='0'?nshow:fshow" active-color="#13ce66" inactive-color="#ff4949"
            @change="editType(scope.$index, scope.row)">
          </el-switch>
        </template>
      </el-table-column>

    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
  </div>
</template>

<script>
  // 导入请求方法
  import {
    advertiseQuery,
    advertiseOpen
  } from '../../api/userMG'
  import Pagination from '../../components/Pagination'
  export default {
    data() {
      return {
        nshow: true, //switch开启
        fshow: false, //switch关闭
        loading: false, //是显示加载
        title: '添加用户',
        editFormVisible: false, //控制编辑页面显示与隐藏
        dataAccessshow: false, //控制数据权限显示与隐藏
        unitAccessshow: false, //控制所属单位隐藏与显示
        // 编辑与添加
        editForm: {
          userId: '',
          userName: '',
          userRealName: '',
          roleId: '',
          userMobile: '',
          userEmail: '',
          userSex: '',
          token: localStorage.getItem('logintoken')
        },
        // 部门参数
        unitparm: {
          userIds: '',
          deptId: '',
          deptName: ''
        },
        // 选择数据
        selectdata: [],
        // rules表单验证
        rules: {
          userName: [{
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }],
          userRealName: [{
            required: true,
            message: '请输入姓名',
            trigger: 'blur'
          }],
          roleId: [{
            required: true,
            message: '请选择角色',
            trigger: 'blur'
          }],
          userMobile: [{
              required: true,
              message: '请输入手机号',
              trigger: 'blur'
            },
            {
              pattern: /^1(3\d|47|5((?!4)\d)|7(0|1|[6-8])|8\d)\d{8,8}$/,
              required: true,
              message: '请输入正确的手机号',
              trigger: 'blur'
            }
          ],
          userEmail: [{
              required: true,
              message: '请输入邮箱',
              trigger: 'blur'
            },
            {
              pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
              required: true,
              message: '请输入正确的邮箱',
              trigger: 'blur'
            }
          ],
          userSex: [{
            required: true,
            message: '请选择性别',
            trigger: 'blur'
          }]
        },
        // 请求数据参数
        formInline: {
          page: 1,
          limit: 10,
          deptId: '',
          userName: '',
          userMobile: '',
          isLock: ''
        },
        //用户数据
        userData: [],
        // 数据权限
        UserDept: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        // 选中
        checkmenu: [],
        //参数role
        saveroleId: '',
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
    watch: {},

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
      // 获取数据方法
      getdata(parameter) {
        this.loading = true
        /***
         * 调用接口，注释上面模拟数据 取消下面注释
         */
        // 获取用户列表
        advertiseQuery(parameter).then(res => {
          this.loading = false
          if (res.success == false) {
            this.$message({
              type: 'info',
              message: res.msg
            })
          } else {
            this.userData = res.data
            // 分页赋值
            this.pageparm.currentPage = this.formInline.page
            this.pageparm.pageSize = this.formInline.limit
            this.pageparm.total = res.count
          }
        }).catch(err => {
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
      //搜索事件
      search() {
        this.getdata(this.formInline)
      },
      // 修改type
      editType: function(index, row) {
        this.loading = true
        let parm = {
          state: '',
          id: '',
          token: localStorage.getItem('logintoken')
        }
        parm.id = row.id
        let state = row.state
        if (state == '1') {
          parm.state = '0'
        } else {
          parm.state = '1'
        }
        // 修改状态
        advertiseOpen(parm).then(res => {
          this.loading = false
          if (res.success == false) {
            this.$message({
              type: 'info',
              message: res.msg
            })
          } else {
            this.$message({
              type: 'success',
              message: '状态修改成功'
            })
            this.getdata(this.formInline)
          }
        })
      },

      handleClick(data, checked, node) {
        if (checked) {
          this.$refs.tree.setCheckedNodes([])
          this.$refs.tree.setCheckedNodes([data])
          this.unitparm.deptId = data.id
          this.unitparm.deptName = data.name
          //交叉点击节点
        } else {}
      },
      // 选择复选框事件
      selectChange(val) {
        this.selectdata = val
      },
      //数据格式化
      changeArr(data) {
        var pos = {}
        var tree = []
        var i = 0
        while (data.length != 0) {
          if (data[i].pId == 0) {
            tree.push({
              id: data[i].id,
              name: data[i].name,
              pId: data[i].pId,
              open: data[i].open,
              checked: data[i].checked,
              children: []
            })
            pos[data[i].id] = [tree.length - 1]
            data.splice(i, 1)
            i--
          } else {
            var posArr = pos[data[i].pId]
            if (posArr != undefined) {
              var obj = tree[posArr[0]]
              for (var j = 1; j < posArr.length; j++) {
                obj = obj.children[posArr[j]]
              }

              obj.children.push({
                id: data[i].id,
                name: data[i].name,
                pId: data[i].pId,
                open: data[i].open,
                checked: data[i].checked,
                children: []
              })
              pos[data[i].id] = posArr.concat([obj.children.length - 1])
              data.splice(i, 1)
              i--
            }
          }
          i++
          if (i > data.length - 1) {
            i = 0
          }
        }
        return tree
      },
      // 选中菜单
      changemenu(arr) {
        let change = []
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].checked) {
            change.push(arr[i].id)
          }
        }
        return change
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
