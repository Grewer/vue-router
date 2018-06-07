<template>
  <div id="app">
    <router-view/>
    <button @click="$router.push('/')">回首页</button>
    <button @click="$router.push('/testPage/12')">按钮router.push str</button>
    <button @click="$router.push({path:'/testPage/13'})">按钮router.push obj byPath</button>
    <button @click="$router.push({name:'testPage'})">按钮router.push obj byName</button>
    <h3>path中带query:</h3>
    <button @click="$router.push('/testPage/12?test=5')">按钮router.push str</button>
    <button @click="$router.push({path:'/testPage/13',query:{pp:1}})">按钮router.push obj</button>
    <button @click="$router.push({path:'/testPage/13?test=7'})">按钮router.push obj</button>
    <button @click="$router.push({path:'/testPage/13?tt=我的数据'})">按钮router.push 中文</button>
    <button @click="$router.push({path:'/testPage/13',query:{my:'测试'}})">按钮router.push 中文</button>
    <button @click="$router.push({name:'BarFoo',query:{tt:'bar foo'}})">按钮router.push+name</button>
    <h3>附带meta</h3>
    <button @click="$router.push('/bar/meta')">按钮router.push+str</button>
    <button @click="$router.push({name:'Bar'})">按钮router.push+name</button>
    <h3>附带params</h3>
    <button @click="$router.push({path:'/bar/meta',params:{name:'this params name'}})">按钮router.push+path</button>
    <button @click="$router.push({name:'Bar',params:{name:'this params name'}})">按钮router.push+name</button>
    <h3>拥有单独导航</h3>
    <button @click="$router.push('/foo')">按钮router.push+str</button>
    <button @click="$router.push({path:'/foo'})">按钮router.push+path</button>
    <button @click="$router.push({name:'Foo'})">按钮router.push+name</button>
    <h3>多个参数</h3>
    <button @click="$router.push('/more/5/oh/add')">按钮router.push str</button>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted(){
    console.log(this)
    console.log('app router:',this.$router)
    console.log('app route:',this.$route)
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

  button{
    margin: 10px;
    padding: 5px 10px;
    color: #333;
    cursor: pointer;
    outline: 0;
    border: 1px solid #ddd;
    border-radius: 2px;
    background-color: #fff;
    appearance: none;
  }

  button:hover{
    border-color: #555;
  }
</style>
