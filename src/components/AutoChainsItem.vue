<template>
  <div class="chainItem me-3 mb-3">
    <div class="d-flex align-items-center justify-content-between mb-3">
      <p class="fs-5 me-3">Цепочка #{{ chainIndex + 1 }} <span class="percentage fs-6 p-1" :class="{
              percentage__good:
                chain.percentage >= 80,
              percentage__mid:
                chain.percentage >= 50 &&
                chain.percentage < 80,
              percentage__bad: chain.percentage < 50,
            }">{{chain.percentage}}%</span></p>
      <button class="btn btn-sm btn-outline-success myBtn rounded" @click.prevent="saveChain">Сохранить цепочку</button>
    </div>
    <div class="d-flex align-items-center">
      <div
        v-for="(item, index) of chain.objects"
        :key="index"
        class="d-flex align-items-center"
      >
        <div v-if="index != 0" class="me-2">
          <p
            class="text-center percentage"
            :class="{
              percentage__good:
                calcPercentage(item.all_scores, item.score) >= 80,
              percentage__mid:
                calcPercentage(item.all_scores, item.score) >= 50 &&
                calcPercentage(item.all_scores, item.score) < 80,
              percentage__bad: calcPercentage(item.all_scores, item.score) < 50,
            }"
          >
            {{ calcPercentage(item.all_scores, item.score) }}%
          </p>
          <div class="arrow"></div>
        </div>

        <auto-chain-post :item="item" />
      </div>
    </div>
  </div>
</template>

<script>
import AutoChainPost from "./AutoChainPost.vue";
import PostPhoto from "./PostPhoto.vue";
import {EventBus} from "@/helpers/eventBus";
export default {
  components: { PostPhoto, AutoChainPost },
  props: ["chain", "chainIndex"],
  data() {
    return {
    };
  },
  methods: {
    saveChain(){
      EventBus.$emit('openSaveGeneratedChainModal', this.chain.objects, this.chain.percentage)
    },
    calcPercentage(allScores, score){
      return Math.floor((score/allScores) * 100)
    },
  },
};
</script>

<style>
.chainItem {
  padding: 10px 20px 10px;
  background: var(--highlight);
  color: var(--font);
  border-radius: 10px;
  border: 1px solid var(--border);
}
.arrow {
  background-image: url("../assets/arrow_right.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 40px;
  height: 20px;
}
.percentage__good {
  //border: 1px solid var(--primary);
  color: var(--primary);
}
.percentage__mid {
  //border: 1px solid #a29718;
  color: #a29718;
}
.percentage__bad {
  //border: 1px solid var(--discard);
  color: var(--discard);
}
.percentage {
  padding: 1px 2px;
  border-radius: 5px;
  font-size: 12px;
  border: 1px solid #525252;
}
</style>