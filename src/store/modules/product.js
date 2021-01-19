import shop from '../../api/shop'
export default {
  namespaced: true,
  state: {
    all: [],  //所有商品，从api里面异步获取
  },
  getters: {
  },
  actions: {
    // 加载所有商品
    getAllProducts({ commit }) {
      shop.getProducts(products => {
        commit('setProducts', products)
      })
    },
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
  },
}