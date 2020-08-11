<template>
  <div>
    <group :title="title">
      <x-button @click.native="showSearch=true"><i class="fa fa-search"></i>查询</x-button>
      <x-dialog v-model="showSearch" class="dialog-demo" hide-on-blur>
        <div style="padding:15px;">
          <x-input title="订单编号" v-model="currentQueryCondition.orderNo"></x-input>
          <selector v-model="currentQueryCondition.status" :options="statusList" title="订单状态"></selector>
          <selector v-model="currentQueryCondition.deliveryStatus" :options="deliveryStatusList" title="发货状态"></selector>
          <selector v-model="currentQueryCondition.approvalStatus" :options="approvalStatusList" title="审批状态"></selector>
          <x-button @click.native="searchData()" type="primary">查询</x-button>
          <x-button @click.native="showSearch=false" type="primary">取消</x-button>
          <x-button @click.native="initQueryCondition" type="primary">清空</x-button>
        </div>
      </x-dialog>
      <template v-for="(el, i) in tableData">
          <div @click="go(el)" class="listA">
            <flexbox style="float: left" wrap="wrap">
              <flexbox-item><div class="flex-demo title">{{el.orderNo}}</div></flexbox-item>
              <flexbox-item><div class="flex-demo" style="float: right; height: 20px;">
                  <div v-for="k in defaultCols" :key="k.prop" :border-intent="false" class="sub-item">
                    <span v-if="k.prop === 'approvalStatus'" :style="el[k.prop] === 200 ? {color: '#5CACEE'} : {color: 'red'}">{{approvalStatusMap[el[k.prop]]}}</span>
                    <span v-else-if="k.prop === 'status'" :style="el[k.prop] === 700 ? {color: '#5CACEE'} : {color: 'red'}">{{statusMap[el[k.prop]]}}</span>
                    <span v-else-if="k.prop === 'deliveryStatus'" :style="el[k.prop] === 500 ? {color: '#5CACEE'} : {color: 'red'}">{{deliveryStatusMap[el[k.prop]]}}</span>
                  </div>
                </div></flexbox-item>
              </flexbox>
            <flexbox wrap="wrap">
              <flexbox-item><div class="flex-demo elseFont">{{el.purCompanyName}}</div></flexbox-item>
            </flexbox>
              <flexbox wrap="wrap">
            <flexbox-item><div class="flex-demo nameStyle">下单时间：{{dateFormatter(el.addTime)}}</div></flexbox-item>
              <flexbox-item><div class="flex-demo amount">￥{{el.amountTotal}}</div></flexbox-item>
            </flexbox>
          </div>
      </template>
    </group>
    <div class="page" v-if="tableData && tableData.length > 0">
      <pagination :page-index="pageNo" :page-size="pageSize" :total="total" @change="pageChange"></pagination>
    </div>
  </div>
</template>

