<template>
  <div id="western_medicine"
       class="western_medicine">

    <!-- new -->
    <div class="RDiv">
      <div class="oPrev"
           @click="Pre"></div>
      <div class="showRDiv"
           ref="west_SHOW"
           id='west_SHOW'>
        <div class="RecipeList"
             ref="westMedList"
             id="westMedList">
          <div v-for="(L,i) in List"
               :class="[{'hover':isHov==i},'per_item']"
               @click.stop="hov(i)"
               :key="L.recipecode"
               v-cloak>
            <div class="title"><b>处方{{i+1}}</b></div>
            <div class="rec-ceil"><span>编号:</span>{{L.recipecode}}</div>
            <div class="rec-ceil"><span>开单医师:</span>{{docName}}</div>
            <div class="rec-ceil">
              <span>慢病处方:</span>
              <el-radio-group v-model="L.ischronicdisease"
                              :disabled="L.signature=='1'">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>

            </div>
            <div class="rec-ceil"
                 id="date"><span>开单日期:</span> {{turnDate(L.createtime)}}</div>

            <input type="hidden"
                   :name='Name1(i)'
                   v-model="L.rid" />
            <input type="hidden"
                   v-model="L.signature"
                   :attr="i"
                   for="signatureFlag" />

            <a class="odelete"
               @click.stop="del(L,i)">&nbsp;</a>
            <!-- <div v-show="L.signature && L.signature=='1'">
              <input type="hidden"
                     id="treatRid"
                     v-model="L.rid" />
              <div class="title_sign"
                   @click="findSignatrueFile(L.rid,L.recipecode);">查看已签名处方</div>
            </div>
            <div v-show="L.signature=='0'">
              <input type="hidden"
                     id="treatrecordRid"
                     v-model="L.rid" />
              <div class="title_sign"
                   @click="signature(L.rid,L.recipecode);">签名</div>
            </div> -->

          </div>
          <div class="per_item"
               v-for="(per,i) in west_less"
               :key='i'>
            <div class="checkAdd med"
                 @click="addREC">+</div>
          </div>
        </div>
      </div>
      <div class="oNext"
           @click="Next"></div>
    </div>
    <!-- new end -->

    <div class="prescription_detail">
      <!-- 標記处方是否签名，已经签名不能编辑 -->
      <!-- <input type="hidden" v-model="FLAG" id="signatureFlag" />
    <ul class="prescription_function_list BTN_GROUP" v-show="FLAG!='1'">

      <li class="btn_add" title="新增" @click="addMedicine">新增医嘱</li>
      <li class="btn_save" onclick="SaveDocrecipesAll(this);" title="保存">保存处方</li>


    </ul> -->

      <!-- 新table -->
      <div class="TABLE"
           v-for="(TB,i) in List"
           v-show="isHov==i"
           :key="TB.rid">
        <div v-show="TB.signature!='1'">
          <!-- 未签名 -->
          <el-button type="success"
                     size="small"
                     icon="el-icon-plus"
                     @click="addDrug(TB)">新增医嘱</el-button>
          <el-button type="primary"
                     size="small"
                     icon="el-icon-success"
                     @click="save()">保存处方</el-button>

        </div>
        <br /> <br />

        <el-table :data="TB.docrecipesdetaillist"
                  border
                  style="width: 100%"
                  :header-cell-style="getRowClass"
                  :ref="'table'+i">
          <!-- 序号 -->
          <el-table-column type="index"
                           label="序号">
          </el-table-column>
          <!-- 药品 -->
          <el-table-column label="药品"
                           width="150">
            <template slot-scope="scope">
              <div class="pops">
                <!-- focus -->
                <el-popover placement="top-start"
                            width="400"
                            trigger="focus"
                            :ref="'tb'+i+'-popover-'+scope.$index"
                            :attr-pop="'tb'+i+'-popover-'+scope.$index">
                  <!-- 药品字典列表 -->
                  <el-table :data="gridData"
                            border
                            class="tipTb"
                            @row-click='selNameTd(scope,$event,i)'
                            :header-cell-style="getRowClass">
                    <el-table-column property="mediname"
                                     :show-overflow-tooltip="true"
                                     label="通用名"
                                     width="200">
                    </el-table-column>
                    <el-table-column property="medispec"
                                     :show-overflow-tooltip="true"
                                     label="规格"></el-table-column>
                  </el-table>
                  <el-pagination background
                                 layout="total,pager"
                                 :current-page.sync="TDparam.pageNum"
                                 class="PAGES"
                                 :page-size="TDparam.pageSize"
                                 :pager-count="5"
                                 @current-change="TDturnPage"
                                 :total="TDtotal"
                                 align='center'>
                  </el-pagination>

                  <el-input v-model="scope.row.advicename"
                            :ref="'tb'+i+'-advicename'+scope.$index"
                            :title="scope.row.advicename"
                            :attr="'tb'+i+'-advicename'+scope.$index"
                            placeholder="药品"
                            @input="searchVal(scope.row.advicename)"
                            @focus="searchVal(scope.row.advicename)"
                            slot="reference">
                  </el-input>

                </el-popover>

              </div>
            </template>
          </el-table-column>
          <!-- 规格 -->
          <el-table-column label="规格"
                           width="100">
            <template slot-scope="scope">
              <el-input v-model="scope.row.spec"
                        :ref="'tb'+i+'-spec'+scope.$index"
                        :attr="'tb'+i+'-spec'+scope.$index"
                        placeholder="规格">
              </el-input>
            </template>
          </el-table-column>
          <!-- 单量 -->
          <el-table-column label="单量"
                           width="60">
            <template slot-scope="scope">

              <input type="number"
                     v-model.number="scope.row.eachdose"
                     :ref="'tb'+i+'-eachdose'+scope.$index"
                     :attr="'tb'+i+'-eachdose'+scope.$index"
                     placeholder="单量"
                     class="num-input"
                     @blur="calculate(TB.docrecipesdetaillist,scope)"
                     min="0" />
              <!-- @input='numInput(scope.row,"eachdose",$event)' -->
            </template>
          </el-table-column>
          <!-- 剂量单位 -->
          <el-table-column label="剂量单位">
            <template slot-scope="scope">
              <el-input v-model="scope.row.doseunit"
                        :ref="'tb'+i+'-doseunit'+scope.$index"
                        :attr="'tb'+i+'-doseunit'+scope.$index"
                        placeholder="剂量单位"
                        @blur="checkdoseunit(TB.docrecipesdetaillist,scope)"
                        @focus="setDoseunit(TB.docrecipesdetaillist,scope)">
              </el-input>

            </template>
          </el-table-column>
          <!-- 频率 -->
          <el-table-column label="频率">
            <template slot-scope="scope">
              <el-popover placement="top"
                          width="400"
                          trigger="focus"
                          :ref="'tb'+i+'-popover1-'+scope.$index"
                          :attr-pop="'tb'+i+'-popover1-'+scope.$index">
                <!-- 频率list -->
                <el-table :data="ferqList"
                          border
                          class="tipTb"
                          @row-click='selFerq(scope,$event,i)'
                          :header-cell-style="getRowClass">
                  <el-table-column property="code"
                                   :show-overflow-tooltip="true"
                                   label="代码">
                  </el-table-column>
                  <el-table-column property="name"
                                   :show-overflow-tooltip="true"
                                   label="通用名称"></el-table-column>
                </el-table>
                <el-pagination background
                               layout="total,pager"
                               :current-page.sync="ferqParam.pageNum"
                               class="PAGES"
                               :page-size="ferqParam.pageSize"
                               :pager-count="5"
                               @current-change="turnPage_Ferq"
                               :total="ferqTotal"
                               align='center'>
                </el-pagination>

                <el-input v-model="scope.row.frequency"
                          :ref="'tb'+i+'-frequency'+scope.$index"
                          :attr="'tb'+i+'-frequency'+scope.$index"
                          placeholder="频率"
                          slot="reference"
                          @input="searchVal_Ferq(scope.row.frequency)"
                          @focus="searchVal_Ferq(scope.row.frequency)">
                </el-input>
              </el-popover>

            </template>
          </el-table-column>
          <!-- 天数 -->
          <el-table-column label="天数"
                           width="60">
            <template slot-scope="scope">

              <input type="number"
                     v-model.number="scope.row.daytime"
                     :ref="'tb'+i+'-daytime'+scope.$index"
                     @blur="calculate(TB.docrecipesdetaillist,scope)"
                     :attr="'tb'+i+'-daytime'+scope.$index"
                     placeholder="天数"
                     class="num-input"
                     min="0" />
            </template>
          </el-table-column>
          <!-- 总量 -->
          <el-table-column label="总量">
            <template slot-scope="scope">

              <input type="text"
                     v-model="scope.row.totaldose"
                     :ref="'tb'+i+'-totaldose'+scope.$index"
                     :attr="'tb'+i+'-totaldose'+scope.$index"
                     placeholder="总量"
                     class="num-input"
                     @blur="calculate(TB.docrecipesdetaillist,scope)" />
            </template>
          </el-table-column>
          <!-- 包装单位 -->
          <el-table-column label="包装单位">
            <template slot-scope="scope">

              <el-input v-model="scope.row.packunit"
                        :ref="'tb'+i+'-packunit'+scope.$index"
                        :attr="'tb'+i+'-packunit'+scope.$index"
                        placeholder="包装单位">
              </el-input>
            </template>
          </el-table-column>
          <!-- 给药途径 -->
          <el-table-column label="给药途径">
            <template slot-scope="scope">
              <el-popover placement="top"
                          width="400"
                          trigger="focus"
                          :ref="'tb'+i+'-popover2-'+scope.$index"
                          :attr-pop="'tb'+i+'-popover2-'+scope.$index">
                <!-- 给药途径list -->
                <el-table :data="drugRouteList"
                          border
                          class="tipTb"
                          @row-click='selDrugRoute(scope,$event,i)'
                          :header-cell-style="getRowClass">
                  <el-table-column property="nhname"
                                   :show-overflow-tooltip="true"
                                   label="名称">
                  </el-table-column>
                </el-table>
                <el-pagination background
                               layout="total,pager"
                               :current-page.sync="drugRouteParam.pageNum"
                               class="PAGES"
                               :page-size="drugRouteParam.pageSize"
                               :pager-count="5"
                               @current-change="turnPage_drugRoute"
                               :total="drugRouteTotal"
                               align='center'>
                </el-pagination>

                <el-input v-model="scope.row.druguseroad"
                          :ref="'tb'+i+'-druguseroad'+scope.$index"
                          :attr="'tb'+i+'-druguseroad'+scope.$index"
                          placeholder="给药途径"
                          slot="reference"
                          @input="searchVal_drugRoute(scope.row.druguseroad)"
                          @focus="searchVal_drugRoute(scope.row.druguseroad)">
                </el-input>
              </el-popover>

            </template>
          </el-table-column>
          <!-- 嘱托 -->
          <el-table-column label="嘱托"
                           width="60">
            <template slot-scope="scope">
              <!-- 嘱托list -->
              <!-- <el-popover placement="top-end" width="300" trigger="focus" :ref="'tb'+i+'-popover3-'+scope.$index"
              :attr-pop="'tb'+i+'-popover3-'+scope.$index">

              <el-table :data="yizhuList" border @row-click='selYiZhu(scope,$event,i)' :header-cell-style="getRowClass">
                <el-table-column property="nhname" :show-overflow-tooltip="true" label="名称">
                </el-table-column>
              </el-table>
              <el-pagination background layout="total,pager" :current-page.sync="yizhuParam.pageNum" class="PAGES"
                :page-size="yizhuParam.pageSize" :pager-count="3" @current-change="turnPage_YiZhu" :total="yizhuTotal"
                align='center'>
              </el-pagination>

              <el-input v-model="scope.row.polst" :ref="'tb'+i+'-polst'+scope.$index"
                :attr="'tb'+i+'-polst'+scope.$index" placeholder="嘱托" slot="reference"
                @input="searchVal_YiZhu(scope.row.polst)" @focus="searchVal_YiZhu(scope.row.polst)"
                @keyup.native="tabFun(TB,scope,$event)">
              </el-input>
            </el-popover> -->

              <el-input v-model="scope.row.polst"
                        :ref="'tb'+i+'-polst'+scope.$index"
                        :attr="'tb'+i+'-polst'+scope.$index"
                        placeholder="嘱托"
                        maxlength="100">
              </el-input>

            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column label="操作"
                           fixed="right"
                           width="50">
            <template slot-scope="scope">
              <el-button size="mini"
                         type="danger"
                         icon="el-icon-delete"
                         circle
                         @click="delDrug(TB,scope)"></el-button>
            </template>
          </el-table-column>

        </el-table>
      </div>

      <!-- 新table end-->
      <!-- 二维码显示区域 -->
      <el-dialog title="请使用医生端手机app扫码签名"
                 :visible.sync="QRcode.dialog"
                 :modal='false'
                 width="350px">
        <div class="qrcode"
             v-loading="QRcode.qrLoading">
          <div id="qrcode_west"></div>
        </div>
        <div slot="footer"
             class="dialog-footer">
          <el-button type="primary"
                     @click="isOkSignature()"
                     v-show="hasQRcode">确定签名</el-button>
        </div>
      </el-dialog>
      <!-- 二维码显示区域 end-->

    </div>
  </div>
