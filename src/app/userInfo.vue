<template>
  <div>
      <blur :blur-amount=10 :url="url" style="background-color: #515151;height: 150px;">
        <div class="center1"><img :src="url">
        <div class="center2">
          <P>姓名：{{tableData.nickName}}</P>
          <p>部门：{{department.departmentName}}</p>
          <p>职位：{{roleList.roleName}}</p>
        </div>
        </div>
      </blur>

      <group>
        <cell title="公司信息" value="" is-link></cell>
        <cell title="系统设置" value="" is-link></cell>
      </group>
      <group>
        <cell title="问题反馈" value="" is-link></cell>
        <cell title="关于我们" value="" is-link></cell>
      </group>
<!--       <x-button @click.native="warn" type="warn">退出登录</x-button> -->
  </div>
</template>

<script>
  import { Group, Cell, Blur, XButton } from 'vux'
  export default {
    components: {Group, Cell, Blur, XButton},
    data () {
      return {
        title: '我的',
        tableData: [],
        department: {},
        roleList: [],
        url: 'https://gss0.baidu.com/7Po3dSag_xI4khGko9WTAnF6hhy/zhidao/wh%3D600%2C800/sign=b7e83ca6a818972ba36f08ccd6fd57b1/35a85edf8db1cb132eaa3ca1de54564e93584b44.jpg',
        getDataUrl: window.ELS.api + '/user/service/findCurrentUser'
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
        this.$http.post(this.getDataUrl).then((res) => {
          this.tableData = res.data.data
          this.department = res.data.data.extInfo.department
          this.roleList = res.data.data.extInfo.roleList[0]
          this.tableDataLoading = false
        })
      }
    },
    created () {
      this.login()
      this.getData()
      this.wx()
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