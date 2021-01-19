<template>
  <ul>
    <li
      v-for="product in products"
      :key="product.id"
    >
      {{ product.title }} - {{ product.price }} （库存:{{ product.inventory }}）
      <br>
      <button
        :disabled="!product.inventory"
        @click="addProductToCart(product)"
      >
        Add to cart
      </button>
    </li>
  </ul>
</template>

<script>
export default {
  computed: {
    // 获取所有商品
    products() {
      return this.$store.state.all
    }
  },
  methods: {
    // 添加商品到购物车
    addProductToCart(product) {
      this.$store.dispatch('addProductToCart', product)
    }
  },
  created() {
    // 加载所有商品
    this.$store.dispatch('getAllProducts')
  }
}
</script>
