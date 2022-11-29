<template>
  <div>
    <create-product @submit-form="save" />
  </div>
</template>

<script>
import CreateProduct from "@/components/CreateProduct.vue";

export default {
  name: "createProduct",
  components: {
    CreateProduct,
  },
  data() {
    return {
      msg: "",
      showError: false,
    };
  },
  methods: {
    save: async function (userData) {
      alert("entre");
      const settings = {
        method: "POST",
        body: JSON.stringify({
          name: userData["name"],
          price: userData["price"],
          category: userData["category"],
          colorAndImage: userData.colorAndImage,
        }),
        headers: {
          "Content-type": "application/json",
        },
      };
      console.log(settings.body);
      /* const url = `${process.env.VUE_APP_PANTERA_API}/product`;
      try {
        const dataReturned = await fetch(url, settings);
        const userAccess = await dataReturned.json();
        if (dataReturned.status >= 400 && dataReturned.status < 600) {
          throw new Error(userAccess.message);
        }
        sessionStorage.setItem("token", userAccess.token);
        this.msg = "Successful login";
        this.$router.push("pokemons");
      } catch (error) {
        this.showError = true;
        this.msg = error;
      } */
    },
  },
};
</script>
