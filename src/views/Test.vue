<template>
  <div>
    <test-category ref="customize" />
  </div>
</template>

<script>
import TestCategory from "@/components/Test.vue";

export default {
  name: "signup",
  components: {
    TestCategory,
  },
  data() {
    return {
      msg: "",
      showError: false,
    };
  },
  methods: {},
};
</script>