</template>
<script>

import {
  setCookie,
  clearCookie,
  getCookie
} from '@/utils/auth'

/*---------------------------- vue ----------------------------------------*/
var WEST_URL = {
  LIMIT: "/webHis/sysOption/queryKeyValueList", //西药处方药品数量上限
  INFO: "/webHis/docrecipes/getPrescriptionMap", //获取所有处方信息
  GET_MEDICINE: "/webhis/DrugDictionaryController/loadMediDict", //药品字典列表list
  GET_FERQ: "/webhis/DrugDictionaryController/loadTreatfreq", //频率list
  GET_TUJING: "/webhis/DrugDictionaryController/loadyongtu", //用药途径list
  // GET_YIZHU: "webhis/DrugDictionaryController/loadyizhu", //医嘱list
  ADD_REC: "/webHis/docrecipes/saveDocrecipesWestern", //新增处方
  DEL_REC: "/webHis/docrecipes/deleteDocrecipesNew", //删除处方(主表)
  DEL_DETAIL: "/webHis/docrecipes/deleteDocrecipesDetail.html", //删除处方列表明细
  SAVE: "/webHis/docrecipes/saveDocrecipesAll", //保存处方（和其他保存处方接口一致）
}
var LIMIT = 6;
export default {
  name: 'westMedicine',
  props: {
    'RID': {
      required: true
    },
    'ill': {// 西医诊断
      required: true
    },
    'chineseill': { // 中医诊断
      required: true
    },
    'orgid': {//机构id
      required: true
    },
    'trcode': {//处方code-标记诊室
      required: true
    }
  },
  data () {
    return {
      AGE: "",
      isHov: 0,
      FLAG: "", //标记签名
      limitNum: 0, //西药处方药品数量上限
      ORG_ID: '', //机构id
      CODE: "", //处方code-标记诊室
      /*西药-处方列表*/
      westList: [],
      /*西药项目弹窗 */
      TDparam: {
        meditypeid: 10000000,
        nh_orgid: "",
        pageNum: 1,
        pageSize: 10,
        keyword: "",
      },
      TDtotal: 0,
      gridData: [], //检验项目列表
      /*频率*/
      ferqParam: {
        pageNum: 1,
        pageSize: 10,
        keyword: ""
      },
      ferqTotal: 0,
      ferqList: [], //频率列表
      /*药途径径*/
      drugRouteParam: {
        pageNum: 1,
        pageSize: 10,
        keyword: "",
      },
      drugRouteTotal: 0,
      drugRouteList: [],
      /*医嘱*/
      yizhuParam: {
        pageNum: 1,
        pageSize: 10,
        keyword: ""
      },
      yizhuTotal: 0,
      yizhuList: [],
      /*二维码 */
      hasQRcode: false,
      QRcode: {
        dialog: false,
        qrLoading: false,
      }
    }
  },
  created () {
    this.getLimitCount(); //获取单个处方限制的药品数量

    this.get_Ferq(); //频率list
    this.get_drugRoute(); //用药途径list
    // this.get_YiZhu(); //医嘱list
    // this.westList = [{
    //   "createtime": 1607655470000,
    //   "departmentid": "895D4F6D8D0E7A91E053BFF0A8C09736",
    //   "deptname": "å°å„¿æ™®é€šå¤–ç§‘",
    //   "docotorid": "Oo3XoYCHjsPjcyCvKzl",
    //   "docrecipesdetaillist": [{
    //     "advicename": "111",
    //     "creattime": 1607655482000,
    //     "creatuser": "å¼ çŠçŠ",
    //     "daytime": 1,
    //     "dosefactor": "15",
    //     "doseunit": "g",
    //     "druguseroad": "è…¹åŠ¨è„‰æ’ç®¡æ³¨å°„",
    //     "druguseroadid": "20212",
    //     "eachdose": "1",
    //     "execstate": 0,
    //     "frequency": "QID",
    //     "orderno": "1",
    //     "otpapack": "1",
    //     "packunit": "ç›’",
    //     "rdid": "teQlnq3kgK1gi8SL2BK",
    //     "rid": "NG9HKbkqmNtkm0GaqOg",
    //     "spec": "1",
    //     "times": "4",
    //     "totaldose": "1",
    //     "treatid": "cessaaa",
    //     "treatnewid": "ADAEF7DAD15E504FE053BFF0A8C0C0B6",
    //     "updatetime": 1607655556000
    //   },
    //   ],
    //   "endRow": 0,
    //   "ischronicdisease": "0",
    //   "isfetchdrug": "0",
    //   "isvaild": "1",
    //   "orgName": "è´è¶äº’è”ç½‘åŒ»é™¢",
    //   "organizationid": "83912AAA60C15A68E053BEF0A8C09545",
    //   "page": 0,
    //   "patiid": "RIJskqx2vLHcYm6WOLV",
    //   "patiname": "ä»–å•¦å•¦å•Š",
    //   "prescriptionstatus": "402002",
    //   "presidentnumber": "1607655470726",
    //   "recipecode": "1607655470726",
    //   "recipetype": "1",
    //   "rid": "NG9HKbkqmNtkm0GaqOg",
    //   "rows": 0,
    //   "set": [{
    //     "$ref": "$.docrecipeslist\\_w[0].docrecipesdetaillist[0]"
    //   }],
    //   "signature": "0",
    //   "startRow": 0,
    //   "treatreocrdid": "7b0879d3da7a48479a6b49f2ec9c4e70"
    // }, {
    //   "createtime": 1607655523000,
    //   "departmentid": "895D4F6D8D0E7A91E053BFF0A8C09736",
    //   "deptname": "å°å„¿æ™®é€šå¤–ç§‘",
    //   "docotorid": "Oo3XoYCHjsPjcyCvKzl",
    //   "docrecipesdetaillist": [{
    //     "advicename": "æµ‹è¯•æ³¨å°„æ¶²",
    //     "creattime": 1607655556000,
    //     "creatuser": "å¼ çŠçŠ",
    //     "daytime": 1,
    //     "dosefactor": "0.02",
    //     "doseunit": "mg",
    //     "druguseroad": "è…¹åŠ¨è„‰æ’ç®¡æ³¨å°„",
    //     "druguseroadid": "20212",
    //     "eachdose": "0.1",
    //     "execstate": 0,
    //     "frequency": "EARLY",
    //     "orderno": "1",
    //     "otpapack": "1",
    //     "packunit": "æ”¯",
    //     "rdid": "eC9FtJzndawVNuNkRrw",
    //     "rid": "cvJeEEeKFSPoMjUejz3",
    //     "spec": "2ml:0.2g/1æ”¯/ç›’",
    //     "times": "1",
    //     "totaldose": "5",
    //     "treatid": "12254542",
    //     "treatnewid": "A920A3696CEC14C1E053BFF0A8C06002"
    //   }],
    //   "endRow": 0,
    //   "ischronicdisease": "0",
    //   "isfetchdrug": "0",
    //   "isvaild": "1",
    //   "orgName": "è´è¶äº’è”ç½‘åŒ»é™¢",
    //   "organizationid": "83912AAA60C15A68E053BEF0A8C09545",
    //   "page": 0,
    //   "patiid": "RIJskqx2vLHcYm6WOLV",
    //   "patiname": "ä»–å•¦å•¦å•Š",
    //   "prescriptionstatus": "402002",
    //   "presidentnumber": "1607655523746",
    //   "recipecode": "1607655523746",
    //   "recipetype": "1",
    //   "rid": "cvJeEEeKFSPoMjUejz3",
    //   "rows": 0,
    //   "set": [{
    //     "$ref": "$.docrecipeslist\\_w[1].docrecipesdetaillist[0]"
    //   }],
    //   "signature": "0",
    //   "startRow": 0,
    //   "treatreocrdid": "7b0879d3da7a48479a6b49f2ec9c4e70"
    // }]


  },
  mounted () {
    this.$nextTick(function () {
      this.ORG_ID = this.orgid
      this.CODE = this.trcode
      this.TDparam.nh_orgid = this.ORG_ID
      this.get_MedicineList(); //查询药品字典list

      if (this.west_less == 1) {
        var len = this.List.length + 1;
        this.$refs.westMedList.style.width = 230 * len + 'px';
      } else {
        this.$refs.westMedList.style.width = 230 * LIMIT + 'px';
      }
      /*标记选中的处方*/
      var json = getCookie('rec_index');
      if (json) {
        var obj = JSON.parse(json);
        if (obj.code == this.CODE) {
          this.isHov = parseInt(obj.i) ? parseInt(obj.i) : 0;
        }
      }
      this.hov(this.isHov);
      this.fousPosition(); //定位处方

    });
  },
  methods: {
    //表头样式
    getRowClass: function (row) {
      return row.rowIndex === 0 ? 'padding:5px;background:  #409dff;color:white;text-align:center;font-size: 14px;' : ""
    },
    //父组件向子组件传参
    west_fatherToChild (list) {
      this.westList = list;
    },
    getInfo: function () {
      var t = this;
      t.api({
        url: WEST_URL.INFO,
        method: "get",
        //dataType: "json",
        params: {},
      }).catch(e => {
        console.log("系统繁忙,稍后再试!");
        t.westList = []

      }).then(data => {

        t.westList = data.docrecipeslist_w || []
        console.log("‘西药’数据---", t.westList);



      });
    },
    /*------------------------------药品字典----------------------------*/
    //输入名称查询
    searchVal: function (val) {
      this.TDparam.pageNum = 1;
      this.TDparam.keyword = val ? val : ""
      this.get_MedicineList();
    },
    TDturnPage: function (num) {
      this.TDparam.pageNum = num;
      this.get_MedicineList();
    },
    //分页
    //西药列表
    get_MedicineList: function () {
      var t = this;
      var param = this.TDparam;

      t.api({
        url: WEST_URL.GET_MEDICINE,
        method: "post",
        // dataType: "json",
        params: param,
      }).catch(e => {
        console.log('west药品字典表', e)
        t.TDtotal = 0;
        t.gridData = [];
      }).then(data => {
        if (data && data.result) {
          t.TDtotal = data.total || 0;
          t.gridData = data.result || [];
        }


      });
    },
    /*------------------------------药品字典 end---------------------*/
    /*------------------------------频率----------------------------*/
    get_Ferq: function () {
      var t = this;
      var param = this.ferqParam;
      t.api({
        url: WEST_URL.GET_FERQ,
        method: "post",
        //dataType: "json",
        params: param,
      }).catch(e => {
        console.log('频率', e)
        t.$message.error('频率查询错误！');
        t.ferqTotal = 0;
        t.ferqList = []

      }).then(data => {
        if (data && data.result) {
          t.ferqTotal = data.total || 0;
          t.ferqList = data.result || [];
        }


      });
    },
    turnPage_Ferq: function (num) {
      this.ferqParam.pageNum = num;
      this.get_Ferq();
    },
    //输入名称查询
    searchVal_Ferq: function (val) {
      this.ferqParam.pageNum = 1;
      this.ferqParam.keyword = val ? val : ""
      this.get_Ferq();
    },

    /*------------------------------频率 end------------------------*/
    /*------------------------------用药途径------------------------*/
    get_drugRoute: function () {
      var t = this;
      var param = this.drugRouteParam;
      t.api({
        url: WEST_URL.GET_TUJING,
        method: "post",
        //dataType: "json",
        params: param,
      }).catch(e => {
        console.log('用药途径', e)
        t.$message.error('用药途径查询错误！');
        t.drugRouteTotal = 0;
        t.drugRouteList = []

      }).then(data => {

        if (data && data.result) {
          t.drugRouteTotal = data.total || 0;
          t.drugRouteList = data.result || [];
        }


      });
    },
    turnPage_drugRoute: function (num) {
      this.drugRouteParam.pageNum = num;
      this.get_drugRoute();
    },
    //输入名称查询
    searchVal_drugRoute: function (val) {
      this.drugRouteParam.pageNum = 1;
      this.drugRouteParam.keyword = val ? val : ""
      this.get_drugRoute();
    },
    /*------------------------------用药途径 end---------------------/
    /*------------------------------医嘱----------------------------*/
    // get_YiZhu: function () {
    //   var t = this;
    //   var param = this.yizhuParam;
    //   t.api({
    //     url: WEST_URL.GET_YIZHU,
    //     method: "post",
    //     // dataType: "json",
    //     params: param,
    //   }).catch(e => {
    //     console.log('医嘱', e)
    //     t.$message.error('医嘱查询错误！');
    //     t.yizhuTotal = 0;
    //     t.yizhuList = []
    //     //中药也公用数据
    //     vm_chineset.yizhuTotal = 0;
    //     vm_chinese.yizhuList = []

    //   }).then(data => {

    //     if (data && data.result) {

    //       t.yizhuTotal = data.data.total || 0;
    //       t.yizhuList = data.data.result || [];
    //       //中药也公用数据
    //       vm_chinese.yizhuTotal = data.data.total || 0;
    //       vm_chinese.yizhuList = data.data.result || [];

    //     }


    //   });
    // },
    // turnPage_YiZhu: function (num) {
    //   this.yizhuParam.pageNum = num;
    //   this.get_YiZhu();
    // },
    //输入名称查询
    // searchVal_YiZhu: function (val) {
    //   this.yizhuParam.pageNum = 1;
    //   this.yizhuParam.keyword = val ? val : ""
    //    this.get_YiZhu();
    // },
    /*------------------------------医嘱 end------------------------*/
    /*------------------------------ @ 填充数据--------------------------------*/

    /**
     *药品-触发
     * @param {*} scope  当前处方明细数据
     * @param {*} row  弹窗表格行数据
     * @param {*} tbIndex 当前处方索引i
     */
    selNameTd: function (scope, row, tbIndex) {

      scope.row.orderno = scope.$index + 1
      scope.row.advicename = row.mediname //通用名
      scope.row.treatid = row.medicode //药品code
      scope.row.treatnewid = row.medichemid //药品id
      scope.row.dosefactor = row.dosefactor //剂量系数(保存处方-不传)
      scope.row.otpapack = row.otpapack //包装系数(保存处方-不传)
      scope.row.spec = row.medispec //规格
      scope.row.doseunit = row.doseunit //计量单位
      scope.row.doseunitCopy = row.doseunit //计量单位(保存处方-不传)
      scope.row.packunit = row.otpaunit //包装单位

      this.calculate(this.westList[tbIndex].docrecipesdetaillist, scope)

      this.$set(this.westList[tbIndex].docrecipesdetaillist, scope.$index, scope.row); //重新渲染列表
      var KEY = 'tb' + tbIndex + '-spec' + scope.$index;
      //选中ref（同一个ref,重复操作,反正没响应）

      scope._self.$refs[KEY][0].focus()
      scope._self.$refs[KEY][1].focus()
      this.TDparam.keyword = ''

    },
    /**
     * 频率-触发
     * @param {*} scope  当前处方明细数据
     * @param {*} row  弹窗表格行数据
     * @param {*} tbIndex 当前处方索引i
     */
    selFerq: function (scope, row, tbIndex) {

      scope.row.frequency = row.code //频率
      scope.row.times = row.times //频率
      this.$set(this.westList[tbIndex].docrecipesdetaillist, scope.$index, scope.row); //重新渲染列表
      var KEY = 'tb' + tbIndex + '-daytime' + scope.$index;
      //选中ref（同一个ref,重复操作,反正没响应）
      scope._self.$refs[KEY][0].focus()
      scope._self.$refs[KEY][1].focus()


      this.ferqParam.keyword = ''

    },

    /**
     * 给药途径-触发
     * @param {*} scope  当前处方明细数据
     * @param {*} row  弹窗表格行数据
     * @param {*} tbIndex 当前处方索引i
     */
    selDrugRoute: function (scope, row, tbIndex) {

      scope.row.druguseroad = row.nhname //给药途径
      scope.row.druguseroadid = row.wid //给药途径id
      this.$set(this.westList[tbIndex].docrecipesdetaillist, scope.$index, scope.row); //重新渲染列表
      var KEY = 'tb' + tbIndex + '-polst' + scope.$index;
      //选中ref（同一个ref,重复操作,反正没响应）
      scope._self.$refs[KEY][0].focus()
      scope._self.$refs[KEY][1].focus()

      this.drugRouteParam.keyword = ''
    },

    /**
     * 嘱托 - 触发
     * @param {*} scope  当前处方明细数据
     * @param {*} row  弹窗表格行数据
     * @param {*} tbIndex 当前处方索引i
     */
    selYiZhu: function (scope, row, tbIndex) {
      scope.row.polst = row.nhname // 嘱托
      this.$set(this.westList[tbIndex].docrecipesdetaillist, scope.$index, scope.row); //重新渲染列表
      var KEY = 'tb' + tbIndex + '-popover3-' + scope.$index;
      //选中ref（同一个ref,重复操作,反正没响应）
      scope._self.$refs[KEY][0].focus()
      scope._self.$refs[KEY][1].focus()
      this.yizhuParam.keyword = ''
    },

    /**
     * 剂量单位校验
     * @param {*} table 当前处方，药品明细列表
     * @param {*} scope 药品明细列表里，当前行数据
     */
    checkdoseunit: function (table, scope) {

      var obj = scope.row;
      var index = scope.$index;
      var doseunitCopy = obj.doseunitCopy //计量单位-药品字典表字段
      var doseunit = obj.doseunit //计量单位-药品list字段
      if (doseunitCopy !== '' && doseunitCopy != null && doseunitCopy != undefined) {
        if (doseunitCopy !== doseunit) {
          this.$message.error('该药品【剂量单位】为‘' + doseunitCopy + '’,请重新输入！');
          scope.row.doseunit = '';
          this.$set(table, index, scope.row)
        }
      }
    },
    /**
     * 设置剂量单位copy
     * 
     * @param {*} scope 药品明细列表里，当前行数据
     */
    setDoseunit: function (table, scope) {

      var obj = scope.row;
      var index = scope.$index;
      var doseunit = obj.doseunit //计量单位-药品list字段
      if (doseunit && doseunit !== '0') {
        scope.row.doseunitCopy = doseunit;
        this.$set(table, index, scope.row)
      }
    },
    /**
     * 计算总用量
     * @param {*} table 当前处方，药品明细列表
     * @param {*} scope 药品明细列表里，当前行数据
     */
    calculate: function (table, scope) {
      var totalaccount; //总量
      var obj = scope.row;
      var index = scope.$index;
      var eachdose = obj.eachdose //每次用量
      var frequency = obj.times //执行频率
      var daytime = obj.daytime //天数
      var dosefactor = obj.dosefactor //剂量系数(保存处方-不传) 143
      var otpapack_S = obj.otpapack //包装系数(保存处方-不传)1
      debugger;
      if (!otpapack_S) {
        return false
      }
      if (otpapack_S.indexOf("*") > -1) { //规格不是一个数字如: 1盒*12剂
        this.$message.warning('该药品总量需要人工计算！');
      } else {

        if (Number(daytime) > 7) { //天数大于7天
          this.$message.error("您开具的药品服用天数超过限制，请联系客服处理");
          scope.row.totaldose = '';
          this.$set(table, index, scope.row)
          return false
        }
        if (Number(eachdose) / Number(dosefactor) >= 20) { //超过正常值，不给赋值保存
          this.$message.error("您开具的药品单次用量已超说明书最大用量，请您确认单次用量")
          scope.row.totaldose = '';
          this.$set(table, index, scope.row)
          return false
        } else {
          totalaccount = (Number(eachdose) * Number(frequency) * Number(daytime)) / Number(dosefactor) / Number(otpapack_S);
          var a = totalaccount.toString().split(".")
          if (a.length > 1)
            a = Number(a[0]) + 1;
          var total = Math.ceil(a)
          scope.row.totaldose = isNaN(total) ? 0 : total;
          this.$set(table, index, scope.row)
        }




      }



      //	priceCount();
    },
    /*------------------------------ @ 填充数据 end--------------------------------*/
    /*西药处方药品数量上限*/
    getLimitCount: function () {
      var t = this;
      var param = {
        "keyCol": "CODE",
        "valueCol": "CONTENT",
        "queryCol": "ID",
        "queryVal": "10",
        "tableName": "nh_sys_option",
      };
      t.api({
        method: 'GET',
        //dataType: "json",
        params: param,
        url: WEST_URL.LIMIT,
        //async: false,
      }).catch(e => {
        console.log('西药处方药品数量上限', e)
        t.$message.error("系统繁忙，查詢西药处方药品数量失败!");
      }).then(data => {
        if (data && data.length == 1) {
          t.limitNum = data[0].value;
        }

      });
    },

    //定位处方位置
    fousPosition: function () {
      var t = this;
      var oShow = this.$refs.SHOW;
      var oList = this.$refs.RecipeList;
      if (oShow && oShow.offsetWidth != null && oShow.offsetWidth != undefined) {
        var divWidth = oShow.offsetWidth;

        oList.style.left = -(divWidth * Math.floor(t.isHov / 3)) + 'px';
        oList.style.transition = "0.3s";
      }


      // $(oList).css({
      //   'left': -(divWidth * Math.floor(t.isHov / 3)),
      //   "transition": "0.3s"
      // })
    },
    Pre: function () {

      var oShow = this.$refs.west_SHOW;
      var oList = this.$refs.westMedList;
      var divWidth = oShow.offsetWidth;
      var allWidth = oList.offsetWidth;
      var LEFT = parseInt(oList.offsetLeft);
      if (LEFT + divWidth <= 0) {
        oList.style.left = LEFT + divWidth + 'px';
        oList.style.transition = "0.3s"

      }

    },
    Next: function () {

      var oShow = this.$refs.west_SHOW;
      var oList = this.$refs.westMedList;
      var divWidth = oShow.offsetWidth;
      var allWidth = oList.offsetWidth;
      var LEFT = parseInt(oList.offsetLeft);
      if (-allWidth < (LEFT - divWidth)) {
        oList.style.left = LEFT - divWidth + 'px';
        oList.style.transition = "0.3s"
        // $(oList).css({
        //   'left': LEFT - divWidth,
        //   "transition": "0.3s"
        // })
      }

    },
    Name1: function (i) {
      return 'docrecipe[' + i + '].rid';
    },
    turnDate: function (obj) {
      if (obj) {
        var str = new Date(obj);
        var y = str.getFullYear();
        var m = str.getMonth() + 1;
        var d = str.getDate();
        return y + '-' + m + "-" + d;
      } else {
        return '';
      }

    },

    //新增处方
    addREC: function () {
      var t = this;


      if (!t.ill) { //西医诊断都没有
        t.$message.error('请先下诊断！');
        return false; //跳出方法

      }

      var patInfo = getCookie('patInfo');
      patInfo = JSON.parse(patInfo);
      t.AGE = patInfo.age;

      if (t.AGE && t.AGE <= 14 && t.westList.length == 0) {
        var str = ''
        if (t.AGE <= 6) {
          str = '该患者为（低龄）儿童，请酌量填写用药剂量!'
        } else {
          str = '该患者为儿童，请酌量填写用药剂量!'
        }
        this.$alert(str, '提示', {
          confirmButtonText: '知道了',
          callback: function (action) {

          }
        });
      }

      t.api({
        url: WEST_URL.ADD_REC,
        method: "post",
        // dataType: "json",
        params: {
          "id": "2",
          "treatId": t.RID,
        },
      }).catch(e => {
        t.$message.error("系统异常，开处方失败");


      }).then(data => {

        if (data.docrecipeslist_w) {
          t.westList = data.docrecipeslist_w
          //选中最新的处方
          t.hov(t.westList.length - 1)

        }

      });
    },
    /**
     * 删除处方
     * @param {*} obj  当前处方对象
     * @param {*} index 当前处方对象index索引
     */
    del: function (obj, index) {

      var isDelete = confirm('请问您确认删除该处方吗?');
      if (isDelete == true) {
        var rid = obj.rid
        this.deleteDocrecipesMain(rid, index);
      }
    },
    isNaN: function (value) {
      return (typeof value) === 'number' && window.isNaN(value);
    },
    hov: function (i) {
      this.isHov = i;

      if (this.isNaN(i)) {
        return false;
      }
      if (!this.List[i]) {
        return false;
      }
      //记住选中的处方
      var json = {
        'title': "west",
        "code": this.CODE,
        'i': i
      }
      setCookie('rec_index', JSON.stringify(json), 1)

    },

    /**
     * 处方主表删除 
     * 后台把此主表相关的从表处方都删除掉了
     * @param rid 处方ID
     * @param i 单前处方的index索引
     */
    deleteDocrecipesMain: function (rid, i) {
      var t = this;
      var json = getCookie('rec_index');
      if (rid != null && "" != rid) {
        //处方主信息
        t.api({
          url: WEST_URL.DEL_REC,
          method: "get",

          params: {
            "rid": rid
          },
        }).catch(e => {
          console.log('删除处方err', e)
          t.$message.error("系统错误，操作失败!");
        }).then(data => {

          if (data) {
            t.$message.success(data);
            t.getInfo();
            // 记住选中的处方块
            if (json && i !== undefined) {
              var obj = JSON.parse(json);
              if (obj.i > i) {
                t.isHov = parseInt(obj.i - 1);
                t.hov(t.isHov);
              }
            } else {
              t.hov(0);
            }
          } else {
            t.$message.error("删除处方，操作失败!");
          }



        });
      }
    },
    /**
     * 
     * @param item:当前处方(主表)
     * @param scope:当前处方明细行数据
     */
    delDrug: function (item, scope) {

      var t = this;
      if (item.signature == '1') {
        t.$message.error("该处方已签名无法修改!")
        return false;
      }

      var rdid = scope.row.rdid
      var index = scope.$index
      var table = item.docrecipesdetaillist
      if (rdid) { //旧td数据
        t.api({
          url: WEST_URL.DEL_DETAIL,
          method: "get",
          params: {
            "rdid": rdid
          },
        }).catch(e => {
          console.log('当前处方(主表)', e)
          t.$message.error("操作失败!");

        }).then(data => {
          if (data > 0) { //后台删除成功  前端页面元素删除
            table.splice(index, 1); //剔除数组某个元素

            // t.getInfo();
            // t.$nextTick(function () {
            //   t.hov(0);
            // })
          } else if (data == -1 || data == '-1') {
            t.$message.error("该处方已签名无法修改!")
          } else if (data === 0 || data === '0') {
            t.$message.error("删除失败!")
          }

        });
      } else { //新td数据

        table.splice(index, 1); //剔除数组某个元素
      }

    },
    /**
     * 处方明细表，最后一格enter键添加一个处方明细
     * @param  obj 当前处方数据
     * @param   scope 当前明细数据
     * @param   e 事件对象
     */
    tabFun: function (obj, scope, e) {

      var index = scope.$index;
      var TB = obj.docrecipesdetaillist; //医嘱列表
      //最后一行&&enter
      if (index == TB.length - 1 && e.keyCode == 13) {
        this.addDrug(obj);
      }

    },

    /**
     * 限制只能输入数字
     * @param scope 当前处方明细行数据
     * @param key 当前值的名称
     * @param e  事件对象
     */
    numInput: function (scope, key, e) {
      // /^(0|[1-9][0-9]*)(\.\d+)?$/;
      //scope[key] = e.target.value.replace(/^(0|[1-9][0-9]*)(\.\d+)?$/g, '');
    },
    /**
     * 新增医嘱
     * @param {*} obj 当前处方数据
     */
    addDrug: function (obj) {
      var TB = obj.docrecipesdetaillist; //医嘱列表
      var len = TB.length + 1

      if (len <= this.limitNum) {
        var obj = {
          'orderno': len,
          'rid': obj.rid
        }
        TB.push(obj);
      } else {
        this.$message.error('西药处方药品数量已达上限！');
      }


    },
    //处理null字段
    NoNull: function (list) {
      var a = list.map(function (e) {
        for (var i in e) {
          e[i] = e[i] ? e[i] : "";
        }
        return e
      });
      return a;
    },
    //保存处方
    save: function () {
      var t = this;
      var list = t.List
      if (!t.ill && !t.chineseill) { //中西医诊断都没有
        t.$message.error('请先下诊断！');
        return false; //跳出方法

      }

      /*-------------封装入参-------------*/
      var paramList = []
      for (var i = 0; i < list.length; i++) {
        var obj = {
          'docrecipesdetails': list[i].docrecipesdetaillist,
          'ischronicdisease': list[i].ischronicdisease ? list[i].ischronicdisease : "0", //默认非慢病处方
          "rid": list[i].docrecipesdetaillist[0].rid
        }
        debugger;
        paramList.push(obj);
      }
      /*-------------封装入参 end-------------*/
      //检验非空
      for (var j = 0; j < paramList.length; j++) { //处方列表
        var perRec = paramList[j]['docrecipesdetails'];

        perRec = t.NoNull(perRec) //处理null字段
        var oRec = '处方' + (j + 1) + "："
        for (var x = 0; x < perRec.length; x++) { //单个处方明细
          var per = perRec[x];
          if (!per['advicename']) {
            var str = oRec + '药品名称为空了'
            t.$message.error(str);
            return false; //跳出方法
          }
          if (!per['spec']) {
            var str = oRec + '规格为空了'
            t.$message.error(str);
            return false; //跳出方法
          }
          if (!per['eachdose']) {
            var str = oRec + '单量为空了'
            t.$message.error(str);
            return false; //跳出方法
          }
          if (!per['doseunit']) {
            var str = oRec + '剂量单位为空了'
            t.$message.error(str);
            return false; //跳出方法
          }
          if (!per['frequency']) {
            var str = oRec + '频率为空了'
            t.$message.error(str);
            return false; //跳出方法
          }
          if (!per['daytime']) {
            var str = oRec + '天数为空了'
            t.$message.error(str);
            return false; //跳出方法
          }
          if (!per['totaldose']) {
            var str = '总量为空了'
            t.$message.error(str);
            return false; //跳出方法
          }
          if (!per['druguseroad']) {
            var str = oRec + '给药途径为空了'
            t.$message.error(str);
            return false; //跳出方法
          }
          // if (!per['polst']) {
          //   var str = oRec + '嘱托为空了'
          //   t.$message.error(str);
          //   return false; //跳出方法
          // }
          //  删除下面连个属性
          delete per["dosefactor"] //剂量系数(保存处方-不传)
          delete per["otpapack"] //包装系数(保存处方-不传)
          delete per["times"] //频率系数(保存处方-不传)
          delete per["doseunitCopy"] //药品剂量单位(保存处方-不传)



        }

      }





      var loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.7)'
      });


      t.api({
        method: "post",
        url: WEST_URL.SAVE,
        headers: {
          'Content-Type': 'application/json'
        },
        transformRequest: [function (data) {
          data = JSON.stringify(data)
          return data
        }],
        data: {
          'docrecipe': paramList,
          "treatId": t.RID
        }

        // contentType: "application/json", //后台传输 跟后台java 的@respondbody有关系
      }).then(res => {

        loading.close();
        if (res == "OK") {
          t.$message.success('处方保存成功!')
          t.getInfo(); //重新加载处方列表，防止重复保存，出现多条一样的处方明细信息
        }

      }).catch(e => {
        loading.close();
        console.log('保存处方', e);
        t.$message.error("网络错误,保存处方失败!");

      });
    },


  },
  computed: {
    docName () {
      return this.$store.getters.docName;
    },
    //获取处方列表
    List: function () {
      return this.westList;

    },
    west_less: function () { //加号的个数
      var str = 0;
      var l = this.List.length;
      if (l >= LIMIT) {
        str = 1;

      } else {
        str = LIMIT - l;
      }
      return str;
    }
  }, //end computed
}
</script>
<style >
#westernMedicine {
  padding-bottom: 20px;
}

