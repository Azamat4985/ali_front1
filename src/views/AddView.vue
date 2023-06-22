<template>
  <div class="bigComponent w-100 mt-4 mb-4">
    <loader v-if="!isReady" />
    <div v-if="isReady">
      <div class="d-flex align-items-center justify-content-between">
        <p class="fs-3 mb-4">
          Добавить объект
          <span class="fw-bold text-white-50">| {{ getStep() }} шаг</span>
        </p>
        <div class="d-flex align-items-center">
          <button class="btn cancelBtn me-3" @click="prevStep" v-if="step != 1">
            Назад
          </button>
          <button
            class="btn cancelBtn me-3"
            @click="cancelHandler"
            v-if="step == 1"
          >
            Отменить
          </button>
          <button class="btn successBtn" @click="nextStep" v-if="step != 3">
            Далее
          </button>
          <button class="btn successBtn" @click="sendHandler" v-if="step == 3 && !isPending">
            Готово
          </button>
          <button
          class="btn successBtn"
          v-if="isPending"
          disabled
        >
          <div
            class="spinner-border spinner-border-sm text-white"
            role="status"
          >
            <span class="visually-hidden">Loading...</span>
          </div>
        </button>
        </div>
      </div>

      <div class="d-flex align-items-start">
        <div class="col-8 d-flex flex-wrap" v-if="step == 1">
          <div class="d-flex flex-column col-5 me-5 mb-3">
            <label for="type" class="fs-5 mb-2">Выберите тип объекта</label>
            <select class="input" id="type" v-model="fields.type">
              <option v-for="item in options" :value="item" :key="item">
                {{ item }}
              </option>
            </select>
          </div>

          <div class="d-flex flex-column col-5 me-5 mb-3">
            <label for="price" class="fs-5 mb-2">Цена</label>
            <money
              id="price"
              class="input"
              v-bind="money"
              v-model="fields.price"
            ></money>
          </div>

          <div class="d-flex flex-column col-11 mb-3 me-5">
            <p class="fs-5 mb-2">Описание объекта</p>
            <textarea
              class="input"
              rows="5"
              v-model="fields.description"
            ></textarea>
          </div>

          <div
            class="d-flex flex-column col-5 me-5 mb-3"
            v-if="$store.getters.getRole == 'admin'"
          >
            <label for="adress" class="fs-5 mb-2">Наш объект</label>
            <select name="" id="" class="input" v-model="fields.isOur">
              <option value="да">Да</option>
              <option value="нет">Нет</option>
            </select>
          </div>

          <div class="d-flex flex-column col-5 me-5 mb-3">
            <label for="region" class="fs-5 mb-2">Область</label>
            <select class="input" id="region" v-model="fields.region">
              <option
                :value="region"
                v-for="region in getRegions()"
                :key="region"
              >
                {{ region }}
              </option>
            </select>
          </div>

          <div class="d-flex flex-column col-5 me-5 mb-3">
            <label for="city" class="fs-5 mb-2">Город</label>
            <select class="input" id="city" v-model="fields.city">
              <option :value="city" v-for="city in getCities()" :key="city">
                {{ city }}
              </option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-5 me-5 mb-3"
            v-if="
              (fields.city == 'Астана' ||
                fields.city == 'Алматы' ||
                fields.city == 'Шымкент' ||
                fields.city == 'Караганда') &&
              fields.type != 'Авто'
            "
          >
            <label for="district" class="fs-5 mb-2">Район</label>
            <select class="input" id="district" v-model="fields.district">
              <option
                :value="district"
                v-for="district in getDisctrics()"
                :key="district"
              >
                {{ district }}
              </option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-5 me-5 mb-3"
            v-if="fields.type != 'Авто'"
          >
            <label for="adress" class="fs-5 mb-2">Адрес</label>
            <input type="text" class="input" v-model="fields.adress" />
          </div>

          <div
            class="d-flex flex-column col-5 me-5 mb-3"
            v-if="fields.type == 'Квартира' || fields.type == 'Помещение'"
          >
            <label for="adress" class="fs-5 mb-2">Жилой комплекс</label>
            <input type="text" class="input" v-model="fields.complex" />
          </div>

          <div
            class="d-flex flex-column col-5 me-5 mb-3"
            v-if="fields.type != 'Авто' && fields.type != 'Участок'"
          >
            <label for="adress" class="fs-5 mb-2">Год постройки</label>
            <input type="number" class="input" v-model="fields.built_year" />
          </div>

          <div
            class="d-flex flex-column col-5 me-5 mb-3"
            v-if="fields.type == 'Квартира'"
          >
            <label for="adress" class="fs-5 mb-2">Класс жилого комплекса</label>
            <input type="text" class="input" v-model="fields.class" />
          </div>

          <div
            class="d-flex flex-column col-5 me-5 mb-3"
            v-if="fields.type == 'Квартира' || fields.type == 'Дом'"
          >
            <label for="adress" class="fs-5 mb-2">Количество комнат</label>
            <input type="number" class="input" v-model="fields.rooms" />
          </div>

          <div
            class="d-flex flex-column col-5 me-5 mb-3"
            v-if="
              fields.type != 'Завод' &&
              fields.type != 'Авто' &&
              fields.type != 'Участок'
            "
          >
            <label for="adress" class="fs-5 mb-2">Общая площадь (в м2)</label>
            <input type="number" class="input" v-model="fields.area" />
          </div>

          <div
            class="d-flex flex-column col-5 me-5 mb-3"
            v-if="
              fields.type == 'Квартира' ||
              fields.type == 'Дом' ||
              fields.type == 'Помещение'
            "
          >
            <label for="adress" class="fs-5 mb-2"
              >Высота потолков (в метрах)</label
            >
            <input type="number" class="input" v-model="fields.height" />
          </div>

          <div
            class="d-flex flex-column col-5 me-5 mb-3"
            v-if="fields.type == 'Квартира'"
          >
            <label for="adress" class="fs-5 mb-2">Балкон</label>
            <select name="" id="" class="input" v-model="fields.balcon">
              <option value="да">Да</option>
              <option value="нет">Нет</option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-5 me-5 mb-3"
            v-if="fields.type == 'Участок'"
          >
            <label for="adress" class="fs-5 mb-2">Есть ли постройки</label>
            <select name="" id="" class="input" v-model="fields.any_buildings">
              <option value="да">Да</option>
              <option value="нет">Нет</option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-5 me-5 mb-3"
            v-if="fields.type == 'Квартира'"
          >
            <label for="adress" class="fs-5 mb-2">Сан.Узел</label>
            <select name="" id="" class="input" v-model="fields.toilet">
              <option value="совмещенный">Совмещенный</option>
              <option value="раздельный">Раздельный</option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-5 me-5 mb-3"
            v-if="
              fields.type == 'Квартира' ||
              fields.type == 'Дом' ||
              fields.type == 'Помещение'
            "
          >
            <label for="adress" class="fs-5 mb-2">Отделка</label>
            <select name="" id="" class="input" v-model="fields.otdelka">
              <option value="черновая">Черновая</option>
              <option value="чистовая">Чистовая</option>
              <option value="черновая улучшенная">Черновая улучшенная</option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-5 me-5 mb-3"
            v-if="fields.type == 'Квартира'"
          >
            <label for="adress" class="fs-5 mb-2">Этаж</label>
            <input type="number" class="input" v-model="fields.floor" />
          </div>

          <div
            class="d-flex flex-column col-5 me-5 mb-3"
            v-if="fields.type == 'Помещение'"
          >
            <label for="adress" class="fs-5 mb-2">Первая линия</label>
            <select name="" id="" class="input" v-model="fields.first_line">
              <option value="да">Да</option>
              <option value="нет">Нет</option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-5 me-5 mb-3"
            v-if="fields.type == 'Помещение'"
          >
            <label for="adress" class="fs-5 mb-2">Готовый бизнес</label>
            <select name="" id="" class="input" v-model="fields.ready_business">
              <option value="да">Да</option>
              <option value="нет">Нет</option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-5 me-5 mb-3"
            v-if="fields.type == 'Помещение'"
          >
            <label for="adress" class="fs-5 mb-2">Арендатор</label>
            <select name="" id="" class="input" v-model="fields.arendator">
              <option value="есть">есть</option>
              <option value="нет">нет</option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-5 me-5 mb-3"
            v-if="fields.type == 'Помещение'"
          >
            <label for="adress" class="fs-5 mb-2">Стоянка автомашин</label>
            <select name="" id="" class="input" v-model="fields.car_parking">
              <option value="есть">Есть</option>
              <option value="нет">нет</option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-5 me-5 mb-3"
            v-if="
              fields.type == 'Дом' ||
              fields.type == 'Участок' ||
              fields.type == 'Завод' ||
              fields.type == 'База/Склад' ||
              fields.type == 'БЦ' ||
              fields.type == 'Гостиница'
            "
          >
            <label for="adress" class="fs-5 mb-2">Участок (сот)</label>
            <input type="number" class="input" v-model="fields.uchastok" />
          </div>

          <div
            class="d-flex flex-column col-5 me-5 mb-3"
            v-if="
              fields.type == 'Дом' ||
              fields.type == 'БЦ' ||
              fields.type == 'Гостиница'
            "
          >
            <label for="adress" class="fs-5 mb-2">Кол-во этажей</label>
            <input type="number" class="input" v-model="fields.floors_number" />
          </div>

          <div
            class="d-flex flex-column col-5 me-5 mb-3"
            v-if="fields.type == 'Участок'"
          >
            <label for="adress" class="fs-5 mb-2">Назначение</label>
            <input type="text" class="input" v-model="fields.purpose" />
          </div>

          <div
            class="d-flex flex-column col-5 me-5 mb-3"
            v-if="fields.type == 'Участок'"
          >
            <label for="adress" class="fs-5 mb-2">ПДП</label>
            <input type="text" class="input" v-model="fields.pdp" />
          </div>

          <div
            class="d-flex flex-column col-5 me-5 mb-3"
            v-if="fields.type == 'Участок'"
          >
            <label for="adress" class="fs-5 mb-2">Проект</label>
            <select name="" id="" class="input" v-model="fields.project">
              <option value="нет">нет</option>
              <option value="эскизник">эскизник</option>
              <option value="разрабатывается">разрабатывается</option>
              <option value="прошел экспертизу">прошел экспертизу</option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-5 me-5 mb-3"
            v-if="fields.type == 'Участок'"
          >
            <label for="adress" class="fs-5 mb-2">Участок</label>
            <select name="" id="" class="input" v-model="fields.uchastok_type">
              <option value="делимый">делимый</option>
              <option value="неделимый">неделимый</option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-5 me-5 mb-3"
            v-if="fields.type == 'БЦ' || fields.type == 'База/Склад'"
          >
            <label for="adress" class="fs-5 mb-2">Площадь офисов (м²)</label>
            <input type="number" class="input" v-model="fields.office_area" />
          </div>

          <div
            class="d-flex flex-column col-5 me-5 mb-3"
            v-if="fields.type == 'Завод' || fields.type == 'База/Склад'"
          >
            <label for="adress" class="fs-5 mb-2">Площадь складов (м²)</label>
            <input
              type="number"
              class="input"
              v-model="fields.warehouse_area"
            />
          </div>

          <div
            class="d-flex flex-column col-5 me-5 mb-3"
            v-if="fields.type == 'Завод' || fields.type == 'База/Склад'"
          >
            <label for="adress" class="fs-5 mb-2">Ж/Д тупик</label>
            <select name="" id="" class="input" v-model="fields.railroad">
              <option value="есть">есть</option>
              <option value="нет">нет</option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-5 me-5 mb-3"
            v-if="fields.type == 'База/Склад'"
          >
            <label for="adress" class="fs-5 mb-2">Отопление</label>
            <select name="" id="" class="input" v-model="fields.heating">
              <option value="центральное">центральное</option>
              <option value="котельная">котельная</option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-5 me-5 mb-3"
            v-if="fields.type == 'База/Склад'"
          >
            <label for="adress" class="fs-5 mb-2">Электроэнергия (кВт)</label>
            <input type="number" class="input" v-model="fields.electricity" />
          </div>

          <div
            class="d-flex flex-column col-5 me-5 mb-3"
            v-if="fields.type == 'База/Склад'"
          >
            <label for="adress" class="fs-5 mb-2">Трансформатор</label>
            <select name="" id="" class="input" v-model="fields.transformator">
              <option value="есть">есть</option>
              <option value="нет">нет</option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-5 me-5 mb-3"
            v-if="fields.type == 'Завод'"
          >
            <label for="adress" class="fs-5 mb-2">Производство</label>
            <input type="text" class="input" v-model="fields.production" />
          </div>

          <div
            class="d-flex flex-column col-5 me-5 mb-3"
            v-if="fields.type == 'Завод'"
          >
            <label for="adress" class="fs-5 mb-2">Мобильность</label>
            <select name="" id="" class="input" v-model="fields.mobility">
              <option value="да">да</option>
              <option value="нет">нет</option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-5 me-5 mb-3"
            v-if="fields.type == 'Авто'"
          >
            <label for="adress" class="fs-5 mb-2">Класс авто</label>
            <select name="" id="" class="input" v-model="fields.auto_class">
              <option value="легковые">Легковые</option>
              <option value="автобус">Автобус</option>
              <option value="грузовой">Грузовые</option>
              <option value="спец.техника">спец.техника</option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-5 me-5 mb-3"
            v-if="fields.type == 'Авто'"
          >
            <label for="adress" class="fs-5 mb-2">Марка</label>
            <select name="" id="" class="input" v-model="fields.marka">
              <option v-for="car in getBrands()" :key="car" :value="car">
                {{ car }}
              </option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-5 me-5 mb-3"
            v-if="fields.type == 'Авто'"
          >
            <label for="adress" class="fs-5 mb-2">Модель</label>
            <select name="" id="" class="input" v-model="fields.model">
              <option
                v-for="car in getModels(fields.marka)"
                :key="car"
                :value="car"
              >
                {{ car }}
              </option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-5 me-5 mb-3"
            v-if="fields.type == 'Авто'"
          >
            <label for="adress" class="fs-5 mb-2">Год выпуска</label>
            <input type="number" class="input" v-model="fields.auto_year" />
          </div>

          <div
            class="d-flex flex-column col-5 me-5 mb-3"
            v-if="fields.type == 'Авто'"
          >
            <label for="adress" class="fs-5 mb-2">Пробег</label>
            <input type="number" class="input" v-model="fields.probeg" />
          </div>

          <div
            class="d-flex flex-column col-5 me-5 mb-3"
            v-if="fields.type == 'Авто'"
          >
            <label for="adress" class="fs-5 mb-2">Растоможен в РК</label>
            <select name="" id="" class="input" v-model="fields.cleared">
              <option value="да">да</option>
              <option value="нет">нет</option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-5 me-5 mb-3"
            v-if="fields.type == 'БЦ'"
          >
            <label for="adress" class="fs-5 mb-2">Кол-во кабинетов</label>
            <input
              type="number"
              class="input"
              v-model="fields.offices_number"
            />
          </div>

          <div
            class="d-flex flex-column col-5 me-5 mb-3"
            v-if="fields.type == 'БЦ' || fields.type == 'Гостиница'"
          >
            <label for="adress" class="fs-5 mb-2"
              >Кол-во парковочных мест</label
            >
            <input
              type="number"
              class="input"
              v-model="fields.parking_number"
            />
          </div>

          <div
            class="d-flex flex-column col-5 me-5 mb-3"
            v-if="fields.type == 'Гостиница'"
          >
            <label for="adress" class="fs-5 mb-2">Кол-во номеров</label>
            <input type="number" class="input" v-model="fields.hotel_rooms" />
          </div>

          <div
            class="d-flex flex-column col-5 me-5 mb-3"
            v-if="fields.type == 'Гостиница'"
          >
            <label for="adress" class="fs-5 mb-2">Плошадь номеров (м²)</label>
            <input
              type="number"
              class="input"
              v-model="fields.hotel_rooms_area"
            />
          </div>

          <div class="d-flex flex-column col-5 me-5 mb-3 align-items-start">
            <label for="adress" class="fs-5 mb-2">Дополнительно</label>
            <input
              type="text"
              class="input mb-3 w-100"
              v-on:keyup.enter="onEnter"
            />
            <div class="d-flex align-items-center flex-wrap">
              <div
                class="extraItem me-2 mb-2"
                v-for="item in fields.extra"
                :key="item"
              >
                <p>
                  {{ item }}
                  <span class="deleteExtra fw-bold" @click="deleteExtra(item)"
                    >x</span
                  >
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="col-4" v-if="step == 1">
          <p class="fs-5 mb-2">Загрузите фотографии</p>
          <img
            src="../assets/no_img.jpeg"
            width="300"
            height="300"
            alt=""
            class="mb-3"
            v-if="fields.mainPhoto == null"
          />
          <div
            class="mainPhoto mb-2 d-flex flex-column justify-content-center"
            v-if="fields.mainPhoto != null"
            :style="{ 'background-image': 'url(' + fields.mainPhoto + ')' }"
          >
            <div
              class="delete d-flex align-items-center justify-content-center"
              @click="deleteMainPhoto"
            >
              <img
                src="../assets/deletePost_active.png"
                width="20"
                height="20"
                alt=""
              />
            </div>
          </div>

          <div
            class="mb-2 d-flex flex-wrap photosList"
            v-if="fields.photos.length != null"
          >
            <div
              class="photo"
              v-for="photo in fields.photos"
              :key="photo"
              :style="{ 'background-image': 'url(' + photo + ')' }"
            >
              <div
                class="crown d-flex align-items-center justify-content-center"
                @click="makeMain(photo)"
              >
                <img src="../assets/crown.png" width="15" height="15" />
              </div>

              <div
                class="delete d-flex align-items-center justify-content-center"
                @click="deletePhoto(photo)"
              >
                <img
                  src="../assets/deletePost_active.png"
                  width="15"
                  height="15"
                  alt=""
                />
              </div>
            </div>
          </div>

          <label for="mainPhoto__uploadInput" class="avatar__uploadBtn">
            Загрузить фото
            <input
              type="file"
              name=""
              id="mainPhoto__uploadInput"
              multiple
              accept="image/png, image/jpeg"
              @change="onMainUpload"
            />
          </label>
        </div>

        <!-- ======================================================================================== -->

        <div class="col-12 d-flex flex-wrap" v-if="step == 2">
          <div class="d-flex flex-column col-3 me-5 mb-3">
            <label for="type" class="fs-5 mb-2">Обмен на</label>
            <select class="input" id="type" v-model="fields.ex_type">
              <option v-for="item in options" :value="item" :key="item">
                {{ item }}
              </option>
            </select>
          </div>

          <div class="d-flex flex-column col-3 me-5 mb-3">
            <label for="price" class="fs-5 mb-2">Цена от</label>
            <money
              id="price"
              class="input"
              v-bind="money"
              v-model="fields.ex_price_from"
            ></money>
          </div>

          <div class="d-flex flex-column col-3 me-5 mb-3">
            <label for="price" class="fs-5 mb-2">Цена до</label>
            <money
              id="price"
              class="input"
              v-bind="money"
              v-model="fields.ex_price_to"
            ></money>
          </div>

          <div class="d-flex flex-column col-3 me-5 mb-3">
            <label for="region" class="fs-5 mb-2">Область</label>
            <select class="input" id="region" v-model="fields.ex_region">
              <option
                :value="region"
                v-for="region in getRegions()"
                :key="region"
              >
                {{ region }}
              </option>
            </select>
          </div>

          <div class="d-flex flex-column col-3 me-5 mb-3">
            <label for="city" class="fs-5 mb-2">Город</label>
            <select class="input" id="city" v-model="fields.ex_city">
              <option :value="city" v-for="city in getCities()" :key="city">
                {{ city }}
              </option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-3"
            v-if="
              (fields.ex_city == 'Астана' ||
                fields.ex_city == 'Алматы' ||
                fields.ex_city == 'Шымкент' ||
                fields.ex_city == 'Караганда') &&
              fields.ex_type != 'Авто'
            "
          >
            <label for="district" class="fs-5 mb-2">Район</label>
            <select class="input" id="district" v-model="fields.ex_district">
              <option
                :value="district"
                v-for="district in getDisctrics()"
                :key="district"
              >
                {{ district }}
              </option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-3"
            v-if="fields.ex_type == 'Квартира' || fields.ex_type == 'Помещение'"
          >
            <label for="adress" class="fs-5 mb-2">Жилой комплекс</label>
            <input type="text" class="input" v-model="fields.ex_complex" />
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-3"
            v-if="fields.ex_type != 'Авто' && fields.ex_type != 'Участок'"
          >
            <label for="adress" class="fs-5 mb-2">Год постройки</label>
            <div class="d-flex align-items-center">
              <p>от</p>
              <input
                type="number"
                class="input me-3 col-5"
                v-model="fields.ex_built_year_from"
              />
              <p>до</p>
              <input
                type="number"
                class="input col-5"
                v-model="fields.ex_built_year_to"
              />
            </div>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-3"
            v-if="fields.ex_type == 'Участок'"
          >
            <label for="adress" class="fs-5 mb-2">Есть ли постройки</label>
            <select
              name=""
              id=""
              class="input"
              v-model="fields.ex_any_buildings"
            >
              <option value="да">Да</option>
              <option value="нет">Нет</option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-3"
            v-if="fields.ex_type == 'Квартира'"
          >
            <label for="adress" class="fs-5 mb-2">Класс жилого комплекса</label>
            <input type="text" class="input" v-model="fields.ex_class" />
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-3"
            v-if="fields.ex_type == 'Квартира' || fields.ex_type == 'Дом'"
          >
            <label for="adress" class="fs-5 mb-2">Количество комнат</label>
            <div class="d-flex align-items-center">
              <p>от</p>
              <input
                type="number"
                class="input me-3 col-5"
                v-model="fields.ex_rooms_from"
              />
              <p>до</p>
              <input
                type="number"
                class="input col-5"
                v-model="fields.ex_rooms_to"
              />
            </div>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-3"
            v-if="
              fields.ex_type != 'Завод' &&
              fields.ex_type != 'Авто' &&
              fields.ex_type != 'Участок'
            "
          >
            <label for="adress" class="fs-5 mb-2">Общая площадь (в м2)</label>
            <div class="d-flex align-items-center">
              <p>от</p>
              <input
                type="number"
                class="input me-3 col-5"
                v-model="fields.ex_area_from"
              />
              <p>до</p>
              <input
                type="number"
                class="input col-5"
                v-model="fields.ex_area_to"
              />
            </div>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-3"
            v-if="
              fields.ex_type == 'Квартира' ||
              fields.ex_type == 'Дом' ||
              fields.ex_type == 'Помещение'
            "
          >
            <label for="adress" class="fs-6 mb-2"
              >Высота потолков (в метрах)</label
            >
            <div class="d-flex align-items-center">
              <p>от</p>
              <input
                type="number"
                class="input me-3 col-5"
                v-model="fields.ex_height_from"
              />
              <p>до</p>
              <input
                type="number"
                class="input col-5"
                v-model="fields.ex_height_to"
              />
            </div>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-3"
            v-if="fields.ex_type == 'Квартира'"
          >
            <label for="adress" class="fs-5 mb-2">Балкон</label>
            <select name="" id="" class="input" v-model="fields.ex_balcon">
              <option value="да">Да</option>
              <option value="нет">Нет</option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-3"
            v-if="fields.ex_type == 'Квартира'"
          >
            <label for="adress" class="fs-5 mb-2">Сан.Узел</label>
            <select name="" id="" class="input" v-model="fields.ex_toilet">
              <option value="совмещенный">Совмещенный</option>
              <option value="раздельный">Раздельный</option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-3"
            v-if="
              fields.ex_type == 'Квартира' ||
              fields.ex_type == 'Дом' ||
              fields.ex_type == 'Помещение'
            "
          >
            <label for="adress" class="fs-5 mb-2">Отделка</label>
            <select name="" id="" class="input" v-model="fields.ex_otdelka">
              <option value="черновая">Черновая</option>
              <option value="чистовая">Чистовая</option>
              <option value="черновая улучшенная">Черновая улучшенная</option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-3"
            v-if="fields.ex_type == 'Квартира'"
          >
            <label for="adress" class="fs-5 mb-2">Этаж</label>
            <div class="d-flex align-items-center">
              <p>от</p>
              <input type="number" class="input col-5" v-model="fields.floor" />
              <p>до</p>
              <input type="number" class="input col-5" v-model="fields.floor" />
            </div>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-3"
            v-if="fields.ex_type == 'Помещение'"
          >
            <label for="adress" class="fs-5 mb-2">Первая линия</label>
            <select name="" id="" class="input" v-model="fields.ex_first_line">
              <option value="да">Да</option>
              <option value="нет">Нет</option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-3"
            v-if="fields.ex_type == 'Помещение'"
          >
            <label for="adress" class="fs-5 mb-2">Готовый бизнес</label>
            <select
              name=""
              id=""
              class="input"
              v-model="fields.ex_ready_business"
            >
              <option value="да">Да</option>
              <option value="нет">Нет</option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-3"
            v-if="fields.ex_type == 'Помещение'"
          >
            <label for="adress" class="fs-5 mb-2">Арендатор</label>
            <select name="" id="" class="input" v-model="fields.ex_arendator">
              <option value="есть">есть</option>
              <option value="нет">нет</option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-3"
            v-if="fields.ex_type == 'Помещение'"
          >
            <label for="adress" class="fs-5 mb-2">Стоянка автомашин</label>
            <select name="" id="" class="input" v-model="fields.ex_car_parking">
              <option value="есть">Есть</option>
              <option value="нет">нет</option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-3"
            v-if="
              fields.ex_type == 'Дом' ||
              fields.ex_type == 'Участок' ||
              fields.ex_type == 'Завод' ||
              fields.ex_type == 'БЦ' ||
              fields.ex_type == 'Гостиница'
            "
          >
            <label for="adress" class="fs-5 mb-2">Участок (сот)</label>
            <div class="d-flex align-items-center">
              <p>от</p>
              <input
                type="number"
                class="input me-3 col-5"
                v-model="fields.ex_uchastok_from"
              />
              <p>до</p>
              <input
                type="number"
                class="input col-5"
                v-model="fields.ex_uchastok_to"
              />
            </div>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-3"
            v-if="
              fields.ex_type == 'Дом' ||
              fields.ex_type == 'БЦ' ||
              fields.ex_type == 'Гостиница'
            "
          >
            <label for="adress" class="fs-5 mb-2">Кол-во этажей</label>
            <div class="d-flex align-items-center">
              <p>от</p>
              <input
                type="number"
                class="input me-3 col-5"
                v-model="fields.ex_floors_number_from"
              />
              <p>до</p>
              <input
                type="number"
                class="input me-3 col-5"
                v-model="fields.ex_floors_number_to"
              />
            </div>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-3"
            v-if="fields.ex_type == 'Участок'"
          >
            <label for="adress" class="fs-5 mb-2">Назначение</label>
            <input type="text" class="input" v-model="fields.ex_purpose" />
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-3"
            v-if="fields.ex_type == 'Участок'"
          >
            <label for="adress" class="fs-5 mb-2">ПДП</label>
            <input type="text" class="input" v-model="fields.ex_pdp" />
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-3"
            v-if="fields.ex_type == 'Участок'"
          >
            <label for="adress" class="fs-5 mb-2">Проект</label>
            <select name="" id="" class="input" v-model="fields.ex_project">
              <option value="нет">нет</option>
              <option value="эскизник">эскизник</option>
              <option value="разрабатывается">разрабатывается</option>
              <option value="прошел экспертизу">прошел экспертизу</option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-3"
            v-if="fields.ex_type == 'Участок'"
          >
            <label for="adress" class="fs-5 mb-2">Участок</label>
            <select
              name=""
              id=""
              class="input"
              v-model="fields.ex_uchastok_type"
            >
              <option value="делимый">делимый</option>
              <option value="неделимый">неделимый</option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-3"
            v-if="fields.ex_type == 'БЦ' || fields.ex_type == 'База/Склад'"
          >
            <label for="adress" class="fs-5 mb-2">Площадь офисов (м²)</label>
            <div class="d-flex align-items-center">
              <p>от</p>
              <input
                type="number"
                class="input me-3 col-5"
                v-model="fields.ex_office_area_from"
              />
              <p>до</p>
              <input
                type="number"
                class="input col-5"
                v-model="fields.ex_office_area_to"
              />
            </div>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-3"
            v-if="fields.ex_type == 'Завод' || fields.ex_type == 'База/Склад'"
          >
            <label for="adress" class="fs-5 mb-2">Площадь складов (м²)</label>
            <div class="d-flex align-items-center">
              <p>от</p>
              <input
                type="number"
                class="input me-3 col-5"
                v-model="fields.ex_warehouse_area_from"
              />
              <p>до</p>
              <input
                type="number"
                class="input col-5"
                v-model="fields.ex_warehouse_area_to"
              />
            </div>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-3"
            v-if="fields.ex_type == 'Завод' || fields.ex_type == 'База/Склад'"
          >
            <label for="adress" class="fs-5 mb-2">Ж/Д тупик</label>
            <select name="" id="" class="input" v-model="fields.ex_railroad">
              <option value="есть">есть</option>
              <option value="нет">нет</option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-3"
            v-if="fields.ex_type == 'База/Склад'"
          >
            <label for="adress" class="fs-5 mb-2">Отопление</label>
            <select name="" id="" class="input" v-model="fields.ex_heating">
              <option value="центральное">центральное</option>
              <option value="котельная">котельная</option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-3"
            v-if="fields.ex_type == 'База/Склад'"
          >
            <label for="adress" class="fs-5 mb-2">Электроэнергия (кВт)</label>
            <div class="d-flex align-items-center">
              <p>от</p>
              <input
                type="number"
                class="input me-3 col-5"
                v-model="fields.ex_electricity_from"
              />
              <p>до</p>
              <input
                type="number"
                class="input col-5"
                v-model="fields.ex_electricity_to"
              />
            </div>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-3"
            v-if="fields.ex_type == 'База/Склад'"
          >
            <label for="adress" class="fs-5 mb-2">Трансформатор</label>
            <select
              name=""
              id=""
              class="input"
              v-model="fields.ex_transformator"
            >
              <option value="есть">есть</option>
              <option value="нет">нет</option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-3"
            v-if="fields.ex_type == 'Завод'"
          >
            <label for="adress" class="fs-5 mb-2">Производство</label>
            <input
              type="text"
              class="input me-3"
              v-model="fields.ex_production"
            />
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-3"
            v-if="fields.ex_type == 'Завод'"
          >
            <label for="adress" class="fs-5 mb-2">Мобильность</label>
            <select name="" id="" class="input" v-model="fields.ex_mobility">
              <option value="да">да</option>
              <option value="нет">нет</option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-3"
            v-if="fields.ex_type == 'Авто'"
          >
            <label for="adress" class="fs-5 mb-2">Класс авто</label>
            <select name="" id="" class="input" v-model="fields.ex_auto_class">
              <option value="легковые">Легковые</option>
              <option value="автобус">Автобус</option>
              <option value="грузовой">Грузовые</option>
              <option value="спец.техника">спец.техника</option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-3"
            v-if="fields.ex_type == 'Авто'"
          >
            <label for="adress" class="fs-5 mb-2">Марка</label>
            <select name="" id="" class="input" v-model="fields.ex_marka">
              <option v-for="car in getBrands()" :key="car" :value="car">
                {{ car }}
              </option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-3"
            v-if="fields.ex_type == 'Авто'"
          >
            <label for="adress" class="fs-5 mb-2">Модель</label>
            <select name="" id="" class="input" v-model="fields.ex_model">
              <option
                v-for="car in getModels(fields.ex_marka)"
                :key="car"
                :value="car"
              >
                {{ car }}
              </option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-3"
            v-if="fields.ex_type == 'Авто'"
          >
            <label for="adress" class="fs-5 mb-2">Год выпуска</label>
            <div class="d-flex align-items-center">
              <p>от</p>
              <input
                type="number"
                class="input me-3 col-5"
                v-model="fields.ex_auto_year_from"
              />
              <p>до</p>
              <input
                type="number"
                class="input col-5"
                v-model="fields.ex_auto_year_to"
              />
            </div>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-3"
            v-if="fields.ex_type == 'Авто'"
          >
            <label for="adress" class="fs-5 mb-2">Пробег</label>
            <input type="number" class="input" v-model="fields.ex_probeg" />
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-3"
            v-if="fields.ex_type == 'Авто'"
          >
            <label for="adress" class="fs-5 mb-2">Растоможен в РК</label>
            <select name="" id="" class="input" v-model="fields.ex_cleared">
              <option value="да">да</option>
              <option value="нет">нет</option>
            </select>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-3"
            v-if="fields.ex_type == 'БЦ'"
          >
            <label for="adress" class="fs-5 mb-2">Кол-во кабинетов</label>
            <div class="d-flex align-items-center">
              <p>от</p>
              <input
                type="number"
                class="input me-3 col-5"
                v-model="fields.ex_offices_number_from"
              />
              <p>до</p>
              <input
                type="number"
                class="input col-5"
                v-model="fields.ex_offices_number_to"
              />
            </div>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-3"
            v-if="fields.ex_type == 'БЦ' || fields.ex_type == 'Гостиница'"
          >
            <label for="adress" class="fs-5 mb-2"
              >Кол-во парковочных мест</label
            >
            <div class="d-flex align-items-center">
              <p>от</p>
              <input
                type="number"
                class="input me-3 col-5"
                v-model="fields.ex_parking_number_from"
              />
              <p>до</p>
              <input
                type="number"
                class="input col-5"
                v-model="fields.ex_parking_number_to"
              />
            </div>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-3"
            v-if="fields.ex_type == 'Гостиница'"
          >
            <label for="adress" class="fs-5 mb-2">Кол-во номеров</label>
            <div class="d-flex align-items-center">
              <p>от</p>
              <input
                type="number"
                class="input me-3 col-5"
                v-model="fields.ex_hotel_rooms_from"
              />
              <p>до</p>
              <input
                type="number"
                class="input col-5"
                v-model="fields.ex_hotel_rooms_to"
              />
            </div>
          </div>

          <div
            class="d-flex flex-column col-3 me-5 mb-3"
            v-if="fields.ex_type == 'Гостиница'"
          >
            <label for="adress" class="fs-5 mb-2">Плошадь номеров (м²)</label>
            <div class="d-flex align-items-center">
              <p>от</p>
              <input
                type="number"
                class="input me-3 col-5"
                v-model="fields.ex_hotel_rooms_area_from"
              />
              <p>до</p>
              <input
                type="number"
                class="input col-5"
                v-model="fields.ex_hotel_rooms_area_to"
              />
            </div>
          </div>
        </div>

        <div class="col-12 d-flex flex-wrap" v-if="step == 3">
          <div class="d-flex flex-column col-3 me-5 mb-3">
            <label for="adress" class="fs-5 mb-2">ФИО клиента</label>
            <input type="text" class="input" v-model="fields.client_fio" />
          </div>
          <div class="d-flex flex-column col-3 me-3 mb-3">
            <label for="adress" class="fs-5 mb-2">Номер клиента 1</label>
            <div class="d-flex align-items-center">
              <p class="me-1">+7</p>
              <input
                type="number"
                class="input"
                v-model="fields.client_number_1"
              />
            </div>
          </div>
          <div class="d-flex flex-column col-3 me-5 mb-3">
            <label for="adress" class="fs-5 mb-2">Номер клиента 2</label>
            <div class="d-flex align-items-center">
              <p class="me-1">+7</p>
              <input
                type="number"
                class="input"
                v-model="fields.client_number_2"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { regions } from "../helpers/regions";
