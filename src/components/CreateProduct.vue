<template>
  <div style="padding-top: 5em">
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center" dense>
        <v-col md="5" lg="4" xl="4" cols="12">
          <v-card elevation="0">
            <div class="text-center">
              <h1 class="mb-2">Creación de productos</h1>
            </div>
            <v-card-text>
              <v-form>
                <v-row align="center" justify="center" dense>
                  <v-col cols="6">
                    <v-text-field
                      label="Nombre"
                      name="name"
                      prepend-inner-icon="mdi-email"
                      type="text"
                      class="rounded-0"
                      v-model="name"
                      :rules="[rules.required]"
                      outlined
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      label="Precio"
                      name="price"
                      prepend-inner-icon="mdi-lock"
                      type="number"
                      v-model="price"
                      :rules="[rules.required, rules.min]"
                      class="rounded-0"
                      outlined
                    />
                  </v-col>
                  <v-col class="d-flex" cols="12">
                    <v-select
                      :items="categories"
                      item-value="uuid"
                      item-text="name"
                      label="Categorías"
                      v-model="category"
                      :rules="[rules.required]"
                      outlined
                    ></v-select>
                  </v-col>
                  <v-col class="d-flex" cols="12">
                    <v-file-input
                      small-chips
                      @change="generateImagePreview"
                      v-model="images"
                      multiple
                      label="Cargar imágenes"
                    ></v-file-input>
                  </v-col>
                </v-row>
                <v-btn
                  class="rounded-0"
                  type="submit"
                  @click="save"
                  color="cyan lighten-3"
                  x-large
                  block
                  >Crear</v-btn
                >
                <!-- Create category -->
                <v-card-actions class="text--secondary">
                  <v-spacer></v-spacer>
                  ¿No está la categoría?
                  <v-dialog v-model="dialogCategory" width="500">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn v-bind="attrs" v-on="on">Créela</v-btn>
                    </template>
                    <v-card>
                      <v-card-title class="text-h5 grey lighten-2">
                        Crear categoría
                      </v-card-title>
                      <v-card-text>
                        <v-file-input
                          small-chips
                          @change="generateImagePreviewCategory"
                          v-model="imageCategory"
                          label="Cargar imágenes"
                          :rules="[rules.required]"
                        ></v-file-input>
                        <v-text-field
                          label="Nombre de la categoría"
                          v-model="nameCategory"
                          name="nameCategory"
                          type="text"
                          :rules="[rules.required]"
                        />
                        <v-img
                          :src="previewImagesCategory"
                          v-show="imageCategory != ''"
                        />
                      </v-card-text>

                      <v-divider></v-divider>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="error"
                          text
                          @click="dialogCategory = false"
                        >
                          Cancelar
                        </v-btn>
                        <v-btn
                          color="primary"
                          type="submit"
                          text
                          @click="saveCategory"
                        >
                          Crear
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-card-actions>
                <!-- Create category -->

                <!-- Create color -->
                <v-card-actions class="text--secondary">
                  <v-spacer></v-spacer>
                  ¿No está el color?
                  <v-dialog v-model="dialogColor" width="500">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn v-bind="attrs" v-on="on">Créelo</v-btn>
                    </template>
                    <v-card>
                      <v-card-title class="text-h5 grey lighten-2">
                        Creación de color
                      </v-card-title>

                      <v-row>
                        <v-col
                          cols="12"
                          style="
                            background-color: #eeeeee;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                          "
                        >
                          <select-color
                            @input="changeColor"
                            :value="paletteColor"
                          />
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            label="Nombre del color"
                            v-model="nameColor"
                            name="nameColor"
                            type="text"
                            :rules="[rules.required]"
                          />
                        </v-col>
                      </v-row>

                      <v-divider></v-divider>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" text @click="dialogColor = false">
                          Cancelar
                        </v-btn>
                        <v-btn color="primary" text @click="saveColor">
                          Crear
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-card-actions>
                <!-- Create color -->
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col md="7" lg="8" xl="8" cols="12">
          <v-row>
            <v-col
              v-for="(image, index) in previewImages"
              :key="index"
              cols="3"
            >
              <v-img :src="image" @change="generateImagePreview" />
              <v-select
                :items="items"
                item-value="id"
                item-text="name"
                v-model="colors[index]"
                @change="addColorToName(index)"
                :rules="[rules.required]"
                label="Colores"
                dense
              ></v-select>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { Sketch } from "vue-color";

