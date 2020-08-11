<template>
  <div>
    <group-title>经销商排名</group-title>
    <div style="margin-top:20px">
      <x-table :cell-bordered="false" :content-bordered="false" style="background-color:#fff;">
        <thead>
          <tr style="background-color: #F7F7F7">
            <th>排名</th>
            <th>经销商名称</th>
            <th>订货数量</th>
            <th>金额汇总</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Apple</td>
            <td>$1.25</td>
            <td> x 1</td>
          </tr>
        </tbody>
      </x-table>
      </div>
    </div>
  </div>
</template>

<script>
  import { Group, CellFormPreview, Cell, GroupTitle, XTable } from 'vux'
  export default {
    components: {Group, CellFormPreview, Cell, GroupTitle, XTable},
    data () {
      return {
        initData: {},
        cols: [],
        defaultCols: [  // 列自定义
          {label: ('经销商名称'), prop: 'companyName', show: true, fixed: false, width: 280},
          {label: ('订货数量'), prop: 'totalNums', show: true, fixed: false, width: 180},
          {label: ('金额汇总'), prop: 'totalAmount', show: true, fixed: false, width: 180}
        ],
        pageNo: 1,
        pageSize: 10,
        tableHeight: null,
        rowCount: 0,
        options: [0, 1, 2],
        queryCondition: { // 查询条件
          warehouseName: '',
          warehouseCode: ''
        },
        tableDataLoading: false,
        showAddAndEdit: false,
        showSearch: false,
        currentQueryCondition: {
          warehouseCode: '',
          companyName: '',
          queryDate: '1',
          categoryId: '',
          province: '', // 省
          city: '', // 市
          district: '' // 区
        },
        tableData: [],
        getDataUrl: window.ELS.api + '/orderStatisticAnalysis/service/findDealerRankingByPage',
        id: 'mychart',
        chartOptions: {},
        styles: {
          width: '1200px',
          height: '300px'
        },
        chartDataUrl: window.ELS.api + '/orderStatisticAnalysis/service/queryChartData',
        getproductUrl: window.ELS.api + '/productCategory/service/findByPage', // 查询产品分类
        cityUrl: window.ELS.api + '/region/service/findByPage', // 获取城市
        legendData: [],
        yAxisData: [],
        seriesData: [],
        productsList: [],
        categoryIdMap: {},
        provincesList: [], // 省列表
        citysList: [], // 市列表
        districtsList: [] // 区列表
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
      changeCols (val) {
        this.cols = []
        this.$nextTick(() => {
          this.cols = val
        })
      },
      // 获取城市
      getCity (id, type, code) {
        let params = {
          parentId_$_eq: Number(id)
        }
        let data = []
        let dataMap = {}
        if (id !== '') {
          this.$http.post(this.cityUrl + '?pageNo=' + this.pageNo + '&pageSize=9999', JSON.stringify(params)).then(res => {
            res.data.data.queryResult.map(i => {
              data.push({value: i.id + '', label: i.regionName})
              dataMap[i.id] = i.regionName
            })
            if (type === 'provincesList') {
              this.provincesList = data
              // this.editData.city = ''
              // this.editData.district = ''
            } else if (type === 'citysList') {
              this.citysList = data
              this.currentQueryCondition.city = null
              this.currentQueryCondition.district = null
              // this.editData.city = code || ''
              // this.editData.district = ''
              // this.cityMap = dataMap
            } else if (type === 'districtsList') {
              this.districtsList = data
              this.currentQueryCondition.district = null
              // this.editData.district = code
            }
          })
        }
      },
      // 获取产品分类
      getproduct () {
        this.$http.get(this.getproductUrl + '?pageNo=' + this.pageNo + '&pageSize=9999').then((res) => {
          this.productsList = res.data.data.queryResult.map(i => {
            this.categoryIdMap[i.id] = i.categoryName
            return {value: i.id, label: i.categoryName}
          })
        })
      },
      // 获取数据
      getData () {
        if (this.tableDataLoading) return
        this.showSearch = false
        this.tableDataLoading = true
        console.log(this.currentQueryCondition.queryDate)
        let params = {
          queryDate_$_eq: this.currentQueryCondition.queryDate,
          province_$_eq: this.currentQueryCondition.province, // 省
          city_$_eq: this.currentQueryCondition.city, // 市
          district_$_eq: this.currentQueryCondition.district // 区
        }
        this.$http.post(this.getDataUrl + '?pageNo=' + this.pageNo + '&pageSize=' + this.pageSize, JSON.stringify(params)).then((res) => {
          this.pageNo = res.data.data.pageNo || 1
          this.pageCount = res.data.data.pageCount
          this.rowCount = res.data.data.rowCount
          this.tableData = res.data.data.queryResult
          this.tableDataLoading = false
        }, () => {
          this.tableDataLoading = false
        })
      },
      // 查询窗口取消功能
      searchData () {
        // 恢复查询条件
        for (let item in this.currentQueryCondition) {
          this.queryCondition[item] = this.currentQueryCondition[item]
        }
        this.getData()
        // / this.setChart()
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
          warehouseName: '',
          warehouseCode: '',
          queryDate: '1',
          categoryId: '',
          province: '', // 省
          city: '', // 市
          district: '' // 区
        }
      },
      // 勾选数据
      handleSelectionChange (selection) {
        this.selectionData = selection
      },
       // 点击行数据打勾或者消勾
      selectRowAction (row, event, column) {
        this.$refs.tableDataOne.toggleRowSelection(row)
      },
      // 勾选数据行
      selectRowData (selection, data) {
        if (selection) {
          this.selectionData = JSON.parse(JSON.stringify(selection))
        } else {
          this.selectionData = {}
        }
      },
      handleSizeChange (val) {
        this.pageSize = val
        this.getData()
      },
      currentPageChange (val) {
        this.pageNo = val
        this.getData()
      },
      // formatDate: function (row, column) {
      //   return formatDate(row[column.property], 'yyyy-MM-dd')
      // },
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
      setChart () {
        this.$http.post(this.chartDataUrl).then((res) => {
          console.log(res)
          this.legendData = res.data.data.categoryList
          this.yAxisData = res.data.data.provinceList
          this.seriesData = this.getSeriesData(res.data.data.statisticAnalysisList)
          let mychart = this.echarts.init(document.getElementById(this.id))
          this.styles.height = 105 * res.data.data.provinceList.length + 'px'
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
              left: '3%',
              right: '4%',
              bottom: '5%',
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
      }
    },
    watch: {
      $route (to, from) {
        if (to.path === '/accountInfoManage' && !this.$parent.keep) {
          for (let item in this.initData) {
            this[item] = JSON.parse(JSON.stringify(this.initData[item]))
          }
          this.getData()
        }
      }
    },
    created () {
      this.tableHeight = document.documentElement.clientHeight - 220
      for (let item in this.$data) {
        if (item !== 'initData' && item !== 'cols') {
          this.initData[item] = JSON.parse(JSON.stringify(this.$data[item]))
        }
      }
      this.getData()
      this.getCity('1', 'provincesList') // 获取城市
    }
      /* mounted () {
        this.setChart()
      } */
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