import { cars } from "../helpers/cars";
import { Money } from "v-money";
import router from "@/router";
import store from "@/store";
import Loader from "@/components/Loader.vue";

export default {
  components: { Money, Loader },
  data() {
    return {
      step: 1,
      isReady: false,
      isPending: false,
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
      districts: {
        Астана: ["Сарыарка", "Байконур", "Алматы", "Есиль"],
        Алматы: [
          "Алатауский",
          "Алмалинский",
          "Ауэзовский",
          "Бостандыкский",
          "Жетысуский",
          "Медеуский",
          "Наурызбайский",
          "Турксибский",
        ],
        Шымкент: ["Абайский", "Аль-Фарабийский", "Енбекшинский", "Каратауский"],
        Караганда: [
          "Казыбекбийский",
          "Майкудук",
          "Район Алихана Бокейханова",
          "Старая Тихоновка",
          "Юго-Восток",
        ],
      },
      fields: {
        email: "",
        name: "",
        type: "Квартира",
        isOur: "нет",
        description: "",
        region: "Акмолинская область",
        city: "Астана",
        district: "",
        mainPhoto: null,
        photos: [],
        adress: "",
        complex: "",
        built_year: null,
        class: "",
        rooms: 1,
        area: 0,
        height: 2.7,
        balcon: "да",
        toilet: "раздельный",
        otdelka: "чистовая",
        floor: 1,
        price: 0,
        extra: [],

        first_line: "да",
        ready_business: "да",
        arendator: "нет",
        car_parking: "есть",

        uchastok: 0,
        any_buildings: "нет",

        purpose: "",
        pdp: null,
        project: "нет",
        uchastok_type: "делимый",

        office_area: 0,
        warehouse_area: 0,
        railroad: "есть",
        heating: "центральное",
        electricity: 0,
        transformator: "есть",

        production: "",
        mobility: "нет",

        auto_class: "легковые",
        marka: "Toyota",
        model: "Camry",
        auto_year: 2023,
        probeg: 0,
        cleared: "да",

        floors_number: null,
        offices_number: null,
        parking_number: null,

        hotel_rooms: null,
        hotel_rooms_area: null,

        // ===========

        ex_type: "Квартира",
        ex_region: "Акмолинская область",
        ex_city: "Астана",
        ex_district: "",
        ex_adress: "",
        ex_complex: "",
        ex_built_year_from: null,
        ex_built_year_to: null,
        ex_class: "",
        ex_rooms_from: 1,
        ex_rooms_to: 2,
        ex_area_from: 0,
        ex_area_to: 0,
        ex_height_from: 2.7,
        ex_height_to: 3,
        ex_balcon: "да",
        ex_toilet: "раздельный",
        ex_otdelka: "Черновая",
        ex_floor_from: 1,
        ex_floor_to: 1,
        ex_price_from: 0,
        ex_price_to: 0,

        ex_first_line: "да",
        ex_ready_business: "да",
        ex_arendator: "нет",
        ex_car_parking: "есть",

        ex_uchastok_from: null,
        ex_uchastok_to: null,
        ex_any_buildings: "нет",

        ex_purpose: "",
        ex_pdp: null,
        ex_project: "нет",
        ex_uchastok_type: "делимый",

        ex_office_area_from: null,
        ex_office_area_to: null,
        ex_warehouse_area_from: null,
        ex_warehouse_area_to: null,
        ex_railroad: "есть",
        ex_heating: "центральное",
        ex_electricity_from: null,
        ex_electricity_to: null,
        ex_transformator: "есть",

        ex_production: "",
        ex_mobility: "да",

        ex_auto_class: "легковые",
        ex_marka: "Toyota",
        ex_model: "Camry",
        ex_auto_year_from: null,
        ex_auto_year_to: null,
        ex_probeg: null,
        ex_cleared: "да",

        ex_floors_number_from: null,
        ex_floors_number_to: null,
        ex_offices_number_from: null,
        ex_offices_number_to: null,
        ex_parking_number_from: null,
        ex_parking_number_to: null,

        ex_hotel_rooms_from: null,
        ex_hotel_rooms_to: null,
        ex_hotel_rooms_area_from: null,
        ex_hotel_rooms_area_to: null,

        // ===============

        client_fio: "",
        client_number_1: null,
        client_number_2: null,
      },
    };
  },
  async mounted() {
    if (this.$route.params.id) {
      let formdata = new FormData();
      formdata.append("id", this.$route.params.id);
      formdata.append("email", store.getters.getEmail);
      formdata.append("hash", store.getters.getHash);
      await fetch(`${process.env.VUE_APP_SERVER_URL}/getPostItem`, {
        method: "POST",
        body: formdata,
      }).then(async (res) => {
        let data = await res.json();
        for (const key in this.fields) {
          for (const data_key in data) {
            if (key == data_key) {
              this.fields[key] = data[key];
            }
          }
        }

        await fetch(`${process.env.VUE_APP_SERVER_URL}/getMainPhoto`, {
          method: "POST",
          body: formdata,
        }).then(async (res) => {
          let resJson = res.clone();
          this.fields.mainPhoto = URL.createObjectURL(await res.blob());
          try {
            let dataJson = await resJson.json();
            if (dataJson.err == "file not found") {
              this.fields.mainPhoto = null;
            }
          } catch (error) {}
        });

        for (const photo of data.photos_path) {
          let photo_name_arr = photo.split("/");
          let photo_name = photo_name_arr[2].split(".");
          let formdata1 = new FormData();
          formdata1.append("id", this.$route.params.id);
          formdata1.append("email", store.getters.getEmail);
          formdata1.append("hash", store.getters.getHash);
          formdata1.append("photoName", photo_name[0]);
          await fetch(`${process.env.VUE_APP_SERVER_URL}/getPhoto`, {
            method: "POST",
            body: formdata1,
          }).then(async (res) => {
            this.fields.photos.push(URL.createObjectURL(await res.blob()));
          });
        }
        this.isReady = true;
      });
    } else {
      this.isReady = true;
    }
  },
  methods: {
    getStep() {
      if (this.fields.isOur && this.step == 3) {
        return "2";
      } else {
        return this.step;
      }
    },
    nextStep() {
      if (this.fields.isOur == "да") {
        this.step = 3;
      } else {
        this.step++;
      }
    },
    prevStep() {
      if (this.fields.isOur == "да") {
        this.step = 1;
      } else {
        this.step--;
      }
    },
    async sendHandler() {
      let formdata = new FormData();
      this.fields.email = store.getters.getEmail;
      this.fields.name = store.getters.getName;
      let data = JSON.stringify(this.fields);
      formdata.append("fields", data);
      this.isPending = true;

      if (this.fields.mainPhoto != null) {
        let main_photo = await this.createFile(
          this.fields.mainPhoto,
          "main.jpg"
        );
        formdata.append("mainPhoto", main_photo);
      }
      for (let i = 0; i < this.fields.photos.length; i++) {
        let file = await this.createFile(this.fields.photos[i], `${i}.jpg`);
        formdata.append(`photo${i}`, file);
      }

      if (this.$route.params.id) {
        // если обновление поста
        formdata.append("id", this.$route.params.id);
        await fetch(`${process.env.VUE_APP_SERVER_URL}/updatePost`, {
          method: "POST",
          body: formdata,
        }).then(async (res) => {
          let response = await res.json();
          if (response.info == "updated") {
            this.$toast.success("Успешно обновлено!", {
              timeout: 3000,
            });
            this.isPending = false;
            router.go(-1);
          }
        });
      } else {
        await fetch(`${process.env.VUE_APP_SERVER_URL}/savePost`, {
          method: "POST",
          body: formdata,
        }).then((res) => {
          this.$toast.success("Успешно добавлено!", {
            timeout: 3000,
          });
          this.isPending = false;
          router.push("/posts");
        });
      }
    },
    cancelHandler() {
      if (confirm("Вы уверены что хотите отменить?")) {
        router.go(-1);
      }
    },
    deleteExtra(extra) {
      let index = this.fields.extra.indexOf(extra);
      this.fields.extra.splice(index, 1);
    },
    onEnter(e) {
      if (e.target.value != "") {
        this.fields.extra.push(e.target.value.toLowerCase());
        e.target.value = "";
      }
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
        if (Object.keys(regions[key])[0] == this.fields.region) {
          this.fields.city = regions[key][this.fields.region][0];
          return regions[key][this.fields.region];
        }
      }
    },
    getDisctrics() {
      return this.districts[this.fields.city];
    },
    onMainUpload(e) {
      console.log("ok");
      if (this.fields.mainPhoto == null) {
        this.fields.mainPhoto = URL.createObjectURL(e.target.files[0]);
        for (let i = 1; i < e.target.files.length; i++) {
          this.fields.photos.push(URL.createObjectURL(e.target.files[i]));
        }
      } else {
        for (let i = 0; i < e.target.files.length; i++) {
          this.fields.photos.push(URL.createObjectURL(e.target.files[i]));
        }
      }
    },
    deleteMainPhoto() {
      if (this.fields.photos.length == 0) {
        this.fields.mainPhoto = null;
      } else {
        this.fields.mainPhoto = this.fields.photos[0];
        this.fields.photos.splice(0, 1);
      }
    },
    deletePhoto(photo) {
      let indexInArray = this.fields.photos.findIndex((item) => item == photo);
      this.fields.photos.splice(indexInArray, 1);
    },
    makeMain(photo) {
      this.fields.photos.push(this.fields.mainPhoto);
      let indexInArray = this.fields.photos.findIndex((item) => item == photo);
      this.fields.mainPhoto = this.fields.photos[indexInArray];
      this.fields.photos.splice(indexInArray, 1);
    },
    async createFile(url, fileName) {
      let response = await fetch(url);
      let data = await response.blob();
      let metadata = {
        type: "image/jpeg",
      };
      let file = new File([data], fileName, metadata);
      return file;
    },
  },
};
</script>

