<template>
  <div>
    <user-register @submit-form="saveUser" />
  </div>
</template>

<script>
import UserRegister from "@/components/Register.vue";

export default {
  name: "signup",
  components: {
    UserRegister,
  },
  data() {
    return {
      msg: "",
      showError: false,
    };
  },
  methods: {
    saveUser: async function (userData) {
      try {
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
        const url = `${process.env.VUE_APP_PANTERA_API}/signup`;
        const signup = await fetch(url, settings);
        if (signup.status >= 400 && signup.status < 600) {
          const infoJson = await signup.json();
          throw new Error(infoJson.message);
        }
        this.msg = "Successfully created";
        this.$router.push("/login");
      } catch (error) {
        this.showError = true;
        this.msg = error;
      }
    },
  },
};
</script>
