<template>
  <div>
    <grid class="formBorder">
      <grid-item link="/approvalList" class="faColor">
        <i slot="icon" class="fa fa-calendar-check-o fa-lg" >
        </i>
        <span slot="label">待办事项</span>
      </grid-item>
      <grid-item link="/orderManage" class="faColor">
        <i slot="icon" class="fa fa-list-alt fa-lg"></i>
        <span slot="label">我的订单</span>
      </grid-item>
      <grid-item link="/myReturn" class="faColor">
        <i slot="icon" class="fa fa-undo fa-lg"></i>
        <span slot="label">我的退货单</span>
      </grid-item>
      <grid-item link="/statistics" class="faColor">
        <i slot="icon" class="fa fa-bar-chart fa-lg"></i>
        <span slot="label">统计分析</span>
      </grid-item>
      </grid>
      <group title="待办事项" >
      <card>
            <div slot="content" class="card-demo-flex card-demo-content01 formBorder">
              <div class="vux-1px-r">
                待审批 
                <br/>
                <span>{{tableData.iTotalDisplayRecords}}</span>
              </div>
              <div class="vux-1px-r">
                已审批
                <br/>
                <span>0</span>
              </div>
              <div class="vux-1px-r">
                已拒绝
                <br/>
                <span>0</span>
              </div>
            </div>
      </card>
      </group>
      <tab>
        <tab-item @on-item-click="onItemClick">月度销售收入条状图</tab-item>
      </tab>
      <div style="margin-top:-20px">
        <div :id='monthbarId' :style="{width: '350px', height: '300px'}"></div>
      </div>

  </div>
</template>

<script>
import { Group, Cell, Grid, GridItem, Badge, Card, Tab, TabItem } from 'vux'

