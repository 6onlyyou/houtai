<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>兑换商品管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="搜索：">
        <el-input size="small" v-model="formInline.goodsName" placeholder="输入商品名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleAddOrEdit()">添加</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table size="small" :data="listData" highlight-current-row v-loading="loading" border
              element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column align="center" type="selection" width="60">
      </el-table-column>
      <el-table-column sortable prop="goodsId" label="商品ID" width="300">
      </el-table-column>
      <el-table-column sortable prop="goodsName" label="商品名称" width="300">
      </el-table-column>

      <el-table-column  prop="goodsImg" label="商品图片" width="300">

        <template slot-scope="goodscope">
          <div>
            <img v-image-preview :src="goodscope.row.goodsImg" style="width: 100px;height: 100px">
          </div>
        </template>
      </el-table-column>
      <el-table-column sortable prop="goodsPrice" label="商品价格" width="300">
      </el-table-column>

      <el-table-column align="center" label="操作" min-width="300">
        <template slot-scope="scope">`
          <el-button size="mini" @click="handleAddOrEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteUser(scope.$index, scope.row.goodsId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
    <!-- 编辑界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="30%" @click="closeDialog">
      <el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm">
        <el-form-item label="商品名称" prop="goodsName">
          <el-input size="small" v-model="editForm.goodsName" auto-complete="off" placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goodsPrice">
          <el-input size="small" v-model="editForm.goodsPrice" auto-complete="off"
                    placeholder="请输入商品价格（虚拟币）"></el-input>
        </el-form-item>
        <el-form-item label="商品图片" prop="goodsImg">
          <el-row>
            <el-col :span="24">
              <input type="hidden" v-model="editForm.goodsImg"/>
              <el-upload
                :action="actionUrl"
                list-type="picture-card"
                :limit='1'
                :on-preview="handlePictureCardPreview"
                :on-success="successHandle"
                :before-upload="beforeAvatarUpload"
                :on-remove="handleRemove"
                :on-exceed="handleExceed">
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogImgVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </el-col>
          </el-row>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm('editForm')">保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {goodsSave, goodsDelete, goodsList,goodsEdit} from '../../api/userMG'
  import Pagination from '../../components/Pagination'

  export default {
    data() {
      return {
        actionUrl: '/mngservice/files/upload',
        dialogImageUrl: '',
        dialogImgVisible: false,
        nshow: true, //switch开启
        fshow: false, //switch关闭
        loading: false, //是显示加载
        editFormVisible: false, //控制编辑页面显示与隐藏
        title: '添加',
        editForm: {
          id:'',
          goodsImg: '',
          goodsPrice: '',
          goodsName: '',
          token: localStorage.getItem('logintoken')
        },
        // rules表单验证
        rules: {
          deptName: [
            {required: true, message: '请输入', trigger: 'blur'}
          ],
          deptNo: [{required: true, message: '请输入', trigger: 'blur'}]
        },
        formInline: {
          page: 1,
          limit: 10,
          token: localStorage.getItem('logintoken')
        },
        // 删除部门
        seletedata: {
          ids: '',
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
      // 文件上传
      handleRemove (file, fileList) {
        console.log(file, fileList)
      },
      handlePictureCardPreview (file) {
        console.log(file.url)
        this.dialogImageUrl = file.url
        this.dialogImgVisible = true
      },
      successHandle (response) {
        console.log(response)
        if (response.code !== 200) {
          // this.$refs.upload.clearFile() todo 删除已经传入的文件
          this.$message.error(response.msg)
        } else {
          this.editForm.goodsImg = response.data
        }
      },
      handleExceed (files, fileList) {
        // todo best shote 隐藏第2个上传
        this.$alert('只能上传一个文件')
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isPng = file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG && !isPng) {
          this.$message.error('上传头像图片只能是 JPG或PNG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M || isPng;
      },
      // 获取列表
      getdata(parameter) {
        this.loading = true

        /***
         * 调用接口，注释上面模拟数据 取消下面注释
         */
        goodsList(parameter)
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
      //显示新增编辑界面
      handleAddOrEdit: function (index, row) {
        this.editFormVisible = true
        if (row != undefined && row != 'undefined') {
          this.title = '修改'
          this.editForm.goodsName = row.goodsName
          this.editForm.goodsPrice = row.goodsPrice
          this.editForm.goodsImg = row.goodsImg
          this.editForm.id = row.goodsId

        } else {
          this.title = '添加'
          this.editForm.goodsName = ''
          this.editForm.goodsPrice = ''
          this.editForm.goodsImg = ''
          this.editForm.id = ''
        }
      },
      // 编辑、增加页面保存方法
      submitForm(editData) {
        this.$refs[editData].validate(valid => {
          if (valid) {
            if (this.title == "修改") {
              goodsEdit(this.editForm)
                .then(res => {
                  this.editFormVisible = false
                  this.loading = false
                  if (res.success) {
                    this.getdata(this.formInline)
                    this.$message({
                      type: 'success',
                      message: '保存成功！'
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
                  this.$message.error('保存失败，请稍后再试！')
                })
            } else {
              goodsSave(this.editForm)
                .then(res => {
                  this.editFormVisible = false
                  this.loading = false
                  if (res.success) {
                    this.getdata(this.formInline)
                    this.$message({
                      type: 'success',
                      message: '保存成功！'
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
                  this.$message.error('保存失败，请稍后再试！')
                })
            }

          } else {
            return false
          }
        })
      },
      // 删除商品
      deleteUser(index, row) {
        this.$confirm('确定要删除吗?', '信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            let params= {
              id: row,
            }
            goodsDelete(params)
              .then(res => {
                if (res.success) {
                  this.$message({
                    type: 'success',
                    message: '商品已删除!'
                  })
                  this.getdata(this.formInline)
                } else {
                  this.$message({
                    type: 'info',
                    message: res.msg
                  })
                }
              })
              .catch(err => {
                this.loading = false
                this.$message.error('公司删除失败，请稍后再试！')
              })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      },
      // 关闭编辑、增加弹出框
      closeDialog() {
        this.editFormVisible = false
      }
    }
  }
</script>

<style scoped>
  .user-search {
    margin-top: 20px;
  }
</style>


