<template>
  <div>
    <group :title="title">
      <x-button @click.native="showSearch=true"><i class="fa fa-search"></i>查询</x-button>
      <x-dialog v-model="showSearch" class="dialog-demo" hide-on-blur>
        <div style="padding:15px;">
          <x-input title="产品名称" v-model="currentQueryCondition.productName"></x-input>
          <x-button @click.native="searchData()" type="primary">查询</x-button>
          <x-button @click.native="showSearch=false" type="primary">取消</x-button>
          <x-button @click.native="initQueryCondition" type="primary">清空</x-button>
        </div>
      </x-dialog>
      <template v-for="(el, i) in tableData">
        <div class="listA">
            <flexbox style="float: left" wrap="wrap">
              <flexbox-item><div class="flex-demo title">{{el.productName}}</div></flexbox-item>
              <flexbox-item><div class="flex-demo" style="float: right; height: 20px;">
                  <div :border-intent="false" class="sub-item">
                    <span>条形码：{{el.barCode}}</span>
                  </div>
                </div></flexbox-item>
              </flexbox>
            <flexbox wrap="wrap">
              <flexbox-item><div class="flex-demo elseFont">商品类型：{{el.categoryName}}</div></flexbox-item>
              <flexbox-item><div class="flex-demo idStyle">商品id：{{el.id}}</div></flexbox-item>
            </flexbox>
            <flexbox wrap="wrap">
              <flexbox-item><div class="flex-demo amount" style="float: left">规格：{{el.spec}}</div></flexbox-item>
              <flexbox-item><div class="flex-demo amount">商品编码：{{el.numberCode}}</div></flexbox-item>
            </flexbox>
        </div>
      </template>
    </group>
    <div class="page" v-if="tableData && tableData.length > 0">
      <pagination :page-index="pageNo" :page-size="pageSize" :total="rowCount" @change="pageChange"></pagination>
    </div>
  </div>
</template>

<script>
  import { Group, Cell, CellBox, FlexboxItem, Flexbox, dateFormat, XInput, XButton, XDialog, Selector } from 'vux'
  import pagination from '../components/pagination.vue'

  export default {
    components: {
      Group,
      Cell,
      CellBox,
      pagination,
      FlexboxItem,
      Flexbox,
      XInput,
      XButton,
      XDialog,
      Selector,
      dateFormat
    },
    data () {
      return {
        title: '产品列表',
        showSearch: false,
        tableDataLoading: false,
        getDataUrl: window.ELS.api + '/product/service/findByPage',
        deleteDataUrl: window.ELS.api + '/product/service/deleteById',
        addDataUrl: window.ELS.api + '/product/service/create',
        editDataUrl: window.ELS.api + '/product/service/edit',
        fileDataUils: window.ELS.api + '/fileDataUtils/service/multiUpload',
        getproductUrl: window.ELS.api + '/productCategory/service/findByPage', // 查询产品分类
        pageNo: 1,
        pageSize: 10,
        total: 1,
        rowCount: 0,
        tableData: [],
        initData: {},
        cols: [],
        defaultCols: [  // 列自定义
          {label: ('商品id'), prop: 'id', show: true, fixed: true, width: 70},
          // {label: ('店铺ID'), prop: 'storeId', show: true, fixed: false, width: 120},
          {label: ('商品名称'), prop: 'productName', show: true, fixed: true, width: 200},
          {label: ('商品条形码'), prop: 'barCode', show: true, fixed: true, width: 105},
          {label: ('商品编码'), prop: 'numberCode', show: true, fixed: true, width: 105},
          {label: ('商品防伪编码'), prop: 'fakeCode', show: true, fixed: false, width: 120},
          {label: ('商品类型'), prop: 'categoryId', show: true, fixed: false, width: 150},
          {label: ('商品标签'), prop: 'label', show: true, fixed: false, width: 100},
          {label: ('商品排序'), prop: 'sequence', show: true, fixed: false, width: 100},
          {label: ('上架状态'), prop: 'saleStatus', show: true, fixed: false, width: 100},
          {label: ('积分商城兑换状态'), prop: 'giftExchangeStatus', show: true, fixed: false, width: 150},
          {label: ('是否套餐'), prop: 'setStatus', show: true, fixed: false, width: 100},
          {label: ('商品是否限购'), prop: 'limitStatus', show: true, fixed: false, width: 130},
          {label: ('每人限购件数'), prop: 'limitBuyQuota', show: true, fixed: false, width: 130},
          {label: ('创建时间'), prop: 'createTime', show: true, fixed: false, width: 110, formatter: true},
          {label: ('更新时间'), prop: 'updateTime', show: true, fixed: false, width: 110, formatter: true}
        ],
        currentQueryCondition: {
          mailAddress: ''
        },
        queryCondition: { // 查询条件
          productName: '',
          sceneCode: ''
        }
      }
    },
    methods: {
      // 获取数据
      getData () {
        if (this.tableDataLoading) return
        this.showSearch = false
        this.tableDataLoading = true
        let params = {
          productName_$_like: this.queryCondition.productName.trim() || undefined
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
      // 获取产品分类
      // getproduct () {
      //   this.$http.get(this.getproductUrl + '?pageNo=' + this.pageNo + '&pageSize=9999').then((res) => {
      //     this.productsList = res.data.data.queryResult.map(i => {
      //       this.categoryIdMap[i.id] = i.categoryName
      //       return {value: i.id, label: i.categoryName}
      //     })
      //   })
      // },
      // 选择页码
      pageChange (page) {
        this.pageNo = page
        this.getData()
      },
      // 格式化时间
      dateFormatter (date) {
        return dateFormat(date, 'YYYY-MM-DD HH:mm:ss')
      },
      // 查询窗口取消功能
      searchData () {
        // 恢复查询条件
        for (let item in this.currentQueryCondition) {
          this.queryCondition[item] = this.currentQueryCondition[item]
        }
        this.getData()
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
          orderNo: '',
          approvalStatus: '',
          status: '',
          product: '',
          deliveryStatus: ''
        }
      }
    },
    created () {
      this.getData()
    }
  }
</script>

<style lang='less'>
.listA {
  padding: 10px;
  border-bottom: 1px solid #EDEDED;
}
.sub-item{
  float: right;
  padding-left: 6px;
  height: 20px;
  .elseFont;
}
.title{
  color: #000;
  line-height: 30px;
}
.elseFont {
  font-size: 13px;
}
.nameStyle {
  width: 200px;
  line-height: 30px;
  .elseFont;
}
.idStyle {
  line-height: 30px;
  float: right;
  .elseFont;
}
.amount{
  float: right;
  .elseFont;
}
</style>
