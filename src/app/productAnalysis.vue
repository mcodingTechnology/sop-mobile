<template>
  <div>
    <group-title>产品分析</group-title>
    <tab>
      <tab-item>各个分类月度趋势图</tab-item>
    </tab>
    <div style="margin-top:20px">
      <div :id='gylLineId' :style="stylesLine"></div>  
    </div>
    <tab>
      <tab-item>各个分类占比分析饼图</tab-item>
    </tab>
      <div :id="gylPieId" :style="stylesPie"></div>
    </div>
</template>

<script>
  import { Group, CellFormPreview, Cell, GroupTitle, Tab, TabItem } from 'vux'
  export default {
    components: {Group, CellFormPreview, Cell, GroupTitle, Tab, TabItem},
    data () {
      return {
        id: 'mychart',
        chartOptions: {},
        stylesLine: {
          width: '350px',
          height: '275px',
          'margin-top': '-15px'
        },
        stylesPie: {
          width: '350px',
          height: '270px',
          'margin-top': '-10px'
        },
        gylLineId: 'gylLineId',
        gylPieId: 'gylPieId',
        fzjLineId: 'fzjLineId',
        fzjPieId: 'fzjPieId',
        wlPieId: 'wlPieId',
        wlLineId: 'wlLineId',
        chartDataUrl: window.ELS.api + '/orderStatisticAnalysis/service/queryProductChartData',
        lineGYLLegendList: [],
        lineGYLSeriesList: [],
        lineXAxisList: [],
        pieGYLLegendList: [],
        pieGYLSeriesList: [],
        pieFZJLegendList: [],
        pieFZJSeriesList: [],
        lineFZJLegendList: [],
        lineFZJSeriesList: [],
        pieWLLegendList: [],
        pieWLSeriesList: [],
        lineWLLegendList: [],
        lineWLSeriesList: [],
        showSearch: false,
        currentQueryCondition: {
          startTime: '',
          endTime: ''
        },
        queryCondition: {
          startTime: '',
          endTime: ''
        }
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
      getChartData () {
        this.$http.post(this.chartDataUrl + '?startDate=' + this.queryCondition.startTime + '&endDate=' + this.queryCondition.endTime).then((res) => {
          console.log(res)
          this.lineGYLLegendList = res.data.data.lineGYLLegendList
          this.lineGYLSeriesList = this.getlineGYLSeriesList(res.data.data.lineGYLSeriesList)
          this.lineXAxisList = res.data.data.lineXAxisList
          this.pieGYLLegendList = res.data.data.pieGYLLegendList
          this.pieGYLSeriesList = this.getpieGYLSeriesList(res.data.data.pieGYLSeriesList)

          this.setGYLlineChart()
          this.setGYLPieChart()
        }, () => {
          console.log('查询图表数据出错')
        })
      },
      searchData () {
        // 恢复查询条件
        for (let item in this.currentQueryCondition) {
          this.queryCondition[item] = this.currentQueryCondition[item]
        }
        this.getChartData()
        // / this.setChart()
      },
      setGYLlineChart () {
        let mychart = this.$echarts.init(document.getElementById(this.gylLineId))
        this.options = {
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: this.lineGYLLegendList,
            top: '10px',
            type: 'scroll',
            left: '5%'
          },
          toolbox: {
            show: false,
            feature: {
              magicType: {type: ['line', 'bar']}
            },
            top: '30px',
            right: '50px'
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.lineXAxisList
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: '{value}'
            }
          },
          series: this.lineGYLSeriesList
        }
        mychart.setOption(this.options)
      },
      setGYLPieChart () {
        let mychart = this.$echarts.init(document.getElementById(this.gylPieId))
        this.options = {
          tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            x: 'left',
            data: this.pieGYLLegendList,
            top: '20px',
            type: 'scroll'
          },
          series: [
            {
              type: 'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: '15',
                    fontWeight: 'bold'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: this.pieGYLSeriesList
            }
          ]
        }
        mychart.setOption(this.options)
      },
      setFZJlineChart () {
        let mychart = this.echarts.init(document.getElementById(this.fzjLineId))
        this.options = {
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: this.lineFZJLegendList,
            top: '10px',
            type: 'scroll',
            left: '5%'
          },
          toolbox: {
            show: false,
            feature: {
              magicType: {type: ['line', 'bar']}
            },
            top: '30px',
            right: '50px'
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.lineXAxisList
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: '{value}'
            }
          },
          series: this.lineFZJSeriesList
        }
        mychart.setOption(this.options)
      },
      setFZJPieChart () {
        let mychart = this.echarts.init(document.getElementById(this.fzjPieId))
        this.options = {
          tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            x: 'left',
            data: this.pieFZJLegendList,
            top: '20px',
            type: 'scroll'
          },
          series: [
            {
              type: 'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: '15',
                    fontWeight: 'bold'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: this.pieFZJSeriesList
            }
          ]
        }
        mychart.setOption(this.options)
      },
      setWLlineChart () {
        let mychart = this.echarts.init(document.getElementById(this.wlLineId))
        this.options = {
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: this.lineWLLegendList,
            top: '10px',
            type: 'scroll',
            left: '5%'
          },
          toolbox: {
            show: false,
            feature: {
              magicType: {type: ['line', 'bar']}
            },
            top: '30px',
            right: '50px'
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.lineXAxisList
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: '{value}'
            }
          },
          series: this.lineWLSeriesList
        }
        mychart.setOption(this.options)
      },
      setWLPieChart () {
        let mychart = this.echarts.init(document.getElementById(this.wlPieId))
        this.options = {
          tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            x: 'left',
            data: this.pieWLLegendList,
            top: '20px',
            type: 'scroll'
          },
          series: [
            {
              type: 'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: '15',
                    fontWeight: 'bold'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: this.pieWLSeriesList
            }
          ]
        }
        mychart.setOption(this.options)
      },
      getlineGYLSeriesList (lineGYLSeriesList) {
        let arr = []
        lineGYLSeriesList.forEach((item, index) => {
          let seriesparam = {
            name: lineGYLSeriesList[index].categoryName,
            type: 'line',
            data: lineGYLSeriesList[index].seriesDataList,
            itemStyle: {
              normal: {
                label: {
                  show: false
                }
              }
            }
          }
          arr.push(seriesparam)
        })
        return arr
      },
      getpieGYLSeriesList (pieGYLSeriesList) {
        let arr = []
        pieGYLSeriesList.forEach((item, index) => {
          let seriesparam = {
            value: pieGYLSeriesList[index].nums,
            name: pieGYLSeriesList[index].categoryName
          }
          arr.push(seriesparam)
        })
        return arr
      }
    },
    created () {
      this.login()
      this.wx()
    },
    mounted () {
      this.getChartData()
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