<template>
  <div>
    <group-title>经营分析</group-title>
    <group>
      <cell :title="('应收')" :value="tableData.totalPayAmount"></cell>
      <cell-form-preview :list="list"></cell-form-preview>
    </group>
    <tab>
      <tab-item>月度销售收入条状图</tab-item>
    </tab>
    <div style="margin-top:-20px">
      <div :id='monthbarId' :style="{width: '350px', height: '300px'}"></div>  
      </div>
      <tab>
      <tab-item>区域省销售收入</tab-item>
      </tab>
      <div>
      <group>
        <radio :options="date" @on-change="selectVal" v-model="queryDate"></radio>
      </group>
      </div>
      <div :id='id' v-model="queryDate" @change="selectVal" :style="styles"></div>
    </div>
  </div>
</template>

<script>
  import { Group, CellFormPreview, Cell, GroupTitle, Tab, TabItem, Radio } from 'vux'
  export default {
    components: {Group, CellFormPreview, Cell, GroupTitle, Tab, TabItem, Radio},
    data () {
      return {
        title: '我的',
        tableData: [],
        list: [],
        styles: {
          width: '350px',
          height: '300px'
        },
        btnAuth: {
          index_monthSalesStripFigure: false,
          index_monthSalesTrendChart: false
        },
        monthbarId: 'monthbarId',
        monthBarXAxisData: [],
        monthBarYAxisData: [],
        show2: true,
        totalPayAmount: '0',
        notPayAmount: '0',
        payAmount: '0',
        queryDate: '1',
        date: [ '本周', '本月', '本季度' ],
        legendData: [],
        yAxisData: [],
        seriesData: [],
        radio: '1',
        id: 'mychart',
        chartMonthDataUrl: window.ELS.api + '/orderStatisticAnalysis/service/queryMonthChartData',
        payDataUrl: window.ELS.api + '/orderStatisticAnalysis/service/queryPayAmountData',
        chartDataUrl: window.ELS.api + '/orderStatisticAnalysis/service/queryChartData'
      }
    },
    methods: {
      login () {
        this.$http.post(window.ELS.api + '/user/service/findCurrentUser').then(res => {
          console.log(res)
        })
      },
      wx () {
        this.$http.get(window.ELS.api + '/wechatOauth/front/createOauthUrlForOpenid?originId=gh_acf7aa5995b7&url=' + 'http://sop.whrunhe.com/wxui/#/').then(res => {
          console.log(res)
        })
      },
      // 获取数据
      getData () {
        if (this.tableDataLoading) return
        this.showSearch = false
        this.tableDataLoading = true
        this.$http.post(this.payDataUrl).then((res) => {
          this.tableData = res.data.data
          this.list = [{
            label: '实收',
            value: res.data.data.payAmount
          },
          {
            label: '未收',
            value: res.data.data.notPayAmount
          }]
          this.tableDataLoading = false
        })
      },
      getSeriesData (statisticAnalysisList) {
        let arr = []
        statisticAnalysisList.forEach((item, index) => {
          let seriesparam = {
            name: statisticAnalysisList[index].categoryName,
            type: 'bar',
            stack: statisticAnalysisList[index].stack,
            barWidth: 18,
            data: statisticAnalysisList[index].provinceDataList
          }
          arr.push(seriesparam)
        })
        return arr
      },
      selectVal () {
        this.setChart()
      },
      setChart () {
        this.$http.post(this.chartDataUrl + '?queryDate=' + this.queryDate).then((res) => {
          console.log(res)
          this.legendData = res.data.data.categoryList
          this.yAxisData = res.data.data.provinceList
          this.seriesData = this.getSeriesData(res.data.data.statisticAnalysisList)
          let mychart = this.$echarts.init(document.getElementById(this.id))
          this.styles.height = 110 * res.data.data.provinceList.length + 'px'
          this.options = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            legend: {
              type: 'scroll',
              left: '5%',
              data: this.legendData
            },
            grid: {
              left: '0%',
              right: '0%',
              bottom: '2%',
              containLabel: true
            },
            xAxis: {
              type: 'value',
              position: 'top'
            },
            yAxis: {
              type: 'category',
              data: this.yAxisData
            },
            series: this.seriesData
          }
          console.log(this.options)
          mychart.setOption(this.options)
          mychart.resize({height: 105 * this.yAxisData.length})
        }, () => {
          console.log('查询图表数据出错')
        })
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
    },
    created () {
      this.login()
      this.setMonthBarChart()
      this.getData()
      this.wx()
    },
    mounted () {
      this.setChart()
      this.setMonthBarChart()
    }
  }
</script>

<style>
.vux-demo {
  text-align: center;
  background-color: #515151;
  color: #FFFAFA;
  height: 45px;
  line-height: 45px;
}
.center1 {
/*    text-align: center;*/
    padding: 20px;
    color: #fff;
    font-size: 18px;
  }
.center1 img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 4px solid #ececec;
    float: left;
  }

.center2{
  float: left;
  margin-left: 30px;
  margin-top: 15px;
}
</style>