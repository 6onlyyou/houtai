<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>求职者管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="搜索：">
        <!--   <el-select size="small" v-model="formInline.isLock" placeholder="请选择" clearable @change="search">
             <el-option label="全部" value=""></el-option>
             <el-option label="开启" value="N"></el-option>
             <el-option label="关闭" value="Y"></el-option>
           </el-select>-->
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
      <el-table-column align="center" sortable prop="nickName" label="用户昵称" width="120">
      </el-table-column>
      <el-table-column align="center" sortable prop="headImg" label="用户头像" width="150">
        <template slot-scope="scope">
          <!--
                    <img :src="scope.row.headImg" alt="" style="width: 150px;height: 150px">
          -->
          <div>
            <img :src="scope.row.headImg" style="width: 50px;height: 50px">
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" sortable prop="phoneNumber" label="绑定手机号" width="150">
      </el-table-column>
      <el-table-column align="center" sortable prop="totalCount" label="金币数量" min-width="120">
      </el-table-column>
      <el-table-column align="center" sortable prop="labelName" label="求职意向" min-width="150">
      </el-table-column>

      <el-table-column align="center"   prop="picSource" label="简历图片" min-width="200">
        <template slot-scope="scope">
          <div>
            <img v-image-preview :src="scope.row.picSource" style="width: 100px;height: 100px">
          </div>
        </template>
      </el-table-column>

      <el-table-column align="center"   prop="vedioSource" label="简历视频" min-width="250">
        <template slot-scope="scope">
          <button @click="viewVideo(scope.$index, scope.row)" v-if="scope.row.vedioSource!==undefined">查看视频</button>
        </template>
      </el-table-column>
      <el-table-column align="center" sortable prop="age" label="年龄" min-width="120">
      </el-table-column>
      <el-table-column align="center" sortable prop="sex" label="性别" min-width="120">
      </el-table-column>
      <el-table-column align="center" sortable prop="cardPhoneNum" label="联系电话" min-width="120">
      </el-table-column>
      <el-table-column align="center" sortable prop="city" label="城市" min-width="120">
      </el-table-column>
      <el-table-column align="center" sortable prop="registrationDate" label="注册时间" min-width="120">
      </el-table-column>

      <!--<el-table-column align="center" sortable prop="state" label="状态" min-width="50">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.isLock=='0'?nshow:fshow" active-color="#13ce66" inactive-color="#ff4949"
            @change="editType(scope.$index, scope.row)">
          </el-switch>
        </template>
      </el-table-column>
-->
    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
    <!--视频播放-->
    <el-dialog title="查看视频" :visible.sync="videoVisible"  :close="close">
      <template slot-scope="scope">
        <video-player  class="video-player vjs-custom-skin"
                       ref="videoPlayer"
                       :playsinline="true"
                       :options="playerOptions"
                       :x5-video-player-fullscreen="true"
                       @pause="onPlayerPause($event)"
                       @play="onPlayerPlay($event)"
                       @click="fullScreen"
        ></video-player>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="close">关闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