.western_medicine {
  font-size: 14px;
  padding: 10px;
}

.western_medicine .prescription_list {
  width: 762px;
  height: 130px;
  position: relative;
  overflow: hidden;
  /* border-left: 1px solid #000; */
  margin-left: 35px;
}

.western_medicine .prescription_list:after {
  content: "";
  display: block;
  clear: both;
}

.movelist {
  border-bottom: 1px solid rgba(151, 186, 246, 0.26);
  padding-bottom: 20px;
}

.movelist .prev,
.movelist .next {
  padding: 10px 6px;
  color: #1180df;
  top: 106px;
  margin: 0 10px;
  font-size: 32px;
  font-weight: bold;
  /* margin-top: -197px; */
  position: absolute;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 10;
  cursor: pointer;
  filter: alpha(opacity=20);
  transform: scale(1, 2.5);
}

.movelist .prev {
  left: 0;
  /* display:none; */
}

.movelist .next {
  right: 0;
  /*  display:none;   */
}

.western_medicine .prescription_list_inner {
  width: 1480px;
  position: absolute;
  left: 0;
  top: 0;
}

.western_medicine .prescription_list_inner:after {
  content: "";
  display: block;
  clear: both;
}

.western_medicine .prescription_list div.active {
  border: 1px solid rgb(17, 128, 216);
  box-shadow: 0 0 8px -1px rgba(23, 23, 134, 0.75);
}

