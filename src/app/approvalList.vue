<template>
  <div>
    <group :title="title">
      <!-- <cell v-for="el in tableData" :title="el.orderNo" :key="el.orderNo" :link="'approvalDetail?id=' + el.orderNo" :inline-desc="el.purCompanyName"></cell> -->
      <template v-for="(el, i) in tableData">
        <cell :title="el.businessKey" :border-intent="false" :key="el.businessKey" is-link :inline-desc="el.companyName">
        <span class="cellLink" @click="go(el)">查看</span>
        </cell>
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
  import { Group, Cell, CellBox, dateFormat, FlexboxItem, Flexbox } from 'vux'
  import pagination from '../components/pagination.vue'

  export default {
    components: {
      Group,
      Cell,
      CellBox,
      pagination,
      dateFormat,
      FlexboxItem,
      Flexbox
    },
    data () {
      return {
        title: '待办事项',
        cur: -1,
        tableDataLoading: false,
        getDataUrl: window.ELS.api + '/dataQuery/service/findTodoTask',
        getReturnUrl: window.ELS.api + '/orderReturn/service/findByPage',
        getOrderUrl: window.ELS.api + '/order/service/findByPage',
        pageNo: 1,
        pageSize: 10,
        total: 1,
        tableData: [],
        queryCondition: { // 查询条件
          orderReturnNo: '',
          orderReturnStatus: null,
          approvalStatus: null
        }
      }
    },
    methods: {
      // 日期格式化
      dateFormatter (date) {
        return dateFormat(date, 'YYYY-MM-DD')
      },
      // 获取数据
      getData () {
        if (this.tableDataLoading) return
        this.showSearch = false
        this.tableDataLoading = true
        this.$http.post(this.getDataUrl + '?pageNo=' + this.pageNo + '&pageSize=' + this.pageSize).then((res) => {
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
        if (el.processDefinitionKey === 'order_approve_process') {
          this.$http.post(this.getOrderUrl, {orderNo_$_like: el.businessKey}).then(res => {
            window.sessionStorage.setItem('orderDetail', JSON.stringify(res.data.data.queryResult[0]))
            this.$router.push('orderDetail?id=' + el.orderNo + '&opera=order' + '&type=approval&taskId=' + el.taskId)
          })
        } else if (el.processDefinitionKey === 'order_return_approve_process') {
          this.$http.post(this.getReturnUrl, {orderReturnNo_$_like: el.businessKey}).then(res => {
            window.sessionStorage.setItem('orderDetail', JSON.stringify(res.data.data.queryResult[0]))
            this.$router.push('orderDetail?id=' + el.orderReturnNo + '&opera=myReturn' + '&type=approval&taskId=' + el.taskId)
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
      }
    },
    created () {
      var row = JSON.parse(window.sessionStorage.getItem('approvalDetail')) || ''
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
      this.getData()
      this.getUser(row)
    }

  }
</script>

<style>
.cellLink{margin-right:5px; color:green;}
</style>
