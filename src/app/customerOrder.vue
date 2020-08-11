<template>
  <div>
    <group :title="title">
      <!-- <cell v-for="el in tableData" :title="el.orderNo" :key="el.orderNo" :link="'orderDetail?id=' + el.orderNo" :inline-desc="el.purCompanyName"></cell> -->
      <template v-for="(el, i) in tableData">
        <cell :arrow-direction="cur===i ? 'up' : 'down'" @click.native="cur = cur === i ? -1 : i" :title="el.orderNo" :border-intent="false" :key="el.orderNo" is-link :inline-desc="el.purCompanyName">
        <span class="cellLink" @click="go(el)">查看</span>
        </cell>
        <template v-if="cur===i">
          <cell-box v-for="k in defaultCols" :key="k.prop" :border-intent="false" class="sub-item">
            <span v-if="k.prop === 'approvalStatus'">{{k.label}}: {{approvalStatusMap[el[k.prop]]}}</span>
            <span v-else-if="k.prop === 'status'">{{k.label}}: {{statusMap[el[k.prop]]}}</span>
            <span v-else-if="k.prop === 'deliveryStatus'">{{k.label}}: {{deliveryStatusMap[el[k.prop]]}}</span>
            <span v-else>{{k.label}}: {{el[k.prop]}}</span>
          </cell-box>
        </template>
      </template>
    </group>
    <div class="page" v-if="tableData && tableData.length > 0">
      <pagination :page-index="pageNo" :page-size="pageSize" :total="total" @change="pageChange"></pagination>
    </div>
  </div>
</template>

<script>
  import { Group, Cell, CellBox } from 'vux'
  import pagination from '../components/pagination.vue'

  export default {
    components: {
      Group,
      Cell,
      CellBox,
      pagination
    },
    data () {
      return {
        title: '业务订单',
        cur: -1,
        tableDataLoading: false,
        getDataUrl: window.ELS.api + '/order/service/findByPageForDealer',
        pageNo: 1,
        pageSize: 10,
        total: 1,
        tableData: [],
        defaultCols: [  // 列自定义
          // {label: '订单编号', prop: 'orderNo', show: true, fixed: true, width: 160},
          // {label: '经销商名称', prop: 'purCompanyName', show: true, fixed: true, width: 210},
          {label: '收货人', prop: 'addressReveiver', show: true, fixed: false, width: 80},
          {label: '数量', prop: 'nums', show: true, fixed: false, width: 70},
          {label: '金额', prop: 'amountTotal', show: true, fixed: false, width: 70},
          {label: '状态', prop: 'status', show: true, fixed: false, width: 80},
          {label: '审批状态', prop: 'approvalStatus', show: true, fixed: false, width: 110},
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
        queryCondition: { // 查询条件
          orderNo: '',
          status: null,
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
        this.$router.push('orderDetail?id=' + el.orderNo + '&opera=order&user=customer')
      }
    },
    created () {
      this.getData()
    }
  }
</script>

<style>
.cellLink{margin-right:5px; color:green;}
</style>