.western_medicine .prescription_list .list_item {
  width: 240px;
  height: 110px;
  float: left;
  cursor: pointer;
  border: 1px solid #97baf6;
  margin: 5px;
  padding: 3px;
  position: relative;
}

.list_item > div span {
  color: #999;

  display: inline-block;
  width: 70px;
}

.western_medicine .prescription_list .list_item .title {
  font-weight: bold;
}

.add_new_item {
  width: 220px;
  height: 110px;
  float: left;
  cursor: pointer;
  color: #2b85e2;
  font-size: 26px;
  font-weight: bold;
  text-align: center;
  line-height: 110px;
  border: 1px solid #97baf6;
  margin: 5px;
  padding: 3px;
}

.prescription_list .list_item .btn_delete {
  width: 40px;
  text-align: center;
  border: 0;
  background-color: #3bbfb4;
  color: #fff;
  font-size: 12px;
  padding: 4px 0;
  border-radius: 4px;
  margin: 6px auto 0 auto;
  display: block;
  cursor: pointer;
}

/* .western_medicine .prescription_detail {
  padding: 10px 0 !important;
} */

.prescription_function_list:after {
  content: "";
  display: block;
  clear: both;
}

.western_medicine .table_prescription_detail,
.western_medicine .table_add_new_prescription {
  width: 828px;
  margin: 20px 10px 0 0;
  text-align: center;
  border-collapse: collapse;
  border: solid #add9c0;
  border-width: 1px 0px 0px 1px;
}

