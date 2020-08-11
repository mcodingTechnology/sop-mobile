<template>
  <div>
    <group :title="title">
      <!-- <cell v-for="el in tableData" :title="el.orderNo" :key="el.orderNo" :link="'orderDetail?id=' + el.orderNo" :inline-desc="el.purCompanyName"></cell> -->
      <template v-for="(el, i) in tableData">
        <cell :arrow-direction="cur===i ? 'up' : 'down'" @click.native="cur = cur === i ? -1 : i" :title="el.orderReturnNo" :border-intent="false" :key="el.orderReturnNo" is-link :inline-desc="el.purCompanyName">
        <span class="cellLink" @click="go(el)">查看</span>
        </cell>
        <template v-if="cur===i">
          <cell-box v-for="k in defaultCols" :key="k.prop" :border-intent="false" class="sub-item">
            <span v-if="k.prop === 'approvalStatus'">{{k.label}}: {{approvalStatusMap[el[k.prop]]}}</span>
            <span v-else-if="k.prop === 'orderReturnStatus'">{{k.label}}: {{orderReturnStatusMap[el[k.prop]]}}</span>
            <span v-else-if="k.prop === 'deliveryStatus'">{{k.label}}: {{deliveryStatusMap[el[k.prop]]}}</span>
            <span v-else-if="k.prop === 'createTime'">{{k.label}}: {{dateFormatter(el[k.prop])}}</span>
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
  import { Group, Cell, CellBox, dateFormat } from 'vux'
  import pagination from '../components/pagination.vue'

  export default {
    components: {
      Group,
      Cell,
      CellBox,
      pagination,
      dateFormat
    },
    data () {
      return {
        title: '业务退货',
        cur: -1,
        tableDataLoading: false,
        getDataUrl: window.ELS.api + '/orderReturn/service/findByPageForDealer',
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
          {label: '状态', prop: 'orderReturnStatus', show: true, fixed: false, width: 80},
          {label: '审批状态', prop: 'approvalStatus', show: true, fixed: false, width: 110},
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
        let params = {
          orderNo_$_like: this.queryCondition.orderReturnNo.trim() || undefined,
          status_$_eq: this.queryCondition.orderReturnStatus || undefined,
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
        this.$router.push('orderDetail?id=' + el.orderReturnNo + '&opera=myReturn&user=customer')
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
