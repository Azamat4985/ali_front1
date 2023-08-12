<template>
  <div
      v-if="ready"
      class="d-flex postWrapper align-items-stretch position-relative"
  >
      <router-link :to="`/post/${post._id}`" v-if="mainPhoto == null" class="noPhoto"></router-link>
      <router-link
          :to="`/post/${post._id}`"
          v-if="mainPhoto != null"
          :style="{ 'background-image': 'url(' + mainPhoto + ')' }"
          class="mainPhotoMini"
      ></router-link>

    <div class="post">
      <p>
        {{ post.type }}
        <span v-if="post.isOur == 'да'" class="our">ali-group</span>
      </p>
      <p>{{ post.city }}, {{ post.price.toLocaleString("ru") }}₸</p>
      <p>Обмен на: {{ post.ex_type }}</p>
    </div>

    <div class="controls d-flex flex-column align-items-center">
      <div class="replace mb-1" @click="replaceObject"></div>
      <div class="deleteObject" @click="deleteObject"></div>
    </div>
  </div>
</template>

<script>
import store from "@/store";
import {EventBus} from "@/helpers/eventBus";

export default {
  props: ["object", "position"],
  data() {
    return {
      mainPhoto: null,
      post: null,
      ready: false,
    };
  },
  watch: {
    async object(oldVal, newVal) {
      this.post = this.object;
      this.mainPhoto = null
      let formData = new FormData();
      formData.append("email", store.getters.getEmail);
      formData.append("hash", store.getters.getHash);
      formData.append("id", this.object._id);
      if (this.post.mainPhoto_path != "") {
        await fetch(`${process.env.VUE_APP_SERVER_URL}/getMainPhoto`, {
          method: "POST",
          body: formData,
        }).then(async (res) => {
          this.mainPhoto = URL.createObjectURL(await res.blob());
        }).then(() => {
          this.ready = true
        })
      } else {
        this.ready = true;
      }
    },
  },
  methods: {
    deleteObject() {
      EventBus.$emit('deleteObject', this.position)
    },
    replaceObject() {
      EventBus.$emit("replaceObject", this.post, this.position);
    },
  },
  async mounted() {
    this.post = this.object;
    let formData = new FormData();
    formData.append("email", store.getters.getEmail);
    formData.append("hash", store.getters.getHash);
    formData.append("id", this.object._id);
    if (this.post.mainPhoto_path != "") {
      await fetch(`${process.env.VUE_APP_SERVER_URL}/getMainPhoto`, {
        method: "POST",
        body: formData,
      }).then(async (res) => {
        this.mainPhoto = URL.createObjectURL(await res.blob());
      }).then(() => {
        this.ready = true;
      })
    } else {
      this.ready = true
    }
  },
};
</script>

<style scoped>
.deleteObject {
  width: 18px;
  height: 18px;
  background-image: url("../assets/delete_object_chain.svg");
  transition-duration: 0.2s;
  cursor: pointer;
}

.replace {
  width: 20px;
  height: 20px;
  background-image: url("../assets/replace_object.svg");
  transition-duration: 0.2s;
  cursor: pointer;
}

.replace:hover {
  background-image: url("../assets/replace_object_hover.svg");
}

.controls {
  position: absolute;
  right: 10px;
  top: 17%;
}

.our {
  padding: 2px;
  border-radius: 2px;
  background: rgba(255, 217, 0, 0.568);
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
  transition-duration: 0.2s;
}
</style>