.western_medicine .table_prescription_inspection {
  width: 518px;
  margin: 0px 10px 0 310px;
  text-align: center;
  border-collapse: collapse;
  border: solid #c4d7f2;
  border-width: 1px 0px 0px 1px;
}

.table_prescription_detail th,
.table_add_new_prescription th,
.table_prescription_inspection th {
  padding-bottom: 4px;
  border-bottom: 2px solid #ddd;
}

.table_prescription_detail td,
.table_add_new_prescription td,
.table_prescription_inspection td {
  padding-bottom: 4px;
  border-bottom: 1px dashed #c4d7f2;
}

.western_medicine .table_prescription_detail input,
.western_medicine .table_add_new_prescription input,
.table_prescription_inspection input {
  width: 34px;
  outline: none;
  text-align: center;
  border: none;
}

.western_medicine .table_prescription_detail .drug,
.western_medicine .table_add_new_prescription .drug,
.table_prescription_inspection .drug {
  width: 100%;
}

.western_medicine .table_prescription_detail .frequency,
.western_medicine .table_add_new_prescription .frequency,
.table_prescription_inspection .frequency {
  width: 50px;
}

.western_medicine .table_prescription_detail .btn_delete,
.western_medicine .table_add_new_prescription .btn_delete,
.table_prescription_inspection .btn_delete {
  height: 20px;
  /* background: url(../../../images/common/cancel2.png) no-repeat center center; */
  cursor: pointer;
}

