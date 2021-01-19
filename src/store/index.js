import Vue from 'vue'
import Vuex from 'vuex'
import shop from '../api/shop'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    items: [],
    checkoutStatus: null,
    all: []
  },
  getters: {
    // 获取购物车商品
    cartProducts: (state, getters, rootState) => {

      console.log('cartProducts-cart模块')
      // rootState - 全局 state
      // 购物车 items 只有 id  quantity ，没有其他商品信息。要从这里获取。
      return state.items.map(({ id, quantity }) => {
        // 从商品列表中，根据 id 获取商品信息
        // const product = rootState.products.all.find(product => product.id === id)
        const product = rootState.all.find(product => product.id === id)
        const coin = rootState.vip ? 100 : 0  // 判断全局state里的vip,如果是则返100金币
        return {
          title: product.title,
          price: product.price,
          quantity,
          coin
        }
      })
    },
    // 所有购物车商品的价格总和
    cartTotalPrice: (state, getters) => {
      console.log('cartTotalPrice-cart模块')
      // reduce 的经典使用场景，求和
      return getters.cartProducts.reduce((total, product) => {
        return total + product.price * product.quantity
      }, 0)
    }
  },
  mutations: {
    // 设置所有商品
    setProducts(state, products) {
      state.all = products  // state是模块的局部状态,也就是上面的state
    },

    // 减少某一个商品的库存（够买一个，库存就相应的减少一个）
    decrementProductInventory(state, { id }) {
      console.log('decrementProductInventory-products模块')
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

    // 设置购物车数据
    setCartItems(state, { items }) {
      state.items = items
    },

    // 设置结算状态
    setCheckoutStatus(state, status) {
      state.checkoutStatus = status
    }
  },
  actions: {
    // 加载所有商品
    getAllProducts({ commit }) {
      // 从 shop API 加载所有商品，模拟异步
      shop.getProducts(products => {
        commit('setProducts', products)
      })
    },
    // 结算
    checkout ({ commit, state }, products) {
      // 获取购物车的商品
      const savedCartItems = [...state.items]
  
      // 设置结账的状态 null
      commit('setCheckoutStatus', null)
  
      // empty cart 清空购物车
      commit('setCartItems', { items: [] })
  
      // 请求接口
      shop.buyProducts(
        products,
        () => commit('setCheckoutStatus', 'successful'), // 设置结账的状态 successful
        () => {
          commit('setCheckoutStatus', 'failed') // 设置结账的状态 failed
          // rollback to the cart saved before sending the request
          // 失败了，就要重新还原购物车的数据
          commit('setCartItems', { items: savedCartItems })
        }
      )
    },
    addProductToCart({ state, commit }, product) {
      console.log('addProductToCart-cart模块')
      commit('setCheckoutStatus', null) // 设置结账的状态 null
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
        // products的decrementProductInventory不带命名空间的时候，可能存在重名的mutations，会分别触发;
        commit('decrementProductInventory', { id: product.id }, { root: true })
        // products的decrementProductInventory带命名空间的时候，只会触发products的decrementProductInventory;
        // commit('products/decrementProductInventory', { id: product.id }, { root: true })
      }
    }
  },
  modules: {
  }
})
