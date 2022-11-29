<template>
  <div style="padding-top: 1em">
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center" dense>
        <v-col cols="12" sm="8" md="4" lg="4">
          <v-card elevation="0">
            <div class="text-center">
              <h1 class="mb-2">Iniciar sesión</h1>
            </div>
            <a
              href="https://edu-fedorae.netlify.app"
              name="Fedorae Education"
              title="Fedorae Education"
              target="_blank"
            >
              <v-img
                src="@/assets/logo.png"
                alt="Fedorae Education Log"
                contain
                height="200"
              ></v-img>
            </a>
            <v-card-text>
              <v-form>
                <v-text-field
                  label="Ingrese su correo"
                  name="email"
                  prepend-inner-icon="mdi-email"
                  type="email"
                  class="rounded-0"
                  v-model="email"
                  :rules="[rules.required, rules.validateEmail]"
                  outlined
                />
                <v-text-field
                  label="Ingrese su contraseña"
                  name="password"
                  prepend-inner-icon="mdi-lock"
                  type="password"
                  v-model="password"
                  :rules="[rules.required, rules.min]"
                  class="rounded-0"
                  outlined
                />
                <v-btn
                  class="rounded-0"
                  type="submit"
                  color="cyan lighten-3"
                  x-large
                  block
                  @click="login"
                  >Ingresar</v-btn
                >
                <v-card-actions class="text--secondary">
                  <v-spacer></v-spacer>
                  ¿No tiene cuenta?
                  <router-link
                    :to="{ name: 'Register' }"
                    class="pl-2"
                    style="color: #000000"
                    :disabled="disabledBtnLogin"
                    >Regístrese</router-link
                  >
                </v-card-actions>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      disabledBtnLogin: false,
      email: "",
      password: "",
      rules: {
        required: (value) => !!value || "Obligatorio",
        min: (value) => value.length >= 8 || "Mínimo 8 caracteres",
        validateEmail: (value) =>
          //eslint-disable-next-line
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
          "Correo incorrecto",
        emailMatch: () =>
          "El correo electrónico y la contraseña que ingresó no coinciden",
      },
    };
  },
  computed: {
    ...mapState(["logging"]),
  },
  methods: {
    async login(e) {
      e.preventDefault();
      this.disabledBtnLogin = true;

      const settings = {
        method: "POST",
        body: JSON.stringify({
          email: this.email,
          password: this.password,
        }),
        headers: {
          "Content-type": "application/json",
        },
      };

      const url = `${process.env.VUE_APP_API_BACKEND}/user/signup`;
      try {
        const dataReturned = await fetch(url, settings);
        const userAccess = await dataReturned.json();
        if (dataReturned.status >= 400 && dataReturned.status < 600) {
          throw new Error(userAccess.message);
        }
        sessionStorage.setItem("token", userAccess.token);
        sessionStorage.setItem("uuid", userAccess.uuid);
        this.$swal({
          position: "center",
          icon: "success",
          title: "¡Bienvenido de vuelta!",
          showConfirmButton: false,
          timer: 1500,
        });

        const settingsCustom = {
          method: "POST",
          body: JSON.stringify({
            uuid: sessionStorage.getItem("uuid"),
          }),
          headers: {
            "Content-type": "application/json",
          },
        };

        const urlCustom = `${process.env.VUE_APP_API_BACKEND}/customization/user`;

        const dataReturnedCustom = await fetch(urlCustom, settingsCustom);
        const userAccessCustom = await dataReturnedCustom.json();
        if (
          dataReturnedCustom.status >= 400 &&
          dataReturnedCustom.status < 600
        ) {
          throw new Error(userAccessCustom.message);
        }

        this.disabledBtnLogin = false;
        this.$router.push("/categoria");
        this.$store.commit("loggingChangeWithCustomization", {
          loggingStatus: true,
          listCustomization: userAccessCustom,
        });
      } catch (error) {
        this.$swal({
          position: "center",
          icon: "error",
          title: error,
          showConfirmButton: false,
          timer: 1500,
        });
        this.disabledBtnLogin = false;
      }
    },
  },
};
</script>
