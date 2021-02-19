<template>
  <div id="chinese_medicine"
       class="chinese_medicine">

    <!-- new -->
    <div class="RDiv">
      <div class="oPrev"
           @click="Pre"></div>
      <div class="showRDiv"
           ref="chinese_SHOW"
           id="chinese_SHOW">
        <div class="RecipeList"
             ref="chineseMedList"
             id="chineseMedList">
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
                   :value="L.rid" />
            <input type="hidden"
                   v-model="L.signature"
                   for="csignatureFlag" />
            <a class="odelete"
               @click.stop="del(L,i)">&nbsp;</a>
            <!-- <div v-if="L.signature &&L.signature=='1'">
              <input type="hidden"
                     id="treatRid"
                     v-model="L.rid" />
              <div class="title_sign"
                   @click="findSignatrueFile(L.rid,L.recipecode);">查看已签名处方</div>
            </div>
            <div v-else>
              <input type="hidden"
                     id="treatrecordRid"
                     v-model="L.rid" />
              <div class="title_sign"
                   @click="signature_chinese(L.rid,L.recipecode);">签名</div>
            </div> -->

          </div>
          <div class="per_item"
               v-for="(per,j) in chinese_less"
               :key="j">
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
      <!-- <input type="hidden" v-model="cFLAG" id="signatureFlag" />
    <ul class="prescription_function_list BTN_GROUP" v-show="cFLAG!='1'">
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
          <el-table-column label="药品名称"
                           width="280">
            <template slot-scope="scope">
              <div class="pops">
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
          <el-table-column label="规格">
            <template slot-scope="scope">
              <el-input v-model="scope.row.spec"
                        :ref="'tb'+i+'-spec'+scope.$index"
                        :attr="'tb'+i+'-spec'+scope.$index"
                        placeholder="规格">
              </el-input>
            </template>
          </el-table-column>

          <!-- 单位 -->
          <el-table-column label="单位">
            <template slot-scope="scope">
              <el-input v-model="scope.row.packunit"
                        :ref="'tb'+i+'-packunit'+scope.$index"
                        :attr="'tb'+i+'-packunit'+scope.$index"
                        placeholder="单位">
              </el-input>
            </template>
          </el-table-column>

          <!-- 数量 -->
          <el-table-column label="数量">
            <template slot-scope="scope">

              <input type="number"
                     v-model="scope.row.totaldose"
                     :ref="'tb'+i+'-totaldose'+scope.$index"
                     :attr="'tb'+i+'-totaldose'+scope.$index"
                     placeholder="数量"
                     class="num-input"
                     min='0' />
              <!-- @input='numInput(scope.row,"totaldose",$event)' -->
            </template>
          </el-table-column>

          <!-- 嘱托 -->
          <el-table-column label="嘱托">
            <template slot-scope="scope">
              <!-- <el-popover placement="top-end" width="300" trigger="focus" :ref="'tb'+i+'-popover3-'+scope.$index"
              :attr-pop="'tb'+i+'-popover3-'+scope.$index">
              嘱托list
              <el-table :data="yizhuList" border @row-click='selYiZhu(scope,$event,i)' :header-cell-style="getRowClass">
                <el-table-column property="nhname" :show-overflow-tooltip="true" label="名称">
                </el-table-column>
              </el-table>
              <el-pagination background layout="total,pager" :current-page.sync="yizhuParam.pageNum" class="PAGES"
                :page-size="yizhuParam.pageSize" :pager-count="5" @current-change="turnPage_YiZhu" :total="yizhuTotal"
                align='center'>
              </el-pagination>

              <el-input v-model="scope.row.polst" :ref="'tb'+i+'-polst'+scope.$index"
                :attr="'tb'+i+'-polst'+scope.$index" placeholder="嘱托" slot="reference"
                @input="searchVal_YiZhu(scope.row.polst)" @focus="searchVal(scope.row.polst)"
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

        <div class="FA">

          <div class="ceils">共 <input type="number"
                   v-model="TB.dose"
                   class="num-input"
                   min="1"
                   onkeyup="this.value=this.value.replace(/\D|^0/g,'')" />剂</div>
          <div class="ceils sel-int">制法:
            <el-select v-model="TB.tcm_preparation_id"
                       placeholder="制法">
              <el-option v-for="item in zhiFa"
                         :key="item.wid"
                         :label="item.nhname"
                         :value="item.wid">
              </el-option>
            </el-select>
          </div>
          <div class="ceils  sel-int">用法:
            <el-select v-model="TB.tcm_usage_id"
                       placeholder="用法">
              <el-option v-for="item in yongFa"
                         :key="item.wid"
                         :label="item.nhname"
                         :value="item.wid">
              </el-option>
            </el-select>
          </div>
          <div class="ceils">每日<input type="number"
                   v-model="TB.dosepd"
                   class="num-input"
                   min="1"
                   onkeyup="this.value=this.value.replace(/\D|^0/g,'')" />剂</div>
          <div class="ceils">分<input type="number"
                   v-model="TB.partsometimestaking"
                   class="num-input"
                   min="1"
                   onkeyup="this.value=this.value.replace(/\D|^0/g,'')" />次服</div>
        </div>
      </div>

      <!-- 新table end-->
    </div>

    <!-- 二维码显示区域 -->
    <!-- <el-dialog title="请使用医生端手机app扫码签名" :visible.sync="QRcode.dialog" :modal='false' width="350px">
    <div class="qrcode" v-loading="QRcode.qrLoading">
      <div id="qrcode_chinese"></div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="isOkSignature" v-show="hasQRcode">确定签名</el-button>
    </div>
  </el-dialog> -->
    <!-- 二维码显示区域 end-->
  </div>