.TABLE .el-input__inner {
  font-size: 10px !important;
  padding: 2px !important;
}

div#west_SHOW,
#chinese_SHOW {
  height: 180px !important;
  /*  background: antiquewhite; */
}

#west_SHOW .per_item,
#chinese_SHOW .per_item {
  height: 160px !important;
}
.RDiv {
  display: inline-block;
  position: relative;
  margin: 0 auto;
  width: 100%;
  text-align: center;
  font-size: 0;
  /* background: antiquewhite; */
}

.rec-ceil {
  text-align: left;
  padding: 2px 0 2px 0px;
}

.oPrev,
.oNext {
  display: inline-block;
  position: relative;
  cursor: pointer;
  z-index: 9;
  text-align: center;
  box-sizing: border-box;
  height: 100px;
  width: 39px;
  vertical-align: top;
  /*   background: #0606061c; */
  margin: 3% 0;
  border-radius: 10%;
}

.oPrev:after {
  content: "";
  font-size: 40px;
  font-weight: bold;
  position: absolute;
  left: 28%;
  top: 37%;
  cursor: pointer;
  color: #1180df;
  border: solid #409dff;
  border-width: 0 5px 5px 0;
  display: inline-block;
  box-sizing: border-box;
  height: 30px;
  width: 30px;
  transform: rotate(135deg);
  -webkit-transform: rotate(135deg);
}

