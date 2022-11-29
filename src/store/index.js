import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    cartItems: JSON.parse(localStorage.getItem("cart")) || [],
    numberProducts: 0,
    logging: false,
    productCustom: [],
  },
  getters: {},
  mutations: {
    changeCart(state, newContent) {
      state.cartItems = newContent;
      state.numberProducts = state.cartItems.length;
    },
    async changeCartLogging(state, newContent) {
      state.cartItems = newContent.cartContent;
      state.numberProducts = state.cartItems.length;

      state.productCustom.push(newContent.custom);
    },
    deleteCartItem(state, index) {
      state.cartItems.splice(index, 1);
      state.numberProducts = state.cartItems.length;
      localStorage.setItem("cart", JSON.stringify(state.cartItems));
    },
    deleteAll(state) {
      state.cartItems = [];
      state.numberProducts = 0;
      localStorage.removeItem("cart");
    },
    numberOfProducts(state) {
      state.numberProducts = state.cartItems.length;
    },
    async purchase(state) {
      const settings = {
        method: "POST",
        body: JSON.stringify({ cartContent: state.cartItems }),
        headers: {
          "Content-type": "application/json",
        },
      };

      const url = `${process.env.VUE_APP_API_BACKEND}/lead`;
      try {
        const dataReturned = await fetch(url, settings);
        const userAccess = await dataReturned.json();
        if (dataReturned.status >= 400 && dataReturned.status < 600) {
          throw new Error(userAccess.message);
        }
        console.log(userAccess.send);
        window.open(userAccess.send, "_blank");
      } catch (error) {
        console.log(error);
      }
    },
    uploadCustomization(state, customization) {
      state.cartItems.push(customization);
      localStorage.setItem("cart", JSON.stringify(state.cartItems));

      this.$swal({
        position: "center",
        icon: "success",
        title: "Su personalización se agregó al carrito",
        showConfirmButton: false,
        timer: 1500,
      });
    },
    loggingChange(state, loggingStatus) {
      state.logging = loggingStatus;
    },
    loggingChangeWithCustomization(state, loggingStatusAndCustomization) {
      state.logging = loggingStatusAndCustomization.loggingStatus;
      state.productCustom = loggingStatusAndCustomization.listCustomization;
    },
    getListCustomization(state, listCustomization) {
      state.productCustom = listCustomization;
    },
  },
  actions: {},
  modules: {},
});
