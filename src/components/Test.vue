<template>
  <div style="padding-top: 2em">
    <v-container class="lighten-5">
      <v-row align="center" justify="center" dense id="sizeRowConva">
        <v-col
          md="8"
          lg="7"
          xl="7"
          cols="12"
          style="display: flex; align-items: center; justify-content: center"
          class="rounded-lg"
          ref="container"
          id="sizeCanva"
        >
          <v-stage
            ref="stage"
            :config="stageSize"
            @mousedown="handleStageMouseDown"
            @touchstart="handleStageMouseDown"
          >
            <v-layer ref="layer">
              <v-image
                :config="{
                  image: tShirtImage,
                }"
              />
              <v-image
                v-for="item in contentImageSettings"
                :key="item.id"
                :config="item"
                @transformend="changeWidthOrHeight"
                @dragend="changePosition"
              />
              <v-text
                @transformstart="transformText"
                @transform="transformText"
                @transformend="handleTransformEnd"
                @dragend="handleTransformEnd"
                v-for="item in contentTextSettings"
                :key="item.id"
                :config="item"
              />
              <v-transformer ref="transformer" />
            </v-layer>
          </v-stage>
        </v-col>
        <v-col
          md="4"
          lg="5"
          xl="5"
          cols="12"
          class="d-flex justify-center align-center"
          align="center"
        >
          <v-row align="stretch">
            <v-col cols="12">
              <v-file-input
                label="Cargar imagen"
                filled
                prepend-icon="mdi-camera"
                @change="handleImage"
                accept="image/*"
              ></v-file-input>
            </v-col>
            <div v-for="(color, indexColor) in imagesColor" :key="indexColor">
              <v-col cols="1">
                <span
                  class="circle"
                  :style="{
                    'background-color': color,
                  }"
                  @click="changeImage(indexColor)"
                ></span>
              </v-col>
            </div>
            <v-col cols="12">
              <v-dialog v-model="dialog" width="500">
                <template v-slot:activator="">
                  <v-text-field
                    label="Agregar texto"
                    v-model="text"
                    name="text"
                    type="text"
                    outlined
                    append-outer-icon="mdi-send"
                    @click:append-outer="dialog = true"
                  >
                    <template v-slot:prepend>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-icon v-on="on"> mdi-help-circle-outline </v-icon>
                        </template>
                        Agrega cualquier texto a tu prenda
                      </v-tooltip>
                    </template>
                  </v-text-field>
                </template>
                <v-card>
                  <v-card-title class="text-h5 grey lighten-2">
                    Colores de texto
                  </v-card-title>

                  <div
                    style="
                      background-color: #eeeeee;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                    "
                  >
                    <select-color @input="changeColor" :value="colors" />
                  </div>
                  <v-card-text>
                    <v-divider></v-divider>
                    <p class="text-md-center" style="padding-top: 2%">
                      Su texto quedará de la siguiente manera:
                      <br />
                      <span :style="{ color: colors.hex }" class="headline">{{
                        text
                      }}</span>
                    </p>
                  </v-card-text>

                  <v-divider></v-divider>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" text @click="dialog = false">
                      Cancelar
                    </v-btn>
                    <v-btn color="primary" text @click="addText">
                      Generar
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-col>
            <v-col cols="12">
              <v-textarea
                outlined
                name="input-7-4"
                label="Observaciones"
                v-model="description"
              >
                <template v-slot:prepend>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on"> mdi-help-circle-outline </v-icon>
                    </template>
                    Agrega observaciones: cosas que no pudiste hacer y quieres,
                    colores, etc..
                  </v-tooltip>
                </template>
              </v-textarea>
            </v-col>
            <v-col cols="6">
              <v-btn
                type="button"
                color="primary"
                @click="removeCustomizationWithAlert"
                >Reiniciar</v-btn
              >
            </v-col>
            <v-col cols="6">
              <v-btn
                type="button"
                @click="saveImage"
                color="primary"
                :disabled="disabledBtnSaveCustom"
                >Guardar</v-btn
              >
            </v-col>
            <v-col cols="12">
              <v-btn
                color="error"
                v-show="selectedShapeName !== ''"
                @click="removeSelectedImageOrText"
              >
                Eliminar imagen ó texto
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style>
.circle {
  height: 25px;
  width: 25px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
  cursor: pointer;
}
</style>

<script>
import { Sketch } from "vue-color";

