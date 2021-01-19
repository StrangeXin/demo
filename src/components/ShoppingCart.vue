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
        <!-- （返金币:{{product.coin}}） 判断全局state里的vip -->
      </li>
    </ul>
    <p>Total: {{ total }}</p>
    <p>
      <button
        :disabled="!products.length"
        @click="checkout(products)"
      >
        Checkout
      </button>
    </p>
    <p v-show="checkoutStatus">
      Checkout {{ checkoutStatus }}.
    </p>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      // 结账的状态
      // checkoutStatus: (state) => state.cart.checkoutStatus
      checkoutStatus: (state) => state.checkoutStatus
    }),
    ...mapGetters({
    // ...mapGetters('cart', {
      products: 'cartProducts', // 购物车的商品
      total: 'cartTotalPrice' // 购物车商品的总价格
    })
  },
  methods: {
    checkout (products) {
      this.$store.dispatch('checkout', products)
      // this.$store.dispatch('cart/checkout', products)
    }
  }
}
</script>
