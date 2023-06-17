<template>
  <div>
    <p class="filterBtn" v-if="!filterOpened" @click="filterOpened = true">Фильтры ▶</p>
    <p class="filterBtn" v-if="filterOpened" @click="filterOpened = false">Фильтры ▼</p>

    <div class="filtersBox mt-2" v-if="filterOpened">
      <div class=" d-flex flex-wrap">
          <div class="d-flex flex-column col-3 me-5 mb-2">
            <label for="type" class="fs-6 mb-1">Тип</label>
            <select class="input" id="type" v-model="filters.type">
              <option v-for="item in options" :value="item" :key="item">
                {{ item }}
              </option>
            </select>
          </div>

          <div class="d-flex flex-column col-3 me-5 mb-2">
            <label for="type" class="fs-6 mb-1">Наш объект</label>
            <select class="input" id="type" v-model="filters.isOur">
              <option value="да">да</option>
              <option value="нет">нет</option>
            </select>
          </div>

          <div class="d-flex flex-column col-3 me-5 mb-2">
            <label for="price" class="fs-6 mb-1">Цена от</label>
            <money
              id="price"
              class="input"
              v-bind="money"
              v-model="filters.price_from"
            ></money>
          </div>

          <div class="d-flex flex-column col-3 me-5 mb-2">
            <label for="price" class="fs-6 mb-1">Цена до</label>
            <money
              id="price"
              class="input"
              v-bind="money"
              v-model="filters.price_to"
            ></money>
          </div>

          <div class="d-flex flex-column col-3 me-5 mb-2">
            <label for="region" class="fs-6 mb-1">Область</label>
            <select class="input" id="region" v-model="filters.region">
              <option
                :value="region"
                v-for="region in getRegions()"
                :key="region"
              >
                {{ region }}
              </option>
            </select>
          </div>

          <div class="d-flex flex-column col-3 me-5 mb-2">
            <label for="city" class="fs-6 mb-1">Город</label>
            <select class="input" id="city" v-model="filters.city">
              <option :value="city" v-for="city in getCities()" :key="city">
                {{ city }}
              </option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-2"
            v-if="filters.city == 'Астана' && filters.type != 'Авто'"
          >
            <label for="district" class="fs-6 mb-1">Район</label>
            <select class="input" id="district" v-model="filters.district">
              <option
                :value="district"
                v-for="district in districts"
                :key="district"
              >
                {{ district }}
              </option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-2"
            v-if="filters.type == 'Квартира' || filters.type == 'Помещение'"
          >
            <label for="adress" class="fs-6 mb-1">Жилой комплекс</label>
            <input type="text" class="input" v-model="filters.complex" />
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-2"
            v-if="filters.type != 'Авто'"
          >
            <label for="adress" class="fs-6 mb-1">Год постройки</label>
            <input type="number" class="input" v-model="filters.built_year" />
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-2"
            v-if="filters.type == 'Квартира'"
          >
            <label for="adress" class="fs-6 mb-1">Класс жилого комплекса</label>
            <input type="text" class="input" v-model="filters.class" />
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-2"
            v-if="filters.type == 'Квартира' || filters.type == 'Дом'"
          >
            <label for="adress" class="fs-6 mb-1">Количество комнат</label>
            <input type="number" class="input" v-model="filters.rooms" />
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-2"
            v-if="
              filters.type != 'Завод' &&
              filters.type != 'Авто' &&
              filters.type != 'Участок'
            "
          >
            <label for="adress" class="fs-6 mb-1">Общая площадь (в м2)</label>
            <div class="d-flex align-items-center">
              <p>от</p>
              <input
                type="number"
                class="input me-3 col-5"
                v-model="filters.area_from"
              />
              <p>до</p>
              <input
                type="number"
                class="input col-5"
                v-model="filters.area_to"
              />
            </div>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-2"
            v-if="
              filters.type == 'Квартира' ||
              filters.type == 'Дом' ||
              filters.type == 'Помещение'
            "
          >
            <label for="adress" class="fs-6 mb-1"
              >Высота потолков (в метрах)</label
            >
            <input type="number" class="input" v-model="filters.height" />
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-2"
            v-if="filters.type == 'Квартира'"
          >
            <label for="adress" class="fs-6 mb-1">Балкон</label>
            <select name="" id="" class="input" v-model="filters.balcon">
              <option value="да">Да</option>
              <option value="нет">Нет</option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-2"
            v-if="filters.type == 'Квартира'"
          >
            <label for="adress" class="fs-6 mb-1">Сан.Узел</label>
            <select name="" id="" class="input" v-model="filters.toilet">
              <option value="совмещенный">Совмещенный</option>
              <option value="раздельный">Раздельный</option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-2"
            v-if="
              filters.type == 'Квартира' ||
              filters.type == 'Дом' ||
              filters.type == 'Помещение'
            "
          >
            <label for="adress" class="fs-6 mb-1">Отделка</label>
            <select name="" id="" class="input" v-model="filters.otdelka">
              <option value="черновая">Черновая</option>
              <option value="чистовая">Чистовая</option>
              <option value="черновая улучшенная">Черновая улучшенная</option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-2"
            v-if="filters.type == 'Квартира'"
          >
            <label for="adress" class="fs-6 mb-1">Этаж</label>
            <div class="d-flex align-items-center">
              <p>от</p>
              <input type="number" class="input col-5" v-model="filters.floor_from" />
              <p>до</p>
              <input type="number" class="input col-5" v-model="filters.floor_to" />
            </div>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-2"
            v-if="filters.type == 'Помещение'"
          >
            <label for="adress" class="fs-6 mb-1">Первая линия</label>
            <select name="" id="" class="input" v-model="filters.first_line">
              <option value="да">Да</option>
              <option value="нет">Нет</option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-2"
            v-if="filters.type == 'Помещение'"
          >
            <label for="adress" class="fs-6 mb-1">Готовый бизнес</label>
            <select
              name=""
              id=""
              class="input"
              v-model="filters.ready_business"
            >
              <option value="да">Да</option>
              <option value="нет">Нет</option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-2"
            v-if="filters.type == 'Помещение'"
          >
            <label for="adress" class="fs-6 mb-1">Арендатор</label>
            <select name="" id="" class="input" v-model="filters.arendator">
              <option value="есть">есть</option>
              <option value="нет">нет</option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-2"
            v-if="filters.type == 'Помещение'"
          >
            <label for="adress" class="fs-6 mb-1">Стоянка автомашин</label>
            <select name="" id="" class="input" v-model="filters.car_parking">
              <option value="есть">Есть</option>
              <option value="нет">нет</option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-2"
            v-if="
              filters.type == 'Дом' ||
              filters.type == 'Участок' ||
              filters.type == 'Завод' ||
              filters.type == 'БЦ' ||
              filters.type == 'Гостиница'
            "
          >
            <label for="adress" class="fs-6 mb-1">Участок (сот)</label>
            <div class="d-flex align-items-center">
              <p>от</p>
              <input
                type="number"
                class="input me-3 col-5"
                v-model="filters.uchastok_from"
              />
              <p>до</p>
              <input
                type="number"
                class="input col-5"
                v-model="filters.uchastok_to"
              />
            </div>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-2"
            v-if="
              filters.type == 'Дом' ||
              filters.type == 'БЦ' ||
              filters.type == 'Гостиница'
            "
          >
            <label for="adress" class="fs-6 mb-1">Кол-во этажей</label>
            <div class="d-flex align-items-center">
              <p>от</p>
              <input
                type="number"
                class="input me-3 col-5"
                v-model="filters.floors_number_from"
              />
              <p>до</p>
              <input
                type="number"
                class="input me-3 col-5"
                v-model="filters.floors_number_to"
              />
            </div>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-2"
            v-if="filters.type == 'Участок'"
          >
            <label for="adress" class="fs-6 mb-1">Назначение</label>
            <input type="text" class="input" v-model="filters.purpose" />
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-2"
            v-if="filters.type == 'Участок'"
          >
            <label for="adress" class="fs-6 mb-1">ПДП</label>
            <input type="text" class="input" v-model="filters.pdp" />
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-2"
            v-if="filters.type == 'Участок'"
          >
            <label for="adress" class="fs-6 mb-1">Проект</label>
            <select name="" id="" class="input" v-model="filters.project">
              <option value="эскизник">эскизник</option>
              <option value="разрабатывается">разрабатывается</option>
              <option value="прошел экспертизу">прошел экспертизу</option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-2"
            v-if="filters.type == 'Участок'"
          >
            <label for="adress" class="fs-6 mb-1">Участок</label>
            <select
              name=""
              id=""
              class="input"
              v-model="filters.uchastok_type"
            >
              <option value="делимый">делимый</option>
              <option value="неделимый">неделимый</option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-2"
            v-if="
              filters.type == 'БЦ' || filters.type == 'База/Склад'
            "
          >
            <label for="adress" class="fs-6 mb-1">Площадь офисов (м²)</label>
            <div class="d-flex align-items-center">
              <p>от</p>
              <input
                type="number"
                class="input me-3 col-5"
                v-model="filters.office_area_from"
              />
              <p>до</p>
              <input
                type="number"
                class="input col-5"
                v-model="filters.office_area_to"
              />
            </div>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-2"
            v-if="filters.type == 'Завод' || filters.type == 'База/Склад'"
          >
            <label for="adress" class="fs-6 mb-1">Площадь складов (м²)</label>
            <div class="d-flex align-items-center">
              <p>от</p>
              <input
                type="number"
                class="input me-3 col-5"
                v-model="filters.warehouse_area_from"
              />
              <p>до</p>
              <input
                type="number"
                class="input col-5"
                v-model="filters.warehouse_area_to"
              />
            </div>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-2"
            v-if="filters.type == 'Завод' || filters.type == 'База/Склад'"
          >
            <label for="adress" class="fs-6 mb-1">Ж/Д тупик</label>
            <select name="" id="" class="input" v-model="filters.railroad">
              <option value="есть">есть</option>
              <option value="нет">нет</option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-2"
            v-if="filters.type == 'База/Склад'"
          >
            <label for="adress" class="fs-6 mb-1">Отопление</label>
            <select name="" id="" class="input" v-model="filters.heating">
              <option value="центральное">центральное</option>
              <option value="котельная">котельная</option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-2"
            v-if="filters.type == 'База/Склад'"
          >
          <label for="adress" class="fs-6 mb-1">Электроэнергия (кВт)</label>
            <div class="d-flex align-items-center">
              <p>от</p>
              <input
                type="number"
                class="input me-3 col-5"
                v-model="filters.electricity_from"
              />
              <p>до</p>
              <input
                type="number"
                class="input col-5"
                v-model="filters.electricity_to"
              />
            </div>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-2"
            v-if="filters.type == 'База/Склад'"
          >
            <label for="adress" class="fs-6 mb-1">Трансформатор</label>
            <select
              name=""
              id=""
              class="input"
              v-model="filters.transformator"
            >
              <option value="есть">есть</option>
              <option value="нет">нет</option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-2"
            v-if="filters.type == 'Завод'"
          >
            <label for="adress" class="fs-6 mb-1"
              >Производительность (тонн)</label
            >
            <div class="d-flex align-items-center">
              <p>от</p>
              <input
                type="number"
                class="input me-3 col-5"
                v-model="filters.performance_from"
              />
              <p>до</p>
              <input
                type="number"
                class="input col-5"
                v-model="filters.performance_to"
              />
            </div>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-2"
            v-if="filters.type == 'Завод'"
          >
            <label for="adress" class="fs-6 mb-1">Мобильность</label>
            <select name="" id="" class="input" v-model="filters.mobility">
              <option value="да">да</option>
              <option value="нет">нет</option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-2"
            v-if="filters.type == 'Авто'"
          >
            <label for="adress" class="fs-6 mb-1">Класс авто</label>
            <select name="" id="" class="input" v-model="filters.auto_class">
              <option value="легковые">Легковые</option>
              <option value="автобус">Автобус</option>
              <option value="грузовой">Грузовые</option>
              <option value="спец.техника">спец.техника</option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-2"
            v-if="filters.type == 'Авто'"
          >
            <label for="adress" class="fs-6 mb-1">Марка</label>
            <select name="" id="" class="input" v-model="filters.marka">
              <option v-for="car in getBrands()" :key="car" :value="car">
                {{ car }}
              </option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-2"
            v-if="filters.type == 'Авто'"
          >
            <label for="adress" class="fs-6 mb-1">Модель</label>
            <select name="" id="" class="input" v-model="filters.model">
              <option
                v-for="car in getModels(filters.marka)"
                :key="car"
                :value="car"
              >
                {{ car }}
              </option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-2"
            v-if="filters.type == 'Авто'"
          >
            <label for="adress" class="fs-6 mb-1">Год выпуска</label>
            <div class="d-flex align-items-center">
              <p>от</p>
              <input
                type="number"
                class="input me-3 col-5"
                v-model="filters.auto_year_from"
              />
              <p>до</p>
              <input
                type="number"
                class="input col-5"
                v-model="filters.auto_year_to"
              />
            </div>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-2"
            v-if="filters.type == 'Авто'"
          >
            <label for="adress" class="fs-6 mb-1">Пробег</label>
            <input type="number" class="input" v-model="filters.probeg" />
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-2"
            v-if="filters.type == 'Авто'"
          >
            <label for="adress" class="fs-6 mb-1">Растоможен в РК</label>
            <select name="" id="" class="input" v-model="filters.cleared">
              <option value="да">да</option>
              <option value="нет">нет</option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-2"
            v-if="filters.type == 'БЦ'"
          >
            <label for="adress" class="fs-6 mb-1">Кол-во кабинетов</label>
            <div class="d-flex align-items-center">
              <p>от</p>
              <input
                type="number"
                class="input me-3 col-5"
                v-model="filters.offices_number_from"
              />
              <p>до</p>
              <input
                type="number"
                class="input col-5"
                v-model="filters.offices_number_to"
              />
            </div>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-2"
            v-if="
              filters.type == 'БЦ' || filters.type == 'Гостиница'
            "
          >
            <label for="adress" class="fs-6 mb-1"
              >Кол-во парковочных мест</label
            >
            <div class="d-flex align-items-center">
              <p>от</p>
              <input
                type="number"
                class="input me-3 col-5"
                v-model="filters.parking_number_from"
              />
              <p>до</p>
              <input
                type="number"
                class="input col-5"
                v-model="filters.parking_number_to"
              />
            </div>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-2"
            v-if="filters.type == 'Гостиница'"
          >
            <label for="adress" class="fs-6 mb-1">Кол-во номеров</label>
            <div class="d-flex align-items-center">
              <p>от</p>
              <input
                type="number"
                class="input me-3 col-5"
                v-model="filters.hotel_rooms_from"
              />
              <p>до</p>
              <input
                type="number"
                class="input col-5"
                v-model="filters.hotel_rooms_to"
              />
            </div>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-2"
            v-if="filters.type == 'Гостиница'"
          >
            <label for="adress" class="fs-6 mb-1">Плошадь номеров (м²)</label>
            <div class="d-flex align-items-center">
              <p>от</p>
              <input
                type="number"
                class="input me-3 col-5"
                v-model="filters.hotel_rooms_area_from"
              />
              <p>до</p>
              <input
                type="number"
                class="input col-5"
                v-model="filters.hotel_rooms_area_to"
              />
            </div>
          </div>
        </div>

        <hr style="border-color: #fff;">

        <div class="d-flex mb-2">
          <div
            class="d-flex flex-column col-3 me-5 mb-2"
            v-if="myRole == 'admin'"
          >
            <label for="adress" class="fs-6 mb-1">Менеджер</label>
            <select name="" id="" class="input" v-model="filters.name">
              <option v-for="name in managers" :key="name">{{name}}</option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-2"
          >
            <label for="adress" class="fs-6 mb-1">Дата добавления</label>
            <input type="date" class="input" v-model="filters.createdAt">
          </div>
        </div>

        <div class="mb-3">
          <div
            class="d-flex flex-column col-3 me-5 mb-2"
          >
            <label for="adress" class="fs-6 mb-1">Поиск по тексту</label>
            <input type="text" class="input" v-model="filters.text">
          </div>
        </div>

        <div class="d-flex">
          <button class="btn btn-primary me-3" @click="apply">Применить</button>
          <button class="btn btn-danger" @click="reset">Сбросить</button>
        </div>

    </div>

  </div>