// 导入请求方法
import {
  userList
} from '../../api/userMG'
import Pagination from '../../components/Pagination'
import { videoPlayer } from 'vue-video-player'
import 'video.js/dist/video-js.css'
export default {
  data() {
    return {
      videoVisible: false,
      playerOptions : {
        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: false, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          src: '',  // 路径
          type: 'video/mp4'  // 类型
        }],
        poster: "", //你的封面地址
        // width: document.documentElement.clientWidth,
        notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true  //全屏按钮
        }
      },
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
        identyType:1,
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
    Pagination,
    videoPlayer
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
    close(){
      this.$refs.videoPlayer.player.close()
      this.videoVisible=false
    },
    fullScreen() {
      const player = this.$refs.videoPlayer.player
      player.requestFullscreen()//调用全屏api方法
      player.isFullscreen(true)
      player.play()
    },
    onPlayerPlay(player) {
      player.play()
    },
    onPlayerPause(player) {
      // alert("pause");
    },
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
    handleEdit: function(index, row) {
      this.editFormVisible = true
      if (row != undefined && row != 'undefined') {
        this.title = '修改用户'
        this.editForm.userId = row.userId
        this.editForm.userName = row.userName
        this.editForm.userRealName = row.userRealName
        this.editForm.roleId = row.roleId
        this.editForm.userMobile = row.userMobile
        this.editForm.userEmail = row.userEmail
        this.editForm.userSex = row.userSex
      } else {
        this.title = '添加用户'
        this.editForm.userId = ''
        this.editForm.userName = ''
        this.editForm.userRealName = ''
        this.editForm.roleId = ''
        this.editForm.userMobile = ''
        this.editForm.userEmail = ''
        this.editForm.userSex = ''
      }
    },
    // 编辑、添加提交方法
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
                  message: '数据保存成功！'
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
    // 保存部门
    unitPermSave() {
      let len = this.selectdata
      let ids = []
      if (len != 0) {
        for (let i = 0; i < len.length; i++) {
          ids.push(len[i].userId)
        }
      }
      this.unitparm.userIds = ids.join(',')
      UserChangeDept(this.unitparm)
        .then(res => {
          this.unitAccessshow = false
          if (res.success) {
            this.$message({
              type: 'success',
              message: '部门设置成功！'
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
          this.$message.error('部门设置失败,请稍后再试！')
        })
    },
    // 选择复选框事件
    selectChange(val) {
      this.selectdata = val
    },
    // 关闭编辑、增加弹出框
    closeDialog(dialog) {
      if (dialog == 'edit') {
        this.editFormVisible = false
      } else if (dialog == 'perm') {
        this.dataAccessshow = false
      } else if (dialog == 'unit') {
        this.unitAccessshow = false
      }
    },
    // 删除用户
    deleteUser(index, row) {
      this.$confirm('确定要删除吗?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 删除
          userDelete(row.id)
            .then(res => {
              if (res.success) {
                this.$message({
                  type: 'success',
                  message: '数据已删除!'
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
              this.$message.error('数据删除失败，请稍后再试！')
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除！'
          })
        })
    },
    // 重置密码
    resetpwd(index, row) {
      this.resetpsd.userId = row.userId
      this.$confirm('确定要重置密码吗?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          userPwd(this.resetpsd)
            .then(res => {
              if (res.success) {
                this.$message({
                  type: 'success',
                  message: '重置密码成功！'
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
              this.$message.error('重置密码失败，请稍后再试！')
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消重置密码！'
          })
        })
    },
    // 数据权限
    dataAccess: function(index, row) {
      this.dataAccessshow = true
      this.saveroleId = row.userId
      UserDeptTree(row.userId)
        .then(res => {
          if (res.data.success) {
            this.checkmenu = this.changemenu(res.data.data)
            this.UserDept = this.changeArr(res.data.data)
          } else {
            this.$message({
              type: 'info',
              message: res.data.msg
            })
          }
        })
        .catch(err => {
          this.loading = false
          this.$message.error('获取权限失败，请稍后再试！')
        })
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
    },
    // 菜单权限-保存
    menuPermSave() {
      let parm = {
        userId: this.saveroleId,
        deptIds: ''
      }
      let node = this.$refs.tree.getCheckedNodes()
      let moduleIds = []
      if (node.length != 0) {
        for (let i = 0; i < node.length; i++) {
          moduleIds.push(node[i].id)
        }
        parm.deptIds = JSON.stringify(moduleIds)
      }
      UserDeptSave(parm)
        .then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '权限保存成功'
            })
            this.dataAccessshow = false
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
          this.$message.error('权限保存失败，请稍后再试！')
        })
    },
    //查看视频
    viewVideo: function (index, row) {
      this.videoVisible = true
      if (row != undefined && row != 'undefined') {
        this.playerOptions.sources[0].src = row.vedioSource
        this.playerOptions.poster = row.picOrVedioSource.split(";")[1]
      }
    },
    // 下线用户
    offlineUser(index, row) {
      this.$confirm('确定要让' + row.userName + '用户下线吗?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          userExpireToken(row.userName)
            .then(res => {
              if (res.success) {
                this.$message({
                  type: 'success',
                  message: '用户' + row.userName + '强制下线成功！'
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
              this.$message.error('用户下线失败，请稍后再试！')
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    // 刷新缓存
    refreshCache(index, row) {
      userFlashCache(row.userName)
        .then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '刷新成功！'
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
          this.$message.error('刷新失败，请稍后再试！')
        })
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
