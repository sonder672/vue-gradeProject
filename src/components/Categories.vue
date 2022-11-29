<template>
  <div style="padding-top: 1em">
    <h1 class="text-center">Categorías</h1>
    <v-container>
      <v-row align="start" no-gutters>
        <v-col
          v-for="(category, index) in categories"
          :key="index"
          md="6"
          lg="4"
          xl="3"
          sm="6"
          cols="12"
          class="mb-10"
        >
          <v-card max-width="344" color="mx-auto">
            <v-img :src="category.images" height="300px"></v-img>

            <v-card-title class="font-weight-black text-breake">
              {{ category.name }}
            </v-card-title>

            <v-card-actions>
              <router-link
                :to="{
                  name: 'productsByCategory',
                  params: { categoryUuid: category.uuid },
                }"
                >Productos</router-link
              >
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  props: ["categories"],
  data: () => ({
    show: false,
  }),
};
</script>
