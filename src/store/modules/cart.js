export default {
  namespaced: true,
  state: {
    items: []  // 已加入购物车的商品，格式如 [{ id, quantity }, { id, quantity }]
  },
  getters: {
    // 获取购物车商品
    cartProducts: (state, getters, rootState) => {
      // rootState - 全局 state
      return state.items.map(({ id, quantity }) => {
        // 从商品列表中，根据 id 获取商品信息
        const product = rootState.product.all.find(product => product.id === id)
        return {
          title: product.title,
          price: product.price,
          quantity
        }
      })
    },
  },
  actions: {
    // 添加商品到购物车
    addProductToCart({ state, commit }, product) {
      // 判断库存是否足够
      if (product.inventory > 0) {
        const cartItem = state.items.find(item => item.id === product.id)
        if (!cartItem) {
          // 初次添加到购物车
          commit('pushProductToCart', { id: product.id })
        } else {
          // 再次添加购物车，增加数量即可
          commit('incrementItemQuantity', cartItem)
        }
        // remove 1 item from stock 减少库存
        commit('product/decrementProductInventory', { id: product.id }, { root: true })
      }
    }
  },
  mutations: {
    // 商品初次添加到购物车
    pushProductToCart(state, { id }) {
      state.items.push({
        id,
        quantity: 1
      })
    },

    // 商品再次被添加到购物车，增加商品数量
    incrementItemQuantity(state, { id }) {
      const cartItem = state.items.find(item => item.id === id)
      cartItem.quantity++
    },

  },
}