export default {
  components: {
    SelectColor: Sketch,
  },
  async beforeCreate() {
    const token = sessionStorage.getItem("token");

    if (!token) {
      this.$router.push("/categoria");

      return;
    }

    const settings = {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = `${process.env.VUE_APP_API_BACKEND}/user/validate/view-access`;
    const verifyToken = await fetch(url, settings);
    if (verifyToken.status >= 400 && verifyToken.status < 600) {
      this.$router.push("/categoria");

      return;
    }
  },
  created() {
    this.getCategoriesToMatch();
    this.getColors();
  },
  data() {
    return {
      name: "",
      price: "",
      category: "",
      colorAndImage: [],
      rules: {
        required: (value) => !!value || "Obligatorio",
        min: (value) => value > 5001 || "Precio incorrecto",
      },
      previewImages: [],
      images: [],
      colors: [],
      items: null,
      categories: null,
      base64: "",

      dialogColor: false,
      paletteColor: {
        hex: "#000000",
      },
      nameColor: "",

      previewImagesCategory: null,
      imageCategory: null,
      nameCategory: "",
      dialogCategory: false,
    };
  },
  methods: {
    generateImagePreview() {
      if (this.images.length < 1 || typeof this.images.length === "undefined")
        return;

      this.images.forEach((image) => {
        this.previewImages.push(URL.createObjectURL(image));
      });
    },
    generateImagePreviewCategory() {
      this.previewImagesCategory = URL.createObjectURL(this.imageCategory);
    },
    async addColorToName(index) {
      const base64 = await this.convertToBase64(this.images[index]);

      var imageIndex;
      this.colorAndImage.some((element, key) => {
        if (element.imageName === this.images[index].name)
          return (imageIndex = key);
      });

      if (typeof imageIndex === "undefined") {
        const colorAndImage = {
          imageBase64: base64,
          imageName: this.images[index].name,
          color: this.colors[index],
        };
        this.colorAndImage.push(colorAndImage);
        console.log({ newColor: base64 });
        return;
      }

      this.colorAndImage[imageIndex].color = {
        color: this.colors[index],
      };
      console.log({ sameColor: base64 });
      return;
    },
    convertToBase64(image) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(image);
      });
    },
    changeColor(newColor) {
      this.paletteColor.hex = newColor.hex;
    },
    async getCategoriesToMatch() {
      try {
        const settings = {
          method: "GET",
        };
        const url = `${process.env.VUE_APP_API_BACKEND}/category/match`;
        const dataReturned = await fetch(url, settings);
        const productsInJson = await dataReturned.json();

        this.categories = productsInJson;
      } catch (error) {
        console.log({ error });
      }
    },
    async getColors() {
      try {
        const settings = {
          method: "GET",
        };
        const url = `${process.env.VUE_APP_API_BACKEND}/color`;
        const dataReturned = await fetch(url, settings);
        const colorsInJson = await dataReturned.json();

        const color = colorsInJson.map((color) => {
          return { id: color.id, name: color.colorName };
        });
        this.items = color;
      } catch (error) {
        console.log({ error });
      }
    },
    async save(e) {
      e.preventDefault();
      const token = sessionStorage.getItem("token");

      if (!token) {
        this.$router.push("/categoria");

        return;
      }
      const settings = {
        method: "POST",
        body: JSON.stringify({
          name: this.name,
          price: this.price,
          stock: 1,
          category: this.category,
          colorAndImage: this.colorAndImage,
        }),
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const url = `${process.env.VUE_APP_API_BACKEND}/product`;
      try {
        const dataReturned = await fetch(url, settings);
        const userAccess = await dataReturned.json();
        if (dataReturned.status >= 400 && dataReturned.status < 600) {
          throw new Error(userAccess.message);
        }
      } catch (error) {
        this.showError = true;
        this.msg = error;
      }
    },
    async saveCategory(e) {
      e.preventDefault();

      const token = sessionStorage.getItem("token");

      if (!token) {
        this.$router.push("/categoria");

        return;
      }
      const formData = new FormData();
      formData.append("name", this.nameCategory);
      formData.append("image", this.imageCategory);
      const settings = {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const url = `${process.env.VUE_APP_API_BACKEND}/category`;
      try {
        const dataReturned = await fetch(url, settings);
        const categories = await dataReturned.json();
        if (dataReturned.status >= 400 && dataReturned.status < 600) {
          throw new Error(categories.message);
        }
        this.categories.push(categories.category);
        this.dialogCategory = false;
        this.nameCategory = "";
        this.imageCategory = null;
        this.previewImagesCategory = null;
      } catch (error) {
        this.showError = true;
        this.msg = error;
      }
    },
    async saveColor(e) {
      e.preventDefault();

      const token = sessionStorage.getItem("token");

      if (!token) {
        this.$router.push("/categoria");

        return;
      }
    },
  },
};
</script>
