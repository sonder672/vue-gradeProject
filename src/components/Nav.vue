<template>
  <div>
    <v-app-bar
      absolute
      elevation="12"
      color="#fcb69f"
      dark
      :src="require('../assets/logotipoSodner.png')"
      scroll-target="#scrolling-techniques-5"
    >
      <template v-slot:img="{ props }">
        <v-img
          v-bind="props"
          gradient="to top right, rgba(19,84,122,.5), rgba(128,208,199,.8)"
        ></v-img>
      </template>

      <v-btn align-with-title text @click="returnCategories">
        <span class="mr-5" style="color: #000000">Categorías</span>
      </v-btn>

      <v-btn align-with-title text @click="returnCustomize" v-if="!logging">
        <span class="mr-5" style="color: #000000">Personalización</span>
      </v-btn>

      <v-menu offset-y v-if="logging">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            align-with-title
            text
            v-bind="attrs"
            v-on="on"
            style="color: #000000"
          >
            Personalización
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-title @click="returnCustomize" style="cursor: pointer"
              >Personalizar prenda</v-list-item-title
            >
          </v-list-item>
          <v-dialog v-model="dialogCustomization" width="45%">
            <template v-slot:activator="{ on, attrs }">
              <v-list-item>
                <v-list-item-title
                  style="cursor: pointer"
                  v-bind="attrs"
                  v-on="on"
                  >Ver lista</v-list-item-title
                >
              </v-list-item>
            </template>
            <v-card
              outlined
              v-for="(custom, indexCustom) in productCustom"
              :key="indexCustom"
            >
              <v-list-item>
                <v-list-item-content>
                  <div class="mb-4">{{ custom.createdAt }}</div>
                  <p style="overflow-wrap: break-word" class="mb-3">
                    Descargue su imagen
                    <a
                      :href="
                        'https://s3-bucket-gradeproject.s3.amazonaws.com/' +
                        custom.namePersonalization
                      "
                      target="_blank"
                      >aquí</a
                    >
                  </p>
                  <p style="overflow-wrap: break-word">
                    {{ custom.description }}
                  </p>
                </v-list-item-content>

                <v-list-item-avatar tile size="30%"
                  ><v-img
                    :src="
                      'https://s3-bucket-gradeproject.s3.amazonaws.com/' +
                      custom.namePersonalization
                    "
                  ></v-img
                ></v-list-item-avatar>
              </v-list-item>
            </v-card>
            <v-btn
              style="background-color: white"
              text
              color="primary"
              @click="dialogCustomization = false"
            >
              Salir
            </v-btn>
          </v-dialog>
        </v-list>
      </v-menu>

      <v-btn align-with-title text @click="returnLogin" v-if="!logging">
        <span class="mr-5" style="color: #000000">Ingresar</span>
      </v-btn>

      <v-btn align-with-title text @click="signOff" v-if="logging">
        <span class="mr-5" style="color: #000000">Cerrar sesión</span>
      </v-btn>

      <v-spacer></v-spacer>
      <v-btn align-with-title text color="black" @click.stop="drawer = !drawer">
        <v-icon black>mdi-cart</v-icon>
        <span
          >Carrito <span style="color: red">({{ numberProducts }})</span></span
        >
      </v-btn>
    </v-app-bar>
    <v-sheet>
      <v-navigation-drawer
        v-model="drawer"
        absolute
        temporary
        right
        width="400"
      >
        <h2 class="mb-2 text-center">Productos del carrito</h2>
        <div v-for="(cart, index) in cartItems" :key="index">
          <v-card>
            <v-list-item three-line>
              <v-list-item-content>
                <div class="text-overline mb-4">{{ cart.name }}</div>
                <v-list-item-title class="text-h5 mb-1">
                  ${{ cart.price }} COP
                </v-list-item-title>
                <v-list-item-subtitle
                  >Está llevando
                  <span style="font-weight: bold">{{ cart.quantity }}</span>
                  {{ cart.name }}
                </v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-avatar tile size="100">
                <v-img :src="cart.image" />
              </v-list-item-avatar>
            </v-list-item>

            <v-card-actions>
              <v-btn
                rounded
                depressed
                text
                @click="deleteCartItem(index)"
                color="error"
              >
                Eliminar
              </v-btn>
            </v-card-actions>
          </v-card>
          <v-divider></v-divider>
        </div>
        <v-btn text color="error" @click="deleteAll"> Limpiar todo </v-btn>
        <v-btn text color="success" @click="purchase"> Comprar </v-btn>
      </v-navigation-drawer>
    </v-sheet>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  mounted() {
    this.numberOfProducts();
    this.loadWithSignIn();
  },
  created() {
    this.getListCustomization();
  },
  data() {
    return {
      drawer: null,
      contentCart: [],
      dialogCustomization: false,
    };
  },
  computed: {
    ...mapState(["cartItems"]),
    ...mapState(["numberProducts"]),
    ...mapState(["logging"]),
    ...mapState(["productCustom"]),
  },
  methods: {
    returnLogin() {
      this.$router.push("/ingresar");
    },
    returnCustomize() {
      this.$router.push("/personalizar");
    },
    returnCategories() {
      this.$router.push("/categoria");
    },
    numberOfProducts() {
      this.$store.commit("numberOfProducts");
    },
    deleteCartItem(index) {
      this.$store.commit("deleteCartItem", index);
    },
    deleteAll() {
      this.$store.commit("deleteAll");
    },
    purchase() {
      this.$store.commit("purchase");
    },
    signOff() {
      this.$swal({
        position: "center",
        icon: "success",
        title: "¡Vuelve pronto!",
        showConfirmButton: false,
        timer: 1500,
      });
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("uuid");
      this.$store.commit("loggingChange", false);
    },
    loadWithSignIn() {
      if (sessionStorage.getItem("token")) {
        this.$store.commit("loggingChange", true);
      }
    },
    async getListCustomization() {
      if (sessionStorage.getItem("token")) {
        const settings = {
          method: "POST",
          body: JSON.stringify({
            uuid: sessionStorage.getItem("uuid"),
          }),
          headers: {
            "Content-type": "application/json",
          },
        };

        const url = `${process.env.VUE_APP_API_BACKEND}/customization/user`;
        try {
          const dataReturned = await fetch(url, settings);
          const userAccess = await dataReturned.json();
          if (dataReturned.status >= 400 && dataReturned.status < 600) {
            throw new Error(userAccess.message);
          }

          this.$store.commit("getListCustomization", userAccess);
        } catch (error) {
          this.showError = true;
          this.msg = error;
        }
      }
    },
  },
};
</script>
