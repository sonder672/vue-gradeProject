<template>
  <div>
    <h1 class="text-center">Categorías</h1>
    <category-list :categories="categories" />
  </div>
</template>

<script>
import CategoryList from "@/components/Categories.vue";

export default {
  name: "categories",
  components: {
    CategoryList,
  },
  created() {
    this.getCategoryList();
  },
  data() {
    return {
      categories: [],
    };
  },
  methods: {
    getCategoryList: async function () {
      try {
        const settings = {
          method: "GET",
        };
        const url = "http://localhost:1234/api/product";
        const dataReturned = await fetch(url, settings);
        const categoriesInJson = await dataReturned.json();
        this.categories = categoriesInJson;
      } catch (error) {
        console.log({ error });
      }
    },
  },
};
</script>
