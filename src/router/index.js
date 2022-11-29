import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";
import Category from "../views/Category.vue";
import ProductsByCategory from "../views/Products.vue";
import Login from "../views/Login.vue";
import Register from "../views/UserRegister.vue";
import Test from "../views/Test.vue";
import CreateProduct from "../components/CreateProduct.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/productos/nuevo",
    name: "newProduct",
    component: CreateProduct,
  },
  {
    path: "/categoria",
    name: "Category",
    component: Category,
  },
  {
    path: "/productos/:categoryUuid",
    name: "productsByCategory",
    component: ProductsByCategory,
  },
  {
    path: "/ingresar",
    name: "Login",
    component: Login,
  },
  {
    path: "/registrarse",
    name: "Register",
    component: Register,
  },
  {
    path: "/personalizar",
    name: "test",
    component: Test,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
