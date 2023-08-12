<template>
  <div
    class="photoItem"
    :style="{ 'background-image': 'url(' + main_photo + ')' }"
    v-if="main_photo != null"
    @click="$router.push(`/post/${id}`)"
  ></div>
</template>

<script>
import store from "@/store";
export default {
  props: ["id"],
  data() {
    return {
      main_photo: null,
    };
  },
  async mounted() {
    let formdata = new FormData();
    formdata.append("email", store.getters.getEmail);
    formdata.append("hash", store.getters.getHash);
    formdata.append("id", this.id);

    await fetch(`${process.env.VUE_APP_SERVER_URL}/getMainPhoto`, {
      method: "POST",
      body: formdata,
    }).then(async (res) => {
      this.main_photo = URL.createObjectURL(await res.blob());
    });
  },
};
</script>

<style scoped>
.photoItem:hover {
  outline: 2px solid var(--link);
}
.photoItem {
  width: 50px;
  height: 50px;
  border-radius: 5px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  cursor: pointer;
}
</style>