<template>
  <div class="app-container">
    <div class="leftDiv">
      <div class="userInfo">
        <img :src="info.url?info.url:userIcon" />
        <div class="infos">
          <label> <b>订单号:</b> {{info.trcode}}</label>
          <label> <b>姓名:</b> {{info.patientName}} <i v-if="AGE!=''&&(AGE==0||AGE<=14)"
               style="color:red">(儿童)</i></label>
          <label> <b>性别:</b> <span v-if="info.patientGender=='1'">男 </span>
            <span v-else-if="info.patientGender=='2'">女 </span>
            <span v-else>{{info.patientGender}}</span>
            &nbsp;&nbsp;&nbsp;<b>年龄:</b>{{info.age}} 岁</label>
        </div>

      </div>
      <div class="Recipe"
           v-show="isOnClinic">
        <ul class="nav">

          <li :class="[{'active':iActive=='diagnose'}]"
              title="diagnose"
              @click="toView('diagnose')">开诊断
          </li>
          <li :class="[{'active':iActive=='caseHistory'}]"
              title="caseHistory"
              @click="toView('caseHistory')">病历
          </li>
          <li :class="[{'active':iActive=='westernMedicine'}]"
              title="westernMedicine"
              @click="toView('westernMedicine')">西药处方</li>

          <li :class="[{'active':iActive=='chineseMedicine'}]"
              title="chineseMedicine"
              @click="toView('chineseMedicine')">中药处方</li>
        </ul>

        <div v-show="iActive=='diagnose'">
          <!-- 西医诊断 -->
          <div class="west-d">
            <div class="nav-switch"
                 data-col="0">西医诊断:
              <el-button type="primary"
                         plain
                         size="small"
                         :disabled="!isOnClinic"
                         @click="zdOpen('w')">诊断</el-button>
            </div>

            <div class="ill">
              <span class="diagnose">诊断结果：{{ill}}</span>

            </div>
          </div>
          <!-- 中医诊断 -->
          <div class="chinese-d">
            <div class="nav-switch"
                 data-col="1">中医诊断:
              <el-button type="primary"
                         plain
                         size="small"
                         :disabled="!isOnClinic"
                         @click="zdOpen('c')">诊断</el-button>
            </div>

            <div class="ill">
              <span class="diagnose">
                诊断结果： {{chineseill}}
              </span>
            </div>
          </div>

        </div>
        <!-- 病历 -->
        <div v-show="iActive=='caseHistory'">
          <form name="medical-history">

            <div class="cen">
              <label class="title-size-m">主诉:</label>
              <textarea name="chief_complaint "
                        maxlength="250"
                        v-model="mh_form.docRemark"
                        placeholder="最多输入250个字符。"
                        class="medical-history-textarea"
                        id="docRemark"></textarea>
              <!-- <button class="saves" @click="SavaMedicalHistory()">保存</button> -->
            </div>
            <div class="cen">
              <label class="title-size-m">病史:</label>
              <textarea name="medical_history"
                        maxlength="250"
                        v-model="mh_form.anamnese"
                        placeholder="最多输入250个字符。"
                        class="medical-history-textarea"
                        id="anamnese"></textarea>
              <!-- <button class="saves" @click="SavaMedicalHistory()">保存</button> -->
            </div>
            <div class="cen">
              <label class="title-size-m">检查结果:</label>
              <textarea name="physical_examination"
                        maxlength="250"
                        v-model="mh_form.physical"
                        placeholder="最多输入250个字符。"
                        class="medical-history-textarea"
                        id="physical"></textarea>
              <!-- <button class="saves" @click="SavaMedicalHistory()">保存</button> -->
            </div>
            <div class="cen">
              <label class="title-size-m">诊断:</label>
              <textarea name="diagnosis"
                        maxlength="250"
                        v-model="mh_form.diagnosis"
                        placeholder="最多输入250个字符。"
                        class="medical-history-textarea"
                        id="diagnosis"></textarea>
              <!-- <button class="saves" @click="SavaMedicalHistory()">保存</button> -->
            </div>

            <div class="cen">
              <label class="title-size-m">处理:</label>
              <textarea name="dispose"
                        maxlength="250"
                        v-model="mh_form.dispose"
                        placeholder="最多输入250个字符。"
                        class="medical-history-textarea"
                        id="dispose"></textarea>
              <!-- <button class="saves" @click="SavaMedicalHistory()">保存</button> -->

            </div>
            <input id="ID"
                   type="hidden"
                   v-model="mh_form.ID" />
            <input id="tempname"
                   type="hidden"
                   v-model="mh_form.tempname" />
          </form>
          <div class="actions">
            <el-button type="primary"
                       size="small"
                       @click="!isSignatrue && SavaMedicalHistory()">保存全部病历</el-button>

            <el-button type="danger"
                       size="small"
                       @click="ClearTxt()"> 清除内容</el-button>
          </div>

        </div>

        <!-- 西药处方 -->
        <div v-show="iActive=='westernMedicine'">
          <west-medicine ref="WEST"
                         :RID="RID"
                         :ill="ill"
                         :chineseill="chineseill"
                         :orgid="orgid"
                         :trcode="trcode"></west-medicine>
        </div>

        <!-- 中药处方 -->
        <div v-show="iActive=='chineseMedicine'">
          <chinese-medicine ref="CHINESE"
                            :RID="RID"
                            :ill="ill"
                            :chineseill="chineseill"
                            :orgid="orgid"
                            :trcode="trcode"></chinese-medicine>
        </div>
      </div>

    </div>
    <div class="rightDiv">
      <div class="actionDiv">
        <el-button type="primary"
                   :disabled="isOnClinic"
                   @click="guahao()">患者挂号</el-button>
        <el-button type="success"
                   :disabled="!isOnClinic"
                   @click="fin()">完成</el-button>
        <el-button type="warning"
                   :disabled="!isOnClinic"
                   @click="overtime()">过号</el-button>
      </div>
      <div class="tableDiv">
        <h4 class="titleTb">已就诊</h4>
        <el-table :data="tableData"
                  border
                  class="userlistTb"
                  style="width: 100%"
                  :header-cell-style="getRowClassOne">
          <el-table-column prop="trcode"
                           label="编号"
                           min-width='150px'></el-table-column>
          <el-table-column prop="patiname"
                           label="姓名"
                           width='100px'></el-table-column>
          <el-table-column label="性别"
                           width='50px'>
            <template slot-scope="scope">
              <span v-if="scope.row.sex==1">男</span>
              <span v-else-if="scope.row.sex==2">女</span>
              <span v-else>{{scope.row.sex}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="age"
                           label="年龄"
                           width='50px'> </el-table-column>
          <el-table-column prop="edate"
                           label="就诊日期"
                           min-width='160px'></el-table-column>

        </el-table>
        <!-- 分页 -->
        <el-pagination background
                       layout="total,prev, pager, next"
                       :current-page.sync="param.page"
                       :page-size="param.rows"
                       @current-change="turnPage1"
                       :total="total1"
                       align='center'>
        </el-pagination>
      </div>
      <div class="tableDiv">
        <h4 class="titleTb">已过号</h4>
        <el-table :data="tableData2"
                  border
                  class="userlistTb"
                  style="width: 100%"
                  :header-cell-style="getRowClassOne">
          <el-table-column prop="trcode"
                           label="编号"
                           min-width='150px'></el-table-column>
          <el-table-column prop="patiname"
                           label="姓名"
                           width='100px'></el-table-column>
          <el-table-column label="性别"
                           width='50px'>
            <template slot-scope="scope">
              <span v-if="scope.row.sex==1">男</span>
              <span v-else-if="scope.row.sex==2">女</span>
              <span v-else>{{scope.row.sex}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="age"
                           label="年龄"
                           width='50px'> </el-table-column>
          <el-table-column prop="edate"
                           label="就诊日期"
                           min-width='160px'></el-table-column>

        </el-table>
        <!-- 分页 -->
        <el-pagination background
                       layout="total,prev, pager, next"
                       :current-page.sync="param2.page"
                       :page-size="param2.rows"
                       @current-change="turnPage2"
                       :total="total2"
                       align='center'>
        </el-pagination>
      </div>
    </div>

    <!-------------------------------------------- 以下是诊断弹窗--------------------------------------------------------->

    <!-- 诊断对话框 -->
    <el-dialog title="诊断对话框"
               :visible.sync="dialog_DIAGNOSE"
               width="80%"
               v-loading='loading'>

      <div class="beseInf">
        <!-- 备注 -->
        <label class="clabel"
               v-show="isWest">
          备注：<input type="text"
                 name="remark"
                 v-model="dform.remark"
                 placeholder="备注" />
        </label>
        <label class="clabel"
               v-show="!isWest">
          备注：<input type="text"
                 name="remark"
                 v-model="dform.remark_c"
                 placeholder="备注" />
        </label>
        <!-- 体重 -->
        <label class="clabel">
          体重：<input type="text"
                 name="weight"
                 v-model="dform.weight"
                 placeholder="体重" />KG
        </label>
        <label class="clabel">
          身高：<input type="text"
                 name="height"
                 v-model="dform.height"
                 placeholder="身高" />cm
        </label>

        <!-- 体温 -->
        <label class="clabel">
          体温：<input type="text"
                 name="animalh"
                 v-model="dform.animalh"
                 placeholder="体温" />℃
        </label>
        <!-- 心跳 -->
        <label class="clabel">
          心跳：<input type="text"
                 name="heartbeat"
                 v-model="dform.heartbeat"
                 placeholder="心跳" />次/分
        </label>
        <!-- 脉搏 -->
        <label class="clabel">
          脉搏 ：<input type="text"
                 name="pulse"
                 v-model="dform.pulse"
                 placeholder="脉搏" />次/分
        </label>
        <!-- 舒张压 -->
        <label class="clabel">
          舒张压：<input type="text"
                 name="SZ_mmHg"
                 v-model="dform.SZ_mmHg"
                 placeholder="舒张压" />mmHg
        </label>
        <!-- 收缩压 -->
        <label class="clabel">
          收缩压 :<input type="text"
                 name="SS_mmHg"
                 v-model="dform.SS_mmHg"
                 placeholder="收缩压 " />mmHg
        </label>

      </div>
      <!-- //诊断列表 -->
      <div class="tb">
        <!-- 新增 -->
        <el-button size="mini"
                   type="primary"
                   icon="el-icon-plus"
                   @click="addDiagnose">新增</el-button>

        <br />
        <!-- 西医诊断 -->
        <div v-show='isWest'>
          <el-table :data="diagnoseDate"
                    border
                    style="width: 100%">
            <!-- 序号 -->
            <el-table-column width='80'
                             label="序号">
              <template slot-scope="scope">
                {{scope.$index+1}}
              </template>
            </el-table-column>
            <!-- 诊断名称 -->
            <el-table-column label="诊断名称"
                             prop="diagname">
            </el-table-column>
            <!-- ICD-10 -->
            <el-table-column label="ICD-10"
                             prop="diagcode"
                             width="180px">
            </el-table-column>
            <!-- 疑似 -->
            <el-table-column label="疑似"
                             width="80px">
              <template slot-scope="scope">
                <input type="checkbox"
                       :checked="ischeck(scope.row.isconfirm)"
                       @change="changeCheckBox(scope,$event)" />
              </template>
            </el-table-column>
            <!-- 操作 -->
            <el-table-column align="center"
                             label="操作"
                             width="80px">
              <template slot-scope="scope">

                <el-button size="mini"
                           type="danger"
                           icon="el-icon-delete"
                           circle
                           @click="delDiagnose(scope)">
                </el-button>

              </template>
            </el-table-column>
          </el-table>

        </div>
        <!-- 西医诊断 end-->
        <!-- 中医诊断 -->
        <div v-show='!isWest'>
          <el-table :data="diagnoseDate_c"
                    border
                    style="width: 100%">
            <!-- 序号 -->
            <el-table-column width='80'
                             label="序号">
              <template slot-scope="scope">
                {{scope.$index+1}}
              </template>
            </el-table-column>
            <!-- 诊断名称 -->
            <el-table-column label="诊断名称"
                             prop="diagname">
            </el-table-column>
            <!-- ICD-10 -->
            <el-table-column label="ICD-10"
                             prop="diagcode"
                             width="180px">
            </el-table-column>
            <!-- 疑似 -->
            <el-table-column label="疑似"
                             width="80px">
              <template slot-scope="scope">
                <input type="checkbox"
                       :checked="ischeck(scope.row.isconfirm)"
                       @change="changeCheckBox(scope,$event)" />
              </template>
            </el-table-column>
            <!-- 操作 -->
            <el-table-column align="center"
                             label="操作"
                             width="80px">
              <template slot-scope="scope">

                <el-button size="mini"
                           type="danger"
                           icon="el-icon-delete"
                           circle
                           @click="delDiagnose(scope)">
                </el-button>

              </template>
            </el-table-column>
          </el-table>
          <br />
          <!-- 中医症型-->
          <label class="clabel">
            备注：<input type="text"
                   name="remark"
                   v-model="dform.tcmremark"
                   placeholder="备注" />
          </label>
          <br />
          <el-button size="mini"
                     type="primary"
                     icon="el-icon-plus"
                     @click="addZX">新增</el-button>
          <br />
          <el-table :data="ZX_diagnose"
                    border
                    style="width: 100%">
            <!-- 序号 -->
            <el-table-column width='80'
                             label="序号">
              <template slot-scope="scope">
                {{scope.$index+1}}
              </template>
            </el-table-column>
            <!-- 诊断名称 -->
            <el-table-column label="中医证型"
                             prop="tcmsyndrome">
            </el-table-column>
            <!-- ICD-10 -->
            <el-table-column label="ICD-10"
                             prop="tcmsyndromecode"
                             width="180px">
            </el-table-column>
            <!-- 疑似 -->
            <el-table-column label="疑似"
                             width="80px">
              <template slot-scope="scope">
                <input type="checkbox"
                       :checked="ischeck(scope.row.isconfirm)"
                       @change="changeCheckBox(scope,$event)" />
              </template>
            </el-table-column>
            <!-- 操作 -->
            <el-table-column align="center"
                             label="操作"
                             width="80px">
              <template slot-scope="scope">

                <el-button size="mini"
                           type="danger"
                           icon="el-icon-delete"
                           circle
                           @click="delZX(scope)">
                </el-button>

              </template>
            </el-table-column>
          </el-table>
          <!-- 中医症型 end-->
        </div>
        <!-- 中医诊断 end -->
      </div>

      <span slot="footer"
            class="dialog-footer">
        <!-- 保存 -->
        <el-button size="mini"
                   type="primary"
                   @click="saveDiagnose">保存</el-button>
        <!-- 取消 -->
        <el-button size="mini"
                   @click="closeDiag">取消</el-button>

      </span>

    </el-dialog>
    <!-----------------------------------诊断列表弹窗-西医-------------------- -->

    <el-dialog title="选择内容"
               :visible.sync="dialog_DIAGNOSE2"
               width="65%">

      <div class='searchDiv'>
        <!--  输入关键字搜索 -->
        <el-input v-model="diagnoseForm.name"
                  prefix-icon="el-icon-search"
                  placeholder="输入关键字搜索"
                  clearable
                  @input="searchDiag"
                  class="input-search">
        </el-input>
      </div>
      <el-table :data="DataList"
                border
                style="width: 100%"
                @row-click="selDiag"
                v-loading='loading2'
                :header-cell-style="getRowClasstwo">

        <!-- 诊断名称 -->
        <el-table-column label="诊断名称"
                         prop="ourname">
        </el-table-column>
        <!-- ICD-10 -->
        <el-table-column label="ICD-10"
                         prop="ourcode"
                         width="180px">
        </el-table-column>

      </el-table>
      <div v-if="w_pageshow">
        <el-pagination background
                       layout="total,prev, pager, next"
                       :current-page="diagnoseForm.pageNum"
                       :page-size="diagnoseForm.pageSize"
                       @current-change="w_turnPage"
                       :total="w_total">
        </el-pagination>
      </div>

    </el-dialog>
    <!-----------------------------------诊断列表弹窗-西医 end-------------------- -->
    <!-----------------------------------诊断列表弹窗-中医-------------------- -->
    <el-dialog title="选择内容"
               :visible.sync="dialog_DIAGNOSE3"
               width="65%">
      <div class='searchDiv'>
        <!--  输入关键字搜索 -->
        <el-input v-model="c_diagnoseForm.name"
                  prefix-icon="el-icon-search"
                  placeholder="输入关键字搜索"
                  clearable
                  @input="searchDiag"
                  class="input-search">
        </el-input>
      </div>
      <el-table :data="c_DataList"
                border
                style="width: 100%"
                @row-click="selDiag_chinese"
                v-loading='loading2'
                :header-cell-style="getRowClasstwo">

        <!-- 诊断名称 -->
        <el-table-column label="诊断名称"
                         prop="ourname">
        </el-table-column>
        <!-- ICD-10 -->
        <el-table-column label="ICD-10"
                         prop="ourcode"
                         width="180px">
        </el-table-column>

      </el-table>
      <div v-if="c_pageshow">
        <el-pagination background
                       :current-page.sync="c_diagnoseForm.pageNum"
                       :page-size="c_diagnoseForm.pageSize"
                       @current-change="c_turnPage"
                       layout="total,prev, pager, next"
                       :total="c_total">
        </el-pagination>
      </div>
    </el-dialog>
    <!-----------------------------------诊断列表弹窗-中医 end-------------------- -->
    <!-----------------------------------诊断列表弹窗-中医（症型）-------------------- -->
    <el-dialog title="选择内容"
               :visible.sync="dialog_DIAGNOSE4"
               width="65%">
      <div class='searchDiv'>
        <!--  输入关键字搜索 -->
        <el-input v-model="ZX_Form.name"
                  prefix-icon="el-icon-search"
                  placeholder="输入关键字搜索"
                  clearable
                  @input="searchDiag_zx"
                  class="input-search">
        </el-input>
      </div>
      <el-table :data="ZX_DataList"
                border
                style="width: 100%"
                @row-click="selZX"
                v-loading='loading2'
                :header-cell-style="getRowClasstwo">

        <!-- 诊断名称 -->
        <el-table-column label="通用名称"
                         prop="ourname">
        </el-table-column>
        <!-- ICD-10 -->
        <el-table-column label="ICD-10"
                         prop="ourcode"
                         width="180px">
        </el-table-column>

      </el-table>
      <div v-if="ZX_pageshow">
        <el-pagination background
                       :current-page.sync="ZX_Form.page"
                       :page-size="ZX_Form.rows"
                       @current-change="turnPage_zx"
                       layout="total,prev, pager, next"
                       :total="ZX_total">
        </el-pagination>
      </div>
    </el-dialog>
    <!-----------------------------------诊断列表弹窗-中医症型） end-------------------- -->

    <!------------------------------------- 以下是诊断弹窗 end--------------------------------------------------------->
    <!-- 挂号弹窗 -->
    <el-dialog title="患者信息"
               :visible.sync="dialog"
               width="500px"
               :before-close="close"
               :close-on-click-modal="false">
      <div class="dialog">
        <div class="ceil"><label>身份证:</label>
          <el-input v-model="userForm.identycode"
                    placeholder="请输入身份证"
                    @blur="blurIDCard()"></el-input>
        </div>
        <div class="ceil"><label>联系号码:</label>
          <el-input v-model="userForm.phoneNumber"
                    placeholder="请输入联系号码"
                    @blur="getUserInfo()"></el-input>
        </div>
        <div class="ceil"><label>姓名:</label>
          <el-input v-model="userForm.patientName"
                    placeholder="请输入姓名"></el-input>
        </div>

        <div class="ceil"><label>出生日期:</label>
          <el-date-picker v-model="userForm.patientBirthday"
                          type="date"
                          placeholder="选择日期"
                          format="yyyy-MM-dd"
                          value-format='yyyy-MM-dd'>
          </el-date-picker>
        </div>
        <div class="ceil"><label>性别:</label>
          <el-radio-group v-model="userForm.patientGender">
            <el-radio label="1">男</el-radio>
            <el-radio label="2">女</el-radio>

          </el-radio-group>

        </div>

      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="close()">取 消</el-button>
        <el-button type="primary"
                   @click="save()">挂号</el-button>
      </span>
    </el-dialog>
    <!-- 挂号弹窗 end-->

  </div>
</template>
<script>
import {
  setCookie,
  clearCookie,
  getCookie
} from '@/utils/auth'

import { baseUrl } from "@/utils/baseUrl.js"
import { isIdentityId } from '@/utils/IDCard_Validation.js'
import westMedicine from "@/views/clinic/components/westMedicine.vue"
import chineseMedicine from "@/views/clinic/components/chineseMedicine.vue"
import userIcon from '@/assets/user.png'

var URLS = {
  GET_USER_INFO: "/webHis/doctorTreating/getPatRegister",//通过身份证，手机号查询患者信息
  INITROOM: "/webHis/doctorTreating/getDoctorTreating",//查询医生正在就诊的线下记录
  INFO: "",//初始化订单数据
  LIST: "/webHis/doctorTreating/paging",//患者list
  FINISH: "/webHis/doctorTreating/finishTreat",//完成诊疗
  OVERTIME: "/webHis/doctorTreating/overtime",//过号
  GUAHAO: "/webHis/doctorTreating/initPatientDocTreatrecord",//患者挂号


}


// 诊断tab
var DIAGNOSE_URL = {
  GET_DIAGNOSE_LIST: "/webHis/docrecipes/getPrescriptionMap", ////获取中西医诊断，中医证型 (处方内容)
  GET_DIAGNOSE: "/webHis/diagnose/findDiagnoseProvinceByDocProvinceCodeList", //获取诊断数据-西医
  DELETE: "/webHis/diagnose/deleteById", //删除西医诊断
  SAVE_WEST_DIAG: "/webHis/diagnose/saveOnBatch", //西医诊断保存
  GET_CHINESE_DIAGNOSE: "/webHis/diagnose/findDiagnoseProvinceByDocProvinceCodeList", //中医诊断（全部）
  GET_CHINESE_ZX: "/webHis/diagnose/findDiagnoseProvinceByDocProvinceCodeList", //中医症型(全部)
}

var URL_MH = {
  INFO: "/webHis/docrecipes/getPrescriptionMap", //获取所有处方信息
  MD_INFO: '/webHis/cprtemplate/medical', //病历信息
  // SIGNATURE: "doctor/signatrue/bingliSignatrue", //签名
  SAVE_MEDICALHISTORY: "/webHis/cprtemplate/keeprecordsNew", //保存病历
  // MODEL: "webHis/cprtemplate/selecttemplateAll", //模板
  // DEL_MODEL: "webHis/cprtemplate/delTemplate", //删除模板
  // SAVE_MODEL: "webHis/cprtemplate/CPRtemplate", //保存模板
  // SEL_MODEL: "webHis/cprtemplate/selecttemplate", //填充选择的模板数据
  // SCAN_FILE: "doctor/signatrue/findFileSignature", //查看已签名的病历文件

}

//使用正则表达式// startsWith()兼容ie
String.prototype.startsWith = function (str) {
  var reg = new RegExp("^" + str);
  return reg.test(this);
}

export default {
  data () {
    return {
      /*患者信息模块 */
      userIcon,
      RID: "",//处方rid
      AGE: '',
      orgid: "",//机构id
      trcode: "",////处方code-标记诊室

      info: {

        rid: "",
        patientName: "",
        trcode: "",
        url: "",
        age: '',
        currCity: "",
        patientGender: "",
      },
      /*------------处方模块------------------*/
      iActive: "diagnose",

      /*开处方tab */
      dialog_DIAGNOSE: false,
      loading: false,
      isWest: true, //标记中西医诊断,true西医，false中医

      dform: {
        remark_c: "", //中医诊断备注 
        tcmremark: "", //中医症型备注
        remark: "", //备注：
        weight: "", //体重：
        height: "",//身高
        animalh: "", //体温：
        heartbeat: "", //心跳：
        pulse: "", //脉搏：
        SZ_mmHg: "", //舒张压：
        SS_mmHg: "", //收缩压：
      },

      /*西医诊断 */
      diagnoseDate: [], //处方诊断数据
      delList: [], //删除的数据

      dialog_DIAGNOSE2: false, //诊断数据弹窗-西医
      loading2: false,
      diagnoseForm: {
        ourtype: 422001,
        name: '',
        pageNum: 1,
        pageSize: 10,
      },
      w_pageshow: true,
      //诊断数据（西医-全部）
      DataList: [{
        ourcode: "E931.01",
        ourid: 2956,
        ourname: "黄胺药物反应",
        theKeys: 2956,
      },

      ],

      w_total: 0,
      /*中医诊断 */
      diagnoseDate_c: [], //处方诊断数据-中医
      delList_c: [], //删除的数据-中医
      dialog_DIAGNOSE3: false, //诊断数据弹窗-中医（症型）
      c_diagnoseForm: {
        ourtype: '422002',
        name: '',
        pageNum: 1,
        pageSize: 10,
      },
      c_DataList: [], //诊断数据（中医-全部）
      c_total: 0,
      c_pageshow: true,
      /*中医症型 */
      ZX_diagnose: [], //处方症型数据-中医
      ZX_delList: [], //删除的数据-中医
      dialog_DIAGNOSE4: false, //诊断症型数据弹窗-中医（症型）
      ZX_Form: {
        ourtype: '416006',
        name: '',
        pageNum: 1,
        pageSize: 10,
      },
      ZX_DataList: [], //诊断数据（中医-全部）
      ZX_total: 0,
      ZX_pageshow: true,

      /*病历tab */
      sdate: "",
      models: [], //模板列表
      mh_form: {
        docRemark: '', //主诉
        anamnese: '', //病史
        physical: '', //检查结果
        diagnosis: '', //诊断
        dispose: '', //处理
        ID: "",
        tempname: "", //模板名
      },
      isSignatrue: false, //是否签名
      rId: "",
      /*二维码 */
      businessId: "",
      businessCode: "",
      QRcode: {
        dialog: false,
        qrLoading: false,
      },
      chineseList: [], //中药处方列表
      westList: [], //西药处方列表

      /*------------处方模块 end------------------*/
      /*已就诊 */
      param: {
        page: 1,
        rows: 5,
        pagingType: "1",
        status: "2,3"
      },
      total1: 0,
      tableData: [],
      /*已过号 */
      param2: {
        page: 1,
        rows: 5,
        pagingType: "1",
        status: "-1",
        breakAppointmentAfter: "0"
      },
      total2: 0,
      tableData2: [],
      /*患者挂号 */
      dialog: false,
      userForm: {
        patientName: "",
        phoneNumber: "",
        patientBirthday: "",
        patientGender: "1",
        identycode: "",
      },
    }
  },
  created () {

    this.iActive = getCookie('title') ? getCookie('title') : "diagnose";

    /*公共数据 */
    this.getDiagnose(); //加载西医诊断数据列表（全部）
    this.c_getDiagnose(); //加载中医诊断
    this.getZX(); //中医证型
    this.initPage();





  },
  mounted () {

  },
  watch: {

  },
  components: {
    "west-medicine": westMedicine,
    "chinese-medicine": chineseMedicine
  },//components end
  computed: {

    isOnClinic () {
      if (this.info.trcode) {
        return true;
      } else {
        return false;
      }
    },
    ill: function () {
      var t = this;
      var diagnameText = '';
      var list = t.diagnoseDate;
      var strKey = '疑似'; //疑似
      for (var i = 0; i < list.length; i++) {
        var diagname = list[i].diagname;
        if (list[i].isconfirm == '1') { //选择了‘疑似’
          //"疑似"+diagname
          diagname = list[i].diagname.startsWith(strKey) ? list[i].diagname : strKey + list[i].diagname;
        } else { //没选择了‘疑似’
          if (list[i].diagname.startsWith(strKey)) { //数据头：含有疑似
            diagname = list[i].diagname.substring(strKey.length);
          } else {
            diagname = list[i].diagname;
          }

        }
        diagnameText += diagname + ","
      }
      return diagnameText;
    },
    chineseill: function () {
      var t = this;
      var diagnameText = '';
      var list = t.diagnoseDate_c; //中医诊断
      var listZX = t.ZX_diagnose; //中医症型
      var strKey = '疑似'; //疑似
      //诊断

      for (var i = 0; i < list.length; i++) {
        var diagname = '';
        if (list[i].isconfirm == '1') { //选择了‘疑似’
          //"疑似"+diagname
          diagname = list[i].diagname.startsWith(strKey) ? list[i].diagname : strKey + list[i].diagname;
        } else { //没选择了‘疑似’
          if (list[i].diagname.startsWith(strKey)) { //数据头：含有疑似
            diagname = list[i].diagname.substring(strKey.length);
          } else {
            diagname = list[i].diagname;
          }

        }
        diagnameText += diagname + ","
      }
      //证型
      for (var i = 0; i < listZX.length; i++) {
        var diagname = '';
        if (listZX[i].isconfirm == '1') { //选择了‘疑似’
          //"疑似"+diagname
          diagname = listZX[i].tcmsyndrome.startsWith(strKey) ? list[i].tcmsyndrome : strKey + listZX[i].tcmsyndrome;
        } else { //没选择了‘疑似’
          if (listZX[i].tcmsyndrome.startsWith(strKey)) { //数据头：含有疑似
            diagname = listZX[i].tcmsyndrome.substring(strKey.length);
          } else {
            diagname = listZX[i].tcmsyndrome;
          }

        }
        diagnameText += diagname + ","
      }
      return diagnameText;
    },
    WMedicine: function () { //西药处方列表格式化
      var list = this.westList;
      var target = [];

      for (var i = 0; i < list.length; i++) {
        var perRec = list[i].docrecipesdetaillist; //当个处方的药品明细
        var arr = perRec.map(function (e) {
          return e.advicename
        })
        target.push(arr.join(","));
      }
      return target;
    },
    CMedicine: function () { //中药处方列表格式化

      var list = this.chineseList;
      var target = [];

      for (var i = 0; i < list.length; i++) {
        var perRec = list[i].docrecipesdetaillist; //当个处方的药品明细
        var arr = perRec.map(function (e) {
          return e.advicename
        })
        target.push(arr.join(","));
      }
      return target;
    },
  },//computed end
  methods: {
    //表头样式
    getRowClassOne: function (row) {
      return row.rowIndex === 0 ? 'background:#f1ffe0;color:#030303;font-size:12px;text-align:center;padding:2px; ' : ""
    },
    //页头颜色
    getRowClasstwo: function (row) {
      return row.rowIndex === 0 ? 'background:#47ccc0;text-align:center;color:black ' : ""
    },
    //初始化页面
    initPage () {
      this.getData();//已就诊list
      this.getData2();//已过号list
      this.initClinicRoom();//加载医生目前的挂号情况
    },
    initClinicRoom () {//加载诊室患者数据
      var t = this;
      // var patInfo = getCookie('patInfo');
      // if (patInfo) {
      //   this.info = JSON.parse(patInfo);
      // }
      this.api({
        url: URLS.INITROOM,
        method: "post",
        params: {}
      }).then(data => {

        // authtohealdoc: 1
        // createtime: "2020-12-18T01:34:07.000+0000"
        // doctorname: "张珊珊"
        // eDate: null
        // endtime: null
        // patibirthday: null
        // patiid: "gUck2MIOOHWJLZc4uoo"
        // patiname: "黄玉生A"
        // patisex: null
        // regiType: "50"
        // registertime: "2020-12-17T16:00:00.000+0000"
        // rid: "d681f474c547484882827c21c6dcbd80"
        // sDate: "2020-12-18T01:34:07.000+0000"
        // starttime: "2020-12-18T01:34:07.000+0000"
        // status: 1
        // trcode: "2020121824113"
        // treatdepartmentid: "83A5277D85434A51E053BFF0A8C0D7F8"
        // treatdocotorid: "Oo3XoYCHjsPjcyCvKzl"
        // treatid: "3043500"
        // treatorganizationid: "83919FF2A7532098E053BFF0A8C0DD6B"
        // treattime: "2020-12-17T16:00:00.000+0000"
        if (data.patibirthday) {
          var birth = data.patibirthday;
          var nowYear = new Date().getFullYear();
          var birthY = parseFloat(birth.substring(0, 4));
          t.AGE = nowYear - birthY;
        } else (
          t.AGE = ''
        )
        t.RID = data.rid;
        t.info = {
          rid: data.rid,
          patientName: data.patiname,
          trcode: data.trcode,
          url: "",
          age: t.AGE,
          patientGender: data.patisex ? data.patisex : '',
        }
        console.log('就诊信息：', t.info);
        setCookie('patInfo', JSON.stringify(t.info), 30)
        t.$store.commit('SET_DOCNAME', data.doctorname)

        t.$nextTick(function () {
          /*开诊断ttab */
          t.getDiagnoseList(true); //加载处方-西医诊断、中医诊断-证型数据 【设置全局数据检验、检查、西药、中药（只有这个方法有)】
          /*病历tab */
          t.getHistoryInfo()

        })

      }).catch(e => {
        console.log('医生线下就诊数据', e)
      })
    },
    blurIDCard () {
      var t = this
      var err = isIdentityId(t.userForm.identycode)
      if (err != '') {//证件号出现错误
        t.$message.error(err);

      } else {
        t.getUserInfo();
      }
    },
    getUserInfo () {

      var t = this;
      if (!t.userForm.phoneNumber || !t.userForm.identycode) {
        return false;
      }
      var param = {
        phoneNumber: t.userForm.phoneNumber,
        identycode: t.userForm.identycode
      };


      t.api({
        url: URLS.GET_USER_INFO,
        method: "get",
        params: param,


      }).then(data => {
        // identycode: "421024198307103423"
        // patientBirthday: "1983-07-10"
        // patientGender: "2"
        // patientId: "377A119B58BE4214B1F72485B0C78D80"
        // patientName: "谭燕琴"
        // phoneNumber: "13697237940"
        // userId: "39AC50D461334708B226D368DC4A947F"
        // userName: "13697237940103423"

        t.userForm = {
          patientName: data.patientName ? data.patientName : t.userForm.patientName,
          phoneNumber: data.phoneNumber ? data.phoneNumber : t.userForm.phoneNumber,
          patientBirthday: data.patientBirthday ? data.patientBirthday : t.userForm.patientBirthday,
          patientGender: data.patientGender ? data.patientGender : t.userForm.patientGender,
          identycode: data.identycode ? data.identycode : t.userForm.identycode,
        }

      }).catch(e => {

        console.log('患者信息err', e);

      })
    },
    //分页
    turnPage1: function (num) {
      this.param.page = num;
      this.getData();
    },
    getData: function () {
      var t = this;
      var param = this.param;


      t.api({
        url: URLS.LIST,
        method: "get",
        params: param,


      }).then(data => {

        t.total1 = data.total;
        t.tableData = data.data || [];
      }).catch(e => {

        console.log('已就诊list', e);
        //  t.$message.error(e.respone);
        t.total1 = 0;
        t.tableData = [];
      })
    },
    //分页
    turnPage2: function (num) {
      this.param2.page = num;
      this.getData2();
    },
    getData2: function () {
      var t = this;
      var param = this.param2;

      t.api({
        url: URLS.LIST,
        method: "get",
        params: param
      }).then(data => {
        t.total2 = data.total;
        t.tableData2 = data.data || [];
      }).catch(e => {
        console.log('过号list', e);

        t.total2 = 0;
        t.tableData2 = [];
      })
    },
    //完成诊疗
    fin () {
      var t = this;
      var str = '是否点击完成诊疗，请确认？'

      this.$confirm(str, '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        t.api({
          url: URLS.FINISH,
          method: "post",
          params: { rid: t.RID }
        }).then(data => {
          if (data.orderno) {
            t.$message.success('完成诊疗！');
            t.resetInfo();
            t.initPage();
          }
        }).catch(e => {
          t.$message.error('系统繁忙，稍后再试!');

        })
      }).catch(() => { });

    },
    //过号
    overtime () {
      var t = this;
      this.$confirm('确定过号操作？', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {


        var param = {
          "rid": t.info.rid
        }
        t.api({
          url: URLS.OVERTIME,
          method: "post",
          params: param
        }).then(data => {

          if (data) {
            t.$message.success("完成过号！");
            t.resetInfo()
            t.initPage();
          } else {
            t.$message.error("过号失败！");
          }

        }).catch(e => {
          t.$message.error('系统繁忙，稍后再试!');

        })
      }).catch(() => { });
    },
    //挂号
    guahao () {
      this.dialog = true;
    },
    //取消
    close () {
      this.dialog = false;
      this.userForm = {
        patientName: "",
        phoneNumber: "",
        patientBirthday: "",
        patientGender: "1",
        identycode: "",
      }

    },
    //清空就诊数据（中西药处方、诊断、病历、患者信息）
    resetInfo () {

      clearCookie('patInfo')
      setCookie('title', 'diagnose', 1);//设置单前展示的tap
      /*患者信息 */
      this.RID = '';
      this.AGE = ''
      this.info = {
        rid: '',
        patientName: '',
        trcode: '',
        url: "",
        age: '',
        patientGender: '1',
      }
      /*开处方 */
      this.diagnoseDate = [];//西医诊断
      this.diagnoseDate_c = [];//中医诊断
      this.ZX_diagnose = []; //中医症型
      /*病历 */
      this.mh_form = {
        docRemark: '', //主诉
        anamnese: '', //病史
        physical: '', //检查结果
        diagnosis: '', //诊断
        dispose: '', //处理
        ID: "",
        tempname: "", //模板名
      }
      /*西药处方*/
      this.$refs.WEST.west_fatherToChild([]);//向子组件传参
      /*中药处方*/
      this.$refs.CHINESE.chinese_fatherToChild([]);//向子组件传参
    },
    //挂号
    save () {
      var t = this;
      if (t.isNULL(t.userForm.patientName)) {
        t.$message.error('请输入名字！');
        return false;
      }
      if (t.isNULL(t.userForm.phoneNumber)) {
        t.$message.error('请输入联系号码！');
        return false;
      }
      if (t.isNULL(t.userForm.patientBirthday)) {
        t.$message.error('请选择出生日期！');
        return false;
      }
      //身份证校验
      var err = isIdentityId(t.userForm.identycode)
      if (err != '') {//证件号出现错误
        t.$message.error(err);
        return false;
      }

      var param = t.userForm;

      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(255,255,255. 0.7)'
      });
      t.api({
        url: URLS.GUAHAO,
        method: "post",
        params: param
      }).then(data => {
        loading.close();
        if (data.treatrid) {

          t.$message.success('挂号成功！');
          // identycode: "120104199901014135"
          // patientBirthday: "1999-01-01"
          // patientGender: "1"
          // patientId: "gUck2MIOOHWJLZc4uoo"
          // patientName: "黄玉生A"
          // phoneNumber: "13424267646"
          // userId: "LxL8IDkt6HtaMi19tys"
          // userName: "13424267646
          if (data.patientBirthday) {
            var birth = data.patientBirthday;
            var nowYear = new Date().getFullYear();
            var birthY = parseFloat(birth.substring(0, 4));
            t.AGE = nowYear - birthY;
          }
          t.RID = data.treatrid;
          t.$nextTick(function () {
            t.info = {
              rid: data.treatrid,
              patientName: data.patientName,
              trcode: data.trcode,
              url: "",
              age: t.AGE,
              patientGender: data.patientGender,
            }
            setCookie('patInfo', JSON.stringify(t.info), 30)
            t.close();

            if (data.isExists != '1') {//新账号
              var tip = '该患者的登录账号：' + data.userName + "(初始化密码为：123456)，请提醒患者前往‘网医联盟’网站进行登录，可查看相关信息！"
              t.$confirm(tip, '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {

              }).catch(() => {

              });
            }


          })

        } else {
          t.$message.success('操作失败！')
        }

      }).catch(e => {

        loading.close();
        t.$message.success('系统错误，操作失败！')
      })




    },
    isNULL (str) {
      if (str != '' && str != undefined && str != null && str !== 0) {
        return false
      } else {
        return true;
      }
    },
    toView: function (name) { //切換栏
      this.iActive = name;
      setCookie('title', name, 1);//设置单前展示的tap
      switch (name) {
        case "diagnose": break;
        case "caseHistory":
          //  this.caseHistoryInfo();
          break;

        case "westernMedicine":
          break;
        case "chineseMedicine":
          break;
      }
    },
    /********************************开处方tab************************ */
    zdOpen (key) {
      if (key == 'w') {
        this.isWest = true;

      } else {
        this.isWest = false;

      }
      this.dialog_DIAGNOSE = true;
    },
    //查询-中西诊断，中医证型【设置全局数据检验、检查、西药、中药（只有这个方法有)】
    getDiagnoseList: function (flag) {
      var t = this;
      t.diagnoseDate = [];

      t.api({
        url: DIAGNOSE_URL.GET_DIAGNOSE_LIST, //路径  
        method: "get",
        params: {
          treatId: t.RID, //就診記錄id
          s: Math.random()
        },
      }).then(data => {

        t.AGE = data.basepatientinfo.patiAge ? parseFloat(data.basepatientinfo.patiAge) : null; //患者年龄
        t.diagnoseDate = data.diagnoseList || []; //西医诊断
        t.diagnoseDate_c = data.chinesediagnoseList || []; //中医诊断
        t.ZX_diagnose = data.chinesetypelist || []; //证型
        // t.westToText();
        // t.chineseToText();

        if (flag) { //只在初始化化时调用
          /*初始化处方数据（检验、检查、西药、中药）*/
          t.westList = data.docrecipeslist_w || []
          t.$refs.WEST.west_fatherToChild(t.westList);//向子组件传参

          t.chineseList = data.docrecipeslist_c || []
          t.$refs.CHINESE.chinese_fatherToChild(t.chineseList);//向子组件传参
        }
      }).catch(e => {
        t.diagnoseDate = [];
        t.diagnoseDate_c = [];
        t.ZX_diagnose = [];
        console.log('诊断查询', e);
        // t.westToText();
        // t.chineseToText();

      })

    },

    //添加诊断数据
    addDiagnose: function () {
      if (this.isWest) { //打开西医诊断列表
        this.dialog_DIAGNOSE2 = true;
      } else { //打开中医诊断列表
        this.dialog_DIAGNOSE3 = true;
      }
    },

    //查询诊断列表
    searchDiag: function (str) {

      if (this.isWest) {

        this.diagnoseForm.pageNum = 1;
        this.getDiagnose();
      } else {

        this.c_diagnoseForm.pageNum = 1;
        this.c_getDiagnose();
      }

    },


    //切换页
    w_turnPage: function (page) {

      this.diagnoseForm.pageNum = page;
      console.log('分页参数', this.diagnoseForm.pageNum)
      this.getDiagnose();

    },
    c_turnPage: function (page) {
      this.c_diagnoseForm.pageNum = page;
      this.c_getDiagnose();
    },
    //获取诊断列表数据(全部)-西医
    getDiagnose: function () {
      var t = this;
      var param = {
        name: t.diagnoseForm.name,
        ourtype: t.diagnoseForm.ourtype,
        pageNum: t.diagnoseForm.pageNum,
        pageSize: t.diagnoseForm.pageSize
      };
      t.DataList = []
      t.w_total = 0;

      t.loading2 = true;
      t.w_pageshow = false
      t.api({
        method: "get", //提交方式  
        url: DIAGNOSE_URL.GET_DIAGNOSE, //路径  
        params: param,

      }).then(data => {
        t.loading2 = false;
        t.DataList = data.result || [];
        t.w_total = data.total;
        t.$nextTick(() => {   //重新渲染分页
          t.w_pageshow = true;
        });
      }).catch(e => {
        t.loading2 = false;
        t.DataList = [];
        t.w_total = 0;
        console.log(e);
        t.$nextTick(() => {   //重新渲染分页
          t.w_pageshow = true;
        });
      })

    },
    //获取诊断列表数据(全部)-中医医
    c_getDiagnose: function () {
      var t = this;
      var param = t.c_diagnoseForm;
      t.c_DataList = []
      t.c_total = 0;

      t.loading2 = true;
      t.c_pageshow = false
      t.api({
        method: "get", //提交方式  
        url: DIAGNOSE_URL.GET_CHINESE_DIAGNOSE, //路径  
        params: param,
      }).then(data => {
        t.loading2 = false;
        t.c_DataList = data.result || [];
        t.c_total = data.total;
        t.$nextTick(() => {   //重新渲染分页
          t.c_pageshow = true;
        });
      }).catch(e => {
        t.loading2 = false;
        t.c_DataList = [];
        t.c_total = 0;
        console.log(e);
        t.$nextTick(() => {   //重新渲染分页
          t.c_pageshow = true;
        });

      });

    },

    //西医诊断选择
    selDiag: function (obj) {
      var listObj = {
        "id": "",
        'diagname': obj.ourname,
        'diagcode': obj.ourcode,
        "trecordtype": "0",
        "isconfirm": '0',

      };
      this.diagnoseDate.push(listObj);
      this.dialog_DIAGNOSE2 = false;
    },
    //中医诊断选择
    selDiag_chinese: function (obj) {
      var listObj = {
        "id": "",
        'diagname': obj.ourname,
        'diagcode': obj.ourcode,
        "trecordtype": "1",
        "isconfirm": '0',

      };
      this.diagnoseDate_c.push(listObj);
      this.dialog_DIAGNOSE3 = false;
    },
    //添加症型
    addZX: function () {
      this.dialog_DIAGNOSE4 = true;
    },
    //选择中医症型
    selZX: function (obj) {
      var listObj = {
        "id": "",
        'tcmsyndrome': obj.ourname,
        'tcmsyndromecode': obj.ourcode,
        "trecordtype": "2",
        "isconfirm": '0',

      };
      this.ZX_diagnose.push(listObj);
      this.dialog_DIAGNOSE4 = false;
    },
    //查询中医症型列表
    searchDiag_zx: function (str) {
      this.ZX_Form.pageNum = 1;
      this.getZX(); //症型

    },
    //症型列表-切换页
    turnPage_zx: function (page) {
      this.ZX_Form.pageNum = page;
      this.getZX(); //症型
    },
    //症型列表
    getZX: function () {
      var t = this;
      var param = t.ZX_Form;
      t.ZX_DataList = []
      t.ZX_total = 0;

      t.loading2 = true;
      t.ZX_pageshow = false;
      t.api({
        method: "get",
        url: DIAGNOSE_URL.GET_CHINESE_ZX, //路径  
        params: param,
      }).then(data => {
        t.loading2 = false;
        t.ZX_DataList = data.result || [];
        t.ZX_total = data.total;
        t.$nextTick(() => {   //重新渲染分页
          t.ZX_pageshow = true;
        });
      }).catch(e => {
        t.loading2 = false;
        t.ZX_DataList = [];
        t.ZX_total = 0;
        console.log(e);
        t.$nextTick(() => {   //重新渲染分页
          t.ZX_pageshow = true;
        });

      });

    },
    //疑似控制
    changeCheckBox: function (obj, e) {
      if (obj.row.isconfirm == '1') {
        obj.row.isconfirm = '0';
      } else {
        obj.row.isconfirm = '1';
      }
    },
    ischeck: function (e) {
      if (e == '1' || e == true) {
        return true;
      } else {
        return false;
      }
    },
    //保存处方
    saveDiagnose: function () {
      var t = this;
      if (t.AGE <= 14) { //14岁以下的儿童患者
        if (t.dform.weight) {
          t.saveAllDiagnose();
        } else {

          var str = '';
          if (t.AGE <= 6) {
            str = '当前是（低龄）儿童就诊，请录入‘体重’等信息!'
          } else {
            str = '当前是儿童就诊，请录入‘体重’等信息!'
          }
          this.$alert(str, '提示', {
            confirmButtonText: '知道了',
            callback: function (action) {

            }
          });

        }

      } else {
        t.saveAllDiagnose();
      }







    },
    //取消
    closeDiag: function () {
      var t = this;
      this.dialog_DIAGNOSE = false;

      this.getDiagnoseList(); //加载处方诊断【方便下次打开，不用再花时间】

      //加载诊断数据列表（全部）【方便下次打开，不用再花时间】

      //加载西医诊断
      t.diagnoseForm = {
        ourtype: '422001',
        name: '',
        pageNum: 1,
        pageSize: 10,
      };
      this.getDiagnose();
      //加载中医诊断 
      t.c_diagnoseForm = {
        ourtype: '422002',
        name: '',
        pageNum: 1,
        pageSize: 10,
      };
      this.c_getDiagnose();
      //中医证型
      t.ZX_Form = {
        ourtype: '416006',
        name: '',
        pageNum: 1,
        pageSize: 10,
      };
      this.getZX();


    },
    //诊断保存
    saveAllDiagnose: function () {
      var t = this;
      var list = t.diagnoseDate;
      //数据保存的data
      var param = [];
      var delParam = [];
      //本地数据库数据
      var diagList = [];
      var allDel = [];
      //保存数据统计
      var wObj = this.initList(t.diagnoseDate, 'w'); //西医处方:w,中医处方:c，中医证型：zx
      var cObj = this.initList(t.diagnoseDate_c, 'c');
      var zxObj = this.initList(t.ZX_diagnose, 'zx');

      //合并数组（提交的数据）
      param = param.concat(wObj.param, cObj.param, zxObj.param);
      //合并数组（本地存储的数据）
      diagList = diagList.concat(wObj.localparam, cObj.localparam, zxObj.localparam);


      //合并数组（删除的数据）
      allDel = allDel.concat(t.delList, t.delList_c, t.ZX_delList);
      //删除数据统计
      for (var i = 0; i < allDel.length; i++) {

        var obj = {
          "id": allDel[i].id,

        };
        delParam.push(obj);
      }


      t.loading = true;
      t.api({
        method: "POST",
        url: DIAGNOSE_URL.SAVE_WEST_DIAG,
        headers: {
          'Content-Type': 'application/json'
        },
        transformRequest: [function (data) {
          data = JSON.stringify(data)
          return data
        }],
        data: {
          'treatId': t.RID, //就诊记录id
          "jsonStr": param,//JSON.stringify(param),
          "deleteJson": delParam,//JSON.stringify(delParam),
        }


      }).then(data => {
        t.delList = []; //清空删除数据标记列表
        t.delList_c = [];
        t.ZX_delLis = [];
        t.loading = false;
        switch (data) {
          case "-2":
            t.$message.error('查询就诊信息为空，操作失败'); //保存完成"
            break;
          case "-1":
            t.$message.success('操作成功，保存完成'); //保存完成"
            break;
          case "0":
            t.$message.info('当前病症为空'); //当前病症为空
            break;
          default:
            t.$message.success('保存完成'); //保存完成"
            break;

        }
        if (data == '-2') {
          return false;
        }

        /****关闭弹窗*****/
        //  t.westToText(); ////加载诊断到右上角显示-西医诊断
        //  t.chineseToText(); //加载诊断到右上角显示-中医诊断
        t.closeDiag(); //关闭弹窗

        /*****病历-添加诊断****/
        var str = diagList.join(",");

        t.mh_form.diagnosis = str; //病历诊断数据-设置
        t.SavaMedicalHistory(); //保存病历


      }).catch(e => {
        t.loading = false;
        console.log('诊断保存', e);
        t.$message.error('系统错误，保存诊断失败！');

      });

    },
    //格式化提交的数据
    /**@list 数据列表
     * @mark 标记数据的内容 w:西医诊断，c:中医诊断,zx:中医症型
     */
    initList: function (list, mark) {
      var t = this;
      var strKey = '疑似'; //疑似
      var key = ''; //名称字段
      var object = {
        param: [],
        localparam: []
      }
      if (mark == 'zx') {
        key = 'tcmsyndrome'
      } else {
        key = 'diagname';
      }

      for (var i = 0; i < list.length; i++) {
        var dname = ''; //提交的数据
        var dname_L = ''; //本地数据用
        var obj = {};
        var indexStr = list[i][key]; //当前值:诊断or症型
        var isconfirm = list[i].isconfirm == '1' || list[i].isconfirm == true ? '1' : '0'
        if (isconfirm == '1') { //action-选择疑似
          dname = indexStr.startsWith(strKey) ? indexStr.substring(strKey.length) : indexStr; //去除'疑似'
          dname_L = indexStr.startsWith(strKey) ? indexStr : strKey + indexStr; //添加'疑似'
        } else { //action-取消疑似
          if (indexStr.startsWith(strKey)) { //原数据含有疑似
            dname = indexStr.substring(strKey.length); //去除疑似
          } else {
            dname = indexStr;
          }
          dname_L = dname;
        }


        switch (mark) {
          case 'w':
            obj = {
              "id": list[i].id,
              "trecordtype": '0',
              "diagname": dname,
              "diagcode": list[i].diagcode,
              "isconfirm": isconfirm, //1:疑似 
              "remark": t.isWest ? t.dform.remark : t.dform.remark_c,
              "weight": t.dform.weight,
              "height": t.dform.height,
              "animalh": t.dform.animalh,
              "heartbeat": t.dform.heartbeat,
              "pulse": t.dform.pulse,
              "SZ_mmHg": t.dform.SZ_mmHg,
              "SS_mmHg": t.dform.SS_mmHg,
            }
            break;
          case 'c':
            obj = {
              "id": list[i].id,
              "trecordtype": "1",
              "diagname": dname,
              "diagcode": list[i].diagcode,
              "isconfirm": isconfirm, //1:疑似 
              "remark": t.isWest ? t.dform.remark : t.dform.remark_c,
              "weight": t.dform.weight,
              "height": t.dform.height,
              "animalh": t.dform.animalh,
              "heartbeat": t.dform.heartbeat,
              "pulse": t.dform.pulse,
              "SZ_mmHg": t.dform.SZ_mmHg,
              "SS_mmHg": t.dform.SS_mmHg,
            }
            break;
          case 'zx':
            obj = {
              "id": list[i].id,
              "trecordtype": "2",
              "tcmsyndrome": dname,
              "tcmsyndromecode": list[i].tcmsyndromecode,
              "isconfirm": isconfirm, //1:疑似 
              "tcmremark": t.dform.tcmremark,
              "weight": t.dform.weight,
              "height": t.dform.height,
              "animalh": t.dform.animalh,
              "heartbeat": t.dform.heartbeat,
              "pulse": t.dform.pulse,
              "SZ_mmHg": t.dform.SZ_mmHg,
              "SS_mmHg": t.dform.SS_mmHg,
            };
            break;
        }


        object.param.push(obj); //提交数据用
        object.localparam.push(dname_L); //本地数据库
      }

      return object;
    },
    //删除诊断
    delDiagnose: function (data) {
      var t = this;
      var obj = data.row;
      var INDEX = data.$index;


      switch (t.isWest) {
        case 'true':
        case true: //西医诊断删除1条处方
          if (obj.id) { //旧诊断-需要接口删除
            var dels = t.diagnoseDate.splice(INDEX, 1); //dels获取删除的数据，diagnoseDate减少删除的数据
            t.delList = t.delList.concat(dels);

          } else { //新增诊断
            //删除行数据
            t.diagnoseDate.splice(INDEX, 1);
          }
          break;
        case 'false':
        case false: ////中医诊断删除1条处方
          if (obj.id) { //旧诊断-需要接口删除
            var dels = t.diagnoseDate_c.splice(INDEX, 1); //dels获取删除的数据，diagnoseDate减少删除的数据
            t.delList_c = t.delList_c.concat(dels);

          } else { //新增诊断
            //删除行数据
            t.diagnoseDate_c.splice(INDEX, 1);
          }
          break;
      }

    },
    //删除症型
    delZX: function (data) {
      var t = this;
      var obj = data.row;
      var INDEX = data.$index;


      if (obj.id) { //旧诊断-需要接口删除
        var dels = t.ZX_diagnose.splice(INDEX, 1); //dels获取删除的数据，diagnoseDate减少删除的数据
        t.ZX_delList = t.ZX_delList.concat(dels);

      } else { //新增诊断
        //删除行数据
        t.ZX_diagnose.splice(INDEX, 1);
      }

    },

    //加载诊断到右上角显示-西医诊断
    // westToText: function () {

    //   $("#w-re span.diagnose").text(this.ill);
    // },
    // //加载诊断到右上角显示-中医诊断
    // chineseToText: function () {

    //   $("#c-re span.diagnose").text(this.chineseill);
    // },
    /********************************开处方tab end************************ */
    /**************************病历tab ****************************** */
    //清除内容
    ClearTxt: function () {
      this.mh_form = {
        docRemark: '', //主诉
        anamnese: '', //病史
        physical: '', //检查结果
        diagnosis: '', //诊断
        dispose: '', //处理
        ID: '',
        tempname: '', //模板名
      };
    },
    NoNULL: function (str) {
      return str != null && str != undefined && str != "" ? true : false
    },
    getInfo_MH: function () { //加载处方信息
      var t = this;
      var promise = new Promise(function (resolve, reject) {

        /*ajax、axios、定时器操作等*/
        t.api({
          url: URL_MH.INFO,
          method: "get",
          params: {},

        }).then(data => {

          t.westList = data.docrecipeslist_w || []
          t.chineseList = data.docrecipeslist_c || []

          /*初始化处方数据（检验、检查、西药、中药）*/
          t.$refs.WEST.west_fatherToChild(t.westList);//向子组件传参

          t.$refs.CHINESE.chinese_fatherToChild(t.chineseList);//向子组件传参
          resolve(true);
          // if (t.WMedicine && t.CMedicine) {
          //   resolve(true);
          // }

        }).catch(e => {
          console.log("系统繁忙,稍后再试!");
          t.westList = []
          t.chineseList = []
          resolve(false);
        })

      });
      return promise;

    },
    //加载病历
    getHistoryInfo: function () {
      var t = this;
      t.mh_form.tempname = '';

      t.api({
        method: "get",
        url: URL_MH.MD_INFO,
        params: {
          'treatId': t.RID
        },

      }).then(data => {
        debugger;
        if (data == '请先下诊断') {
          t.$message.warning('请先下诊断');
          return false;
        }
        if (data != null) {
          var s;
          var type = typeof (data)
          if (type == 'string') {
            if (data.indexOf("{") > -1 && data.indexOf("}") > -1) {
              var s = JSON.parse(data);
            }

          } else {
            s = data
          }


          // anamnese: "2"
          // createtime: "2020-12-18 12:39:27"
          // diagnosis: "4"
          // dispose: "5"
          // docRemark: "1"
          // iD: "6ebdbbf24e8441d3955a595c7d506ee6"
          // isSignatrue: "0"
          // physical: "3"
          // rId: "d681f474c547484882827c21c6dcbd80"
          if (s.resultCode == '501') {
            t.$message.error(s.resultDesc);
            return false;
          }
          t.mh_form.ID = s.iD;
          //t.businessId = t.mh_form.ID
          t.rId = s.rId;


          // $("#assistPhysical").val(s.assistPhysical);

          if (data.isSignatrue == "1") { //已經簽名
            t.isSignatrue = true;
          }


          t.mh_form.docRemark = s.docRemark
          t.mh_form.anamnese = s.anamnese
          t.mh_form.physical = s.physical
          t.mh_form.diagnosis = s.diagnosis

          // /*处理初始化*/
          setTimeout(function () {
            var DisposeStr = ''
            //中西药品内容
            var wstr = t.WMedicine.join('/')
            var cstr = t.CMedicine.join('/');
            wstr = wstr ? wstr : ""
            cstr = cstr ? cstr : ""
            if (wstr != "") {
              DisposeStr += (wstr + "/")
            }
            if (cstr != "") {
              DisposeStr += cstr
            }

            var dispose = t.matchDispose(DisposeStr, s.dispose);
            t.mh_form.dispose = dispose;
          }, 50);






        }
      }).catch(error => {
        debugger;
        t.$message.error('系统错误');
        if (error.responseText && error.responseText.indexOf('\u0000') != -1) {
          var data = error.responseText.replace(/\u0000/g, '');
          initHistal(data); //初始化
        }

      });
    },
    /*匹配本地数据库和后台数据，过滤相同项
     * */
    matchDispose: function (Ldata, Ddata) {

      if (Ldata != undefined && Ddata != undefined) {
        if (Ldata != "" && Ddata == "") {
          return Ldata;
        }
        if (Ldata === Ddata) {
          return Ldata;
        }
        var a = Ldata.split("/"); //本地数据
        var b = Ddata.split("/"); //数据库数据
        var c = []; //整合数据
        var str = ""; //返回的字符串
        //数组去空
        a = a.filter(function (s) {
          return s && s.trim();
        })
        b = b.filter(function (s) {
          return s && s.trim();
        })

        var com = a.concat(b); //合并数租
        //数据去重
        for (var i = 0; i < com.length; i++) {
          if (c.indexOf(com[i]) == -1) {
            c.push(com[i]);
          }
        }



        str = c.join('/');
        return str;
      } else {
        return;
      }

    },
    //保存病历
    SavaMedicalHistory: function () {
      var t = this;

      var loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.5)'
      });

      t.getInfo_MH().then(function (promise) {

        var dispose = t.mh_form.dispose;
        if (promise) {

          //中西药品内容
          var wstr = t.WMedicine.join('/')
          var cstr = t.CMedicine.join('/');
          var DisposeStr = wstr + "/" + cstr; //本地数据库数据
          dispose = t.mh_form.dispose //t.matchDispose(DisposeStr, t.mh_form.dispose); //匹配数据

          var param = {
            "docRemark": t.mh_form.docRemark,
            "anamnese": t.mh_form.anamnese,
            "physical": t.mh_form.physical,
            "diagnosis": t.mh_form.diagnosis,
            "dispose": dispose,
            'rId': t.RID, //=就诊记录id
          };
          t.api({
            url: URL_MH.SAVE_MEDICALHISTORY,
            method: 'post',
            params: param,

          }).then(data => {
            loading.close();

            if (data) {
              t.mh_form.ID = data;
              t.businessId = t.mh_form.ID; // 保存内容后，才赋值业务id(处方id，病历id)
              t.$message.success('病历保存成功！');
              t.getHistoryInfo();//重新加载病历数据

            } else {
              t.$message.error("病历保存失败！");
            }

          }).catch(e => {
            loading.close();
            t.$message.error("网络错误,保存病历失败!");

          });
        } else {
          loading.close();
        }



      })

    },

    /********************************病历tab end*********************************/

  }// methods end
}
</script>