</template>
<script>
import {
  setCookie,
  clearCookie,
  getCookie
} from '@/utils/auth'
var LIMIT = 6;
var CHINESE_URL = {

  INFO: "/webHis/docrecipes/getPrescriptionMap", //获取所有处方信息
  GET_MEDICINE: "/webhis/DrugDictionaryController/loadMediDict", //药品字典列表list
  //GET_YIZHU: "webhis/DrugDictionaryController/loadyizhu", //医嘱list
  ZHIFA: "/webhis/DrugDictionaryController/loadPreparation.html", //制法list
  YONGFA: "/webhis/DrugDictionaryController/loadUsage.html", //用法list
  ADD_REC: '/webHis/docrecipes/saveDocrecipesWestern',   //新增处方  
  DEL_REC: "/webHis/docrecipes/deleteDocrecipesNew",  //删除处方(主表)
  DEL_DETAIL: "/webHis/docrecipes/deleteDocrecipesDetail.html", //删除处方列表明细
  // SIGNATRUE: "doctor/signatrue/chufangSignatrue", //签名
  //SCAN_FILE: "doctor/signatrue/findFileSignature", //查看已经签名的处方文件
  SAVE: "/webHis/docrecipes/saveDocrecipesAll", //保存处方（和其他保存处方接口一致）

}
export default {
  name: 'chineseMedicine',
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
      cFLAG: "0", //标记签名 0未签名，1已签名
      limitNum: 0, //西药处方药品数量上限
      ORG_ID: '', //机构id
      CODE: "", //处方code-标记诊室
      /*中药处方列表*/
      chineseList: [],
      /*中药项目弹窗 */
      TDparam: {
        meditypeid: 30000000,
        nh_orgid: "",
        pageNum: 1,
        pageSize: 10,
        keyword: "",
      },
      TDtotal: 0,
      gridData: [], //检验项目列表
      /*医嘱*/
      yizhuParam: {
        pageNum: 1,
        pageSize: 10,
        keyword: ""
      },
      yizhuTotal: 0,
      yizhuList: [],
      /*制法list */
      zhiFa: [],
      /*用法list*/
      yongFa: [],
      /*二维码 */
      hasQRcode: false,
      QRcode: {
        dialog: false,
        qrLoading: false,
      }
    }
  },
  created () {
    this.getZhiFa(); //制法list
    this.getYongFa(); //用法list
    // this.chineseList = [{
    //   "createtime": 1608089371000,
    //   "departmentid": "895D4F6D8D0E7A91E053BFF0A8C09736",
    //   "deptname": "å°å„¿æ™®é€šå¤–ç§‘",
    //   "docotorid": "Oo3XoYCHjsPjcyCvKzl",
    //   "docrecipesdetaillist": [{
    //     "advicename": "sss",
    //     "creattime": 1608089385000,
    //     "creatuser": "å¼ çŠçŠ",
    //     "dose": "1",
    //     "dosefactor": "10",
    //     "execstate": 0,
    //     "orderno": "1",
    //     "otpapack": "10",
    //     "packunit": "1",
    //     "rdid": "fPrExgQLGGnCjX1M4Rx",
    //     "rid": "Ut7dNBgvy6cSsaX6mLU",
    //     "spec": "g",
    //     "totaldose": "1",
    //     "treatid": "342423",
    //     "treatnewid": "94772BFB3A5926DDE053BFF0A8C08C92"
    //   },
    //   {
    //     "advicename": "aaa",
    //     "creattime": 1608089385000,
    //     "creatuser": "å¼ çŠçŠ",
    //     "dose": "1",
    //     "dosefactor": "10",
    //     "execstate": 0,
    //     "orderno": "1",
    //     "otpapack": "10",
    //     "packunit": "1",
    //     "rdid": "fPrExgQLGGnCjX1M4Rx",
    //     "rid": "Ut7dNBgvy6cSsaX6mLU",
    //     "spec": "g",
    //     "totaldose": "1",
    //     "treatid": "342423",
    //     "treatnewid": "94772BFB3A5926DDE053BFF0A8C08C92"
    //   }],
    //   "dose": 1.0,
    //   "dosepd": 1.0,
    //   "endRow": 0,
    //   "ischronicdisease": "0",
    //   "isfetchdrug": "0",
    //   "isvaild": "1",
    //   "orgName": "è´è¶äº’è”ç½‘åŒ»é™¢",
    //   "organizationid": "83912AAA60C15A68E053BEF0A8C09545",
    //   "page": 0,
    //   "partsometimestaking": "1",
    //   "patiid": "RIJskqx2vLHcYm6WOLV",
    //   "patiname": "ä»–å•¦å•¦å•Š",
    //   "prescriptionstatus": "402002",
    //   "presidentnumber": "1608089371275",
    //   "recipecode": "1608089371275",
    //   "recipetype": "5",
    //   "rid": "Ut7dNBgvy6cSsaX6mLU",
    //   "rows": 0,
    //   "set": [{
    //     "$ref": "$.docrecipeslist\\_c[0].docrecipesdetaillist[0]"
    //   }],
    //   "signature": "0",
    //   "startRow": 0,
    //   "tcm_preparation_id": "23657",
    //   "tcm_usage_id": "23669",
    //   "treatreocrdid": "7b0879d3da7a48479a6b49f2ec9c4e70"
    // }]
  },
  mounted () {
    this.$nextTick(function () {
      this.ORG_ID = this.orgid
      this.CODE = this.trcode //处方code-标记诊室
      this.TDparam.nh_orgid = this.ORG_ID
      this.get_MedicineList(); //查询药品字典list

      if (this.chinese_less == 1) {
        var len = this.List.length + 1;
        this.$refs.chineseMedList.style.width = 230 * len + 'px';
        //$("#chineseMedList").css('width', 250 * len + 'px');
      } else {
        // $("#chineseMedList").css('width', 250 * LIMIT + 'px');
        this.$refs.chineseMedList.style.width = 230 * LIMIT + 'px';
      }
      //标记处方选择
      var json = getCookie('chinese_index');
      if (json) {
        var obj = JSON.parse(json);
        if (obj.code == this.CODE) {

          this.isHov = parseInt(obj.i) ? parseInt(obj.i) : 0;
        }
      }
      this.hov(this.isHov);
      this.fousPosition(); //定位处方
      //保存已写好的处方到处方模板和处方明细
      // deleteDtl_chinese($('#chinese_medicine'), 'table_prescription_detail');
    });
  },
  computed: {
    docName () {
      return this.$store.getters.docName;
    },
    //获取处方列表
    List: function () {
      var list = this.chineseList;
      return list;
    },
    chinese_less: function () { //加号的个数
      var l = this.List.length;
      if (l >= LIMIT) {
        return 1;
      } else {
        return LIMIT - l;
      }

    },
  },
  methods: {
    //表头样式
    getRowClass: function (row) {
      return row.rowIndex === 0 ? 'padding:5px;background:  #409dff;color:white;text-align:center;font-size: 14px;' : ""
    },
    //父组件向子组件传参
    chinese_fatherToChild (list) {
      this.chineseList = list;
    },
    getInfo: function () {
      var t = this;

      t.api({
        url: CHINESE_URL.INFO,
        method: "get",
        params: {},
      }).catch(e => {
        console.log("系统繁忙,稍后再试!");
        t.chineseList = []
      }).then(data => {

        t.chineseList = data.docrecipeslist_c || []
        console.log("‘中药’数据---", t.chineseList);



      });
    },
    /*------------------------------制法list----------------------------*/
    getZhiFa: function () {
      var t = this;
      var param = {};

      t.api({
        url: CHINESE_URL.ZHIFA,
        method: "get",

        params: param,
      }).catch(e => {
        console.log("制法err", e);
        t.zhiFa = []

      }).then(data => {
        t.zhiFa = data || []


      });
    },
    /*------------------------------制法list end -----------------------*/
    /*------------------------------用法list ---------------------------*/
    getYongFa: function () {
      var t = this;
      var param = {};
      t.api({
        url: CHINESE_URL.YONGFA,
        method: "get",
        params: param,
      }).catch(e => {
        console.log("用法err", e);
        t.yongFa = []

      }).then(data => {
        t.yongFa = data || []
      });
    },
    /*------------------------------用法list end -----------------------*/
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
        url: CHINESE_URL.GET_MEDICINE,
        method: "post",
        params: param,
      }).catch(e => {
        console.log('chinese药品字典表err', e)

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
    /*------------------------------医嘱----------------------------*/
    //       get_YiZhu: function () {
    //         var t = this;
    //         var param = this.yizhuParam;
    //         $.ajax({
    //           url: CHINESE_URL.GET_YIZHU,
    //           type: "post",
    //           dataType: "json",
    //           data: param,
    //           error: function (e) {
    //             t.$message.error(e);
    //             t.yizhuTotal = 0;
    //             t.yizhuList = []
    //
    //           },
    //           success: function (data) {
    //
    //             if (data.result) {
    //               t.yizhuTotal = data.data.total || 0;
    //               t.yizhuList = data.data.result || [];
    //             }
    //
    //           }
    //         });
    //       },
    //       turnPage_YiZhu: function (num) {
    //         this.yizhuParam.pageNum = num;
    //         this.get_YiZhu();
    //       },
    //       //输入名称查询
    //       searchVal_YiZhu: function (val) {
    //         this.yizhuParam.pageNum = 1;
    //         this.yizhuParam.keyword = val ? val : ""
    //         this.get_YiZhu();
    //       },
    /*------------------------------医嘱 end------------------------*/
    /*------------------------------ @ 填充数据--------------------------------*/
    /**
     *药品-触发
     * @param {*} scope  当前处方明细数据
     * @param {*} row  弹窗表格行数据
     * @param {*} tbIndex 当前处方索引i
     */
    selNameTd: function (scope, row, tbIndex) {

      /**row 数据(单个)
       * 
       */

      scope.row.orderno = scope.$index + 1
      scope.row.advicename = row.mediname //通用名
      scope.row.treatid = row.medicode //药品code
      scope.row.treatnewid = row.medichemid //药品id
      scope.row.spec = row.medispec //规格


      this.$set(this.chineseList[tbIndex].docrecipesdetaillist, scope.$index, scope.row); //重新渲染列表
      var KEY = 'tb' + tbIndex + '-spec' + scope.$index;
      //选中ref（同一个ref,重复操作,反正没响应）
      scope._self.$refs[KEY][0].focus()
      scope._self.$refs[KEY][1].focus()

      this.TDparam.keyword = ''
    },
    /**
     * 嘱托 - 触发
     * @param {*} scope  当前处方明细数据
     * @param {*} row  弹窗表格行数据
     * @param {*} tbIndex 当前处方索引i
     */
    //       selYiZhu: function (scope, row, tbIndex) {
    //         scope.row.polst = row.nhname // 嘱托
    //         this.$set(this.chineseList[tbIndex].docrecipesdetaillist, scope.$index, scope.row); //重新渲染列表
    //         var KEY = 'tb' + tbIndex + '-popover3-' + scope.$index;
    //         //选中ref（同一个ref,重复操作,反正没响应）
    //         scope._self.$refs[KEY][2].doClose()
    //         scope._self.$refs[KEY][0].doClose()
    //         this.yizhuParam.keyword = ''
    //
    //       },
    /*------------------------------ @ 填充数据 end--------------------------------*/

    //定位处方位置
    fousPosition: function () {
      var t = this;
      var oShow = this.$refs.chinese_SHOW;//$("#chinese_SHOW")[0]; 
      var oList = this.$refs.chineseMedList;//$("#chineseMedList")[0];
      if (oShow && oShow.offsetWidth != null && oShow.offsetWidth != undefined) {
        var divWidth = oShow.offsetWidth;
        oList.style.left = -(divWidth * Math.floor(t.isHov / 3)) + 'px';
        oList.style.transition = "0.3s";
      }

    },
    Pre: function () {

      var oShow = this.$refs.chinese_SHOW;//$("#chinese_SHOW")[0]; //
      var oList = this.$refs.chineseMedList;//$("#chineseMedList")[0]; //
      var divWidth = oShow.offsetWidth;
      var allWidth = oList.offsetWidth;
      var LEFT = parseInt(oList.offsetLeft);
      if (LEFT + divWidth <= 0) {
        oList.style.left = LEFT + divWidth + 'px';
        oList.style.transition = "0.3s"
        // $(oList).css({
        //   'left': LEFT + divWidth,
        //   "transition": "0.3s"
        // })
      }

    },
    Next: function () {
      var oShow = this.$refs.chinese_SHOW;//$("#chinese_SHOW")[0]; //
      var oList = this.$refs.chineseMedList;//$("#chineseMedList")[0]; //
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
      if (!t.chineseill) { //西医诊断都没有
        t.$message.error('请先下诊断！');
        return false; //跳出方法

      }
      var patInfo = getCookie('patInfo');
      patInfo = JSON.parse(patInfo);
      t.AGE = patInfo.age;
      if (t.AGE <= 14 && t.chineseList.length == 0) {
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
        url: CHINESE_URL.ADD_REC,
        method: "post",
        params: {
          "id": "1",
          "treatId": t.RID
        },
      }).catch(e => {
        t.$message.error("系统繁忙稍后再试!");
      }).then(data => {

        if (data.docrecipeslist_c) {
          t.chineseList = data.docrecipeslist_c
          //选中最新的处方
          t.hov(t.chineseList.length - 1)
        }

      });
    },
    /**
     * 删除处方
     * @param {*} obj  当前处方对象
     * @param {*} index 当前处方对象index索引
     *
     */
    del: function (obj, index) {

      var isDelete = confirm('请问您确认删除该处方吗?');
      if (isDelete == true) {
        //1.调用方法从后台删除数据
        //2.去除active类
        //3.将内容清空, 用add_new_item类替换list_item类, 去除index属性, 将从表删除
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
        'title': "chinese",
        "code": this.CODE,
        'i': i
      }
      setCookie('chinese_index', JSON.stringify(json), 1)

    },

    /**
     * 处方主表删除 
     * 后台把此主表相关的从表处方都删除掉了
     * @param rid 处方ID
     * @param i 单前处方的index索引
     */
    deleteDocrecipesMain: function (rid, i) {
      var t = this;
      var json = getCookie('chinese_index');
      if (rid != null && "" != rid) {
        //处方主信息
        t.api({
          url: CHINESE_URL.DEL_REC,
          method: "get",
          params: {
            "rid": rid
          },
        }).catch(e => {
          console.log('删除处方err', e)
          t.$message.error("系统错误，操作失败!");
        }).then(data => {
          if (data) { //后台删除成功  重新加载页面
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
     * 限制只能输入数字
     * @param scope 当前处方明细行数据
     * @param key 当前值的名称
     * @param e  事件对象
     */
    numInput: function (scope, key, e) {
      scope[key] = e.target.value.replace(/[^\d]/g, '');
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
          url: CHINESE_URL.DEL_DETAIL,
          method: "get",
          params: {
            "rdid": rdid
          },
        }).catch(e => {
          console.log('删除当前处方(主表)', e);
          t.$message.error("操作失败!");
        }).then(data => {
          debugger;
          if (data > 0) { //后台删除成功  前端页面元素删除
            table.splice(index, 1); //剔除数组某个元素
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
     * 新增医嘱
     * @param {*} obj 当前处方数据
     */
    addDrug: function (obj) { //不限制条数
      var TB = obj.docrecipesdetaillist; //医嘱列表
      var len = TB.length + 1
      var obj = {
        'orderno': len,
        'rid': obj.rid
      }
      TB.push(obj);
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
      if (!t.chineseill) { //中西医诊断都没有
        t.$message.error('请先下诊断！');
        return false; //跳出方法

      }

      /*-------------封装入参-------------*/
      var paramList = []
      for (var i = 0; i < list.length; i++) {
        var obj = {
          "rid": list[i].docrecipesdetaillist[0].rid,
          'docrecipesdetails': list[i].docrecipesdetaillist, //处方明细列表
          'ischronicdisease': list[i].ischronicdisease ? list[i].ischronicdisease : "0", //默认非慢病处方
          'dose': list[i].dose, //总剂
          'tcm_preparation_id': list[i].tcm_preparation_id, //制法
          'tcm_usage_id': list[i].tcm_usage_id, //用法
          'dosepd': list[i].dosepd, //每日X剂
          'partsometimestaking': list[i].partsometimestaking, //分X次服药
        }
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
          if (!per['packunit']) {
            var str = oRec + '单位为空了'
            t.$message.error(str);
            return false; //跳出方法
          }

          if (!per['totaldose']) {
            var str = oRec + '数量为空了'
            t.$message.error(str);
            return false; //跳出方法
          }
        }
        if (!paramList[j].tcm_preparation_id) {
          var str = oRec + '请选择‘制法’'
          t.$message.error(str);
          return false; //跳出方法
        }
        if (!paramList[j].tcm_usage_id) {
          var str = oRec + '请选择‘用法’'
          t.$message.error(str);
          return false; //跳出方法
        }

      }




      var param = {
        'docrecipe': paramList,
        "treatId": t.RID
      }
      var loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.7)'
      });


      t.api({
        method: "post",
        url: CHINESE_URL.SAVE,
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

      }).then(res => {
        loading.close();
        if (res.data == "1") {
          t.$message.success('处方保存成功!')
          t.getInfo();//重新加载处方列表，防止重复保存，出现多条一样的处方明细信息
        }


      }).catch(e => {
        loading.close();
        console.log('保存处方', e)
        t.$message.error("网络错误,保存处方失败!");

      });
    },
    /********** 签名 *********** */

    /*新签名*/
    // signature_chinese: function (businessId, businessCode) {

    //   var t = this;
    //   t.QRcode.dialog = true; //弹窗
    //   t.QRcode.qrLoading = true; //加载
    //   $.ajax({
    //     type: "GET",
    //     url: CHINESE_URL.SIGNATRUE,
    //     data: {
    //       "businessId": businessId,
    //       "businessCode": businessCode,
    //       'recipeType': '5'
    //     },
    //     success: function (data) {
    //       t.QRcode.qrLoading = false

    //       if (data.status == '1') {
    //         var msg = data.msg;
    //         t.hasQRcode = true;
    //         //生成二维码
    //         $("#qrcode_chinese").children().remove();
    //         var code = new QRCode(document.getElementById("qrcode_chinese"), {
    //           text: msg,
    //           width: 300, // 相应宽高扩大3倍
    //           height: 300,
    //           colorDark: "#397cbf",
    //           colorLight: "#eceaef",
    //           correctLevel: QRCode.CorrectLevel.H
    //         })

    //       } else {
    //         t.hasQRcode = false;
    //         t.QRcode.dialog = false; //弹窗
    //         t.$message.error(data.msg);
    //       }
    //     },
    //     error: function (request) {
    //       t.QRcode.dialog = false; //弹窗
    //       t.QRcode.qrLoading = false
    //       t.hasQRcode = false;
    //       t.$message.error("网络错误,生成二维码失败!");
    //     },
    //   });
    // },
    // //确定签名
    // isOkSignature: function () {
    //   this.QRcode.dialog = false;
    //   this.getInfo();
    // },
    // //查看已经签名的处方文件
    // findSignatrueFile: function (businessId, businessCode) {
    //   var t = this;
    //   $.ajax({
    //     type: "GET",
    //     url: CHINESE_URL.SCAN_FILE,
    //     data: {
    //       "businessId": businessId,
    //       "businessCode": businessCode,
    //       "businessType": "2",
    //     },
    //     success: function (data) {
    //       if (data.status == '1') {
    //         window.open(data.msg);
    //       } else {
    //         t.$message.error(data.msg);
    //       }
    //     },
    //     error: function (request) {
    //       t.$message.error("网络错误!");
    //     },
    //   });
    // },
  },
}
</script>
<style >
div#chinese_medicine {
  font-size: 14px;
  padding: 10px;
}
.FA {
  display: table;
  border-collapse: collapse;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 99.9%;
  margin: 30px auto 10px auto;
}
.ceils {
  display: table-cell;
  border: 1px solid #c6dff9;
  padding: 5px;
  box-sizing: border-box;
  background: aliceblue;
  text-align: center;
}
.ceils > .num-input {
  width: 50px !important;
  margin: 5px;
  padding: 5px;
}
.num-input {
  width: 80% !important;
  padding: 5px;
  border: 1px solid #dcdfe6;
  border-radius: 3px;
  line-height: 25px;
  font-size: 12px;
}
.ceils.sel-int {
  width: 200px;
}
.TABLE .el-input__inner {
  font-size: 10px !important;
  padding: 2px !important;
}
</style>
