<template>
  <div>
    <v-container>
      <v-row justify="space-around" id="sizeByRowCol">
        <v-col cols="12">
          <v-img :src="imageHome" height="100%"></v-img>
        </v-col>
        <v-col cols="12" md="4" lg="4" xl="4" sm="12">
          <v-card width="100%">
            <v-img height="50%" :src="require('../assets/guia1.png')">
              <v-app-bar flat color="rgba(0, 0, 0, 0)">
                <v-app-bar-nav-icon color="white"></v-app-bar-nav-icon>

                <v-spacer></v-spacer>

                <v-btn color="white" icon>
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </v-app-bar>
            </v-img>

            <v-card-text>
              <div class="font-weight-bold ml-8 mb-2">Creación</div>

              <v-timeline align-top dense>
                <v-timeline-item small color="blue lighten-1">
                  <div>
                    <div class="font-weight-normal">
                      <strong>Escoge el color</strong>
                    </div>
                    <div>
                      Puedes elegir entre la variedad de colores que hay
                    </div>
                  </div>
                </v-timeline-item>
              </v-timeline>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4" lg="4" xl="4" sm="12">
          <v-card width="100%">
            <v-img height="50%" :src="require('../assets/guia2.png')">
              <v-app-bar flat color="rgba(0, 0, 0, 0)">
                <v-app-bar-nav-icon color="white"></v-app-bar-nav-icon>

                <v-spacer></v-spacer>

                <v-btn color="white" icon>
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </v-app-bar>
            </v-img>

            <v-card-text>
              <div class="font-weight-bold ml-8 mb-2">Proceso</div>

              <v-timeline align-top dense>
                <v-timeline-item small color="blue darken-3">
                  <div>
                    <div class="font-weight-normal">
                      <strong>Sube tus logos</strong>
                    </div>
                    <div>
                      Sube cualquier imagen o texto y posicionala dentro de la
                      prenda
                    </div>
                  </div>
                </v-timeline-item>
              </v-timeline>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4" lg="4" xl="4" sm="12">
          <v-card width="100%">
            <v-img height="50%" :src="require('../assets/guia3.png')">
              <v-app-bar flat color="rgba(0, 0, 0, 0)">
                <v-app-bar-nav-icon color="white"></v-app-bar-nav-icon>

                <v-spacer></v-spacer>

                <v-btn color="white" icon>
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </v-app-bar>
            </v-img>

            <v-card-text>
              <div class="font-weight-bold ml-8 mb-2">Finalización</div>

              <v-timeline align-top dense>
                <v-timeline-item small color="blue darken-4">
                  <div>
                    <div class="font-weight-normal">
                      <strong>Guarda tu creación</strong>
                    </div>
                    <div>
                      Una vez satisfecho, puedes guardar tu personalización
                    </div>
                  </div>
                </v-timeline-item>
              </v-timeline>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  mounted() {
    const sizeByRow = document.getElementById("sizeByRowCol");
    console.log(sizeByRow.offsetWidth);
    if (sizeByRow.offsetWidth < 899) {
      console.log("verdad");
      this.imageHome = require("../assets/imginicioMobile.png");
    }
  },
  data() {
    return {
      imageHome: require("../assets/imginicioLogo.png"),
    };
  },
};
</script>
