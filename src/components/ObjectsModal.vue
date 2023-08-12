<template>
  <div>
    <div class="objectsBg" @click="closeObjectsModal"></div>
    <div class="objectsModal">
      <p>Выбор объекта</p>
      <div class="d-flex mb-4"></div>
      <div class="d-flex flex-wrap" v-if="isFirst">
        <post-mini
          v-for="post in objects"
          :key="post.createdAt"
          :post="post"
          :chosenObj="chosenObj"
        />
      </div>

      <div class="d-flex align-items-start col-12" v-if="!isFirst">
        <div class="d-flex flex-column col-4">
          <p class="fw-bold fs-5 gold mb-3">Золото</p>
          <post-mini
            v-for="post in objects.gold"
            :key="post.createdAt"
            :post="post"
            :chosenObj="chosenObj"
          />
        </div>
        <div class="d-flex flex-column col-4">
          <p class="fw-bold fs-5 silver mb-3">Серебро</p>
          <post-mini
            v-for="post in objects.silver"
            :key="post.createdAt"
            :post="post"
            :chosenObj="chosenObj"
          />
        </div>
        <div class="d-flex flex-column col-4">
          <p class="fw-bold fs-5 bronze mb-3">Бронза</p>
          <post-mini
            v-for="post in objects.bronze"
            :key="post.createdAt"
            :post="post"
            :chosenObj="chosenObj"
          />
        </div>
      </div>

      <div class="d-flex justify-content-end align-items-center">
        <button class="btn btn-danger me-3" @click="closeObjectsModal">
          Отмена
        </button>
        <button class="btn successBtn" @click="choose">Выбрать</button>
      </div>
    </div>
  </div>
</template>

<script>
import store from "@/store";
import PostMini from "./PostMini.vue";
import { EventBus } from "@/helpers/eventBus";
export default {
  components: { PostMini },
  props: ["lastObject", "isEdit", "replaceIndex"],
  data() {
    return {
      objects: [],
      chosenObj: null,
      isFirst: false,
    };
  },
  methods: {
    choose() {
      this.closeObjectsModal();
      let obj;
      if (!this.isFirst) {
        let allObjects = [
          ...this.objects.gold,
          ...this.objects.silver,
          ...this.objects.bronze,
        ];
        obj = allObjects.find((obj) => obj._id == this.chosenObj);
      } else {
        obj = this.objects.find((obj) => obj._id == this.chosenObj);
      }
      if (!this.isEdit) {
        EventBus.$emit("addObj", obj);
      } else {
        EventBus.$emit("replaceObj", obj, this.replaceIndex)
      }
    },
    closeObjectsModal() {
      EventBus.$emit("closeObjectsModal");
    },
  },
  async mounted() {
    EventBus.$on("objChosen", (id) => {
      this.chosenObj = id;
    });

    let formData = new FormData();
    formData.append("role", store.getters.getRole);
    if (this.lastObject == null) {
      formData.append('isChain', true)
      this.isFirst = true;
      await fetch(`${process.env.VUE_APP_SERVER_URL}/getPosts`, {
        method: "POST",
        body: formData,
      }).then(async (res) => {
        this.objects = await res.json();
      });
    } else {
      formData.append("id", this.lastObject._id);
      await fetch(`${process.env.VUE_APP_SERVER_URL}/findMatching`, {
        method: "POST",
        body: formData,
      }).then(async (res) => {
        this.objects = await res.json();
      });
    }
  },
};
</script>

<style scoped>
.gold {
  color: var(--gold);
}
.silver {
  color: var(--silver);
}
.bronze {
  color: var(--bronze);
}
.objectsBg {
  position: absolute;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.41);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}
.objectsModal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--component);
  z-index: 999;
  padding: 20px;
  border-radius: 10px;
  color: white;
  min-width: 800px;
  z-index: 1001;
}
</style>