<script>
  import { Group, Cell, CellBox, FlexboxItem, Flexbox, dateFormat, XInput, XButton, XDialog, Selector } from 'vux'
  import pagination from '../components/pagination.vue'

  export default {
    components: {
      Group,
      Cell,
      CellBox,
      pagination,
      FlexboxItem,
      Flexbox,
      XInput,
      XButton,
      XDialog,
      Selector,
      dateFormat
    },
    data () {
      return {
        title: '我的订单',
        cur: -1,
        showSearch: false,
        tableDataLoading: false,
        getDataUrl: window.ELS.api + '/order/service/findByPage',
        pageNo: 1,
        pageSize: 10,
        total: 1,
        tableData: [],
        defaultCols: [  // 列自定义
          // {label: '订单编号', prop: 'orderNo', show: true, fixed: true, width: 160},
          // {label: '经销商名称', prop: 'purCompanyName', show: true, fixed: true, width: 210},
          // {label: '收货人', prop: 'addressReveiver', show: true, fixed: false, width: 80},
          // {label: '数量', prop: 'nums', show: true, fixed: false, width: 70},
          // {label: '金额', prop: 'amountTotal', show: true, fixed: false, width: 70},
          {label: '审批状态', prop: 'approvalStatus', show: true, fixed: false, width: 110},
          {label: '状态', prop: 'status', show: true, fixed: false, width: 80},
          {label: '发货状态', prop: 'deliveryStatus', show: true, fixed: false, width: 110},
          {label: '下单时间', prop: 'addTime', show: true, fixed: false, width: 110, formatter: true}
        ],
        statusMap: {
          100: '待提交',
          200: '待支付',
          600: '已取消',
          700: '已支付'
        },
        approvalStatusMap: {
          100: '待审批',
          150: '运维人员审核通过',
          200: '审批通过',
          300: '审批不通过'
        },
        deliveryStatusMap: { // 发货状态
          300: '待发货',
          400: '待收货',
          500: '已完成'
        },
        deliveryStatusList: [
          {key: 300, value: ('待发货')},
          {key: 400, value: ('待收货')},
          {key: 500, value: ('已完成收货')}
        ],
        statusList: [
          {key: 100, value: ('待提交')},
          {key: 200, value: ('待支付')},
          {key: 600, value: ('已取消')},
          {key: 700, value: ('已支付')}
        ],
        approvalStatusList: [
          {key: 100, value: ('待审批')},
          {key: 150, value: ('运维人员审核通过')},
          {key: 200, value: ('审批通过')},
          {key: 300, value: ('审批不通过')}
        ],
        currentQueryCondition: {
          orderNo: '',
          status: '',
          approvalStatus: '',
          product: '', // 产品名称
          deliveryStatus: ''
        },
        queryCondition: { // 查询条件
          orderNo: '',
          status: null,
          deliveryStatus: '',
          approvalStatus: null
        }
      }
    },
    methods: {
      // 获取数据
      getData () {
        if (this.tableDataLoading) return
        this.showSearch = false
        this.tableDataLoading = true
        console.log(this.queryCondition.status)
        let params = {
          orderNo_$_like: this.queryCondition.orderNo.trim() || undefined,
          status_$_eq: this.queryCondition.status || undefined,
          approvalStatus_$_eq: this.queryCondition.approvalStatus || undefined,
          deliveryStatus_$_eq: Number(this.queryCondition.deliveryStatus) || undefined
        }
        this.$http.post(this.getDataUrl + '?pageNo=' + this.pageNo + '&pageSize=' + this.pageSize, JSON.stringify(params)).then((res) => {
          this.pageNo = res.data.data.pageNo || 1
          this.pageCount = res.data.data.pageCount
          this.total = res.data.data.rowCount
          this.tableData = res.data.data.queryResult
          this.tableDataLoading = false
        }, () => {
          this.tableDataLoading = false
        })
      },
      // 选择页码
      pageChange (page) {
        this.pageNo = page
        this.getData()
      },
      // 跳转至详情
      go (el) {
        window.sessionStorage.setItem('orderDetail', JSON.stringify(el))
        this.$router.push('orderDetail?id=' + el.orderNo + '&opera=order')
      },
      // 格式化时间
      dateFormatter (date) {
        return dateFormat(date, 'YYYY-MM-DD HH:mm:ss')
      },
      // 查询窗口取消功能
      searchData () {
        // 恢复查询条件
        for (let item in this.currentQueryCondition) {
          this.queryCondition[item] = this.currentQueryCondition[item]
        }
        this.getData()
      },
      // 打开查询窗口
      openSearch () {
        // 恢复查询条件
        for (let item in this.queryCondition) {
          this.currentQueryCondition[item] = this.queryCondition[item]
        }
      },
      // 清空查询条件
      initQueryCondition () {
        this.currentQueryCondition = { // 查询条件
          orderNo: '',
          approvalStatus: '',
          status: '',
          product: '',
          deliveryStatus: ''
        }
      }
    },
    created () {
      this.getData()
    }
  }
</script>

<style lang='less'>
.listA {
  padding: 10px;
  border-bottom: 1px solid #EDEDED;
}
.sub-item{
  float: right;
  padding-left: 6px;
  height: 20px;
  .elseFont;
}
.title{
  color: #000;
  line-height: 30px;
}
.elseFont {
  font-size: 13px;
}
.nameStyle {
  width: 220px;
  line-height: 30px;
  color: #999999;
  .elseFont;
}
.amount{
  float: right;
  .elseFont;
}
</style>
