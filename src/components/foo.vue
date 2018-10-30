<template>
  <div>
    <em>这是foo组件</em>
  </div>
</template>

<script>
  export default {
    name: "foo",
    beforeRouteEnter(to, from, next) {
      // 在渲染该组件的对应路由被 confirm 前调用
      // 不！能！获取组件实例 `this`
      // 因为当守卫执行前，组件实例还没被创建
      console.log('组件中的路由钩子创建', to, from) // 已正确
      next(vm => {
        console.log('next  回调',vm)
      })
      // next('/bar/meta') // ok
    },
    created() {
    }
  }
</script>

<style scoped>

</style>