export default {
  components: {
    Group,
    Cell,
    Grid,
    GridItem,
    Badge,
    Card,
    Tab,
    TabItem
  },
  name: 'hello',
  data () {
    return {
      title: '工作台',
      cur: -1,
      tableDataLoading: false,
      menu: [],
      tableData: [],
      pageNo: 1,
      pageSize: 10,
      btnAuth: {
        index_monthSalesStripFigure: false,
        index_monthSalesTrendChart: false
      },
      monthbarId: 'monthbarId',
      monthlineId: 'monthlineId',
      monthBarXAxisData: [],
      monthBarYAxisData: [],
      monthLineXAxisData: [],
      monthLineYAxisData: [],
      stylesMonth: {
        width: '600px',
        height: '250px',
        'margin-top': '-40px'
      },
      msg: 'Welcome to Your Vue.js App',
      chartMonthDataUrl: window.ELS.api + '/orderStatisticAnalysis/service/queryMonthChartData',
      getDataUrl: window.ELS.api + '/dataQuery/service/findTodoTask'
    }
  },
  methods: {
    // login () {
    //   this.$http.post(window.ELS.api + '/loginForSpringSecurity?username=liee&password=123456').then(res => {
    //     console.log(res)
    //   })
    // },
    wx () {
      this.$http.get(window.ELS.api + '/wechatOauth/front/createOauthUrlForOpenid?originId=gh_acf7aa5995b7&url=' + 'http://sop.whrunhe.com/wxui/#/').then(res => {
        console.log(res)
      })
    },
    // 获取数据
    // getData () {
    //   if (this.tableDataLoading) return
    //   this.showSearch = false
    //   this.tableDataLoading = true
    //   let params = {
    //     orderNo_$_like: this.queryCondition.orderReturnNo.trim() || undefined,
    //     status_$_eq: this.queryCondition.orderReturnStatus || undefined,
    //     approvalStatus_$_eq: this.queryCondition.approvalStatus || undefined
    //   }
    //   // roderno改orderReturnNo，status改orderReturnStatus
    //   this.$http.post(this.getDataUrl + '?pageNo=' + this.pageNo + '&pageSize=' + this.pageSize, JSON.stringify(params)).then((res) => {
    //     this.pageNo = res.data.data.pageNo || 1
    //     this.pageCount = res.data.data.pageCount
    //     this.total = res.data.data.rowCount
    //     this.tableData = res.data.data.queryResult
    //     this.tableDataLoading = false
    //   }, () => {
    //     this.tableDataLoading = false
    //   })
    // },
    // 获取数据
    getData () {
      if (this.tableDataLoading) return
      this.showSearch = false
      this.tableDataLoading = true
      this.$http.post(this.getDataUrl + '?pageNo=' + this.pageNo + '&pageSize=' + this.pageSize).then((res) => {
        this.pageNo = res.data.data.pageNo || 1
        this.pageCount = res.data.data.pageCount
        this.total = res.data.data.rowCount
        this.tableData = res.data.data
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
    onItemClick (index) {
      console.log('on item click:', index)
    },
    setMonthBarChart () {
      this.$http.post(this.chartMonthDataUrl).then((res) => {
        this.monthBarXAxisData = res.data.data.monthXAxisList
        this.monthBarYAxisData = res.data.data.monthYAxisList
        let mychart = this.$echarts.init(document.getElementById(this.monthbarId))
        this.monthOptions = {
          color: ['#3398DB'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          toolbox: {
            show: true,
            feature: {
              magicType: {
                type: ['line', 'bar']
              }
            },
            top: '30px',
            right: '30px'
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: this.monthBarXAxisData,
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '销售金额(元)',
              type: 'bar',
              barWidth: '60%',
              data: this.monthBarYAxisData
            }
          ]
        }
        console.log(this.monthOptions)
        mychart.setOption(this.monthOptions)
      }, () => {
        console.log('查询图表数据出错')
      })
    }
    // setMonthLineChart () {
    //   this.$http.post(this.chartMonthDataUrl).then((res) => {
    //     console.log(res)
    //     this.monthLineXAxisData = res.data.data.monthXAxisList
    //     this.monthLineYAxisData = res.data.data.monthYAxisList
    //     let mychart = this.$echarts.init(document.getElementById(this.monthlineId))
    //     this.monthOptions = {
    //       color: ['#3398DB'],
    //       tooltip: {
    //         trigger: 'axis',
    //         axisPointer: {            // 坐标轴指示器，坐标轴触发有效
    //           type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
    //         }
    //       },
    //       toolbox: {
    //         show: true,
    //         feature: {
    //           magicType: {
    //             type: ['line', 'bar']
    //           }
    //         },
    //         top: '30px',
    //         right: '30px'
    //       },
    //       grid: {
    //         left: '3%',
    //         right: '4%',
    //         bottom: '3%',
    //         containLabel: true
    //       },
    //       xAxis: [
    //         {
    //           type: 'category',
    //           data: this.monthLineXAxisData,
    //           axisTick: {
    //             alignWithLabel: false
    //           }
    //         }
    //       ],
    //       yAxis: [
    //         {
    //           type: 'value'
    //         }
    //       ],
    //       series: [
    //         {
    //           name: '销售金额(元)',
    //           type: 'line',
    //           barWidth: '60%',
    //           data: this.monthLineYAxisData
    //         }
    //       ]
    //     }
    //     console.log(this.monthOptions)
    //     mychart.setOption(this.monthOptions)
    //   }, () => {
    //     console.log('查询图表数据出错')
    //   })
    // }
  },
  // 获取按钮权限
  getBtnAuth () {
    this.$http.get(this.permissionsUrl).then(res => {
      var obj = this
      res.body.data.forEach(function (item) {
        if (item.menuCode === 'code_index1') {
          item.buttonList.forEach(function (item2) {
            obj.btnAuth[item2.btnCode] = item2.authorized
          })
        }
      })
      console.log(obj.btnAuth)
    })
  },
  created () {
    this.menu = window.menu
    // this.login()
    this.getData()
    this.wx()
  },
  mounted () {
    this.setMonthBarChart()
    // this.setMonthLineChart()
    // this.drawLine()
  }
}
</script>

<style lang='less'>
.vux-demo {
  text-align: center;
  background-color: #515151;
  color: #FFFAFA;
  height: 45px;
  line-height: 45px;
}
.logo {
  width: 100px;
  height: 100px
}
.card-demo-flex {
  display: flex;
}
.card-demo-content01 {
  padding: 10px 0;
}
.card-padding {
  padding: 15px;
}
.card-demo-flex > div {
  flex: 1;
  text-align: center;
  font-size: 15px;
}
.card-demo-flex span {
  color: #f74c31;
}
.formBorder {
  .weui-grid:before{
  border: none;
}
background-color: #F8F8FF;
}
.faColor {
  color: #36648B;
}
.badgeSite {
   .vux-badge {
  vertical-align: top !important;
  color: #F8F8FF;
}
}
.fa-lg {
  margin-left: 3px;
}
</style>
