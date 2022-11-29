<template>
  <div>
    <h1 class="text-center">Productos</h1>
    <product-list />
  </div>
</template>

<script>
import ProductList from "@/components/Products.vue";

export default {
  name: "products",
  components: {
    ProductList,
  },
  created() {
    this.getProductsByCategory();
  },
  data() {
    return {
      products: "",
    };
  },
  methods: {
    getProductsByCategory: async function () {
      try {
        const settings = {
          method: "GET",
        };
        const categoryUuid = this.$route.params.categoryUuid;
        const url = `${process.env.VUE_APP_API_BACKEND}/product/${categoryUuid}`;
        const dataReturned = await fetch(url, settings);
        const productsInJson = await dataReturned.json();

        this.products = productsInJson;
      } catch (error) {
        console.log({ error });
      }
    },
  },
};
</script>
