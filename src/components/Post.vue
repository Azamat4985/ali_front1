<template>
  <router-link
    class="post me-3 mb-3 d-flex flex-column justify-content-between"
    :to="`/post/${post._id}`"
  >
    <div class="d-flex flex-column align-items-start">
      <div
        class="post__img mb-2"
        :style="{ 'background-image': 'url(' + mainPhoto_URL + ')' }"
        v-if="mainPhoto_URL != null"
      ></div>

      <div class="post__img mb-2" v-if="mainPhoto_URL == null"></div>

      <p class="fw-bold mb-2">
        {{ post.type }}
        <span class="our ms-2" v-if="post.isOur == 'да'">ali-group</span>
        <span v-if="post.isOur == 'нет'" class="fw-normal"> ➝ {{ post.ex_type }}</span>
      </p>
      <div class="d-flex flex-wrap mb-2">
        <span v-for="extra in post.extra" :key="extra" class="extra">{{
          extra
        }}</span>
      </div>
    </div>
    <div class="d-flex flex-column align-items-start">
      <p class="fs-5 mb-2 fw-bold">{{ post.price.toLocaleString("ru") }} ₸</p>
      <div class="d-flex align-items-stretch mb-2">
        <router-link
          class="btn btn-outline-success myBtn me-1 flex-grow-1"
          :to="`/update/${post._id}`"
        >
          Изменить
        </router-link>
        <button class="btn btn-outline-primary myBtn me-1" @click.prevent="saveFav">
          <div class="favIcon" :class="{ 'favIcon--active': isFavData }"></div>
        </button>
        <button class="btn btn-outline-danger myBtn" @click.prevent="deletePost" v-if="!delete_pending">
          <div class="delIcon"></div>
        </button>
        <button
          class="btn btn-outline-danger myBtn"
          @click="deletePost"
          v-if="delete_pending"
          disabled
        >
          <div
            class="spinner-border spinner-border-sm text-white"
            role="status"
          >
            <span class="visually-hidden">Loading...</span>
          </div>
        </button>
      </div>
      <p class="post__date text-end">{{ formatDate(post.createdAt) }}</p>
      <p class="post__date text-end">{{ post.name }}</p>
    </div>
  </router-link>
</template>

<script>
import store from "@/store/index.js";
import { EventBus } from "../helpers/eventBus.js";
export default {
  props: ["post", "myFavs"],
  data() {
    return {
      isFavData: false,
      mainPhoto_URL: null,
      delete_pending: false,
    };
  },
  async mounted() {
    if (this.myFavs.includes(this.post._id)) {
      this.isFavData = true;
    }

    if (this.post.mainPhoto_path != "") {
      let formdata = new FormData();
      formdata.append("email", store.getters.getEmail);
      formdata.append("hash", store.getters.getHash);
      formdata.append("id", this.post._id);

      await fetch(`${process.env.VUE_APP_SERVER_URL}/getMainPhoto`, {
        method: "POST",
        body: formdata,
      }).then(async (res) => {
        this.mainPhoto_URL = URL.createObjectURL(await res.blob());
      });
    }
  },
  methods: {
    async saveFav() {
      event.stopPropagation();
      let formdata = new FormData();
      formdata.append("email", store.getters.getEmail);
      formdata.append("id", this.post._id);

      if (this.isFavData) {
        await fetch(`${process.env.VUE_APP_SERVER_URL}/deleteFav`, {
          method: "POST",
          body: formdata,
        }).then((res) => {
          console.log(res);
          this.isFavData = false;
        });
      } else {
        await fetch(`${process.env.VUE_APP_SERVER_URL}/saveFav`, {
          method: "POST",
          body: formdata,
        }).then((res) => {
          console.log(res);
          this.isFavData = true;
        });
      }
    },
    formatDate(date) {
      let formatted = new Date(date);
      return formatted.toLocaleString("ru");
    },
    async deletePost() {
      event.stopPropagation();
      if (confirm("Вы уверены что хотите удалить объект?")) {
        this.delete_pending = true;
        let formdata = new FormData();
        formdata.append("id", this.post._id);
        await fetch(`${process.env.VUE_APP_SERVER_URL}/deletePost`, {
          method: "POST",
          body: formdata,
        }).then(async (res) => {
          let data = await res.json();
          this.delete_pending = false;
          if (data.info == 200) {
            this.$toast.success("Успешно удалено", { timeout: 3000 });
            EventBus.$emit("reloadPosts");
          } else if (data.info == "postUsed") {
            this.$toast.error(`Объект используется в цепочке ${data.name}`, {
              timeout: 5000,
            });
          }
        });
      }
    },
  },
};
</script>

<style scoped>
.our {
  font-size: 10px;
  font-weight: normal;
  background-color: rgba(255, 217, 0, 0.568);
  padding: 3px;
  border-radius: 5px;
  white-space: nowrap;
}
.delBtn {
  background: #313745;
  transition-duration: 0.1s;
}
.delBtn:hover {
  background: #3e4658;
}
.delBtn:hover .delIcon {
  background-image: url("../assets/deletePost_active.png");
}
.delIcon {
  background-image: url("../assets/deletePost.png");
  width: 20px;
  height: 20px;
  background-size: contain;
  transition-duration: 0.1s;
}
.favIcon--active {
  background-image: url("../assets/fav_active.png") !important;
}
.favIcon {
  background-image: url("../assets/fav.png");
  width: 20px;
  height: 20px;
  background-size: contain;
  transition-duration: 0.1s;
}
.favBtn {
  background: var(--highlight);
  transition-duration: 0.1s;
}
.favBtn:hover {
  background: #3e4658;
}
.favBtn:hover .favIcon {
  background-image: url("../assets/fav_active.png");
}
.post {
  padding: 15px;
  border-radius: 10px;
  background-color: var(--highlight);
  border: 1px solid var(--border);
  max-width: 240px;
  cursor: pointer;
  transition-duration: 0.1s;
}
.post:hover {
  transform: scale(1.03);
}
.post__img {
  background-repeat: no-repeat;
  width: 210px;
  height: 150px;
  background-size: contain;
  background-image: url("../assets/no_img.jpeg");
  background-position: center;
  background-color: var(--bg);
  border-radius: 10px;
}
.extra {
  color: var(--font);
  padding: 5px 10px;
  background: var(--highlight);
  border: 1px solid var(--border);
  border-radius: 10px;
  font-size: 12px;
  margin-right: 2px;
  margin-bottom: 5px;
}
.post__date {
  font-size: 12px;
}
</style>