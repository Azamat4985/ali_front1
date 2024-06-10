<template>
  <div id="app">
    <Menu v-if="getLogged"/>
    <loader v-if="!appReady"/>
    <router-view v-if="appReady"/>

    <chain-modal v-if="showChainModal" :id="chainId"/>

    <objects-modal
        v-if="showObjectsModal"
        :isEdit="isEdit"
        :lastObject="lastObject"
        :replaceIndex="replaceIndex"
    />

    <modal-component v-if="showGeneratedChainModal">
      <p class="fs-5 mb-2">Введите название цепочки</p>
      <input v-model="generatedChainName" class="input mb-2 w-100" type="text">
      <div class="d-flex justify-content-end">
        <button :disabled="generatedChainSaving" class="btn btn-outline-primary d-flex align-items-center" @click.prevent="saveGeneratedChain">
          <div v-if="generatedChainSaving" class="spinner-border spinner-border-sm text-light me-2" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p>Сохранить</p>
        </button>
      </div>
    </modal-component>
  </div>
</template>

<script>
import router from "./router";
import store from "./store";
import Menu from "./components/Menu.vue";
import {mapGetters} from "vuex";
import ChainModal from "./components/ChainModal.vue";
import {EventBus} from "./helpers/eventBus";
import ObjectsModal from "./components/ObjectsModal.vue";
import Loader from "./components/Loader.vue";
import ModalComponent from "@/components/ModalComponent.vue";
import axios from "axios";

export default {
  data() {
    return {
      appReady: false,
      showChainModal: false,
      showObjectsModal: false,
      lastObject: null,
      isEdit: null,
      replaceIndex: null,
      chainId: null,

      generatedChainName: '',
      generatedChainSaving: false,
      showGeneratedChainModal: false,
      generatedChainObjects: null,
      generatedChainPercentage: null,
    };
  },
  components: {ModalComponent, Menu, ChainModal, ObjectsModal, Loader},
  async mounted() {
    EventBus.$on('openSaveGeneratedChainModal', (objects, percentage) => {
      for (const object of objects) {
        object._id = object.id;
      }
      this.generatedChainObjects = objects;
      this.generatedChainPercentage = percentage;
      this.showGeneratedChainModal = true;
    })
    EventBus.$on('closeSaveGeneratedChainModal', () => {
      this.generatedChainObjects = null;
      this.generatedChainPercentage = null;
      this.showGeneratedChainModal = false;
    })
    EventBus.$on("openChainModal", (id) => {
      this.chainId = id;
      this.showChainModal = true;
    });
    EventBus.$on("closeChainModal", () => {
      this.showChainModal = false;
    });
    EventBus.$on("openObjectsModal", (lastObject, isEdit, replaceIndex) => {
      this.lastObject = lastObject;
      this.isEdit = isEdit;
      this.replaceIndex = replaceIndex;
      this.showObjectsModal = true;
    });
    EventBus.$on("closeObjectsModal", () => {
      this.showObjectsModal = false;
    });

    let hash = this.getCookie("hash");
    let email = this.getCookie("email");

    if (hash !== undefined && email !== undefined) {
      await fetch(`${process.env.VUE_APP_SERVER_URL}/checkHash`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email: email, hash: hash}),
      }).then(async (res) => {
        console.log(res);
        let result = await res.json();
        if (result.correct === false) {
          router.push("/auth");
          this.appReady = true;
        } else {
          let currentRoute = router.currentRoute.path;
          if (currentRoute == "/") {
            router.push("/posts");
          } else {
            router.push(currentRoute).catch(() => {
            });
          }
          store.commit("setLogged", true);
          store.commit("setEmail", result.email);
          store.commit("setName", result.name);
          store.commit("setRole", result.role);
          store.commit("setHash", hash);
          this.appReady = true;
        }
      });
    } else {
      router.push("/auth");
      this.appReady = true;
    }
  },
  computed: {
    ...mapGetters(["getLogged"]),
  },
  methods: {
    saveGeneratedChain() {
      if (this.generatedChainName === '') {
        alert('Введите название цепочки')
        return;
      }
      this.generatedChainSaving = true;
      let data = {
        name: this.generatedChainName,
        probability: this.generatedChainPercentage,
        objects: this.generatedChainObjects,
        createdBy: store.getters.getName,
      }

      axios.post(process.env["VUE_APP_SERVER_URL"] + '/saveChain', {data: JSON.stringify(data)}).then((res) => {
        if (res.data.info === 200) {
          this.$toast.success("Успешно сохранено", {timeout: 3000});

          this.generatedChainObjects = null;
          this.generatedChainPercentage = null;
          this.showGeneratedChainModal = false;

          EventBus.$emit('loadGeneratedChains')
        } else if (res.data.info === 'duplicate') {
          this.$toast.error("Цепочка с таким названием уже существует!", {
            timeout: 5000,
          });
        }

        this.generatedChainSaving = false;
      })
    },
    getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
    },
  },
};
</script>

<style>
:root {
  --bg: #1a1a1a;
  --component: #242424;
  --btn: #238636;
  --btnHover: #1c692c;
  --link: #58a6ff;
  --border: #444444;
  --font: #c8d1d9;
  --discard: #f65249;
  --highlight: #303030;
  --primary: #58a5ff;

  --gold: #d4af34;
  --silver: #d8d8d8;
  --bronze: #b08d57;
}

body {
  min-height: 100vh;
  margin: 0;
}

#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
  background-color: var(--bg);
  display: flex;
  padding-right: 30px;
}

.input {
  border-radius: 8px;
  background-color: var(--bg);
  border: 1px solid var(--border);
  padding: 8px 15px;
  color: var(--font);
}

.successBtn {
  background: var(--btn);
  color: var(--font);
  padding: 5px 10px;
}

.successBtn:hover {
  background: var(--btnHover);
  color: var(--font);
}

.input:focus {
  border: 1px solid var(--link);
}

.input:focus-visible {
  border: 1px solid var(--link);
  outline: none;
}

.input:focus {
  border: 1px solid var(--link);
}

.component {
  background-color: var(--component);
  padding: 20px;
  border-radius: 10px;
  border: 1px solid var(--border);
}

.bigComponent {
  background-color: var(--component);
  padding: 20px 30px;
  border-radius: 10px;
  border: 1px solid var(--border);
}

.myBtn{
  background: var(--highlight);
  border: 1px solid var(--border);
  color: var(--font);
}

p {
  color: #c8d1d9;
  margin: 0;
}

label {
  color: #c8d1d9;
}

a {
  color: var(--font);
  text-decoration: none;
}

@import url("~bootstrap/dist/css/bootstrap.css");
</style>
