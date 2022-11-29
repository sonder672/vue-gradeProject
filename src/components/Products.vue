<template>
  <div style="padding-top: 5em">
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center" dense>
        <v-col
          md="5"
          lg="4"
          xl="2"
          cols="12"
          v-for="(product, indexProduct) in products"
          :key="indexProduct"
        >
          <v-card elevation="24" max-width="444" class="mx-auto">
            <v-system-bar lights-out></v-system-bar>
            <v-img :src="images[indexProduct]"></v-img>
            <v-list two-line>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{ product.name }}</v-list-item-title>
                  <v-list-item-subtitle
                    >${{ product.price }} pesos</v-list-item-subtitle
                  >
                </v-list-item-content>
                <v-card-actions>
                  <v-btn @click="addCart(product, indexProduct)">
                    Agregar</v-btn
                  >
                </v-card-actions>
              </v-list-item>
            </v-list>
            <v-expand-transition>
              <div>
                <v-row align="center" justify="center" dense>
                  <v-list
                    v-for="(
                      colorAndImage, indexColorAndImage
                    ) in product.images"
                    :key="indexColorAndImage"
                  >
                    <v-col cols="3">
                      <span
                        class="circle"
                        :style="{
                          'background-color':
                            colorAndImage.color.hexadecimalCode,
                        }"
                        @click="
                          changeImageColor(colorAndImage.image, indexProduct)
                        "
                      ></span>
                    </v-col>
                  </v-list>
                </v-row>
              </div>
            </v-expand-transition>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style>
.circle {
  height: 25px;
  width: 25px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
  cursor: pointer;
}
</style>

<script>
export default {
  created() {
    this.getProductsByCategory();
  },
  data() {
    return {
      products: [],
      images: [],
    };
  },
  computed: {
    contentCart: {
      get() {
        return this.contentCart;
      },
      set(newProduct) {
        this.$store.commit("changeCart", newProduct);
      },
    },
  },
  methods: {
    changeImageColor(color, positionProduct) {
      this.images.splice(positionProduct, 1, color);
    },
    async getProductsByCategory() {
      try {
        const settings = {
          method: "GET",
        };
        const categoryUuid = this.$route.params.categoryUuid;
        const url = `${process.env.VUE_APP_API_BACKEND}/product/${categoryUuid}`;
        const dataReturned = await fetch(url, settings);
        const productsInJson = await dataReturned.json();

        this.products = productsInJson;
        this.products.forEach((product) => {
          this.images.push(product.images[0].image);
        });
      } catch (error) {
        console.log({ error });
      }
    },
    async addCart(productElements, positionProduct) {
      let cart = localStorage.getItem("cart");

      if (!cart) {
        const contentCart = [
          {
            uuid: productElements.uuid,
            price: productElements.price,
            name: productElements.name,
            quantity: 1,
            image: this.images[positionProduct],
          },
        ];
        this.contentCart = contentCart;
        localStorage.setItem("cart", JSON.stringify(contentCart));

        return;
      }

      const contentCart = {
        uuid: productElements.uuid,
        price: productElements.price,
        name: productElements.name,
        quantity: 1,
        image: this.images[positionProduct],
      };

      cart = JSON.parse(cart);
      var cartIndex;
      cart.some((element, key) => {
        if (
          element.uuid == productElements.uuid &&
          element.image == this.images[positionProduct]
        )
          return (cartIndex = key);
      });

      if (typeof cartIndex === "undefined") {
        cart.push(contentCart);
        this.contentCart = cart;
        localStorage.setItem("cart", JSON.stringify(cart));

        return;
      }

      contentCart.quantity += cart[cartIndex].quantity;
      contentCart.price = contentCart.price * contentCart.quantity;
      cart[cartIndex] = contentCart;
      this.contentCart = cart;
      localStorage.setItem("cart", JSON.stringify(cart));

      return;
    },
  },
};
</script>
