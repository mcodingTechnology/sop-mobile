<template>
  <div id="app">
    <div style="height:100%;">
      <view-box ref="viewBox">
        <keep-alive>
    <router-view></router-view>
    </keep-alive>
      </view-box>
    </div>
    <tabbar class="footMenu">  
        <tabbar-item selected link="/index">
          <span slot="label"><i class="fa fa-desktop fa-lg"></i>
            <br>
           <span>工作台</span>
         </span>
        </tabbar-item>  
        <tabbar-item link="/productList">  
          <span slot="label"><i class="fa fa-database fa-lg"></i>
            <br>
          <span>产品列表</span>
          </span>
        </tabbar-item>   
        <tabbar-item link="/informationCenter">  
          <span slot="label"><i class="fa fa-commenting-o fa-lg"></i>
            <br>
          <span>信息中心</span>
          </span> 
        </tabbar-item>  
        <tabbar-item link="/userInfo">  
          <span slot="label"><i class="fa fa-user-o fa-lg"></i>
            <br>
          <span>我的</span>
          </span>
        </tabbar-item>
      </tabbar>
  </div>
</template>

<script>
import { Tabbar, TabbarItem, Group, Cell, ViewBox } from 'vux'
export default {
  components: {
    Tabbar,
    TabbarItem,
    Group,
    Cell,
    ViewBox
  },
  name: 'app'
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';

html,body {
  background-color: #fbf9fe;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}
.footMenu{
  .vux-tabbar-simple .weui-tabbar__label{
    line-height: 25px;
  }
  .fa-lg {
    font-size: 16px;
    margin-left: 4px;
  }
}
</style>