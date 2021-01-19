<template>
  <div id="app">
    <h1>购物车示例</h1>
    <hr>
    <h2>商品列表</h2>
    <ProductList />
    <hr>
    <ShoppingCart />
  </div>
</template>

<script>
import ProductList from './components/ProductList.vue'
import ShoppingCart from './components/ShoppingCart.vue'

export default {
  name: 'App',
  components: {
    ProductList,
    ShoppingCart
  }
}
</script>
