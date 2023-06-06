<template>
    <div class="d-flex flex-wrap col-12">
      <p class="col-3 mb-2 text-primary">Обмен на: <span class="fw-bold">{{ post.ex_type }}</span></p>
      <p class="col-3 mb-2">Область: <span class="fw-bold">{{ post.ex_region }}</span></p>
      <p class="col-3 mb-2">Цена: <span class="fw-bold">от {{ post.ex_price_from.toLocaleString('ru') }}₸ до {{ post.ex_price_to.toLocaleString('ru') }}₸</span></p>
      <p class="col-3 mb-2">Город: <span class="fw-bold">{{ post.ex_city }}</span></p>
      <p class="col-3 mb-2" v-if="post.ex_type != 'Авто'">Район: <span class="fw-bold">{{ post.ex_district }}</span></p>
      <p class="col-3 mb-2" v-if="post.ex_type != 'Авто'">Адрес: <span class="fw-bold">{{ post.ex_adress }}</span></p>
      <p class="col-3 mb-2" v-if="post.ex_type == 'Квартира' || post.ex_type == 'Дом'">Комнат: <span class="fw-bold">{{ post.ex_rooms }}</span></p>
      <p class="col-3 mb-2">Наш объект: <span class="fw-bold">{{ post.ex_isOur }}</span></p>
      <p class="col-3 mb-2" v-if="post.ex_type == 'Квартира' || post.ex_type == 'Помещение'">Жилой комплекс: <span class="fw-bold">{{ post.ex_complex }}</span></p>
      <p class="col-3 mb-2" v-if="post.ex_type != 'Авто'">Год постройки: <span class="fw-bold">{{ post.ex_built_year }}</span></p>
      <p class="col-3 mb-2" v-if="post.ex_type == 'Квартира'">Класс ЖК: <span class="fw-bold">{{ post.ex_class }}</span></p>
      <p class="col-3 mb-2" v-if="post.ex_type != 'Завод' && post.ex_type != 'Авто' && post.ex_type != 'Участок'">Площадь: <span class="fw-bold">от {{ post.ex_area_from }}м² до {{ post.ex_area_to }}м²</span></p>
      <p class="col-3 mb-2" v-if="post.ex_type == 'Квартира' || post.ex_type == 'Дом' || post.ex_type == 'Помещение'">Высота потолков: <span class="fw-bold">{{ post.ex_height }}</span></p>
      <p class="col-3 mb-2" v-if="post.ex_type == 'Квартира'">Балкон: <span class="fw-bold">{{ post.ex_balcon }}</span></p>
      <p class="col-3 mb-2" v-if="post.ex_type == 'Квартира'">Сан.узел: <span class="fw-bold">{{ post.ex_toilet }}</span></p>
      <p class="col-3 mb-2" v-if="post.ex_type == 'Квартира' || post.ex_type == 'Помещение' || post.ex_type == 'Дом'">Отделка: <span class="fw-bold">{{ post.ex_otdelka }}</span></p>
      <p class="col-3 mb-2" v-if="post.ex_type == 'Квартира'">Этаж: <span class="fw-bold">{{ post.ex_floor }}</span></p>
  
      <p class="col-3 mb-2" v-if="post.ex_type == 'Помещение'">Первая линия: <span class="fw-bold">{{ post.ex_first_line }}</span></p>
      <p class="col-3 mb-2" v-if="post.ex_type == 'Помещение'">Готовый бизнес: <span class="fw-bold">{{ post.ex_ready_business }}</span></p>
      <p class="col-3 mb-2" v-if="post.ex_type == 'Помещение'">Арендатор: <span class="fw-bold">{{ post.ex_arendator }}</span></p>
      <p class="col-3 mb-2" v-if="post.ex_type == 'Помещение'">Паркинг: <span class="fw-bold">{{ post.ex_car_parking }}</span></p>
  
      <p class="col-3 mb-2" v-if="post.ex_type == 'Дом' || post.ex_type == 'Участок' || post.ex_type == 'Завод' || post.ex_type == 'Бизнес-Центр' || post.ex_type == 'Гостиница'">Участок (сот): <span class="fw-bold">{{ post.ex_uchastok }}</span></p>
      <p class="col-3 mb-2" v-if="post.ex_type == 'Участок'">Назначение: <span class="fw-bold">{{ post.ex_purpose }}</span></p>
      <p class="col-3 mb-2" v-if="post.ex_type == 'Участок'">ПДП: <span class="fw-bold">{{ post.ex_pdp }}</span></p>
      <p class="col-3 mb-2" v-if="post.ex_type == 'Участок'">Проект: <span class="fw-bold">{{ post.ex_project }}</span></p>
      <p class="col-3 mb-2" v-if="post.ex_type == 'Участок'">Тип участка: <span class="fw-bold">{{ post.ex_uchastok_type }}</span></p>
  
      <p class="col-3 mb-2" v-if="post.ex_type == 'БЦ' || post.ex_type == 'База/Склад'">Площадь офисов: <span class="fw-bold">{{ post.ex_office_area }}</span></p>
      <p class="col-3 mb-2" v-if="post.ex_type == 'База/Склад' || post.ex_type == 'Завод'">Площадь складов: <span class="fw-bold">{{ post.ex_warehouse_area }}</span></p>
      <p class="col-3 mb-2" v-if="post.ex_type == 'Завод' || post.ex_type == 'База/Склад'">ЖД тупик: <span class="fw-bold">{{ post.ex_railroad }}</span></p>
      <p class="col-3 mb-2" v-if="post.ex_type == 'База/Склад'">Отопление: <span class="fw-bold">{{ post.ex_heating }}</span></p>
      <p class="col-3 mb-2" v-if="post.ex_type == 'База/Склад'">Электроэнергия: <span class="fw-bold">{{ post.ex_electricty }} кВт</span></p>
      <p class="col-3 mb-2" v-if="post.ex_type == 'База/Склад'">Трансформатор: <span class="fw-bold">{{ post.ex_transformator }}</span></p>
  
      <p class="col-3 mb-2" v-if="post.ex_type == 'Завод'">Производительность: <span class="fw-bold">{{ post.ex_perfomance }} тонн</span></p>
      <p class="col-3 mb-2" v-if="post.ex_type == 'Завод'">Мобильность: <span class="fw-bold">{{ post.ex_mobilty }}</span></p>
  
      <p class="col-3 mb-2" v-if="post.ex_type == 'Авто'">Класс авто: <span class="fw-bold">{{ post.ex_auto_class }}</span></p>
      <p class="col-3 mb-2" v-if="post.ex_type == 'Авто'">Марка: <span class="fw-bold">{{ post.ex_marka }}</span></p>
      <p class="col-3 mb-2" v-if="post.ex_type == 'Авто'">Модель: <span class="fw-bold">{{ post.ex_model }}</span></p>
      <p class="col-3 mb-2" v-if="post.ex_type == 'Авто'">Год выпуска: <span class="fw-bold">{{ post.ex_auto_year }}</span></p>
      <p class="col-3 mb-2" v-if="post.ex_type == 'Авто'">Пробег: <span class="fw-bold">{{ post.ex_probeg }}</span></p>
      <p class="col-3 mb-2" v-if="post.ex_type == 'Авто'">Растоможен: <span class="fw-bold">{{ post.ex_cleared }}</span></p>
  
      <p class="col-3 mb-2" v-if="post.ex_type == 'Дом' || post.ex_type == 'БЦ' || post.ex_type == 'Гостиница'">Кол-во этажей: <span class="fw-bold">{{ post.ex_floors_number }}</span></p>
      <p class="col-3 mb-2" v-if="post.ex_type == 'БЦ'">Кол-во офисов: <span class="fw-bold">{{ post.ex_offices_number }}</span></p>
      <p class="col-3 mb-2" v-if="post.ex_type == 'БЦ' || post.ex_type == 'Гостиница'">Кол-во парк. мест: <span class="fw-bold">{{ post.ex_parking_number }}</span></p>
  
      <p class="col-3 mb-2" v-if="post.ex_type == 'Гостиница'">Кол-во номеров: <span class="fw-bold">{{ post.ex_hotel_rooms }}</span></p>
      <p class="col-3 mb-2" v-if="post.ex_type == 'Гостиница'">Площадь номеров: <span class="fw-bold">{{ post.ex_hotel_rooms_area }}</span></p>
  
  
      <p class="col-3 mb-2">Дополнительно: <span class="fw-bold" v-for="extra in post.ex_extra" :key="extra">{{ extra }} </span></p>
    </div>
  </template>
  
  <script>
  export default {
      props: ['post']
  }
  </script>
  
  <style>
  
  </style>