.oNext:after {
  content: "";
  font-size: 40px;
  font-weight: bold;
  position: absolute;
  right: 28%;
  top: 37%;
  cursor: pointer;
  color: #1180df;
  border: solid #409dff;
  border-width: 0 5px 5px 0;
  display: inline-block;
  box-sizing: border-box;
  height: 30px;
  width: 30px;
  transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
}

.oPrev:hover,
.oNext:hover {
  background: #eaf4ff;
}

.showRDiv {
  display: inline-block;
  width: 690px;
  font-size: 12px;
  overflow: hidden;
  height: 145px;
  padding: 5px 0;
  box-sizing: border-box;
  position: relative;
}

.RecipeList {
  display: inline-block;
  min-width: 690px;
  position: absolute;
  left: 0;
  font-size: 0px;
}

.per_item {
  vertical-align: top;
  display: inline-block;
  border: 1px solid #b2b2b3;
  padding: 5px;
  position: relative;
  width: 220px;
  margin: 5px;
  min-height: 135px;
  box-sizing: border-box;
  font-size: 14px;
}

.per_item > div > span {
  display: inline-block;
  width: 35%;
  text-align: left;
  color: #b2b2b3;
}

.odelete {
  width: 18px;
  text-align: center;
  border: 0;
  background: url("~@/assets/delete.png") no-repeat center center;
  font-size: 8px;
  background-size: 99%;
  padding: 4px 0;
  border-radius: 4px;
  display: block;
  cursor: pointer;
  outline: none;
  position: absolute;
  right: 7px;
  top: 0;
}

