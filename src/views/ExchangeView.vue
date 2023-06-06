<template>
  <div class="bigComponent w-100 mt-4 mb-4">
    <loader v-if="!ready" />

    <div v-if="ready">
      <div class="d-flex align-items-center justify-content-between mb-4">
        <p class="fs-3 fw-bold">Варианты обмена</p>
      </div>

      <div class="d-flex justify-content-between align-items-start">
        <div class="col-4">
          <p class="fs-4 fw-bold mb-3 gold">Золото</p>

          <gold-item
            v-for="item in gold"
            :key="item.key"
            :item="item"
            :initial_type="getType(item.initial)"
            :second_type="getType(item.second)"
          />
        </div>

        <div class="col-4">
          <p class="fs-4 fw-bold mb-3 silver">Серебро</p>

          <silver-item
            v-for="item in silver"
            :key="item.key"
            :item="item"
            :initial_type="getType(item.initial)"
            :second_type="getType(item.second)"
          />
        </div>

        <div class="col-4">
          <p class="fs-4 fw-bold mb-3 bronze">Бронза</p>

          <bronze-item
            v-for="item in bronze"
            :key="item.key"
            :item="item"
            :initial_type="getType(item.initial)"
            :second_type="getType(item.second)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from "@/components/Loader.vue";
import store from "@/store";
import PostPhoto from "../components/PostPhoto.vue";
import GoldItem from "../components/GoldItem.vue";
import SilverItem from "../components/SilverItem.vue";
import BronzeItem from "../components/BronzeItem.vue";

export default {
  components: { Loader, PostPhoto, GoldItem, SilverItem, BronzeItem },
  data() {
    return {
      ready: false,
      exchangeData: null,
      gold: null,
      silver: null,
      bronze: null,
      posts: [],
      ids: [],
    };
  },
  methods: {
    getType(id) {
      for (const key in this.posts) {
        if (this.posts[key]._id == id) {
          return this.posts[key].type;
        }
      }
    },
  },
  async mounted() {
    await fetch(`${process.env.VUE_APP_SERVER_URL}/getExchange`, {
      method: "POST",
    }).then(async (res) => {
      let data = await res.json();
      console.log(data);
      this.gold = data.gold;
      this.silver = data.silver;
      this.bronze = data.bronze;

      for (const key in data) {
        for (const item of data[key]) {
          for (const id of item.ids) {
            if (!this.ids.includes(id)) {
              this.ids.push(id);
            }
          }
        }
      }

      for (const id of this.ids) {
        let formdata = new FormData();
        formdata.append("id", id);
        await fetch(`${process.env.VUE_APP_SERVER_URL}/getPostItem`, {
          method: "post",
          body: formdata,
        }).then(async (res) => {
          this.posts.push(await res.json());
        });
      }

      this.ready = true;
    });
  },
};
</script>

<style scoped>
.gold {
  color: #d4af34;
}
.silver {
  color: #d8d8d8;
}
.bronze {
  color: #b08d57;
}

.silverLine {
  position: absolute;
  left: 0;
  top: 0;
  background-color: #d8d8d8;
  width: 5px;
  height: 100%;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}
.bronzeLine {
  position: absolute;
  left: 0;
  top: 0;
  background-color: #b08d57;
  width: 5px;
  height: 100%;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}

.itemBox {
  position: relative;
  padding: 20px 20px 20px 25px;
  background-color: #21252e;
  border-radius: 10px;
}

.item__photo {
  background-color: var(--bg);
  width: 50px;
  height: 50px;
  border-radius: 5px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  cursor: pointer;
}

.item__photo--no {
  background-image: url("../assets/no_img.jpeg");
}

.item__exchangeIcon {
  width: 30px;
  height: 30px;
  background-image: url("../assets/exchange_item.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
</style>