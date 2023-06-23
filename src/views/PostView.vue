<template>
  <div class="bigComponent w-100 mt-4 mb-4">
    <loader v-if="!ready" />
    <div v-if="ready">
      <div class="d-flex align-items-center mb-3 justify-content-between"> 
        <div class="d-flex align-items-center">
          <p class="fw-bold fs-3 me-3">{{ fields.type }}</p>
          <span class="our text-white" v-if="fields.isOur == 'да'">ali-group</span>
        </div>
        <div class="d-flex align-items-center">
          <p class="me-3">Создано: {{ getProperDate(fields.createdAt) }}</p>
          <p>Менеджер: {{ fields.name }}</p>
        </div>
      </div>
      <div class="d-flex justify-content-between align-items-center mb-3">
        <p class="fw-bold fs-3 text-primary">{{ fields.price.toLocaleString('ru') }}₸</p>
        <button
          class="btn btn-primary me-1"
          @click="$router.push(`/update/${id}`)"
        >
          Редактировать объект
        </button>
      </div>
      <div class="d-flex flex-wrap">
        <div
          class="imageWrapper d-flex flex-column justify-content-center me-3"
          v-for="(image, i) in allImages"
          :src="image"
          :key="i"
          @click="index = i"
        >
          <img class="image" :src="image" :key="i" @click="index = i" />
        </div>

        <img
          src="../assets/no_img.jpeg"
          class="image"
          alt=""
          v-if="main_photo == null"
        />
      </div>
      <vue-gallery-slideshow
        :images="allImages"
        :index="index"
        @close="index = null"
      ></vue-gallery-slideshow>

      <p class="mt-4 fs-3 fw-bold mb-2">Описание</p>

      <p class="descriptionBox" v-if="fields.description != ''">{{ fields.description }}</p>
      <p class="descriptionBox" v-if="fields.description == ''">Описание отсутсвует...</p>

      <p class="mt-4 fs-3 fw-bold mb-2">Детали</p>
      <details-post :post="fields"/>

      <p class="mt-4 fs-3 fw-bold mb-2">Обмен(критерии)</p>
      <exchange-details :post="fields"/>

      <p class="mt-4 fs-3 fw-bold mb-2">Контакты клиента</p>
      <div class="d-flex">
        <p class="fw-bold me-5">ФИО клиента: {{ fields.client_fio }}</p>
        <p class="fw-bold me-5">Номер клиента 1 : {{ fields.client_number_1 }}</p>
        <p class="fw-bold me-5">Номер клиента 1 : {{ fields.client_number_2 }}</p>
      </div>


    </div>
  </div>
</template>

<script>
import Loader from "@/components/Loader.vue";
import VueGallerySlideshow from "vue-gallery-slideshow";
import DetailsPost from '@/components/details/DetailsPost.vue';
import ExchangeDetails from '@/components/details/ExchangeDetails.vue';


export default {
  components: { Loader, VueGallerySlideshow, DetailsPost, ExchangeDetails },
  data() {
    return {
      fields: null,
      id: null,
      ready: false,
      main_photo: null,
      photos: [],
      allImages: [],
      index: null,
    };
  },
  methods: {
    getProperDate(date){
      return new Date(date).toLocaleDateString('ru')
    }
  },
  async mounted() {
    this.id = this.$route.params.id;
    let formdata = new FormData();
    formdata.append("id", this.id);
    formdata.append("email", this.$store.getters.getEmail);
    formdata.append("hash", this.$store.getters.getHash);
    await fetch(`${process.env.VUE_APP_SERVER_URL}/getPostItem`, {
      method: "post",
      body: formdata,
    }).then(async (res) => {
      this.fields = await res.json();

      await fetch(`${process.env.VUE_APP_SERVER_URL}/hasPhoto`, {
        method: "post",
        body: formdata,
      }).then(async (res) => {
        let data = await res.json();
        if (data.hasPhoto) {
          await fetch(`${process.env.VUE_APP_SERVER_URL}/getMainPhoto`, {
            method: "post",
            body: formdata,
          }).then(async (res) => {
            this.main_photo = URL.createObjectURL(await res.blob());
            this.allImages.push(this.main_photo);
          });
          let photosList = this.fields.photos_path;
          for (const key in photosList) {
            let photoFormData = new FormData();
            photoFormData.append("id", this.id);
            photoFormData.append("email", this.$store.getters.getEmail);
            photoFormData.append("hash", this.$store.getters.getHash);
            let photoNameArr = photosList[key].split("/");
            let photoName = photoNameArr[2];
            photoName = photoName.split(".");
            photoFormData.append("photoName", photoName[0]);
            await fetch(`${process.env.VUE_APP_SERVER_URL}/getPhoto`, {
              method: "post",
              body: photoFormData,
            }).then(async (res) => {
              this.photos.push(URL.createObjectURL(await res.blob()));
            });
          }
        }
        this.allImages.push(...this.photos);
      });

      this.ready = true;
    });
  },
};
</script>

<style>
.descriptionBox {
  background-color: #252d39;
  padding: 20px;
  border-radius: 5px;
}
.our {
  font-size: 10px;
  font-weight: normal;
  background-color: rgba(255, 217, 0, 0.568);
  padding: 3px;
  border-radius: 5px;
}
.imageWrapper {
  width: 300px;
  height: 300px;
  border-radius: 10px;
  background: var(--bg);
  cursor: pointer;
  transition-duration: 0.2s;
}
.imageWrapper:hover {
  transform: scale(1.01);
  box-shadow: 0px 0px 5px 0px rgba(222, 222, 222, 0.75);
  -webkit-box-shadow: 0px 0px 5px 0px rgba(222, 222, 222, 0.75);
  -moz-box-shadow: 0px 0px 5px 0px rgba(222, 222, 222, 0.75);
}
.image {
  width: 300px;
  object-fit: contain;
}
</style>