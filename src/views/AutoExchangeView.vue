<template>
  <div class="bigComponent w-100 mt-4 mb-4">
    <loader v-if="!ready" />

    <div v-if="ready">
      <div class="d-flex align-items-center justify-content-between mb-2">
        <p class="fs-3 fw-bold">Варианты обмена</p>
      </div>
      <div class="mb-3">
        <div class="d-flex align-items-center justify-content-between">
          <div class="d-flex align-items-center">
            <p class="me-5">Минимальный процент: </p>
            <div class="d-flex align-items-center me-3">
              <input type="range" class="form-range" min="0" max="100" v-model="percentage" />
              <p class="ms-2">{{ percentage }}%</p>
            </div>
            <button class="btn btn-outline-success myBtn me-2" @click.prevent="apply">Применить</button>
            <button class="btn btn-outline-danger myBtn" @click.prevent="reset">Сбросить</button>
          </div>
          <button class="btn btn-outline-primary" @click.prevent="updateChains">Обновить цепочки</button>
        </div>

      </div>

      <div class="d-flex align-items-center flex-wrap">
        <auto-chains-item
          v-for="(item, index) in chains"
          :key="index"
          :chain="item"
          :chainIndex="index"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Loader from "@/components/Loader.vue";
import AutoChainsItem from "@/components/AutoChainsItem.vue";
import axios from "axios";
import {EventBus} from "@/helpers/eventBus";

export default {
  components: { Loader, AutoChainsItem },
  data() {
    return {
      ready: true,
      chains: [],
      percentage: 80,
    };
  },
  methods: {
    updateChains() {
      this.ready = false;
      axios.post(process.env["VUE_APP_SERVER_URL"] + '/resetChains').then((res) => {
        if(res.data){
          this.reset()
        }
      })
    },
    apply() {
      this.ready = false;
      axios.post(process.env["VUE_APP_SERVER_URL"] + '/getAutoChains', {
        minimumPercentage: this.percentage
      }).then((res) => {
        this.chains = res.data.chains;

        this.ready = true;
      })
    },
    reset(){
      this.ready = false;
      axios.post(process.env["VUE_APP_SERVER_URL"] + '/getAutoChains', {
      }).then((res) => {
        this.chains = res.data.chains;

        this.percentage = 80;
        this.ready = true;
      })
    },
  },
  async mounted() {
    this.ready = false;
    axios.post(process.env["VUE_APP_SERVER_URL"] + '/getAutoChains').then((res) => {
      this.chains = res.data.chains;

      this.ready = true;
    })

    EventBus.$on('loadGeneratedChains', () => {
      this.reset();
    })
  },
};
</script>

<style>
</style>