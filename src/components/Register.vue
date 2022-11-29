<template>
  <v-container class="fill-height" style="padding-top: 5em" fluid>
    <v-row align="center" justify="center" dense>
      <v-col cols="12" sm="8" md="4" lg="4">
        <v-card elevation="0">
          <div class="text-center">
            <h1 class="mb-2">Registro</h1>
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
                label="Ingrese su nombre"
                name="name"
                prepend-inner-icon="mdi-account"
                type="text"
                v-model="name"
                :rules="[rules.required]"
                class="rounded-0"
                outlined
              ></v-text-field>
              <v-text-field
                label="Ingrese sus apellidos"
                name="lastName"
                prepend-inner-icon="mdi-account"
                type="text"
                v-model="lastName"
                :rules="[rules.required]"
                class="rounded-0"
                outlined
              ></v-text-field>
              <v-text-field
                label="Ingrese su correo"
                name="email"
                prepend-inner-icon="mdi-email"
                type="email"
                v-model="email"
                :rules="[rules.required, rules.validateEmail]"
                class="rounded-0"
                outlined
              ></v-text-field>
              <v-text-field
                label="Ingrese una contraseña"
                name="password"
                prepend-inner-icon="mdi-lock"
                type="password"
                v-model="password"
                :rules="[rules.required, rules.min]"
                class="rounded-0"
                outlined
              ></v-text-field>
              <v-text-field
                label="Repetir contraseña"
                name="password"
                prepend-inner-icon="mdi-lock-outline"
                type="password"
                v-model="repeatedPassword"
                :rules="[rules.required, rules.passwordMatch]"
                class="rounded-0"
                outlined
              ></v-text-field>
              <v-btn
                class="rounded-0"
                color="cyan lighten-3"
                type="submit"
                x-large
                block
                @click="register"
                :disabled="disabledBtnSaveRegister"
                >Registrarse</v-btn
              >
              <v-card-actions class="text--secondary">
                <v-spacer></v-spacer>
                ¿Ya tiene una cuenta?
                <router-link
                  :to="{ name: 'Login' }"
                  class="pl-2"
                  style="color: #000000"
                  >Ingrese</router-link
                >
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      disabledBtnSaveRegister: false,
      name: "",
      lastName: "",
      email: "",
      password: "",
      rules: {
        required: (value) => !!value || "Obligatorio",
        min: (value) => value.length >= 8 || "Mínimo 8 caracteres",
        validateEmail: (value) =>
          //eslint-disable-next-line
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
          "Correo incorrecto",
        passwordMatch: (repeatedPassword) =>
          repeatedPassword === this.password || "Las contraseñas no coinciden",
        emailMatch: () =>
          "El correo electrónico y la contraseña que ingresó no coinciden",
      },
    };
  },
  methods: {
    async register(e) {
      e.preventDefault();
      this.disabledBtnSaveRegister = true;
      const settings = {
        method: "POST",
        body: JSON.stringify({
          email: this.email,
          password: this.password,
          name: this.name,
          lastName: this.lastName,
        }),
        headers: {
          "Content-type": "application/json",
        },
      };

      const url = `${process.env.VUE_APP_API_BACKEND}/user/signin`;
      try {
        const dataReturned = await fetch(url, settings);
        const userAccess = await dataReturned.json();
        if (dataReturned.status >= 400 && dataReturned.status < 600) {
          throw new Error(userAccess.message);
        }
        this.disabledBtnSaveRegister = false;
        this.$swal({
          position: "center",
          icon: "success",
          title: "¡Creación exitosa!",
          showConfirmButton: false,
          timer: 1500,
        });
        this.$router.push("/ingresar");
      } catch (error) {
        this.$swal({
          position: "center",
          icon: "error",
          title: error,
          showConfirmButton: false,
          timer: 2000,
        });
        this.disabledBtnSaveRegister = false;
      }
    },
  },
};
</script>