.checkAdd {
  font-size: 29px;
  display: block;
  height: 100%;
  text-align: center;
  color: #397dc0;
  cursor: pointer;
  padding: 30px 0 0 0;
  box-sizing: border-box;
}
.checkAdd.med {
  padding-top: 21%;
}
.hover {
  border: 1px solid #409dff;
  background: #eaf4ff;
}

.hover .title {
  color: #409dff;
}

.hover .title_sign {
  background: #f97c55;
  border: 1px solid #f97c55;
  color: white;
}

.hover .rec-ceil > span {
  color: #0064c7;
}
.hover .title_sign {
  background: #f97c55;
  border: 1px solid #f97c55;
  color: white;
}
.title_sign {
  color: #000000;
  background: #ebf1ff;
  border: 1px solid #97baf6;
  font-size: 14px;
  font-weight: 400 !important;
  cursor: pointer;
  min-width: 55px;
  display: inline-block;
  text-align: center;
  padding: 3px 4px;
  border-radius: 2px;
}
.title {
  font-size: 20px;
  color: #b2b2b3;
  font-family: 微軟雅黑;
}
.hover .title {
  color: #409dff;
}
.num-input {
  width: 80% !important;
  padding: 5px;
  border: 1px solid #dcdfe6;
  border-radius: 3px;
  line-height: 25px;
  font-size: 12px;
}
.TABLE .el-table .cell {
  width: 100%;
  padding: 0 !important;
  text-align: center;
  height: 40px;
  box-sizing: border-box;
  display: inline-block;
  vertical-align: middle;
  line-height: 40px;
}
.cell .el-input {
  width: 95%;
}
.el-table__fixed-right::before,
.el-table__fixed::before {
  content: "";
  background: none !important;
}
.el-popover {
  height: 360px;
}
.tipTb td {
  margin: 0;
  padding: 1px;
}
</style>
