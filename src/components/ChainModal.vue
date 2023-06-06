<template>
  <div>
    <div class="chainBg" @click="closeModal"></div>
    <div class="chainModal">
      <div class="d-flex align-items-center justify-content-between">
        <input
          type="text"
          class="chainNameInput mb-4"
          placeholder="Название цепочки..."
          v-model="name"
        />
        <button class="btn btn-danger" @click="reset">Сбросить</button>
      </div>

      <div class="d-flex align-items-stretch mb-3">
        <div class="d-flex align-items-center">
          <chain-object v-if="objects[0]" :object="objects[0]" :position="0" />

          <div class="d-flex flex-column align-items-center" v-if="objects[1]">
            <p class="percentage">
              {{ getPercentage(objects[1].all_scores, objects[1].score) }}%
            </p>
            <div class="arrow"></div>
          </div>
          <chain-object v-if="objects[1]" :object="objects[1]" :position="1" />

          <div class="d-flex flex-column align-items-center" v-if="objects[2]">
            <p class="percentage">
              {{ getPercentage(objects[2].all_scores, objects[2].score) }}%
            </p>
            <div class="arrow"></div>
          </div>
          <chain-object v-if="objects[2]" :object="objects[2]" :position="2" />

          <div class="d-flex flex-column align-items-center" v-if="objects[3]">
            <p class="percentage">
              {{ getPercentage(objects[3].all_scores, objects[3].score) }}%
            </p>
            <div class="arrow"></div>
          </div>
          <chain-object v-if="objects[3]" :object="objects[3]" :position="3" />
        </div>

        <div class="d-flex align-items-center" v-if="canAdd()">
          <div class="arrow" v-if="objects.length != 0"></div>
          <div class="add_obj" @click="openObjectsModal">
            <img src="../assets/plus.png" alt="" />
          </div>
        </div>
      </div>

      <div class="d-flex justify-content-end align-items-center">
        <p class="me-3">Вероятность обмена: {{ getProbabilty() }}%</p>
        <button class="btn btn-primary" @click="save">Сохранить</button>
      </div>
    </div>
  </div>
</template>