export default {
  components: {
    SelectColor: Sketch,
  },
  mounted() {
    this.canvaSize();
    this.loadFirstImage();
  },
  created() {
    this.uploadLocalStorageImages();
    this.uploadLocalStorageText();

    window.addEventListener("resize", this.changeRect);
  },
  data() {
    return {
      disabledBtnSaveCustom: false,
      stageSize: {
        width: null,
        height: null,
      },
      images: [
        "Camisetanegra-delantera-trasera.jpg",
        "Camisetaroja-delantera-trasera.jpg",
        "CamisetaAzul-delantera-trasera.jpg",
        "Camisetablanca-delantera-trasera.jpg",
        "Camisetaverde-delantera-trasera.jpg",
        "Camisetagris-delantera-trasera.jpg",
        "CamisetaAmarilla-delantera-trasera.jpg",
        "Camisetarosa-delantera-trasera.jpg",
        "Camisetanaranja-delantera-trasera.jpg",
      ],
      imagesColor: [
        "#000000",
        "#F32B00",
        "#0032F3",
        "#FFFFFF",
        "#02DB32",
        "#ABABAB",
        "#FAFA00",
        "#ECA1FF",
        "#FFA300",
      ],
      contentImageSettings: [],
      contentTextSettings: [],
      selectedShapeName: "",
      customImage: null,
      tShirtImage: null,
      file: null,
      text: "",
      colors: {
        hex: "#000000",
      },
      dialog: false,
      description: "",
    };
  },
  methods: {
    canvaSize: function () {
      const width = document.getElementById("sizeCanva").offsetWidth;
      const height = document.getElementById("sizeRowConva").offsetHeight;
      this.stageSize.width = width;
      this.stageSize.height = height;
    },
    loadFirstImage: function () {
      const image = new Image(this.stageSize.width, this.stageSize.height);
      image.src =
        "https://s3-bucket-gradeproject.s3.amazonaws.com/Camisetanegra-delantera-trasera.jpg";
      image.crossOrigin = "Anonymous";

      image.onload = () => {
        this.tShirtImage = image;
      };
    },
    changeRect: function () {
      const container = this.$refs.container;

      if (!container) {
        return;
      }

      const height = container.offsetHeight;
      const width = container.offsetWidth;

      this.stageSize.width = width;
      this.stageSize.height = height;

      const image = new Image(width, height);
      image.src = this.tShirtImage.currentSrc;
      image.crossOrigin = "Anonymous";

      image.onload = () => {
        this.tShirtImage = image;
      };
    },
    changePosition(changeEvent) {
      const newImageSettings = changeEvent.target.attrs;

      this.setLocalStorage(
        newImageSettings,
        changeEvent.target.image().currentSrc
      );
    },
    changeWidthOrHeight(changeEvent) {
      const newImageSettings = changeEvent.target.attrs;

      this.setLocalStorage(
        newImageSettings,
        changeEvent.target.image().currentSrc
      );
    },
    transformText(e) {
      if (e.type === "transformstart") {
        this.saveUndo();
      } else if (e.type === "transform") {
        const rect = this.stage.layer.shape.find(
          (r) => r.name === this.selectedShapeName
        );
        var transformerNode = this.$refs.transformer.getNode();
        if (rect && transformerNode.getActiveAnchor() !== "rotater") {
          rect.width = Math.max(e.target.width() * e.target.scaleX(), 50);
          // rect.height = Math.max(e.target.height() * e.target.scaleY(), 0);

          rect.scaleX = 1;
          rect.scaleY = 1;
        }
      }
    },
    handleTransformEnd(e) {
      // shape is transformed, let us save new attrs back to the node
      // find element in our state
      if (e.type == "mouseup") {
        this.textEditor(e);
      }

      const rect = this.contentTextSettings.find(
        (r) => r.name === this.selectedShapeName
      );
      // update the state
      rect.x = e.target.x();
      rect.y = e.target.y();
      rect.rotation = e.target.rotation();
      if (rect.type != "text") {
        rect.scaleX = e.target.scaleX();
        rect.scaleY = e.target.scaleY();
      } else {
        this.transformText(e);
      }

      this.setLocalStorageText(e.target.attrs);
    },
    handleStageMouseDown(changeEvent) {
      console.log(changeEvent);
      if (changeEvent.target === changeEvent.target.getStage()) {
        this.selectedShapeName = "";
        this.updateTransformer();

        return;
      }

      const clickedOnTransformer =
        changeEvent.target.getParent().className === "Transformer";

      if (clickedOnTransformer) {
        return;
      }

      const name = changeEvent.target.name();
      const image = this.contentImageSettings.find(
        (image) => image.name === name
      );

      const text = this.contentTextSettings.find((text) => text.name === name);

      if (typeof image === "undefined" && typeof text === "undefined") {
        this.selectedShapeName = "";
      } else {
        this.selectedShapeName = name;
      }

      this.updateTransformer();
    },
    updateTransformer() {
      const transformerNode = this.$refs.transformer.getNode();
      const stage = transformerNode.getStage();
      const { selectedShapeName } = this;

      const selectedNode = stage.findOne("." + selectedShapeName);

      if (selectedNode === transformerNode.node()) {
        return;
      }

      if (selectedNode) {
        transformerNode.nodes([selectedNode]);
      } else {
        transformerNode.nodes([]);
      }
    },
    handleImage(selectedImage) {
      this.createBase64Image(selectedImage);
    },
    createBase64Image(image) {
      const reader = new FileReader();

      reader.onload = (e) => {
        this.customImage = e.target.result;
        this.uploadImage();
      };

      reader.readAsDataURL(image);
    },
    uploadImage() {
      const { customImage } = this;
      const uniqueImageName = "customImage" + new Date().toJSON();

      const image = new Image();
      image.src = customImage;
      image.crossOrigin = "anonymous";

      const imageSettings = {
        rotation: 0,
        x: 10,
        y: 10,
        width: 100,
        height: 100,
        scaleX: 1,
        scaleY: 1,
        name: uniqueImageName,
        draggable: true,
        image,
        offsetX: 0,
        offsetY: 0,
        skewX: 0,
        skewY: 0,
      };
      this.contentImageSettings.push(imageSettings);

      this.setLocalStorage(imageSettings, customImage);
    },
    addText() {
      const uniqueTextName = "customText" + new Date().toJSON();

      const textSettings = {
        x: 50,
        y: 60,
        rotation: 0,
        fontSize: 20,
        text: this.text,
        draggable: true,
        width: "auto",
        scaleX: 1,
        name: uniqueTextName,
        height: "auto",
        fill: this.colors.hex,
      };

      this.contentTextSettings.push(textSettings);
      this.dialog = false;
      this.text = "";

      this.setLocalStorageText(textSettings);
    },
    setLocalStorageText(textSettings) {
      localStorage.setItem(textSettings.name, JSON.stringify(textSettings));
    },
    setLocalStorage(imageSettings, imageBase64) {
      const imageElement = imageSettings.image;
      imageSettings.image = imageBase64;

      localStorage.setItem(imageSettings.name, JSON.stringify(imageSettings));

      imageSettings.image = imageElement;
    },
    uploadLocalStorageImages() {
      const localStorageImages = Object.entries(localStorage);
      localStorageImages.forEach((items) => {
        const [key, value] = items;

        if (!/customImage.*/.test(key)) {
          return;
        }

        const imageSettings = JSON.parse(value);
        const image = new Image();
        image.src = imageSettings.image;

        imageSettings.image = image;

        this.contentImageSettings.push(imageSettings);
      });
    },
    uploadLocalStorageText() {
      const localStorageText = Object.entries(localStorage);
      localStorageText.forEach((items) => {
        const [key, value] = items;

        if (!/customText.*/.test(key)) {
          return;
        }

        const textSettings = JSON.parse(value);

        this.contentTextSettings.push(textSettings);
      });
    },
    async saveImage() {
      let stage = this.$refs.stage.getNode();
      let dataURL = stage.toDataURL();
      if (!sessionStorage.getItem("token")) {
        this.$swal({
          title: "¿Estás seguro?",
          text: "La personalización se agregará a su carrito, pero no se guardará porque no ha ingresado con su cuenta",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Agrégalo",
          cancelButtonText: "Cancelar",
        }).then(async (result) => {
          if (result.isConfirmed) {
            this.disabledBtnSaveCustom = true;
            const settings = {
              method: "POST",
              body: JSON.stringify({
                imageBase64: dataURL,
              }),
              headers: {
                "Content-type": "application/json",
              },
            };

            const url = `${process.env.VUE_APP_API_BACKEND}/customization`;
            try {
              const dataReturned = await fetch(url, settings);
              const imageReturned = await dataReturned.json();
              if (dataReturned.status >= 400 && dataReturned.status < 600) {
                throw new Error(imageReturned.message);
              }
              let cart = localStorage.getItem("cart");

              if (!cart) {
                const contentCart = [
                  {
                    uuid: imageReturned.image,
                    price: 1,
                    name: "Camiseta personalizada",
                    quantity: 1,
                    image: `https://s3-bucket-gradeproject.s3.amazonaws.com/${imageReturned.image}`,
                  },
                ];

                localStorage.setItem("cart", JSON.stringify(contentCart));
                this.disabledBtnSaveCustom = false;
                this.$store.commit("changeCart", contentCart);
                return;
              }

              const contentCart = {
                uuid: imageReturned.image,
                price: 1,
                name: "Camiseta personalizada",
                quantity: 1,
                image: `https://s3-bucket-gradeproject.s3.amazonaws.com/${imageReturned.image}`,
              };

              cart = JSON.parse(cart);
              cart.push(contentCart);
              localStorage.setItem("cart", JSON.stringify(cart));
              this.removeCustomization();
              this.$swal({
                position: "center",
                icon: "success",
                title: "Su personalización se agregó al carrito",
                showConfirmButton: false,
                timer: 1500,
              });
              this.disabledBtnSaveCustom = false;
              this.$store.commit("changeCart", cart);
            } catch (error) {
              this.showError = true;
              this.msg = error;
            }
          }
        });

        return;
      }
      this.disabledBtnSaveCustom = true;
      const settings = {
        method: "POST",
        body: JSON.stringify({
          imageBase64: dataURL,
          description: this.description,
          user: sessionStorage.getItem("uuid"),
        }),
        headers: {
          "Content-type": "application/json",
        },
      };

      const url = `${process.env.VUE_APP_API_BACKEND}/customization`;
      try {
        const dataReturned = await fetch(url, settings);
        const imageReturned = await dataReturned.json();
        if (dataReturned.status >= 400 && dataReturned.status < 600) {
          throw new Error(imageReturned.message);
        }

        let cart = localStorage.getItem("cart");

        if (!cart) {
          const contentCart = [
            {
              uuid: imageReturned.image,
              price: 1,
              name: "Camiseta personalizada",
              quantity: 1,
              image: `https://s3-bucket-gradeproject.s3.amazonaws.com/${imageReturned.image}`,
            },
          ];

          localStorage.setItem("cart", JSON.stringify(contentCart));
          this.disabledBtnSaveCustom = false;
          this.$store.commit("changeCart", contentCart);
          return;
        }

        const contentCart = {
          uuid: imageReturned.image,
          price: 1,
          name: "Camiseta personalizada",
          quantity: 1,
          image: `https://s3-bucket-gradeproject.s3.amazonaws.com/${imageReturned.image}`,
        };

        cart = JSON.parse(cart);
        cart.push(contentCart);
        localStorage.setItem("cart", JSON.stringify(cart));
        this.removeCustomization();

        const description = this.description;
        this.description = "";

        this.$swal({
          position: "center",
          icon: "success",
          title: "Su personalización se agregó al carrito",
          showConfirmButton: false,
          timer: 1500,
        });
        this.disabledBtnSaveCustom = false;
        this.$store.commit("changeCartLogging", {
          cartContent: cart,
          custom: {
            description,
            createdAt: "",
            namePersonalization: imageReturned.image,
          },
        });
      } catch (error) {
        this.disabledBtnSaveCustom = false;
        this.$swal({
          position: "center",
          icon: "error",
          title: error,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    },
    removeSelectedImageOrText() {
      const imageIndex = this.contentImageSettings.findIndex(
        (value) => value.name == this.selectedShapeName
      );

      const textIndex = this.contentTextSettings.findIndex(
        (value) => value.name == this.selectedShapeName
      );

      if (imageIndex === -1) {
        localStorage.removeItem(this.contentTextSettings[textIndex].name);
        this.contentTextSettings.splice(textIndex, 1);

        return;
      }

      localStorage.removeItem(this.contentImageSettings[imageIndex].name);
      this.contentImageSettings.splice(imageIndex, 1);
    },
    changeColor(newColor) {
      this.colors.hex = newColor.hex;
    },
    removeCustomization() {
      const storage = Object.keys(localStorage);
      storage.forEach((key) => {
        if (!/customText.*/.test(key) && !/customImage.*/.test(key)) {
          return;
        }

        localStorage.removeItem(key);
      });
      this.contentImageSettings = [];
      this.contentTextSettings = [];
    },
    removeCustomizationWithAlert() {
      this.$swal({
        title: "¿Estás seguro?",
        text: "Se perderán todos los logotipos/textos que haya agregado",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Reinícialo",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          this.removeCustomization();
          this.$swal({
            position: "center",
            icon: "success",
            title: "Se eliminó correctamente todos los logotipos/textos",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
    },
    changeImage(index) {
      const image = new Image(this.stageSize.width, this.stageSize.height);
      image.src =
        "https://s3-bucket-gradeproject.s3.amazonaws.com/" + this.images[index];
      image.crossOrigin = "Anonymous";

      image.onload = () => {
        this.tShirtImage = image;
      };
    },
  },
};
</script>
