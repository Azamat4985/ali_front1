<template>
  <div class="menu__wrapper">
    <div
      class="menu d-flex flex-column align-items-center justify-content-between"
    >
      <div class="d-flex flex-column align-items-center">
        <p class="fs-3 fw-bold mb-3">Ali Group</p>
        <img
          src="../assets/logo.png"
          class="mb-5"
          alt=""
          width="50"
          height="50"
        />
        <!-- <router-link
          class="navLink d-flex align-items-center mb-3"
          to="/"
          :class="{ 'navLink--active': currentRoute() == 'dashboard' }"
        >
          <img
            src="../assets/dashboard.png"
            width="20"
            height="20"
            class="me-3"
          />
          <p>Главная</p>
        </router-link> -->
        
        <router-link
          class="navLink d-flex align-items-center mb-3"
          to="/posts"
          :class="{ 'navLink--active': currentRoute() == 'posts' }"
        >
          <img src="../assets/posts.png" width="20" height="20" class="me-3" />
          <p>Объекты</p>
        </router-link>

        <router-link
          class="navLink d-flex align-items-center mb-3"
          to="/favs"
          :class="{ 'navLink--active': currentRoute() == 'Favs' }"
        >
          <img src="../assets/fav.png" width="20" height="20" class="me-3" />
          <p style="font-size: 15px">Избранные объекты</p>
        </router-link>

        <router-link
          class="navLink d-flex align-items-center mb-3"
          to="/exchange"
          :class="{ 'navLink--active': currentRoute() == 'Exchange' }"
          v-if="role == 'admin'"
        >
          <img
            src="../assets/exchange.png"
            width="20"
            height="20"
            class="me-3"
          />
          <p>Обмен</p>
        </router-link>
        <router-link
          class="navLink d-flex align-items-center mb-3"
          to="/exchange-chain"
          :class="{ 'navLink--active': currentRoute() == 'Exchange-chain' }"
          v-if="role == 'admin'"
        >
          <img
            src="../assets/exchange.png"
            width="20"
            height="20"
            class="me-3"
          />
          <p>Цепочный обмен</p>
        </router-link>
        <router-link
          class="navLink d-flex align-items-center mb-3"
          to="/exchange-chain-auto"
          :class="{ 'navLink--active': currentRoute() == 'Exchange-chain-auto' }"
          v-if="role == 'admin'"
        >
          <img
            src="../assets/exchange.png"
            width="20"
            height="20"
            class="me-3"
          />
          <p>Цепочный обмен (авт.)</p>
        </router-link>
        <!-- <router-link
          class="navLink d-flex align-items-center mb-3"
          to="/exchange"
          :class="{ 'navLink--active': currentRoute() == 'customers' }"
        >
          <img
            src="../assets/customers.png"
            width="20"
            height="20"
            class="me-3"
          />
          <p>Клиенты</p>
        </router-link> -->
      </div>

      <div class="w-100">
        <p class="mb-3">{{ $store.getters.getName }} : {{ $store.getters.getRole }}</p>
        <div
        class="
          d-flex
          justify-content-start
          w-100
          align-items-center
          navLink navLink--active
        "
        @click="logout"
      >
        <img src="../assets/logout.png" width="20" height="20" class="me-3" />
        <p class="text-danger fw-bold">Выход</p>
      </div>
      </div>

    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import store from "@/store";
import router from "@/router";

export default {
  data() {
    return{
      role: null,
    }
  },
  mounted() {
    this.role = store.getters.getRole;
  },
  methods: {
    currentRoute() {
      return this.$route.name;
    },
    logout() {
      if (confirm("Вы уверены что хотите выйти?")) {
        store.commit("setLogged", false);
        document.cookie = "hash= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "email= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
        router.push("/auth");
      }
    },
  },
};
</script>

<style>
.menu__wrapper {
  min-width: 270px;
  margin-right: 30px;
}
.menu {
  background-color: var(--component);
  padding: 20px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  min-height: 100vh;
  position: fixed;
}
.navLink {
  width: 230px;
  padding: 10px 20px;
  border-radius: 5px;
  transition-duration: 0.1s;
  cursor: pointer;
  border: 1px solid transparent;
}
.navLink:hover {
  background-color: var(--highlight);
}
.navLink--active {
  background-color:  var(--highlight);
  border: 1px solid var(--border);
}
</style>