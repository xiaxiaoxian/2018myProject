<template>
  <div class="hello">
    <h1>vue-resource插件讲解</h1>
    <a href="javascript:" @click="get">get请求</a>
    <a href="javascript:" @click="post">post请求</a>
    <a href="javascript:" @click="jsonp">JSONP请求</a>
    <a href="javascript:" @click="http">http请求</a>
    <div>
      <span>
        {{message}}
      </span>
      <span>{{msg}}</span>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  export default {
    name: 'HelloWorld',
    data () {
      return {
        message:'',
        msg:''
      }
    },
    mounted(){
      Vue.http.interceptors.push(function(request,next){
          console.log('request init');  // 请求前
          next(function(response){ // 请求后执行的函数（响应）
              console.log('response init');
              return  response;
          });
      })
    },
    methods: {
        get(){
            this.$http.get('http://www.imooc.com/course/AjaxCourseMembers?ids=796',{
                params:{
                    userId: 101,
                },
                headers:{ // 第三方服务一般要注入一个token
                    token: 'abcd'
                }
            }).then(res=>{
                this.message = res.data;
            },error=>{
                this.message = error;
            })
        },
        post(){
            this.$http.post('package.json',{
                userId: "102"
            },{emulateJSON: true},
              {
                headers: {
                    access_token: 'xiatian'
                }
            }).then(function(res){
                console.log(res);
                this.msg = res.data;
            })
        },
        jsonp(){
            this.$http.jsonp("http://www.imooc.com/course/AjaxCourseMembers?ids=796",).then(res=>{
                this.msg = res.data;
            })
        },
        http(){
           this.$http({
             methods:'get',
             url: '././package.json',
             params:{
                 userId: '103'
             },
             headers:{
                 token: '123'
             },
             timeout:5,
             before(){
                 console.log('before init');
             }
           }).then(function(res){
               this.msg = res.data;
           })
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
