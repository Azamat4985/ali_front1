<template>
  <div class="bigComponent w-100 mt-4 mb-4">
    <loader v-if="!ready" />

    <div v-if="ready">
      <div class="d-flex align-items-center justify-content-between mb-4">
        <p class="fs-3 fw-bold">Избранные объекты</p>
        <div class="d-flex align-items-center">
          <div
            class="typeBtn me-2"
            @click="changeView"
            :class="{ 'typeBtn--active': view == 'list' }"
          >
            <img src="../assets/list.png" width="25" />
          </div>
          <div
            class="typeBtn"
            @click="changeView"
            :class="{ 'typeBtn--active': view == 'cards' }"
          >
            <img src="../assets/cards.png" width="20" />
          </div>
        </div>
      </div>

      <p class="fs-2 text-white-50 text-center" v-if="posts.length == 0">
        Избранных объектов нет...
      </p>
      <div class="d-flex flex-wrap" v-if="view == 'cards'">
        <post
          v-for="post in posts"
          :key="post.createdAt"
          :post="post"
          :myFavs="myFavs"
        />
      </div>
      <div class="d-flex flex-column" v-if="view == 'list'">
        <post-horizontal
          v-for="post in posts"
          :key="post.createdAt"
          :post="post"
          :myFavs="myFavs"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Loader from "@/components/Loader.vue";
import PostHorizontal from "@/components/PostHorizontal.vue";
import Post from "@/components/Post.vue";

export default {
  components: { Loader, Post, PostHorizontal },
  data() {
    return {
      posts: [],
      ready: false,
      myFavs: null,
      view: "cards",
    };
  },
  async mounted() {
    let formdata = new FormData();
    formdata.append("email", this.$store.getters.getEmail);
    await fetch(`${process.env.VUE_APP_SERVER_URL}/getFavs`, {
      method: "post",
      body: formdata,
    }).then(async (res) => {
      let favs = await res.json();
      this.myFavs = favs;
      for (const fav of favs) {
      let favsFormdata = new FormData();
        favsFormdata.append("id", fav);
        await fetch(`${process.env.VUE_APP_SERVER_URL}/getPostItem`, {
          method: "post",
          body: favsFormdata,
        }).then(async (postRes) => {
          let data = await postRes.json();
          if (data.info != "not found") {
            this.posts.push(data);
          }
        });
      }
      if (localStorage.getItem("view")) {
        this.view = localStorage.getItem("view");
      } else {
        localStorage.setItem("view", "cards");
      }
      this.ready = true;
    });
  },
  methods: {
    async reloadPosts() {
      await fetch(`${process.env.VUE_APP_SERVER_URL}/getPosts`, {
        method: "POST",
      }).then(async (res) => {
        this.posts = await res.json();
        this.ready = true;
      });
    },
    changeView() {
      if (this.view == "cards") {
        this.view = "list";
        localStorage.setItem("view", "list");
      } else {
        this.view = "cards";
        localStorage.setItem("view", "cards");
      }
    },
  },
};
</script>

<style>
</style>