
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>招聘者管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
    <!--  <el-form-item label="">
        <el-input size="small" v-model="formInline.identyType" placeholder=""></el-input>
      </el-form-item>-->
      <el-form-item label="搜索：">
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
      <el-table-column align="center" sortable prop="id" label="用户id" width="120">
      </el-table-column>
      <el-table-column align="center" sortable prop="companyName" label="公司名称" width="120">
      </el-table-column>
      <el-table-column align="center" sortable prop="nickName" label="用户昵称" width="150">
      </el-table-column>
      <el-table-column align="center"  prop="headImg" label="用户头像" width="150">
        <template slot-scope="userlistscope">
<!--
          <img :src="scope.row.headImg" alt="" style="width: 150px;height: 150px">
-->
          <div>
            <img  :src="userlistscope.row.headImg" style="width: 50px;height: 50px">
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" sortable prop="cardPhoneNum" label="联系手机号" width="150">
      </el-table-column>
      <el-table-column align="center" sortable prop="phoneNumber" label="绑定手机号" min-width="150">
      </el-table-column>
      <el-table-column align="center" sortable prop="totalCount" label="金币数量" min-width="120">
      </el-table-column>
      <el-table-column align="center" sortable prop="inviteCode" label="邀请码" min-width="120">
      </el-table-column>
      <el-table-column align="center" sortable prop="city" label="城市" min-width="120">
      </el-table-column>
      <el-table-column align="center" sortable prop="registrationDate" label="注册时间" min-width="120">
      </el-table-column>
      <el-table-column align="center"  prop="state" label="操作" min-width="250"  fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit('1', scope.row)">+增加金币</el-button>
          <el-button size="mini" @click="handleEdit('2', scope.row)">-减少金币</el-button>
        </template>
      </el-table-column>

    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
    <!-- 编辑界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="30%" @click="closeDialog">
      <el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm">
        <el-form-item label="金币数量" prop="deptName">
          <el-input size="small" v-model="editForm.count" auto-complete="off" placeholder="请输入金币数量"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm('editForm')">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  // 导入请求方法
  import {
    userList,
    userSave
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
        // 金币修改
        editForm: {
          userId: '',
          count: '',
          operType: '',
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
          }]
        },
        // 请求数据参数
        formInline: {
          page: 1,
          limit: 10,
          identyType:'2',
          city: ''
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
        userList(parameter).then(res => {
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
          lock: '',
          userId: '',
          token: localStorage.getItem('logintoken')
        }
        parm.userId = row.id
        let lock = row.state
        if (lock == '2') {
          parm.state = '0'
        } else {
          parm.state = '2'
        }
        // 修改状态
        userLock(parm).then(res => {
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

      //显示编辑界面
      handleEdit: function(type, row) {
        this.editFormVisible = true
        if (type =='1') {
          this.title = '添加金币'
          this.editForm.userId = row.id
          this.editForm.operType = 1

        }else{
          this.title = '扣除金币'
          this.editForm.userId = row.id
          this.editForm.operType = 2
        }
      },
      // 提交方法
      submitForm(editData) {
        this.$refs[editData].validate(valid => {
          if (valid) {
            // 请求方法
            userSave(this.editForm)
              .then(res => {
                this.editFormVisible = false
                this.loading = false
                if (res.success) {
                  this.getdata(this.formInline)
                  this.$message({
                    type: 'success',
                    message: '成功！'
                  })
                } else {
                  this.$message({
                    type: 'info',
                    message: res.msg
                  })
                }
              })
              .catch(err => {
                this.editFormVisible = false
                this.loading = false
                this.$message.error('失败，请稍后再试！')
              })
          } else {
            return false
          }
        })
      },
      // 显示部门设置
      handleunit: function(index, row) {
        this.unitAccessshow = true
        let parms = 0
        UserDeptdeptTree(parms)
          .then(res => {
            if (res.data.success) {
              this.UserDept = this.changeArr(res.data.data)
            } else {
              this.$message({
                type: 'info',
                message: res.msg
              })
            }
          })
          .catch(err => {
            this.loading = false
            this.$message.error('配置权限失败,请稍后再试！')
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
      // 关闭编辑、增加弹出框
      closeDialog() {
        this.editFormVisible = false
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
