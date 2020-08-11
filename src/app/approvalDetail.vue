<template>
  <div>
    <group :title="title">
      <cell title="要货方" :value="editDatah.purCompanyName"></cell>
      <cell title="供货方" :value="editDatah.supCompanyName"></cell>
      <cell title="单据日期" :value="dateFormatter(editDatah.addTime)"></cell>
      <cell title="收货联系人" :value="editDatah.addressReveiver"></cell>
      <cell title="收货联系电话" :value="editDatah.addressPhone"></cell>
      <cell title="收货地址" :value="editDatah.address"></cell>
      <cell title="订单联系人" v-if="opera === 'myReturn'" :value="editDatah.orderReturnUserName"></cell>
      <cell title="订单联系人" v-if="opera === 'order'" :value="editDatah.orderUserName"></cell>
      <cell title="订单联系电话" v-if="opera === 'myReturn'" :value="editDatah.orderReturnPhone"></cell>
      <cell title="订单联系电话" v-if="opera === 'order'" :value="editDatah.orderUserPhone"></cell>
      <cell title="客户采购单号" :value="editDatah.purchaseOrderNo"></cell>
      <cell title="选择合同" v-if="opera === 'myReturn'" :value="editDatah.optionContract"></cell>
      <cell title="选择合同" v-if="opera === 'order'" :value="editDatah.contractNo"></cell>
      <cell title="订单备注" v-if="opera === 'myReturn'" :value="editDatah.orderRemark"></cell>
      <cell title="订单备注" v-if="opera === 'order'" :value="editDatah.optionContract"></cell>
      <cell title="预计到货日期" v-if="opera === 'order'" :value="dateFormatter(editDatah.presetReceiverTime)"></cell>
      <cell title="发货优先级" :value="deliveryPriorityMap[editDatah.deliveryPriority]"></cell>
      <cell title="发货订单类型" v-if="opera === 'order'" :value="typeMap[editDatah.type]"></cell>
      <cell title="退货订单类型" v-if="opera === 'myReturn'" :value="returnOrderTypeMap[editDatah.returnOrderType]"></cell>
      <cell title="税率%" :value="editDatah.tax"></cell>
      <cell title="区域" :value="editDatah.area"></cell>
      <cell title="结算方式" :value="payMap[editDatah.payType]"></cell>
      <cell title="交货方式" :value="deliveryMap[editDatah.deliveryType]"></cell>
    </group>
    <group title="已选商品">
      <template v-for="(el, i) in editDatah.orderDataG" v-if="opera === 'order'">
        <cell :arrow-direction="cur===i ? 'up' : 'down'" @click.native="cur = cur === i ? -1 : i" :title="el.productName" :border-intent="false" :key="el.orderNo" :value="'数量：' + el.nums" is-link></cell>
        <cell-box v-if="cur===i" v-for="k in defaultCols" :key="k.prop" :border-intent="false" class="sub-item">
          <span>{{k.label}}: {{el[k.prop]}}</span>
        </cell-box>
      </template>
      <template v-for="(el, i) in editDatah.orderDataG" v-if="opera === 'myReturn'">
        <cell :arrow-direction="cur===i ? 'up' : 'down'" @click.native="cur = cur === i ? -1 : i" :title="el.productName" :border-intent="false" :key="el.orderReturnNo" :value="'数量：' + el.nums" is-link></cell>
        <cell-box v-if="cur===i" v-for="k in colsRg" :key="k.prop" :border-intent="false" class="sub-item">
          <span v-if="k.prop === 'orderTime'">{{k.label}}: {{dateFormatter(el[k.prop])}}</span>
          <span v-else-if="k.prop === 'validityPeriod'">{{k.label}}: {{dateFormatter(el[k.prop])}} / {{dateFormatter(el[k.prop1])}}</span>
          <span v-else>{{k.label}}: {{el[k.prop]}}</span>
        </cell-box>
      </template>
      <!-- <group-title slot="title" v-if="m.title === '谷幽兰'">{{m.title}}<span style="float:right;">已选{{sumG}}件商品，小计金额：￥{{amountG}}</span></group-title>
      <group-title slot="title" v-if="m.title === '夫专家'">{{m.title}}<span style="float:right;">已选{{sumF}}件商品，小计金额：￥{{amountF}}</span></group-title>
      <group-title slot="title" v-if="m.title === '物料'">{{m.title}}<span style="float:right;">已选{{sumM}}件商品，小计金额：￥{{amountM}}</span></group-title> -->
    </group>
    <group title="支付方式" v-if="opera === 'order'">
      <!-- <cell title="收款单位名称" :border-intent="false" value="武汉润禾生物医药有限公司"></cell> -->
      <!-- <cell title="开户行" :border-intent="false" value="工商银行武昌支行"></cell> -->
      <!-- <cell title="账号" :border-intent="false" value="3202005509200436453"></cell> -->
      <cell title="使用销售支持额度" :border-intent="false" value="￥0" inline-desc="已使用0元，可用0元"></cell>
      <cell title="使用市场推广支持额度" :border-intent="false" value="￥0" inline-desc="已使用0元，可用0元"></cell>
      <!-- <cell title="应付总额" :border-intent="false" :value="'￥' + amountTotal" :inline-desc="'已选' + sum + '件商品'"></cell> -->
    </group>
    <group title="合计">
      <template v-if="opera === 'order'">
         <cell title="谷幽兰" :border-intent="false" :value="'已选' + sumG + '件商品，' + '小计金额：￥' + amountG"></cell>
        <cell title="夫专家":border-intent="false" :value="'已选' + sumF + '件商品，' + '小计金额：￥' + amountF"></cell>
        <cell title="物料" :border-intent="false" :value="'已选' + sumM + '件商品，' + '小计金额：￥' + amountM"></cell>
        <cell title="运费" :border-intent="false" :value="'￥' + freight"></cell>
        <cell title="税费" :border-intent="false" :value="'￥' + taxes"></cell>
        <cell title="应付总额" :border-intent="false" :value="'￥' + amountTotal + '，已选'+ sum + '件商品'"></cell>
      </template>
     <template v-if="opera === 'myReturn'">
       <cell title="退货原因" :border-intent="false" :value="editDatah.returnReason"></cell>
       <cell title="退货原因" :border-intent="false" :value="editDatah.returnReason"></cell>
       <cell title="汇总数量" :border-intent="false" :value="sum"></cell>
       <cell title="汇总金额" :border-intent="false" :value="'￥' + returnSum + '元'"></cell>
       <cell title="税费" :border-intent="false" :value="'￥' + returnTax + '元'"></cell>
       <cell title="制单人" :border-intent="false" :value="editDatah.creater"></cell>
       <cell title="合计退款金额" :border-intent="false" :value="'￥' + editDatah.amountPay + '元'"></cell>
     </template>
    </group>
    <box gap="10px 10px">
      <flexbox v-if="approvalShow">
        <flexbox-item>
          <x-button type="primary" @click.native="dialog('pass')">通过</x-button>
        </flexbox-item>
        <flexbox-item>
          <x-button type="warn" @click.native="dialog('noPass')">拒绝</x-button>
        </flexbox-item>
      </flexbox>
      <x-button type="primary" v-if="orderShow" :disabled="sendDisabled" @click.native="sendShow=true">发货</x-button>
      <!-- <x-button type="warn" v-if="returnShow" :disabled="returnDisabled" @click.native="returnSend">收货</x-button> -->
    </box>
    <toast v-model="showPositionValue" type="text" :time="3000" is-show-mask :position="position">{{msg}}</toast>
    <!-- 发货弹窗 -->
    <x-dialog v-model="sendShow" class="dialog-demo">
      <div style="padding:15px;">
        <x-input title="物流单号" v-model="deliveryCode"></x-input>
      </div>
      <div style="padding:15px;">
        <flexbox>
          <flexbox-item>
            <x-button @click.native="send" type="primary">确定</x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button @click.native="sendShow=false">取消</x-button>
          </flexbox-item>
        </flexbox>
      </div>
    </x-dialog>
    <!-- 审批弹窗 -->