<style >
.app-container {
  font-size: 0;
  min-width: 1200px;
}
.el-message-box__btns {
  text-align: center;
}
.leftDiv {
  width: 70%;
  min-width: 810px;
  display: inline-block;
  vertical-align: top;
  font-size: 14px;
}
.rightDiv {
  font-family: 微软雅黑;
  display: inline-block;
  width: 30%;
  min-width: 320px;
  font-size: 14px;
}
.userInfo {
  background: aliceblue;
  padding: 10px;
  box-sizing: border-box;
  font-style: normal;
  width: 98%;
  border: 1px solid #e5e5e5;
}
.userInfo img {
  display: inline-block;
  width: 100px;
  height: 100px;
  vertical-align: top;
}
.infos {
  display: inline-block;
  padding: 5px;
}
.infos > label {
  display: block;
  font-size: 15px;
  padding: 3px;
  font-weight: 300;
  color: #409dff;
}
.infos > label b {
  color: #000000;
}
.infos > label i {
  font-style: normal;
}
h4.titleTb {
  margin: 0;
  padding: 5px;
  background: #79b7f9;
  color: white;
  margin-top: 20px;
  font-size: 13px;
  font-weight: 400;
}

.ceil {
  margin-bottom: 5px;
}
.ceil > label {
  display: inline-block;
  width: 100px;
  font-size: 15px;
  padding-right: 5px;
  text-align: right;
  margin: 6px 0;
}
.ceil > .el-input {
  width: 200px;
}
.el-dialog__header {
  border-bottom: 1px solid #e1e1e1;
}
.el-dialog__footer {
  text-align: center;
}
/*患者list */
.userlistTb td {
  font-size: 14px;
  padding: 0;
  margin: 0;
}
/*患者list end */
/*处方模块 */
.Recipe {
  border: 1px solid #e5e5e5;
  padding: 0;
  margin: 10px 0;
  width: 98%;
}
ul.nav {
  padding: 0;
  font-size: 0;
  margin: 0 0 10px 0;
  border-bottom: 1px solid #e5e5e5;
  display: block;
  height: 30px;
}
.nav > li {
  display: inline-block;
  padding: 5px;
  border-right: 1px solid #e7e7e7;
  font-size: 17px;
  color: #585858;
  font-weight: bold;
  width: 120px;
  text-align: center;
  cursor: pointer;
}

