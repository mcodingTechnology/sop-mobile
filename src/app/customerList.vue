<template>
  <div>
    <group-title>业务管理</group-title>
    <grid :cols="4" class="formColor">
      <grid-item link="/orderManage" class="faColor">
        <i slot="icon" class="fa fa-shopping-cart fa-lg"></i>
        <span slot="label">我的订单</span>
      </grid-item>
      <grid-item link="/myReturn" class="faColor">
        <i slot="icon" class="fa fa-undo fa-lg"></i>
        <span slot="label">我的退货单</span>
      </grid-item>
      <grid-item class="faColor">
        <i slot="icon" class="fa fa-search fa-lg"></i>
        <span slot="label">价格查询</span>
      </grid-item>
      <grid-item class="faColor">
        <i slot="icon" class="fa fa-handshake-o fa-lg"></i>
        <span slot="label">市场支持</span>
      </grid-item>
      </grid>
      <group-title>统计分析</group-title>
    <grid class="formColor">
      <grid-item class="faColor">
        <i slot="icon" class="fa fa-line-chart fa-lg"></i>
        <span slot="label">经营业绩</span>
      </grid-item>
      <grid-item class="faColor">
        <i slot="icon" class="fa fa-bar-chart fa-lg"></i>
        <span slot="label">产品业绩</span>
      </grid-item>
      <grid-item class="faColor">
        <i slot="icon" class="fa fa-pie-chart fa-lg"></i>
        <span slot="label">区域业绩</span>
      </grid-item>
    </grid>
      <group-title>库存管理</group-title>
      <grid class="formColor">
        <grid-item class="faColor">
          <i slot="icon" class="fa fa-search-plus fa-lg"></i>
          <span slot="label">库存查询</span>
        </grid-item>
        <grid-item class="faColor">
          <i slot="icon" class="fa fa-truck fa-lg"></i>
          <span slot="label">库存流水</span>
        </grid-item>
        <grid-item class="faColor">
          <i slot="icon" class="fa fa-stack-overflow fa-lg"></i>
          <span slot="label">盘点查询</span>
        </grid-item>
      </grid>
        <group-title>主数据</group-title>
        <grid :cols="4" class="formColor">
          <grid-item class="faColor">
            <i slot="icon" class="fa fa-shopping-basket fa-lg"></i>
            <span slot="label">产品信息</span>
        </grid-item>
          <grid-item class="faColor">
            <i slot="icon" class="fa fa-sitemap fa-lg"></i>
            <span slot="label">企业信息</span>
        </grid-item>
        <grid-item class="faColor">
            <i slot="icon" class="fa fa-pencil-square-o fa-lg"></i>
            <span slot="label">合同信息</span>
        </grid-item>
        <grid-item class="faColor">
            <i slot="icon" class="fa fa-address-card-o fa-lg"></i>
            <span slot="label">经销商信息</span>
        </grid-item>
        <grid-item class="faColor">
            <i slot="icon" class="fa fa-users fa-lg"></i>
            <span slot="label">组织采购</span>
        </grid-item>
        <grid-item class="faColor">
            <i slot="icon" class="fa fa-id-badge fa-lg"></i>
            <span slot="label">账号信息</span>
        </grid-item>
        <grid-item class="faColor">
            <i slot="icon" class="fa fa-cogs fa-lg"></i>
            <span slot="label">操作日记</span>
        </grid-item>
        <grid-item class="faColor">
            <i slot="icon" class="fa fa-linode fa-2x"></i>
            <span slot="label">仓库信息</span>
        </grid-item>
      </grid>
  </div>
</template>

<script>
import { Group, Cell, Grid, GridItem, Card, GroupTitle } from 'vux'

export default {
  components: {
    Group,
    Cell,
    Grid,
    GridItem,
    Card,
    GroupTitle
  },
  data () {
    return {
      title: '业务功能',
      cur: -1,
      tableDataLoading: false,
      menu: [],
      tableData: []
    }
  },
  methods: {
    login () {
      this.$http.post(window.ELS.api + '/user/service/findCurrentUser').then(res => {
        console.log(res)
      })
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
      // roderno改orderReturnNo，status改orderReturnStatus
      this.$http.post(this.getDataUrl + '?pageNo=' + this.pageNo + '&pageSize=' + this.pageSize, JSON.stringify(params)).then((res) => {
        this.pageNo = res.data.data.pageNo || 1
        this.pageCount = res.data.data.pageCount
        this.total = res.data.data.rowCount
        this.tableData = res.data.data.queryResult
        this.tableDataLoading = false
      }, () => {
        this.tableDataLoading = false
      })
    }
  },
  created () {
    this.menu = window.menu
    this.login()
  }
}
</script>

<style lang='less'>
.fa-lg {
  margin-left: 3px;
}
.vux-demo {
  text-align: center;
  background-color: #515151;
  color: #FFFAFA;
  height: 45px;
  line-height: 45px;
}
.formColor {
background-color: #F8F8FF;
}
// .formBorder {
//   clear: both;
//   .weui-grid:before {
//   border: none;
// }
//   .weui-grid {
//     padding-top: 35px;
//   }
// }
</style>
