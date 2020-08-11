<template>
  <div class="warp">
<!--     <x-header :left-options="{showBack: false}">{{tableData[0].moduleId}}</x-header> -->
    <div class="">
      <div class="title">
        <h2>{{tableData[0].title}}</h2>
        <p>{{tableData[0].subTitle}}</p>
      </div>
      <p class="smallLabel">
        <span>作者：{{tableData[0].author}}</span>
        <span style="margin-left:30px;">发布时间：{{dateFormatter(tableData[0].publishTime)}}</span>
      </p>
    </div>
    <div class="main">
      <p class="content" v-html="tableData[0].content"></p>
      <div style="text-align: center">
        <img v-if="tableData[0].coverImage" :src="tableData[0].coverImage" class="img">
      </div>
    </div>
  </div>
</template>

<script>
import { dateFormat, XHeader } from 'vux'
export default {
  components: {
    dateFormat,
    XHeader
  },
  data () {
    return {
      initData: {},
      cols: [],
      defaultCols: [  // 列自定义
      {label: ('标题'), prop: 'title', show: true, fixed: false, width: 240},
      {label: ('副标题'), prop: 'subTitle', show: true, fixed: false, width: 120},
      {label: ('作者'), prop: 'author', show: true, fixed: false, width: 120},
      {label: ('显示类型'), prop: 'typeId', show: true, fixed: false, width: 120},
      {label: ('状态'), prop: 'articleState', show: true, fixed: false, width: 100},
      {label: ('点击量'), prop: 'clickCount', show: true, fixed: false, width: 100},
      {label: ('点赞'), prop: 'likeCount', show: true, fixed: false, width: 100},
      {label: ('创建时间'), prop: 'publishTime', show: true, fixed: false, width: 120, formatter: true}],
      pageNo: 1,
      pageSize: 10,
      tableHeight: null,
      rowCount: 0,
      options: [0, 1, 2],
      editData: {}, // 新建修改当前数据存储
      tableDataLoading: false,
      showAddAndEdit: false,
      showSearch: false,
      tableData: [],
      getDataUrl: window.ELS.api + '/article/service/findByPage'
    }
  },
  methods: {
    saveUrl (response, file, fileList) {
      this.editData.coverImage = response.data.fileUrl
      this.editData.coverImage = window.ELS.api + '/' + response.data.fileUrl
    },
    changeCols (val) {
      this.cols = []
      this.$nextTick(() => {
        this.cols = val
      })
    },
    // 获取数据
    getData () {
      if (this.tableDataLoading) return
      this.showSearch = false
      this.tableDataLoading = true
      let params = {
        id_$_eq: this.$route.query.id || undefined
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
    // 格式化时间
    dateFormatter (date) {
      return dateFormat(date, 'YYYY-MM-DD')
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
      if (this.$route.query.id) {
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
  }
}
</script>

<style>
.warp {
  margin: 15px;
}
.header {
  color:black;
  text-align:center;
  padding:5px;
  }
.title {
  margin:auto;
  color:black;
  line-height:40px;
  }
.smallLabel {
  color: #999999;
  font-size: 14px;
  margin-top: 5px;
  }
.main {
  color:black;
  padding:5px;
  }
.content {
/*  text-indent:2em;*/
  font-size:18px;
  margin-top:5px;
  line-height: 32px;
  text-align: left;
  }
  .img {
    width:auto;
    height:auto;
    text-align: center;
    margin: 10px;
  }
</style>