</template>

<script>
import { regions } from "@/helpers/regions";
import { cars } from "../helpers/cars";
import { Money } from "v-money";
import router from "@/router";
import store from "@/store";
import { EventBus } from "@/helpers/eventBus";

export default {
  comments: {Money},
  props: ['filters'],
  data() {
    return {
      managers: [],
      myRole: null,
      filterOpened: false,
      money: {
        decimal: ",",
        thousands: " ",
        prefix: "",
        suffix: " ",
        precision: 0,
        masked: false,
      },
      options: [
        "Квартира",
        "Помещение",
        "Дом",
        "Участок",
        "База/Склад",
        "Завод",
        "Авто",
        "БЦ",
        "Гостиница",
      ],
      districts: ["Сарыарка", "Байконур", "Алматы", "Есиль"],
    }
  },
  async mounted() {
    await fetch(`${process.env.VUE_APP_SERVER_URL}/getUsers`, {
      method: 'post'
    }).then(async (res) => {
      this.managers = await res.json();
      this.myRole = store.getters.getRole;
    })
  },
  methods: {
    apply() {
      EventBus.$emit('applyFilters')
    },
    reset() {
      EventBus.$emit('resetFilters')
    },
    getBrands() {
      let arr = [];
      for (const key in cars) {
        arr.push(cars[key].brand);
      }
      return arr;
    },
    getModels(brand) {
      for (const key in cars) {
        if (cars[key].brand == brand) {
          return cars[key].models;
        }
      }
    },
    getRegions() {
      let arr = [];
      for (const key in regions) {
        arr.push(Object.keys(regions[key])[0]);
      }
      return arr;
    },
    getCities() {
      for (const key in regions) {
        if (Object.keys(regions[key])[0] == this.filters.region) {
          return regions[key][this.filters.region];
        }
      }
    },
  }
}
</script>

<style scope>
.filterBtn{
  padding: 5px 10px;
  border-radius: 5px;
  background-color: #252d39;
  width: fit-content;
  cursor: pointer;
}
.filtersBox{
  padding: 10px 20px;
  border-radius: 5px;
  background-color: #252d39;
  font-size: 12px;
  width: fit-content;
}
</style>