<!--     <x-dialog v-model="approvalEdit" class="dialog-demo">
      <div style="padding:15px;">
        <x-input title="审批意见" v-model="desc"></x-input>
      </div>
      <div style="padding:15px;">
        <flexbox>
          <flexbox-item>
            <x-button @click.native="submit" type="primary">确定</x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button @click.native="approvalEdit=false">取消</x-button>
          </flexbox-item>
        </flexbox>
      </div>
    </x-dialog> -->
  </div>
</template>

<script>
  import { Divider, GroupTitle, Group, Cell, CellBox, XButton, Box, dateFormat, Flexbox, FlexboxItem, XDialog, XInput, Toast } from 'vux'

  export default {
    components: {
      Divider,
      GroupTitle,
      Group,
      Cell,
      CellBox,
      Box,
      XButton,
      dateFormat,
      Flexbox,
      FlexboxItem,
      XDialog,
      XInput,
      Toast
    },
    data () {
      return {
        returnTax: '', // 退货单税费
        taxes: '', // 税费
        approvalShow: false, // 审批按钮
        orderShow: false, // 发货按钮
        returnShow: false, // 收货按钮
        returnDisabled: true,
        approvalEdit: false, // 审批弹窗
        sendDisabled: true, // 发货按钮
        sendShow: false, // 发货弹窗
        showPositionValue: false, // 请求操作提示
        user: '', // 是否是经销商
        position: '', // 提示位置
        deliveryCode: '', // 物流单号
        desc: '', // 审批意见
        currentAction: '', // 当前状态
        taskId: '',
        msg: '',
        title: '订单详情',
        opera: '', // 单据类型
        editDatah: {},  // 单据信息
        product: [
          {prop: 'orderDataG', title: '谷幽兰'},
          {prop: 'orderDataF', title: '夫专家'},
          {prop: 'orderDataM', title: '物料'}
        ],
        cur: -1,  // 展开的产品详情
        dealerUrl: window.ELS.api + '/company/service/queryDealerByPage', // 查询经销商
        userUrl: window.ELS.api + '/user/service/findCurrentUser', // 获取当前用户
        sendUrl: window.ELS.api + '/order/service/deliverOrder', // 我的订单发货
        returnSendUrl: window.ELS.api + '/orderReturn/service/orderReturnFinished', // 我的退货单收货
        customerUrl: window.ELS.api + '/orderReturn/service/orderReturnDeliver', // 我的退货单发货
        customerReturnUrl: window.ELS.api + '/order/service/finishOrder', // 我的退货单收货
        completePersonalTaskUrl: window.ELS.api + '/workFlow/service/completePersonalTask', // 审批接口
        deliveryPriorityMap: {1: '低', 2: '中', 3: '高'},
        typeMap: {0: '订货申请单', 1: '物料申请单', 2: '补货申请单', 3: '换货申请单'},
        returnOrderTypeMap: {0: '运输途中损坏', 1: '产品质量问题', 2: '滞销'},
        payMap: {'ACOUNT_TRANSFER': '转账', 'TELE_TRANSFER': '电汇'},
        deliveryMap: {1: '货运', 2: '快递'},
        defaultCols: [  // 订单列自定义
          {label: '产品编号', prop: 'productId', show: true, fixed: false, width: 120},
          {label: '产品名称', prop: 'productName', show: true, fixed: false, width: 200},
          {label: '规格', prop: 'productSpec', show: true, fixed: false, width: 80},
          {label: '单位', prop: 'productUnit', show: true, fixed: false, width: 80},
          {label: '零售价', prop: 'productSpec', show: true, fixed: false, width: 80},
          {label: '药店供货价', prop: 'productPriceForNextDealer', show: true, fixed: false, width: 80},
          {label: '供货价', prop: 'productSupplyPrice', show: true, fixed: false, width: 80},
          {label: '数量', prop: 'nums', show: true, fixed: false, width: 80},
          {label: '小计', prop: 'amountTotal', show: true, fixed: false, width: 80}
        ],
        colsRg: [  // 退货单列自定义
          {label: '区域', prop: 'area', show: true, fixed: false, width: 100},
          {label: '商品名称', prop: 'productName', show: true, fixed: false, width: 180},
          // {label: this.$t('订单编号'), prop: 'orderNo', show: true, fixed: false, width: 130},
          {label: '订货时间', prop: 'orderTime', show: true, fixed: false, width: 150, formatter: true},
          {label: '有效期/生产日期', prop: 'validityPeriod', prop1: 'productionDate', show: true, fixed: false, width: 270, formatter: true},
          {label: '订货单价', prop: 'orderPrice', show: true, fixed: false, width: 110},
          {label: '订货金额', prop: 'orderAmount', show: true, fixed: false, width: 110},
          {label: '数量', prop: 'nums', show: true, fixed: false, width: 130},
          {label: '退货原因', prop: 'returnReason', show: true, fixed: false, width: 130}
        ]
      }
    },
    computed: {
      sumG: function () {
        if (this.editDatah.orderDataG) {
          let nums = 0
          this.editDatah.orderDataG.map(i => {
            if (i.categoryName === '谷幽兰') {
              nums += i.nums
            }
          })
          return nums
        } else {
          return 0
        }
      }, // 谷幽兰的件数合计
      amountG: function () {
        if (this.editDatah.orderDataG) {
          let sum = 0
          this.editDatah.orderDataG.map(i => {
            if (i.categoryName === '谷幽兰') {
              sum += i.amountTotal
            }
          })
          return sum
        } else {
          return 0
        }
      }, // 谷幽兰的件数合计
      sumF: function () {
        if (this.editDatah.orderDataG) {
          let nums = 0
          this.editDatah.orderDataG.map(i => {
            if (i.categoryName === '夫专家') {
              nums += i.nums
            }
          })
          return nums
        } else {
          return 0
        }
      }, // 夫专家的件数合计
      amountF: function () {
        if (this.editDatah.orderDataG) {
          let sum = 0
          this.editDatah.orderDataG.map(i => {
            if (i.categoryName === '夫专家') {
              sum += i.amountTotal
            }
          })
          return sum
        } else {
          return 0
        }
      }, // 夫专家的件数合计
      sumM: function () {
        if (this.editDatah.orderDataG) {
          let nums = 0
          this.editDatah.orderDataG.map(i => {
            if (i.categoryName === '物料') {
              nums += i.nums
            }
          })
          return nums
        } else {
          return 0
        }
      }, // 物料的件数合计
      amountM: function () {
        if (this.editDatah.orderDataG) {
          let sum = 0
          this.editDatah.orderDataG.map(i => {
            if (i.categoryName === '物料') {
              sum += i.amountTotal
            }
          })
          return sum
        } else {
          return 0
        }
      }, // 物料的件数合计
      sum: function () {
        let sum = this.sumG + this.sumF + this.sumM
        this.editDatah.nums = sum
        return sum
      },
      amountTotal: function () {
        let sum = this.amountG + this.amountF + this.amountM
        this.taxes = Number(this.editDatah.tax / 100) * sum
        sum = sum + this.taxes
        this.editDatah.amountTotal = sum
        return sum
      },
      freight: function () {
        let freight = 0
        this.editDatah.freight = freight
        return freight
      },
      returnSum: function () {
        let sumG = 0
        let sum = 0
        if (this.editDatah.orderDataG) {
          this.editDatah.orderDataG.map(i => {
            sumG += Number(i.orderAmount)
          })
        }
        sum = sumG || 0
        this.editDatah.amountTotal = sum
        this.returnTax = Number(this.editDatah.tax / 100) * sum
        this.editDatah.amountPay = sum + this.returnTax
        return sum
      }
    },
    methods: {
      // 审批弹窗
      dialog (type) {
        this.currentAction = type
        this.approvalEdit = true
      },
      // 审批
      submit () {
        if (this.desc === '') {
          this.msg = '物流单号不能为空！'
          this.position = 'middle'
          this.showPositionValue = true
          return
        }
        if (this.currentAction === 'pass') {
          this.currentAction = true
        } else {
          this.currentAction = false
        }
        this.$http.post(this.completePersonalTaskUrl + '?taskId=' + this.taskId + '&isPass=' + this.currentAction + '&desc=' + this.desc).then((res) => {
          this.msg = res.data.msg
          this.position = 'middle'
          this.showPositionValue = true
          this.approvalEdit = false
          let self = this
          setTimeout(function () {
            self.$router.go(-1)
          }, 1000)
        })
      },
      // 我的订单发货 / 业务退货发货
      send () {
        if (this.deliveryCode === '') {
          this.msg = '物流单号不能为空！'
          this.position = 'middle'
          this.showPositionValue = true
          return
        }
        if (this.user === 'RH') {
          this.$http.post(this.sendUrl + '?deliveryCode=' + this.deliveryCode, JSON.stringify([this.editDatah.id])).then((res) => {
            this.msg = res.data.msg
            this.position = 'middle'
            this.showPositionValue = true
            this.sendShow = false
            let self = this
            setTimeout(function () {
              self.$router.go(-1)
            }, 1000)
          })
        } else if (this.user === 'customer') {
          this.$http.post(this.customerUrl + '?logisticsNo=' + this.deliveryCode, JSON.stringify([this.editDatah.orderReturnNo])).then((res) => {
            this.msg = res.data.msg
            this.position = 'middle'
            this.showPositionValue = true
            this.sendShow = false
            let self = this
            setTimeout(function () {
              self.$router.go(-1)
            }, 1000)
          })
        }
      },
      // 我的退货单收货
      returnSend () {
        if (this.user === 'RH') {
          this.$http.post(this.returnSendUrl, JSON.stringify([this.editDatah.orderReturnNo])).then(res => {
            this.msg = res.data.msg
            this.position = 'middle'
            this.showPositionValue = true
            let self = this
            setTimeout(function () {
              self.$router.go(-1)
            }, 1000)
          })
        } else if (this.user === 'customer') {
          this.$http.post(this.customerReturnUrl, JSON.stringify([this.editDatah.id])).then(res => {
            this.msg = res.data.msg
            this.position = 'middle'
            this.showPositionValue = true
            let self = this
            setTimeout(function () {
              self.$router.go(-1)
            }, 1000)
          })
        }
      },
      // 判断当前用户的权限
      getUser (row) {
        this.$http.get(this.userUrl).then(res => {
          if (res.data.data.extInfo && res.data.data.extInfo.roleList.length > 0) {
            res.data.data.extInfo.roleList.map(i => {
              if (i.roleCode === 'business_manager') {
                if (row.deliveryStatus === 300) {
                  this.sendDisabled = false
                }
                if (row.orderReturnStatus === 3) {
                  this.returnDisabled = false
                }
              } else if (i.roleCode === 'supplier') {
                if (row.deliveryStatus === 400) {
                  this.returnDisabled = false
                }
                if (row.orderReturnStatus === 2) {
                  this.sendDisabled = false
                }
              }
            })
          }
        })
      },
      // 获取经销商数据
      getDealer () {
        this.$http.get(this.dealerUrl + '?pageNo=1&pageSize=9999').then(res => {
          var arr = res.data.data.queryResult || []
          for (var i = 0; i < arr.length; i++) {
            if (arr[i].id === this.editDatah.purCompanyId) {
              this.editDatah.purCompanyName = arr[i].companyFullName
              break
            }
          }
        })
      },
      // 日期格式化
      dateFormatter (date) {
        return dateFormat(date, 'YYYY-MM-DD')
      },
      init () {
        this.getDealer()
        var row = JSON.parse(window.sessionStorage.getItem('orderDetail')) || ''
        if (this.$route.query.opera === 'order' && this.$route.query.type === undefined && this.$route.query.user === undefined) { // 判断是否是我的订单
          this.opera = 'order'
          this.orderShow = true
          this.user = 'RH'
        } else if (this.$route.query.opera === 'myReturn' && this.$route.query.type === undefined && this.$route.query.user === undefined) { // 判断是否是我的退货单
          this.opera = 'myReturn'
          this.returnShow = true
          this.user = 'RH'
        } else if (this.$route.query.opera === 'myReturn' && this.$route.query.user === 'customer') { // 判断是否是业务退货单
          this.opera = 'myReturn'
          this.orderShow = true
          this.user = 'customer'
        } else if (this.$route.query.opera === 'order' && this.$route.query.user === 'customer') { // 判断是否是业务订单
          this.opera = 'order'
          this.returnShow = true
          this.user = 'customer'
        } else if (this.$route.query.opera === 'order' && this.$route.query.type === 'approval') { // 判断是否是待办事项的订单
          this.opera = 'order'
          this.approvalShow = true
          this.taskId = this.$route.query.taskId
        } else if (this.$route.query.opera === 'myReturn' && this.$route.query.type === 'approval') { // 判断是否是待办事项的退货
          this.opera = 'myReturn'
          this.approvalShow = true
          this.taskId = this.$route.query.taskId
        } else if (this.$route.query.opera === 'order' && this.$route.query.type === 'finish') {  // 判断是否是已办事项的订单
          this.opera = 'order'
        } else if (this.$route.query.opera === 'myReturn' && this.$route.query.type === 'finish') { // 判断是否是已办事项的退货单
          this.opera = 'myReturn'
        }
        if (row) {
          this.editDatah = row
          this.editDatah.orderDataG = this.editDatah.orderItems || this.editDatah.orderReturnItems
        }
        this.getUser(row)
      }
    },
    watch: {
      $route () {
        this.init()
      }
    },
    created () {
      this.init()
    }
  }
</script>

<style>
.cellLink{margin-right:5px; color:green;}
.custom-primary-red {
  border-radius: 99px!important;
  border-color: #CE3C39!important;
  color: #CE3C39!important;
  &:active {
    border-color: rgba(206, 60, 57, 0.6)!important;
    color: rgba(206, 60, 57, 0.6)!important;
    background-color: transparent;
  }
}
.weui-cell__hd{
  height:40px;
  line-height: 40px;
}
.weui-input{
  padding:0 5px !important;
  height:40px !important;
  line-height: 40px !important;
  border:1px solid #c0c0c0 !important;
}
</style>
