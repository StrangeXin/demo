<template>
  <div class="cart">
    <h2>购物车</h2>
    <p v-show="!products.length">
      <i>Please add some products to cart.</i>
    </p>
    <ul>
      <li
        v-for="product in products"
        :key="product.id"
      >
        {{ product.title }} - {{ product.price }} x
        {{ product.quantity }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  computed: {
    // 购物车的商品
    products() {
      return this.$store.getters.cartProducts
    }
  }
}
</script>