<style>
.cancelBtn {
  border: 2px solid var(--discard) !important;
  color: var(--discard) !important;
}
.deleteExtra {
  cursor: pointer;
  transition-duration: 0.1s;
}
.deleteExtra:hover {
  color: var(--discard);
}
.extraItem {
  padding: 5px 10px;
  background: #252d39;
  display: inline-block;
  border-radius: 5px;
}
.mainPhoto {
  width: 300px;
  height: 300px;
  border: 1px solid var(--border);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
}
#mainPhoto__uploadInput {
  display: none;
}
.avatar__uploadBtn {
  background-color: var(--btn);
  padding: 5px 15px;
  border-radius: 5px;
  text-align: center;
  color: #fff;
  border: 1px solid var(--border);
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
}
.photo {
  width: 90px;
  height: 90px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  border: 1px solid var(--border);
  margin-right: 10px;
  margin-bottom: 10px;
  position: relative;
}
.photosList {
  max-width: 300px;
}
.delete {
  width: 30px;
  height: 30px;
  background-color: var(--component);
  position: absolute;
  border-radius: 50%;
  border: 1px solid var(--border);
  bottom: 0;
  right: 0;
  cursor: pointer;
}
.crown {
  width: 30px;
  height: 30px;
  background-color: var(--component);
  position: absolute;
  border-radius: 50%;
  border: 1px solid var(--border);
  top: 0;
  right: 0;
  cursor: pointer;
}
</style>