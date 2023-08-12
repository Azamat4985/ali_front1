<template>
  <div
    class="d-flex me-3 mb-3 postWrapper align-items-stretch"
    @click="chooseObj(post._id)"
  >
    <div class="noPhoto" v-if="mainPhoto == null"></div>
    <div
      class="mainPhotoMini"
      v-if="mainPhoto != null"
      :style="{ 'background-image': 'url(' + mainPhoto + ')' }"
    ></div>

    <div class="post">
      <p>{{ post.type }} <span v-if="post.isOur == 'да'" class="our">ali-group</span></p>
      <p>{{ post.city }}, {{ post.price.toLocaleString("ru") }}₸</p>
      <p>Обмен на: {{ post.ex_type }}</p>
      <div class="chosen" v-if="chosenObj == post._id"></div>
    </div>
  </div>
</template>

<script>
import store from "@/store";
import { EventBus } from "@/helpers/eventBus";
export default {
  props: ["post", "chosenObj"],
  data() {
    return {
      mainPhoto: null,
    };
  },
  async mounted() {
    if (this.post.mainPhoto_path != "") {
      let formData = new FormData();
      formData.append("email", store.getters.getEmail);
      formData.append("hash", store.getters.getHash);
      formData.append("id", this.post._id);
      await fetch(`${process.env.VUE_APP_SERVER_URL}/getMainPhoto`, {
        method: "POST",
        body: formData,
      }).then(async (res) => {
        this.mainPhoto = URL.createObjectURL(await res.blob());
      });
    }
  },
  methods: {
    chooseObj(id) {
      EventBus.$emit("objChosen", id);
    },
  },
};
</script>

<style scoped>

.our{
  padding: 2px;
  border-radius: 2px;
  background: rgba(255, 217, 0, 0.568);
}
.chosen {
  background-image: url("../assets/chosen.png");
  width: 30px;
  height: 30px;
  position: absolute;
  background-size: contain;
  right: 20px;
  top: 25%;
  //box-shadow: 0px 0px 10px 10px rgb(36, 36, 36);
}
.noPhoto {
  background-image: url("../assets/no_img.jpeg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  width: 70px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}
.mainPhotoMini {
  background-color: var(--bg);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  width: 70px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}
.post {
  background-color: var(--highlight);
  border: 1px solid var(--border);
  padding: 5px 15px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  width: 100%;
  position: relative;
}
.postWrapper {
  width: 230px;
  font-size: 12px;
  max-height: 100px;
  cursor: pointer;
  transition-duration: 0.2s;
}
.postWrapper:hover {
  transform: scale(1.05);
}
</style>