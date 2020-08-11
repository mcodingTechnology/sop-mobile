<template>
  <div>
    <group :title="title">
      <x-button @click.native="showSearch=true"><i class="fa fa-search"></i>查询</x-button>
      <x-dialog v-model="showSearch" class="" hide-on-blur>
        <div style="padding:15px;">
          <x-input title="退订单编号" v-model="currentQueryCondition.orderReturnNo"></x-input>
          <selector v-model="currentQueryCondition.orderReturnStatus" :options="orderReturnStatusList" title="订单状态"></selector>
          <selector v-model="currentQueryCondition.approvalStatus" :options="approvalStatusList" title="审批状态"></selector>
          <x-button @click.native="searchData()" type="primary">查询</x-button>
          <x-button @click.native="showSearch=false" type="primary">取消</x-button>
          <x-button @click.native="initQueryCondition" type="primary">清空</x-button>
        </div>
      </x-dialog>
      <template v-for="(el, i) in tableData">
          <div @click="go(el)" class="listA">
            <flexbox style="float: left" wrap="wrap">
              <flexbox-item><div class="flex-demo title">{{el.orderReturnNo}}
              </div></flexbox-item>
              <flexbox-item><div class="flex-demo sub-item">
          <div v-for="k in defaultCols" :key="k.prop" :border-intent="false" class="sub-item" primary="content">
            <span v-if="k.prop === 'approvalStatus'" :style="el[k.prop] === 200 ? {color: '#5CACEE'} : {color: 'red'}">{{approvalStatusMap[el[k.prop]]}}</span>
            <span v-else-if="k.prop === 'orderReturnStatus'" :style="el[k.prop] === 4 ? {color: '#5CACEE'} : {color: 'red'}">{{orderReturnStatusMap[el[k.prop]]}}</span>
          </div>
            </div></flexbox-item>
          </flexbox>
          <flexbox wrap="wrap">
            <flexbox-item><div class="flex-demo elseFont">{{el.purCompanyName}}
            </div></flexbox-item><flexbox-item><div class="flex-demo timeStyle">{{dateFormat(tableData[0].createTime)}}</div></flexbox-item>
          </flexbox>
        </div>
        <!-- <cell v-for="el in tableData" :title="el.orderNo" :key="el.orderNo" :link="'myReturnDetail?id=' + el.orderNo" :inline-desc="el.purCompanyName"></cell> -->
<!--         <template v-if="cur===i">
          <cell-box v-for="k in defaultCols" :key="k.prop" :border-intent="false" class="sub-item">
            <span v-if="k.prop === 'approvalStatus'">{{k.label}}: {{approvalStatusMap[el[k.prop]]}}</span>
            <span v-else-if="k.prop === 'orderReturnStatus'">{{k.label}}: {{orderReturnStatusMap[el[k.prop]]}}</span>
            <span v-else-if="k.prop === 'deliveryStatus'">{{k.label}}: {{deliveryStatusMap[el[k.prop]]}}</span>
            <span v-else-if="k.prop === 'createTime'">{{k.label}}: {{dateFormatter(el[k.prop])}}</span>
            <span v-else>{{k.label}}: {{el[k.prop]}}</span>
          </cell-box>
        </template> -->
      </template>
    </group>
    <div class="page" v-if="tableData && tableData.length > 0">
      <pagination :page-index="pageNo" :page-size="pageSize" :total="total" @change="pageChange"></pagination>
    </div>
  </div>
</template>

<script>
  import { Group, Cell, CellBox, dateFormat, FlexboxItem, Flexbox, XInput, XButton, XDialog, Selector } from 'vux'
  import pagination from '../components/pagination.vue'

  export default {
    components: {
      Group,
      Cell,
      CellBox,
      pagination,
      dateFormat,
      FlexboxItem,
      XInput,
      XButton,
      XDialog,
      Selector,
      Flexbox
    },
    data () {
      return {
        title: '我的退货',
        cur: -1,
        showSearch: false,
        tableDataLoading: false,
        getDataUrl: window.ELS.api + '/orderReturn/service/findByPage',
        pageNo: 1,
        pageSize: 10,
        total: 1,
        tableData: [],
        defaultCols: [  // 列自定义
          {label: '订单编号', prop: 'orderReturnNo', show: true, fixed: true, width: 160},
          // {label: '经销商名称', prop: 'purCompanyName', show: true, fixed: true, width: 210},
          // {label: '收货人', prop: 'addressReveiver', show: true, fixed: false, width: 80},
          // {label: '数量', prop: 'nums', show: true, fixed: false, width: 70},
          // {label: '金额', prop: 'amountTotal', show: true, fixed: false, width: 70},
          {label: '审批状态', prop: 'approvalStatus', show: true, fixed: false, width: 110},
          {label: '状态', prop: 'orderReturnStatus', show: true, fixed: false, width: 80},
          // {label: '发货状态', prop: 'deliveryStatus', show: true, fixed: false, width: 110},
          {label: '创建时间', prop: 'createTime', show: true, fixed: false, width: 110, formatter: true}
        ],
        orderReturnStatusMap: {
          0: '待提交',
          1: '待审核',
          2: '待发货',
          3: '待收货',
          4: '已完成',
          5: '已取消'
        },
        approvalStatusMap: {
          100: '待审批',
          200: '审批通过',
          300: '审批不通过'
        },
        deliveryStatusMap: { // 发货状态
          300: '待发货',
          400: '待收货',
          500: '已完成'
        },
        orderReturnStatusList: [
          {key: 0, value: ('待提交')},
          {key: 1, value: ('待审批')},
          {key: 2, value: ('待发货')},
          {key: 3, value: ('待收货')},
          {key: 4, value: ('已完成')},
          {key: 5, value: ('已取消')}
        ],
        approvalStatusList: [
          {key: 100, value: ('待审批')},
          {key: 200, value: ('审批通过')},
          {key: 300, value: ('审批不通过')}
        ],
        currentQueryCondition: {
          orderReturnNo: '',
          orderReturnStatus: '',
          approvalStatus: ''
        },
        queryCondition: { // 查询条件
          orderReturnNo: '',
          orderReturnStatus: '',
          approvalStatus: null
        }
      }
    },
    methods: {
      dateFormat: function (str, column) {
        return dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')
      },
      // 获取数据
      getData () {
        if (this.tableDataLoading) return
        this.showSearch = false
        this.tableDataLoading = true
        let params = {
          orderReturnNo_$_like: this.queryCondition.orderReturnNo.trim() || undefined,
          orderReturnStatus_$_eq: this.queryCondition.orderReturnStatus || undefined,
          approvalStatus_$_eq: this.queryCondition.approvalStatus || undefined
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
          orderReturnNo: '',
          approvalStatus: '',
          orderReturnStatus: ''
        }
      }
    },
    created () {
      this.getData()
    }
  }
</script>

<style>
.listA {
  padding: 10px;
  border-bottom: 1px solid #EDEDED;
}
.sub-item{
  font-size: 13px;
  float:right;
  padding-left: 6px;
  height: 20px; 
}
.elseFont {
  font-size: 13px;
  line-height: 30px;
}
.title{
  color: #000;
}
.timeStyle {
  float: right;
  line-height: 30px;
  color: #999999;
  font-size: 13px;
}
</style>
