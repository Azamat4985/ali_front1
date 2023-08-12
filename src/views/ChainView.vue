<template>
  <div class="bigComponent w-100 mt-4 mb-4 position-relative">
    <loader v-if="!ready" />

    <div v-if="ready">
      <div class="d-flex align-items-center justify-content-between mb-4">
        <p class="fs-3 fw-bold">Цепочки обменов</p>
        <button class="btn btn-outline-success myBtn" @click="showModal">
          Добавить цепочку +
        </button>
      </div>

      <div class="d-flex flex-wrap align-items-center">
        <chain-item
          v-for="chain in chains"
          :chain="chain"
          :key="chain.createdAt"
          class="me-3"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Loader from "@/components/Loader.vue";
import { EventBus } from "@/helpers/eventBus";
import ChainItem from "@/components/ChainItem.vue";

export default {
  components: { Loader, ChainItem },
  data() {
    return {
      ready: true,
      chains: [],
    };
  },
  methods: {
    showModal() {
      EventBus.$emit("openChainModal", null);
    },
    async updateView() {
      this.ready = false;
      await fetch(`${process.env.VUE_APP_SERVER_URL}/getChains`, {
        method: "post",
      }).then(async (res) => {
        this.chains = await res.json();
        this.ready = true;
      });
    },
  },
  async mounted() {
    EventBus.$on("updateView", () => {
      this.updateView();
    });

    await fetch(`${process.env.VUE_APP_SERVER_URL}/getChains`, {
      method: "post",
    }).then(async (res) => {
      this.chains = await res.json();
    });
  },
};
</script>

<style scoped>
</style>