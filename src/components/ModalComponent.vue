<template>
  <div>
    <div class="myModal--bg" @click.prevent="closeModal">
    </div>
      <div class="myModal p-3 rounded">
        <slot></slot>
      </div>
  </div>
</template>

<script>
import {EventBus} from "@/helpers/eventBus";

export default {
  methods: {
    closeModal(){
      EventBus.$emit('closeSaveGeneratedChainModal')
    }
  }
}
</script>

<style scoped>

.myModal--bg{
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.84);
  position: absolute;
  top: 0;
  left: 0;
  cursor: pointer;
}
.myModal{
  z-index: 999;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--component);
  min-width: 400px;
}
</style>