li.active {
  border-bottom: 2px solid #409eff;
  background: #f2f5f7;
}

.nav-switch {
  background: whitesmoke;
  line-height: 33px;
  padding-left: 15px;
  font-weight: bold;
  font-size: 17px;
  color: #47ccc0;
}
.nav-switch button.el-button {
  margin-left: 20px;
}
.ill {
  font-size: 14px;
  padding: 5px;
  margin-bottom: 30px;
}
.diagnose {
  display: inline-block;
  word-break: break-all;
  font-size: 15px;
  line-height: 20px;
}
.clabel {
  display: inline-block;
  min-width: 176px;
  margin: 5px;
  font-size: 14px;
}

.clabel input[type="text"] {
  padding: 5px;
  display: inline-block;
  width: 61px;
  border: 1px solid #e6e2e2;
  margin: 0 3px;
}
.el-pagination.is-background {
  text-align: center;
}
/*处方模块 end*/
/*病历tab */
.cen {
  display: table;
  margin-bottom: 5px;
}
.title-size-m {
  font-family: "微软雅黑";
  font-size: 15px;
  width: 85px;
  margin-top: 15px;
  display: table-cell;
  vertical-align: middle;
  text-align: center;
  font-weight: bold;
  color: #000000;
}
.medical-history-textarea {
  width: 400px;
  height: 85px;
  position: relative;
  resize: none;
  font-family: "微软雅黑";
  font-size: 14px;
  padding: 3px 4px;
  margin: 0 5px;
  background-color: rgba(255, 255, 255, 0.62);
  border: 1px solid rgb(195, 215, 242);
  border-radius: 2px;
  display: table-cell;
  vertical-align: middle;
  box-sizing: border-box;
}
.actions {
  text-align: center;
  padding: 10px;
}
/*病历tab */
</style>
