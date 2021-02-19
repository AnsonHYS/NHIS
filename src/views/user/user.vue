<template>
  <div class="app-container user">
    <div class="filter-container">
      <el-form>
        <el-form-item>
          <el-input v-model="listQuery.username"
                    placeholder="请输入用户名"
                    style="width:420px;height:50px;"></el-input>
          <el-button type="primary"
                     icon="plus"
                     @click="search">查询
          </el-button>
          <el-button type="primary"
                     icon="plus"
                     v-if="hasPerm('user:add')"
                     @click="showCreate">添加
          </el-button>

        </el-form-item>
      </el-form>
    </div>
    <el-table :data="list"
              v-loading.body="listLoading"
              element-loading-text="拼命加载中"
              border
              fit
              highlight-current-row>
      <el-table-column align="center"
                       label="序号"
                       width="80">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="昵称"
                       prop="nickname"
                       style="width: 60px;"></el-table-column>
      <el-table-column align="center"
                       label="用户名"
                       prop="username"
                       style="width: 60px;"></el-table-column>

      <el-table-column align="center"
                       label="创建时间"
                       prop="createTime"
                       width="170"></el-table-column>
      <el-table-column align="center"
                       label="最近修改时间"
                       prop="updateTime"
                       width="170"></el-table-column>
      <el-table-column align="center"
                       label="管理"
                       width="220"
                       v-if="hasPerm('user:update')">
        <template slot-scope="scope">
          <el-button type="primary"
                     icon="edit"
                     @click="showUpdate(scope.$index)"
                     size="small">修改</el-button>
          <el-button type="danger"
                     icon="delete"
                     v-if="scope.row.userId!=userId "
                     @click="removeUser(scope.row)"
                     size="small">删除
          </el-button>

          <el-button type="primary"
                     icon="edit"
                     @click="userRole(scope.row)"
                     size="small"
                     style="margin-left: 0px;margin-top:10px;">用户角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="listQuery.pageNum"
                   :page-size="listQuery.pageRow"
                   :total="totalCount"
                   :page-sizes="[10, 20, 50, 100]"
                   layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <el-dialog :title="textMap[dialogStatus]"
               :visible.sync="dialogFormVisible">
      <el-form class="small-space"
               :model="tempUser"
               label-position="left"
               label-width="80px"
               style='width: 300px; margin-left:50px;'>
        <el-form-item label="用户名"
                      required
                      v-if="dialogStatus=='create'">
          <el-input type="text"
                    v-model="tempUser.username">
          </el-input>
        </el-form-item>
        <el-form-item label="密码"
                      v-if="dialogStatus=='create'"
                      required>
          <el-input type="password"
                    v-model="tempUser.password">
          </el-input>
        </el-form-item>
        <el-form-item label="新密码"
                      v-else>
          <el-input type="password"
                    v-model="tempUser.password"
                    placeholder="不填则表示不修改">
          </el-input>
        </el-form-item>

        <el-form-item label="昵称"
                      required>
          <el-input type="text"
                    v-model="tempUser.nickname">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'"
                   type="success"
                   @click="createUser">创 建</el-button>
        <el-button type="primary"
                   v-else
                   @click="updateUser">修 改</el-button>
      </div>
    </el-dialog>

    <el-dialog title="赋予角色"
               :visible.sync="dialogRoleFormTableVisible"
               :close-on-click-modal="false">

      <el-divider content-position="left">
        <el-tag type="success"
                effect="dark">已拥有角色</el-tag>
      </el-divider>

      <el-table :data="haveRoleList"
                border
                fit
                highlight-current-row
                v-loading.body="listLoading1"
                element-loading-text="拼命加载中">
        <el-table-column align="center"
                         property="roleName"
                         label="角色名"></el-table-column>
        <el-table-column align="center"
                         label="管理">
          <template slot-scope="scope">
            <el-button type="primary"
                       icon="edit"
                       @click="cancelUserRole(scope.row)"
                       size="small">取消角色</el-button>
          </template>
        </el-table-column>

      </el-table>
      <el-pagination @size-change="handleSizeChange1"
                     @current-change="handleCurrentChange1"
                     :current-page="listQuery1.pageNum"
                     :page-size="listQuery1.pageRow"
                     :total="totalCount1"
                     :page-sizes="[10, 20, 50, 100]"
                     layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
      <el-divider content-position="left">
        <el-tag type="success"
                effect="dark">未拥有角色</el-tag>
      </el-divider>

      <el-table :data="noHaveRoleList"
                border
                fit
                highlight-current-row
                v-loading.body="listLoading2"
                element-loading-text="拼命加载中">
        <el-table-column align="center"
                         property="roleName"
                         label="日期"></el-table-column>
        <el-table-column align="center"
                         label="管理">
          <template slot-scope="scope">
            <el-button type="primary"
                       icon="edit"
                       @click="addUserRole(scope.row)"
                       size="small">赋予角色</el-button>

          </template>
        </el-table-column>

      </el-table>
      <el-pagination @size-change="handleSizeChange2"
                     @current-change="handleCurrentChange2"
                     :current-page="listQuery2.pageNum"
                     :page-size="listQuery2.pageRow"
                     :total="totalCount2"
                     :page-sizes="[10, 20, 50, 100]"
                     layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </el-dialog>

  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      totalCount: 0, //分页组件--数据总条数
      totalCount1: 0, //分页组件--数据总条数
      totalCount2: 0, //分页组件--数据总条数
      list: [],//表格的数据
      listLoading: false,//数据加载等待动画
      listLoading1: false,//数据加载等待动画
      listLoading2: false,//数据加载等待动画
      listQuery: {
        pageNum: 1,//页码
        pageRow: 10,//每页条数,
        username: ''
      },
      listQuery1: {
        pageNum: 1,//页码
        pageRow: 10,//每页条数
        userId: ''
      },
      listQuery2: {
        pageNum: 1,//页码
        pageRow: 10,//每页条数
        userId: ''
      },
      roles: [],//角色列表
      dialogStatus: 'create',
      dialogFormVisible: false,
      textMap: {
        update: '编辑',
        create: '新建用户'
      },
      dialogRoleFormTableVisible: false,
      haveRoleList: [],
      noHaveRoleList: [],
      dialogRoleForm: {
        userId: ''

      },
      tempUser: {
        username: '',
        password: '',
        nickName: '',

        id: ''
      }
    }
  },
  created () {
    this.getList();
    if (this.hasPerm('user:add') || this.hasPerm('user:update')) {
      // this.getAllRoles();
    }
  },
  computed: {
    ...mapGetters([
      'userId'
    ])
  },
  methods: {
    getAllRoles () {
      this.api({
        url: "/user/getAllRoles",
        method: "get"
      }).then(data => {
        this.roles = data.list;
      })
    },
    userRole (row) {
      this.listQuery1.userId = row.userId;
      this.listQuery2.userId = row.userId;
      this.dialogRoleFormTableVisible = true;
      this.getListHaveRole();
      this.getListNoHaveRole();

    },
    search () {
      this.listQuery.pageNum = '1';
      this.getList();


    },
    getList () {
      //查询列表
      this.listLoading = true;
      this.api({
        url: "/user/list",
        method: "get",
        params: this.listQuery
      }).then(data => {
        this.listLoading = false;
        this.list = data.list;
        this.totalCount = data.totalCount;
      })
    },
    getListHaveRole () {
      //查询列表
      this.listLoading1 = true;

      this.api({
        url: "/user/listHaveRole",
        method: "get",
        params: this.listQuery1
      }).then(data => {
        this.listLoading1 = false;
        this.haveRoleList = data.result;
        this.totalCount1 = data.total;
      })
    },
    getListNoHaveRole () {
      //查询列表
      this.listLoading2 = true;

      this.api({
        url: "/user/listNoHaveRole",
        method: "get",
        params: this.listQuery2
      }).then(data => {
        this.listLoading2 = false;
        this.noHaveRoleList = data.result;
        this.totalCount2 = data.total;
      })
    },
    handleSizeChange (val) {
      //改变每页数量
      this.listQuery.pageRow = val
      this.handleFilter();
    },
    handleSizeChange1 (val) {
      //改变每页数量
      this.listQuery1.pageRow = val
      this.handleFilter1();
    },
    handleSizeChange2 (val) {
      //改变每页数量
      this.listQuery2.pageRow = val
      this.handleFilter2();
    },
    handleCurrentChange (val) {
      //改变页码
      this.listQuery.pageNum = val
      this.getList();
    },
    handleCurrentChange1 (val) {
      //改变页码
      this.listQuery1.pageNum = val
      this.getListHaveRole();
    },
    handleCurrentChange2 (val) {
      //改变页码
      this.listQuery2.pageNum = val
      this.getListNoHaveRole();
    },
    handleFilter () {
      //查询事件
      this.listQuery.pageNum = 1
      this.getList()
    },
    handleFilter1 () {
      //查询事件
      this.listQuery1.pageNum = 1
      this.getListHaveRole()
    },
    handleFilter2 () {
      //查询事件
      this.listQuery2.pageNum = 1
      this.getListNoHaveRole()
    },
    getIndex ($index) {
      //表格序号
      return (this.listQuery.pageNum - 1) * this.listQuery.pageRow + $index + 1
    },
    showCreate () {
      //显示新增对话框
      this.tempUser.username = "";
      this.tempUser.password = "";
      this.tempUser.nickName = "";

      this.tempUser.id = "";
      this.dialogStatus = "create"
      this.dialogFormVisible = true
    },
    showUpdate ($index) {
      let user = this.list[$index];
      this.tempUser.username = user.username;
      this.tempUser.nickName = user.nickname;

      this.tempUser.id = user.userId;
      this.tempUser.deleteStatus = '1';
      this.tempUser.password = '';
      this.dialogStatus = "update"
      this.dialogFormVisible = true
    },
    createUser () {
      //添加新用户
      this.api({
        url: "/user/addUser",
        method: "post",
        data: this.tempUser
      }).then(() => {
        this.getList();
        this.dialogFormVisible = false
      })
    },
    cancelUserRole (row) {

      let that = this;
      var param = {
        "userId": this.listQuery2.userId,
        "roleId": row.id,
      }
      this.api({
        url: "/user/cancelUserRole",
        method: "post",
        data: param
      }).then(() => {
        that.success("操作成功");
        that.getListNoHaveRole();
        that.getListHaveRole();

      })


    },
    addUserRole (row) {

      let that = this;
      var param = {
        "userId": this.listQuery1.userId,
        "roleId": row.id,
      }
      this.api({
        url: "/user/addUserRole",
        method: "post",
        data: param
      }).then(() => {
        that.success("操作成功");
        that.getListNoHaveRole();
        that.getListHaveRole();
      })


    },


    success (msg) {
      this.$message({
        showClose: true,
        message: msg,
        type: 'success'
      });
    },

    warning (msg) {
      this.$message({
        showClose: true,
        message: msg,
        type: 'warning'
      });
    },

    error (msg) {
      this.$message({
        showClose: true,
        message: msg,
        type: 'error'
      });
    },
    updateUser () {
      //修改用户信息
      let _vue = this;
      this.api({
        url: "/user/updateUser",
        method: "post",
        data: this.tempUser
      }).then(() => {
        let msg = "修改成功";
        this.dialogFormVisible = false
        if (this.userId === this.tempUser.userId) {
          msg = '修改成功,部分信息重新登录后生效'
        }
        this.$message({
          message: msg,
          type: 'success',
          duration: 1 * 1000,
          onClose: () => {
            _vue.getList();
          }
        })
      })
    },
    removeUser (row) {
      let _vue = this;
      this.$confirm('确定删除此用户?', '提示', {
        confirmButtonText: '确定',
        showCancelButton: false,
        type: 'warning'
      }).then(() => {
        var param = {
          id: row.userId

        }
        _vue.api({
          url: "/user/deleteUser",
          method: "post",
          data: param
        }).then(() => {
          _vue.getList()
        }).catch(() => {
          _vue.$message.error("删除失败")
        })
      })
    },
  }
}
</script>


<style >
.user .el-table thead {
  color: white;
  font-weight: 500;
  background-color: #337da8 !important;
}

.user .el-table__header th {
  background-color: #337da8 !important;
}
.user .el-table td .el-table th.is-leaf {
  border-bottom: 1px solid #ebeef5;
  border-right: 1px solid #ebeef5;
}
.user .el-table .cell {
  text-align: center;
}
</style>
