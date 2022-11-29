<template>
  <div>
    <login-user @submit-form="verifyAccount" />
  </div>
</template>

<script>
import LoginUser from "@/components/Login.vue";

export default {
  name: "login",
  components: {
    LoginUser,
  },
  data() {
    return {
      msg: "",
      showError: false,
    };
  },
  methods: {
    verifyAccount: async function (userData) {
      const settings = {
        method: "POST",
        body: JSON.stringify({
          email: userData["email"],
          password: userData["password"],
        }),
        headers: {
          "Content-type": "application/json",
        },
      };
      const url = `${process.env.VUE_APP_PANTERA_API}/signin`;
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
      }
    },
  },
};
</script>
