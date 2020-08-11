<template>
    <div class="mPagenation">
      <ul class="mo-paging">
        <!-- first -->
        <li
        v-if="index !== 1"
        :class="['paging-item', 'paging-item--first', {'paging-item--disabled' : index === 1}]"
        @click="first"><i class="icon"><img src="../assets/images/pageToFirst_icon.png"></i></li>

        <!-- prev -->
        <li
        v-if="index !== 1"
        :class="['paging-item', 'paging-item--prev', {'paging-item--disabled' : index === 1}]"
        @click="prev"><i class="icon"><img src="../assets/images/pagePrev_icon.png"></i></li>
        
        <!-- <li
        :class="['paging-item', 'paging-item--more']"
        v-if="showPrevMore">...</li> -->

        <!-- <li
        :class="['paging-item', {'paging-item--current' : index === pager}]"
        v-for="pager in pagers"
        @click="go(pager)">{{ pager }}</li> -->
        <li>
          <!-- <i class="footLogo"><img src="~/assets/images/logo-small.png" :alt="$t('越南商会')"></i> -->
          <b class="count">
            <span>{{index}}</span>/<span>{{pages}}</span>
          </b>
        </li>

        <!-- <li
        :class="['paging-item', 'paging-item--more']"
        v-if="showNextMore">...</li> -->

        <!-- next -->
        <li
        v-if="index !== pages"
        :class="['paging-item', 'paging-item--next', {'paging-item--disabled' : index === pages}]"
        @click="next"><i class="icon"><img src="../assets/images/pageNext_icon.png"></i></li>

        <!-- last -->
        <li
        v-if="index !== pages"
        :class="['paging-item', 'paging-item--last', {'paging-item--disabled' : index === pages}]"
        @click="last"><i class="icon"><img src="../assets/images/pageToLast_icon.png"></i></li>
      </ul>
    </div>
</template>
<script>
export default {
  name: 'Paging',
  // 通过props来接受从父组件传递过来的值
  props: {
    // 页面中的可见页码，其他的以...替代, 必须是奇数
    perPages: {
      type: Number,
      default: 5
    },
    // 当前页码
    pageIndex: {
      type: Number,
      default: 1
    },
    // 每页显示条数
    pageSize: {
      type: Number,
      default: 10
    },
    // 总记录数
    total: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      index: this.pageIndex, // 当前页码
      limit: this.pageSize, // 每页显示条数
      size: this.total || 1, // 总记录数
      showPrevMore: false,
      showNextMore: false
    }
  },
  watch: {
    pageIndex (val) {
      this.index = val || 1
    },
    pageSize (val) {
      this.limit = val || 10
    },
    total (val) {
      this.size = val || 1
    }
  },
  computed: {
    // 计算总页码
    pages () {
      return Math.ceil(this.size / this.limit)
    },
    // 计算页码，当count等变化时自动计算
    pagers () {
      const array = []
      const perPages = this.perPages
      const pageCount = this.pages
      let current = this.index
      const _offset = (perPages - 1) / 2
      const offset = {
        start: current - _offset,
        end: current + _offset
      }
      // -1, 3
      if (offset.start < 1) {
        offset.end = offset.end + (1 - offset.start)
        offset.start = 1
      }
      if (offset.end > pageCount) {
        offset.start = offset.start - (offset.end - pageCount)
        offset.end = pageCount
      }
      if (offset.start < 1) offset.start = 1
      this.showPrevMore = (offset.start > 1)
      this.showNextMore = (offset.end < pageCount)
      for (let i = offset.start; i < offset.end + 1; i++) {
        array.push(i)
      }
      console.log(offset)
      console.log(array)
      return array
    }
  },
  methods: {
    prev () {
      if (this.index > 1) {
        this.go(this.index - 1)
      }
    },
    next () {
      if (this.index < this.pages) {
        this.go(this.index + 1)
      }
    },
    first () {
      if (this.index !== 1) {
        this.go(1)
      }
    },
    last () {
      if (this.index !== this.pages) {
        this.go(this.pages)
      }
    },
    go (page) {
      if (this.index !== page) {
        this.index = page
        // 父组件通过change方法来接受当前的页码
        this.$emit('change', this.index)
      }
    }
  }
}
</script>

<style lang="less">
.mPagenation{
  padding: 15px 0;
  .mo-paging {display: flex; display: -webkit-flex; font-size: 15px;color: #696969;
    li{flex:1;-webkit-flex:1;display: flex;display: -webkit-flex;justify-content: center;}
    i{display: flex; display: -webkit-flex;width: 24px;height: 24px;
      img{width: 100%;vertical-align: middle;}
    }
    b.count{align-self: center;margin-left: 5px;}
  }
}
</style>
