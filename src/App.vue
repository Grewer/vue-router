<template>
  <div id="app">
    <router-view/>
    <button @click="$router.push('/testPage/12')">按钮router.push str</button>
    <button @click="$router.push({path:'/testPage/13',query:{pp:1}})">按钮router.push obj byPath</button>
    <button @click="$router.push({name:'testPage',param:{pp:1}})">按钮router.push obj byName</button>
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
