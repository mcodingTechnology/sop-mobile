<template>
  <div>
    <div class="topFixation">
      <div style="width: 100%;overflow:scroll;-webkit-overflow-scrolling:auto;">
      <tab style="width: 950px">
        <tab-item :selected="tag === item" v-for="(item,index) in moduleId" :key="item.name" @on-item-click="getArticleData(item.id)">{{item.name}}</tab-item>
      </tab>
    </div>
<!--       <swiper height="180px" :show-dots="false" style="background-color: #EDEDED;">
         <swiper :list="demo01_list"></swiper>
          <div></div>
        </swiper-item>
      </swiper> -->
<!--       <div style="height: 2px;background-color: #F0F0F0; width: 100%;"></div> -->
    </div>
    <div class="listFixation">
      <view-box ref="viewBox">
       <template v-for="(item,index) in tableData">
        <div class="listb" @click="go(item)">
          <div class="coverImg"><img v-if="item.thumbnail" :src="item.thumbnail" class="img"></div>
          <div class="titleb"><span>{{item.title}}</span></div>
          <div class="flex-demo amountb">
          <span class="spanState">{{item.author}}</span><span>{{dateFormatter(item.publishTime)}}</span>
          </div>
        </div>
        </template>
       </view-box>
    </div>
  </div>
</template>

<script>
import { Tab, TabItem, Swiper, SwiperItem, FlexboxItem, Flexbox, ViewBox, dateFormat, Group, Cell } from 'vux'
// import informationView from '../app/informationView.vue'
const baseList = [{
  url: 'javascript:',
  img: 'https://static.vux.li/demo/1.jpg',
  title: ''
}, {
  url: 'javascript:',
  img: 'https://static.vux.li/demo/2.jpg',
  title: ''
}, {
  url: 'javascript:',
  img: 'https://static.vux.li/demo/5.jpg',
  title: '',
  fallbackImg: 'https://static.vux.li/demo/3.jpg'
}]
export default {
  components: {
    Tab,
    TabItem,
    Swiper,
    SwiperItem,
    FlexboxItem,
    Flexbox,
    ViewBox,
    dateFormat,
    Group,
    Cell
  },
  data () {
    return {
      title: '信息中心',
      cur: -1,
      tableDataLoading: false,
      menu: [],
      tag: '公告',
      taglist: ['公告', '动态', '促销活动', '新品发布', '营销活动'],
      index01: 0,
      demo01_list: baseList,
      demo2: '精选',
      moduleId: [],
      num: 0,
      id: [],
      pageNo: 1,
      pageSize: 10,
      getArticleUrl: window.ELS.api + '/article/service/findByPage', // 根据条件查询文章
      // getModuleUrl: window.ELS.api + '/article/service/toListPageView', // 文章跳转
      getModuleUrl: window.ELS.api + '/module/service/findByPage', // 查询模块
      tableData: [],
      defaultCols: [  // 列自定义
        {label: '文章缩略图', prop: 'thumbnail', show: true, fixed: false, width: 110},
        {label: '文章标题', prop: 'title', show: true, fixed: false, width: 80},
        {label: '文章作者', prop: 'author', show: true, fixed: false, width: 110},
        {label: '文章发布时间', prop: 'publishTime', show: true, fixed: false, width: 110, formatter: true}
      ]
    }
  },
  methods: {
    login () {
      this.$http.post(window.ELS.api + '/user/service/findCurrentUser').then(res => {
        console.log(res)
      })
    },
    // 获取文章信息
    getArticleData (id) {
      this.tableData = []
      let params = {
        moduleId_$_eq: id || 1
      }
      this.$http.post(this.getArticleUrl + '?pageNo=' + this.pageNo + '&pageSize=100', JSON.stringify(params)).then((res) => {
        this.tableData = res.data.data.queryResult
        console.log(this.tableData)
      })
    },
    // 获取模板信息
    getModuleData () {
      let params = {
        name_$_like: '公告'
      }
      this.$http.get(this.getModuleUrl + '?pageNo=' + this.pageNo + '&pageSize=' + this.pageSize, JSON.stringify(params)).then((res) => {
        this.moduleId = res.data.data.queryResult.reverse()
        console.log(this.moduleId)
      })
    },
    // 格式化时间
    dateFormatter (date) {
      return dateFormat(date, 'YYYY-MM-DD')
    },
    // 跳转至详情
    go (item) {
      window.sessionStorage.setItem('informationView', JSON.stringify(item))
      this.$router.push('informationView?id=' + item.id)
      console.log(this.$router)
    }
    // getArticleData () {
    //   this.$http.get(this.getArticleUrl).then((res) => {
    //     this.list = res.data.queryResult.map(n => {
    //       return {id: n.id, src: n.coverImage, title: n.title, meta: {date: n.publishTime, source: n.author}}
    //     })
    //     console.log(this.list)
    //   })
    // },
    // 跳转至详情
    // go (el) {
    //   window.sessionStorage.setItem('orderDetail', JSON.stringify(el))
    //   this.$router.push('orderDetail?id=' + el.orderNo + '&opera=order')
    // },
    // go (el) {
    //   this.$router.push({path: '/informationView?id=' + id})
    // }
  },
  created () {
    this.menu = window.menu
    this.login()
    // this.getModuleData() // 根据文章类型查询文章
    this.getArticleData() // 根据文章类型查询文章
    this.getModuleData() // 获取模板名称
  }
}
</script>

<style lang='less'>
.listb {
  height: 80px;
  padding: 10px;
  border-bottom: 1px solid #EDEDED;
  .vux-flexbox-item {
   // background-color: #000000;
   // width: 100px;
}
.spanState{
  padding-right: 15px;
}
.coverImg{
height: 100px;
// width: 100px;
}
.titleb {
  font-size: 16px;
  height: 50px;
  float: left;
  margin-top: -100px;
  margin-left: 100px;
  overflow: hidden;
}
.elseFont {
  font-size: 13px;
}
.amountb {
  float: left;
  color: #999999;
  margin-top: -40px;
  margin-left: 100px;
  .elseFont;
}
.img{
  height: 80px;
  width: 80px;
  }
}
.topFixation {
width:100%;height:225px;position:fixed;top:0;left:0;z-index: 99;
}
.listFixation {
position: absolute;z-index: 1;top:40px;left:0;width: 100%;
}

</style>
