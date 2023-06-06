<template>
  <div class="chainItem mr-3 mb-2">
    <div class="d-flex align-items-center justify-content-between mb-1">
      <p class="mb-2 fw-bold fs-4">{{ chain.name }}</p>
      <div class="d-flex align-items-center">
        <button class="editBtn me-2" @click="editChain(chain._id)">ред.</button>
        <button class="removeBtn me-2" @click="removeChain(chain._id)">
          <img src="../assets/delete.png" alt="" width="20" />
        </button>
      </div>
    </div>

    <div class="d-flex align-items-stretch mb-2 justify-content-between">
      <div v-for="(item, index) in objects" :key="index">
        <div class="d-flex align-items-center">
          <div class="d-flex flex-column align-items-center" v-if="index != 0">
            <div class="arrow me-2"></div>
            <p
              class="percentage"
              :class="{
                percentage__good: getPercentage(index) >= 80,
                percentage__mid:
                  getPercentage(index) >= 50 && getPercentage(index) < 80,
                percentage__bad: getPercentage(index) < 50,
              }"
            >
              {{ getPercentage(index) }}%
            </p>
          </div>
          <div
            class="me-2 chainItem__photoClickable"
            @click="$router.push(`/post/${item._id}`)"
          >
            <div class="noPhoto" v-if="item.mainPhoto_path == ''"></div>
            <div
              class="mainPhoto"
              :style="{ 'background-image': 'url(' + photos[index] + ')' }"
              v-if="item.mainPhoto_path != ''"
            ></div>
            <p style="font-size: 12px">{{ item.type }}</p>
          </div>
        </div>
      </div>
    </div>

    <p style="font-size: 12px">
      {{ chain.createdBy }},
      {{ new Date(chain.createdAt).toLocaleDateString("ru") }}
    </p>
    <p>
      Вероятность сделки:
      <span
        class="probability fw-bold"
        :class="{
          percentage__good: getProbability() >= 80,
          percentage__mid: getProbability() >= 50 && getProbability() < 80,
          percentage__bad: getProbability() < 50,
        }"
        >{{ getProbability() }}%</span
      >
    </p>
  </div>
</template>

<script>
import { EventBus } from "@/helpers/eventBus";
export default {
  props: ["chain"],
  data() {
    return {
      objects: [],
      ready: false,
      photos: [],
    };
  },
  methods: {
    async removeChain(id) {
      if (confirm("Вы уверены?")) {
        let formdata = new FormData();
        formdata.append('chainId', id);
        await fetch(`${process.env.VUE_APP_SERVER_URL}/removeChain`, {
          method: 'post',
          body: formdata
        }).then(async (res) => {
          let data = await res.json();
          if(data.info == 200){
            this.$toast.success("Успешно удалено", { timeout: 3000 });
              EventBus.$emit("updateView");
          }
        })
      }
    },
    editChain(id) {
      EventBus.$emit("openChainModal", id);
    },
    getProbability() {
      let all_scores = 0;
      let score = 0;
      for (let i = 1; i < this.chain.objects.length; i++) {
        all_scores += this.chain.objects[i].all_scores;
        score += this.chain.objects[i].score;
      }
      return Math.round((score / all_scores) * 100);
    },
    getPercentage(index) {
      let item = this.chain.objects[index];
      return Math.round((item.score / item.all_scores) * 100);
    },
  },
  async mounted() {
    for (const item of this.chain.objects) {
      let formdata = new FormData();
      formdata.append("id", item._id);
      await fetch(`${process.env.VUE_APP_SERVER_URL}/getPostItem`, {
        method: "post",
        body: formdata,
      }).then(async (res) => {
        this.objects.push(await res.json());
      });
    }

    for (let i = 0; i < this.chain.objects.length; i++) {
      let formdata = new FormData();
      formdata.append("id", this.chain.objects[i]._id);
      await fetch(`${process.env.VUE_APP_SERVER_URL}/getMainPhoto`, {
        method: "post",
        body: formdata,
      }).then(async (res) => {
        let data = await res.blob();
        this.photos.push(URL.createObjectURL(data));
      });
    }

    this.ready = true;
  },
};
</script>

<style scoped>
.removeBtn {
  background-color: var(--discard);
  border: none;
  border-radius: 5px;
  transition-duration: 0.2s;
}
.editBtn {
  border: 1px solid var(--primary);
  color: var(--primary);
  background: transparent;
  border-radius: 5px;
  transition-duration: 0.2s;
}
.editBtn:hover {
  background-color: var(--highlight);
}
.chainItem__photoClickable {
  cursor: pointer;
}
.chainItem__photoClickable:hover .mainPhoto {
  outline: 1px solid var(--link);
}
.chainItem__photoClickable:hover .noPhoto {
  outline: 2px solid var(--link);
}
.probability {
  padding: 3px 5px;
  border-radius: 5px;
}
.percentage__good {
  border: 1px solid var(--primary);
  color: var(--primary);
}
.percentage__mid {
  border: 1px solid #a29718;
  color: #a29718;
}
.percentage__bad {
  border: 1px solid var(--discard);
  color: var(--discard);
}
.percentage {
  padding: 2px 3px;
  border-radius: 5px;
  font-size: 10px;
}
.arrow {
  background-image: url("../assets/arrow_right.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 40px;
  height: 20px;
}
.mainPhoto {
  width: 50px;
  height: 50px;
  background-size: cover;
  border-radius: 5px;
}
.noPhoto {
  width: 50px;
  height: 50px;
  background-image: url("../assets/no_img.jpeg");
  background-size: cover;
  border-radius: 5px;
}
.chainItem {
  padding: 10px 20px 10px;
  background: var(--highlight);
  border-radius: 5px;
  color: var(--font);
}
</style>