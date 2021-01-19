import Vue from 'vue'
import Vuex from 'vuex'
import shop from '../api/shop'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    all: [],  //所有商品列表，从api里面异步获取
    items: []  // 已加入购物车的商品，格式如 [{ id, quantity }, { id, quantity }]
  },
  getters: {
    // 获取购物车商品
    cartProducts: (state) => {
      return state.items.map(({ id, quantity }) => {
        // 从商品列表中，根据 id 获取商品信息
        const product = state.all.find(product => product.id === id)
        return {
          title: product.title,
          price: product.price,
          quantity
        }
      })
    },
  },
  actions: {
    // 加载所有商品
    getAllProducts({ commit }) {
      shop.getProducts(products => {
        commit('setProducts', products)
      })
    },

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
        commit('decrementProductInventory', { id: product.id })
      }
    }
  },
  mutations: {
    // 设置所有商品
    setProducts(state, products) {
      state.all = products
    },

    // 减少某一个商品的库存（买一个，库存就相应的减少一个）
    decrementProductInventory(state, { id }) {
      const product = state.all.find(product => product.id === id)
      product.inventory--
    },

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
  }
})
