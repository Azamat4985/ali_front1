<template>
  <div class="itemBox itemBox--silver d-flex align-items-stretch mb-3 col-11">
    <div class="silverLine"></div>

    <div class="d-flex align-items-center col-12">
      <div class="col-4">
        <div
          class="item__photo item__photo--no"
          v-if="!item.initial_photo"
        ></div>
        <post-photo :id="item.initial" v-if="item.initial_photo" />
        <p>{{ initial_type }}</p>
        <p style="font-size: 8px">{{ item.initial }}</p>
      </div>

      <div class="col-4 d-flex flex-column align-items-center">
        <div
          class="item__exchangeIcon ms-3 me-3"
          @mouseenter="isMatchesShown = true"
          @mouseleave="isMatchesShown = false"
        ></div>
        <p
          class="silver fw-bold position-relative"
          @mouseenter="isMatchesShown = true"
          @mouseleave="isMatchesShown = false"
        >
          {{ item.initial_all_scores + item.second_all_scores }} /
          {{ item.initial_score + item.second_score }}

          <span class="matchesBox" v-if="isMatchesShown">
            <p>Подходящие параметры:</p>
            <div class="d-flex">
              <div class="me-3">
                <p class="matchText text-success" v-for="match in item.initial_matches" :key="match">{{ match }}</p>
              </div>
              <div>
                  <p class="matchText text-success" v-for="match in item.second_matches" :key="match">{{ match }}</p>
              </div>
            </div>
          </span>
        </p>
      </div>

      <div class="col-4">
        <div
          class="item__photo item__photo--no"
          v-if="!item.second_photo"
        ></div>
        <post-photo :id="item.second" v-if="item.second_photo" />
        <p>{{ second_type }}</p>
        <p style="font-size: 8px">{{ item.second }}</p>
      </div>
    </div>
  </div>
</template>
  
  <script>
import PostPhoto from "../components/PostPhoto.vue";

export default {
  props: ["item", "initial_type", "second_type"],
  components: { PostPhoto },
  data() {
    return {
      isMatchesShown: false,
    };
  },
};
</script>
  
  <style>
.silver {
  color: #d8d8d8;
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