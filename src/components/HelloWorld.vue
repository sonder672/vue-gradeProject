<template>
  <div style="padding-top: 5em">
    <v-container fluid>
      <v-row style="background-color: #ecfffe">
        <v-col cols="6" style="padding-top: 10%">
          <v-card class="mx-auto" max-width="90%">
            <v-card-text>
              <p
                class="text-h4 text--primary text-center"
                style="font-size: 50%"
              >
                DISEÑA TU CAMISETA PERSONALIZADA
              </p>
              <div class="text--primary">
                Puedes escoger agregar los logotipos y textos que tú quieras,
                con la gama de colores que hay disponible para las camisetas.
                <span class="font-weight-bold"
                  >El límite es tu creatividad, ¿te atreves?</span
                >
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="6">
          <v-img
            contain
            height="100%"
            width="100%"
            :src="require('../assets/imginicio.png')"
          />
        </v-col>
      </v-row>
    </v-container>

    <template>
      <div style="padding-top: 5em">
        <h1 class="text-center">¿Cómo personalizar tu camiseta?</h1>
      </div>

      <v-container>
        <div>
          <v-stepper alt-labels align>
            <v-stepper-header>
              <v-stepper-step complete alt-labels step="1">
                Selecciona entre los colores disponibles
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step complete alt-labels step="2">
                Sube y posiciona la imagen o el texto que quieras
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step complete alt-labels step="3">
                Guarda y envía el pedido
              </v-stepper-step>
            </v-stepper-header>
          </v-stepper>
        </div>
        <v-row>
          <v-col cols="4"
            ><v-img
              width="100%"
              height="100%"
              :src="require('../assets/guia1.png')"
          /></v-col>
          <v-col cols="4"
            ><v-img
              width="100%"
              height="100%"
              :src="require('../assets/guia2.png')"
          /></v-col>
          <v-col cols="4"
            ><v-img
              width="100%"
              height="100%"
              :src="require('../assets/guia3.png')"
          /></v-col>
        </v-row>
      </v-container>
    </template>
  </div>
</template>
