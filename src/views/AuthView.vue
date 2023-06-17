<template>
  <div class="wrapper">
    <p class="fs-2 mb-3 text-center">Вход в систему</p>
    <div class="component d-flex flex-column auth__wrap">
      <label for="email" class="label mb-2"
        >Введите адрес электронной почты</label
      >
      <input
        type="text"
        name=""
        id="email"
        class="input mb-3"
        v-model="email"
      />
      <label for="password" class="label mb-2">Введите пароль</label>
      <input
        type="password"
        name=""
        id="password"
        class="input mb-3"
        v-model="password"
      />
      <button class="btn successBtn" @click="login" v-if="!pending">Войти</button>
      <button class="btn successBtn" disabled v-if="pending">
        <div class="d-flex align-items-center justify-content-center">
          <p class="me-1">Войти</p>
          <div class="spinner-border spinner-border-sm" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </button>
      <p class="text-danger text-center mt-3">{{ problem }}</p>
    </div>
  </div>
</template>

<script>
import store from "@/store";
import router from "@/router";
export default {
  data() {
    return {
      email: "",
      password: "",
      problem: "",
      pending: false,
    };
  },
  methods: {
    async login() {
      this.pending = true;
      await fetch(`${process.env.VUE_APP_SERVER_URL}/login`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: this.email, password: this.password }),
      }).then(async (res) => {
        let response = await res.json();
        this.pending = false;
        if (response.info == "incorrect password") {
          this.problem = "Неверный пароль";
        }
        if (response.info == "allow") {
          document.cookie = `hash=${response.hash}`;
          document.cookie = `email=${this.email}`;
          store.commit("setHash", response.hash);
          store.commit("setEmail", response.email);
          store.commit("setName", response.name);
          store.commit("setRole", response.role);
          store.commit("setLogged", true);
          router.push({ path: "/posts" });
        }
      });
    },
  },
};
</script>

<style>
.auth__wrap {
  min-width: 350px;
}
.wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.label {
  font-size: 14px;
}
</style>