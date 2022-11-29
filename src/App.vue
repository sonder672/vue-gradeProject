<template>
  <v-app>
    <Nav />

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import Nav from "./components/Nav.vue";

export default {
  name: "App",
  components: {
    Nav,
  },
  data: () => ({
    routes: [
      {
        name: "Home",
        path: "/",
      },
      {
        name: "Categoria",
        path: "/categoria",
      },
    ],
  }),

  methods: {
    insertRoute(route) {
      this.$router.push(route);
    },
  },
};
</script>
