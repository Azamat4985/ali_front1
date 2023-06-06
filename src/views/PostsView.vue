<template>
  <div class="bigComponent w-100 mt-4 mb-4">
    <loader v-if="!ready" />

    <div v-if="ready">
      <div class="d-flex align-items-center justify-content-between mb-2">
        <p class="fs-3 fw-bold">Список объектов</p>
        <div class="d-flex align-items-center">
          <div
            class="typeBtn me-2"
            @click="changeView"
            :class="{ 'typeBtn--active': view == 'list' }"
          >
            <img src="../assets/list.png" width="25" />
          </div>
          <div
            class="typeBtn me-5"
            @click="changeView"
            :class="{ 'typeBtn--active': view == 'cards' }"
          >
            <img src="../assets/cards.png" width="20" />
          </div>
          <router-link class="btn successBtn" to="new">+ Добавить</router-link>
        </div>
      </div>

      <posts-filter class="mb-4" :filters="filters" />

      <p class="fs-2 text-white-50 text-center" v-if="posts.length == 0">
        Записей пока нет...
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
import Menu from "@/components/Menu.vue";
import Post from "@/components/Post.vue";
import PostHorizontal from "@/components/PostHorizontal.vue";
import { EventBus } from "@/helpers/eventBus";
import Loader from "../components/Loader.vue";
import store from "@/store";
import { mapGetters } from "vuex";
import router from "@/router";
import PostsFilter from "@/components/PostsFilter.vue";

export default {
  components: { Menu, Post, Loader, PostHorizontal, PostsFilter },
  data() {
    return {
      posts: [],
      originalPosts: [],
      ready: false,
      myFavs: [],
      view: "cards",
      filters: {
        type: null,
        region: null,
        city: null,
        district: null,
        adress: null,
        complex: null,
        built_year: null,
        class: null,
        rooms: null,
        isOur: null,
        area_from: null,
        area_to: null,
        height: null,
        balcon: null,
        toilet: null,
        otdelka: null,
        floor_from: null,
        floor_to: null,
        price_from: 0,
        price_to: 0,

        first_line: null,
        ready_business: null,
        arendator: null,
        car_parking: null,

        uchastok_from: null,
        uchastok_to: null,

        purpose: null,
        pdp: null,
        project: null,
        uchastok_type: null,

        office_area_from: null,
        office_area_to: null,
        warehouse_area_from: null,
        warehouse_area_to: null,
        railroad: null,
        heating: null,
        electricity_from: null,
        electricity_to: null,
        transformator: null,

        performance_from: null,
        performance_to: null,
        mobility: null,

        auto_class: null,
        marka: null,
        model: null,
        auto_year_from: null,
        auto_year_to: null,
        probeg: null,
        cleared: null,

        floors_number_from: null,
        floors_number_to: null,
        offices_number_from: null,
        offices_number_to: null,
        parking_number_from: null,
        parking_number_to: null,

        hotel_rooms_from: null,
        hotel_rooms_to: null,
        hotel_rooms_area_from: null,
        hotel_rooms_area_to: null,

        client_fio: null,
        client_number: null,
        name: null,
        createdAt: null,

        ranges: {}
      },
    };
  },
  methods: {
    applyFilters() {
      this.ready = false;
      this.posts = structuredClone(this.originalPosts);

      let filteredPosts = [];
      let filters = structuredClone(this.filters);
      for (const key in filters) {
        if (filters[key] == null || filters[key] == '') {
          delete filters[key];
        }
      }

      for (const key in filters) {
        let keyName = key.split('_');
        if(keyName.includes('from') || keyName.includes('to')){
          filters.ranges[key] = filters[key];
          delete filters[key];
        }
      }

      for (const post of this.posts) {
        if(!this.checkFilters(post, filters)){
          filteredPosts.push(post)
        }
      }

      this.posts = filteredPosts;
      this.ready = true;
    },
    resetFilters() {
      this.posts = structuredClone(this.originalPosts);
      for (const key in this.filters) {
        this.filters[key] = null;
      }
    },
    checkFilters(post, filters) {
      console.log(filters);
      let toDelete = false;
      for (const key in filters) {
        if(post[key] != filters[key] && key != 'ranges' && key != 'createdAt'){
          toDelete = true;
        }
        if(key == 'createdAt'){
          let postDate = new Date(post.createdAt);
          let postMonth = postDate.getMonth()+1;
          if(postMonth < 10){ 
            postMonth = `0${postMonth}`
          }
          let postDay = postDate.getDate();
          if(postDay < 10){ 
            postDay = `0${postDay}`
          }
          let postDateString = `${postDate.getFullYear()}-${postMonth}-${postDay}`;
          console.log(postDateString, filters[key]);
          if (postDateString != filters[key]) {
            toDelete = true;
          }
        }
      }
      for (const key in filters.ranges) {
        let field = key.split('_');
        let fieldName = key.split('_')[0]
        if(field.includes('from')){
          if(filters.ranges[key] > post[fieldName]){
            toDelete = true;
          }
        }
        if(field.includes('to')){
          if(filters.ranges[key] < post[fieldName]){
            toDelete = true;
          }
        }
      }
      return toDelete
    },
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
  computed: {
    ...mapGetters(["getEmail"]),
  },
  async mounted() {
    EventBus.$on("applyFilters", () => {
      this.applyFilters();
    });
    EventBus.$on("resetFilters", () => {
      this.resetFilters();
    });

    let that = this;
    let initialFormdata = new FormData();
    initialFormdata.append("role", this.$store.getters.getRole);
    initialFormdata.append("name", this.$store.getters.getName);
    await fetch(`${process.env.VUE_APP_SERVER_URL}/getPosts`, {
      method: "POST",
      body: initialFormdata,
    }).then(async (res) => {
      let data = await res.json();
      this.posts = data;
      this.originalPosts = data;

      let formdata = new FormData();
      new Promise((resolve, reject) => {
        let email = this.getEmail;
        console.log(email);
        resolve(email);
      }).then(async (email) => {
        formdata.append("email", email);
        await fetch(`${process.env.VUE_APP_SERVER_URL}/getFavs`, {
          method: "POST",
          body: formdata,
        }).then(async (res) => {
          this.myFavs = await res.json();

          if (localStorage.getItem("view")) {
            this.view = localStorage.getItem("view");
          } else {
            localStorage.setItem("view", "cards");
          }

          this.ready = true;
        });
      });
    });
    EventBus.$on("reloadPosts", () => {
      that.ready = false;
      that.reloadPosts();
    });
  },
};
</script>

<style>
.typeBtn {
  padding: 5px 7px;
  border-radius: 5px;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  transition-duration: 0.1s;
}

.typeBtn--active {
  background: #3e4658;
}

.typeBtn:hover {
  background: #313745;
}
</style>