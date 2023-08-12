<template>
  <div class="me-2">
    <div v-if="ready">
      <router-link :to="'/post/' + postData._id" v-if="photo == ''">
        <img src="../assets/no_img.jpeg" width="60" class="rounded main_photo" />
      </router-link>
      <router-link :to="'/post/' + postData._id" v-if="photo != ''">
        <img :src="photo" width="60" class="rounded main_photo" />
      </router-link>

      <p style="font-size: 12px;">{{ postData.type }}</p>
    </div>
    <div v-if="!ready">
      <div class="spinner-border spinner-border-sm" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["item"],
  data() {
    return {
      photo: "",
      postData: null,
      ready: false,
    };
  },
  methods: {},
  async mounted() {
    this.ready = false;
    let formData = new FormData();
    let id;
    if(typeof(this.item) == 'string'){
      id = this.item
    } else {
      id = this.item.id;
    }
    formData.append("id", id);
    await fetch(`${process.env.VUE_APP_SERVER_URL}/getPostItem`, {
      method: "post",
      body: formData,
    }).then(async (res) => {
      this.postData = await res.json();

      await fetch(`${process.env.VUE_APP_SERVER_URL}/hasPhoto`, {
        method: "post",
        body: formData,
      }).then(async (res) => {
        let data = await res.json();
        if (data.hasPhoto) {
          await fetch(`${process.env.VUE_APP_SERVER_URL}/getMainPhoto`, {
            method: "post",
            body: formData,
          }).then(async (photoRes) => {
            let photoData = await photoRes.blob();
            this.photo = URL.createObjectURL(photoData);
            this.ready = true;
          });
        }
        this.ready = true;
      });
    });
  },
};
</script>

<style scoped>
.main_photo:hover{
  border: 2px solid var(--primary);
}
</style>