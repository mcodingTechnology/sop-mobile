<template>
  <div>
    <group-title>报表分析</group-title>
    <grid :cols="3" class="formColor">
      <grid-item link="/businessAnalysis" class="faColor">
        <i slot="icon" class="fa fa-shopping-cart fa-lg"></i>
        <span slot="label">经营分析</span>
      </grid-item>
      <grid-item link="/productAnalysis" class="faColor">
        <i slot="icon" class="fa fa-undo fa-lg"></i>
        <span slot="label">产品分析</span>
      </grid-item>
      <grid-item link="/operatingStatement"class="faColor">
        <i slot="icon" class="fa fa-search fa-lg"></i>
        <span slot="label">经营报表</span>
      </grid-item>
      </grid>
      <group-title>排名分析</group-title>
      <grid :cols="4" class="formColor">
        <grid-item link="/dealerRanking" class="faColor">
          <i slot="icon" class="fa fa-shopping-cart fa-lg"></i>
          <span slot="label">经销商排名</span>
        </grid-item>
        <grid-item link="/productRanking" class="faColor">
          <i slot="icon" class="fa fa-undo fa-lg"></i>
          <span slot="label">产品排名</span>
        </grid-item>
        <grid-item link="/areaStatistics" class="faColor">
          <i slot="icon" class="fa fa-search fa-lg"></i>
          <span slot="label">区域统计</span>
        </grid-item>
        <grid-item link="/bigAreaRanking" class="faColor">
          <i slot="icon" class="fa fa-search fa-lg"></i>
          <span slot="label">大区排名</span>
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