<script>
import { EventBus } from "@/helpers/eventBus";
import PostMini from "./PostMini.vue";
import ChainObject from "./ChainObject.vue";
import store from "@/store";
export default {
  components: { PostMini, ChainObject },
  props: ["id"],
  data() {
    return {
      name: "",
      probabilty: 0,
      objects: [],
    };
  },
  methods: {
    async save() {
      let isErr = false;
      if (this.name == "") {
        alert("Введите название цепочки");
        isErr = true;
      }
      if (this.objects.length <= 2) {
        alert("Слишком мало объектов");
        isErr = true;
      }
      if (!isErr) {
        let formdata = new FormData();
        let data = JSON.stringify({
          name: this.name,
          probability: this.getProbabilty(),
          objects: this.objects,
          createdBy: store.getters.getName,
          chainId: this.id ? this.id : null,
        });
        formdata.append("data", data);
        if (this.id == null) {
          await fetch(`${process.env.VUE_APP_SERVER_URL}/saveChain`, {
            method: "POST",
            body: formdata,
          }).then(async (res) => {
            let data = await res.json();
            if (data.info == 200) {
              this.$toast.success("Успешно сохранено", { timeout: 3000 });
              EventBus.$emit("closeChainModal");
              EventBus.$emit("closeObjectsModal");
              EventBus.$emit("updateView");
            }
            if (data.info == "duplicate") {
              this.$toast.error("Цепочка с таким названием уже существует!", {
                timeout: 5000,
              });
            }
          });
        } else {
          await fetch(`${process.env.VUE_APP_SERVER_URL}/updateChain`, {
            method: "post",
            body: formdata,
          }).then(async (res) => {
            let data = await res.json();
            if (data.info == 200) {
              this.$toast.success("Успешно сохранено", { timeout: 3000 });
              EventBus.$emit("closeChainModal");
              EventBus.$emit("closeObjectsModal");
              EventBus.$emit("updateView");
            }
          });
        }
      }
    },
    reset() {
      if (confirm("Вы уверены что хотите сбросить цепочку?")) {
        this.objects = [];
        this.name = "";
      }
    },
    getPercentage(all_scores, score) {
      return Math.round((score / all_scores) * 100);
    },
    getProbabilty() {
      if (this.objects.length > 1) {
        let all_scores = 0;
        let scores = 0;
        for (let i = 1; i < this.objects.length; i++) {
          all_scores = all_scores + this.objects[i].all_scores;
          scores = scores + this.objects[i].score;
        }
        return Math.round((scores / all_scores) * 100);
      } else {
        return "0";
      }
    },
    closeModal() {
      EventBus.$emit("closeChainModal");
    },
    openObjectsModal() {
      EventBus.$emit("openObjectsModal", this.objects[this.objects.length - 1]);
    },
    openReplaceModal(post, position) {
      if (position == 0) {
        EventBus.$emit("openObjectsModal", null, true, position);
      } else {
        let prev = this.objects[position - 1];
        EventBus.$emit("openObjectsModal", prev, true, position);
      }
    },
    replaceObject(post, index) {
      this.objects.splice(index, 1, post);
      this.objects.splice(index + 1, 4);
    },
    addObject(post) {
      this.objects.push(post);
    },
    deleteObject(index) {
      if (confirm("Вы уверены?")) {
        this.objects.splice(index, 4);
      }
    },
    canAdd() {
      let canAdd = true;
      if (this.objects.length == 4) {
        canAdd = false;
      } else if (this.objects.length >= 2) {
        for (let i = 1; i < this.objects.length; i++) {
          if (this.objects[i]._id == this.objects[0]._id) {
            canAdd = false;
          }
        }
      }

      return canAdd;
    },
  },
  async mounted() {
    if (this.id != null) {
      let formdata = new FormData();
      formdata.append("id", this.id);
      await fetch(`${process.env.VUE_APP_SERVER_URL}/getChainById`, {
        method: "post",
        body: formdata,
      }).then(async (res) => {
        let chainData = await res.json();
        console.log(chainData);
        this.name = chainData.name;
        for (const object of chainData.objects) {
          let formdata = new FormData();
          formdata.append("id", object._id);
          formdata.append("email", this.$store.getters.getEmail);
          formdata.append("hash", this.$store.getters.getHash);
          await fetch(`${process.env.VUE_APP_SERVER_URL}/getPostItem`, {
            method: "post",
            body: formdata,
          }).then(async (res) => {
            let objectData = await res.json();
            objectData.all_scores = object.all_scores;
            objectData.score = object.score;
            this.addObject(objectData);
          });
        }
      });
    }
    EventBus.$on("addObj", (post) => {
      this.addObject(post);
    });
    EventBus.$on("replaceObject", (post, position) => {
      this.openReplaceModal(post, position);
    });
    EventBus.$on("replaceObj", (post, replaceIndex) => {
      this.replaceObject(post, replaceIndex);
    });
    EventBus.$on("deleteObject", (index) => {
      this.deleteObject(index);
    });
  },
};
</script>

<style scoped>
.percentage {
  font-size: 12px;
  margin-bottom: 5px;
}
.arrow {
  background-image: url("../assets/arrow_right.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 50px;
  height: 20px;
}
.add_obj {
  width: 200px;
  min-height: 50px;
  height: 100%;
  background-color: var(--highlight);
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition-duration: 0.2s;
}
.add_obj:hover {
  transform: scale(1.05);
}
.chainNameInput {
  background: transparent;
  border: none;
  border-bottom: 1px solid white;
  padding: 5px 10px;
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
  color: white;
  width: 50%;
}
.chainNameInput:focus-within {
  border-bottom: 1px solid var(--link);
}
.chainNameInput:focus-visible {
  outline: none;
  border-bottom: 1px solid var(--link);
}
.chainBg {
  position: absolute;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.41);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.chainModal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--component);
  z-index: 999;
  padding: 20px;
  border-radius: 10px;
  color: white;
  min-width: 1000px;
}
</style>