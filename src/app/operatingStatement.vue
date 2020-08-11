<template>
  <div>
    <group-title>经营分析</group-title>
    <tab>
      <tab-item>月度销售收入条状图</tab-item>
    </tab>
    <div style="margin-top:-20px">
      <div></div>  
      </div>
      <tab>
      <tab-item>区域省销售收入</tab-item>
      </tab>
      <div>
<!--       <group>
        <radio></radio>
      </group> -->
      </div>
      <div></div>
    </div>
  </div>
</template>

<script>
  import { Group, CellFormPreview, Cell, GroupTitle, Tab, TabItem, Radio } from 'vux'
  export default {
    components: {Group, CellFormPreview, Cell, GroupTitle, Tab, TabItem, Radio},
    data () {
      return {
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
      }
    },
    created () {
      this.login()
      this.wx()
    },
    mounted () {
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