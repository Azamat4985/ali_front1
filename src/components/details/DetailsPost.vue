<template>
  <div class="d-flex flex-wrap col-12">
    <p class="col-3 mb-2">Область: <span class="fw-bold">{{ post.region }}</span></p>
    <p class="col-3 mb-2">Город: <span class="fw-bold">{{ post.city }}</span></p>
    <p class="col-3 mb-2" v-if="post.type != 'Авто'">Район: <span class="fw-bold">{{ post.district }}</span></p>
    <p class="col-3 mb-2" v-if="post.type != 'Авто'">Адрес: <span class="fw-bold">{{ post.adress }}</span></p>
    <p class="col-3 mb-2" v-if="post.type == 'Квартира' || post.type == 'Дом'">Комнат: <span class="fw-bold">{{ post.rooms }}</span></p>
    <p class="col-3 mb-2 text-primary">Наш объект: <span class="fw-bold">{{ post.isOur }}</span></p>
    <p class="col-3 mb-2" v-if="post.type == 'Квартира' || post.type == 'Помещение'">Жилой комплекс: <span class="fw-bold">{{ post.complex }}</span></p>
    <p class="col-3 mb-2" v-if="post.type != 'Авто'">Год постройки: <span class="fw-bold">{{ post.built_year }}</span></p>
    <p class="col-3 mb-2" v-if="post.type == 'Квартира'">Класс ЖК: <span class="fw-bold">{{ post.class }}</span></p>
    <p class="col-3 mb-2" v-if="post.type != 'Завод' && post.type != 'Авто' && post.type != 'Участок'">Плошадь: <span class="fw-bold">{{ post.area }}</span></p>
    <p class="col-3 mb-2" v-if="post.type == 'Квартира' || post.type == 'Дом' || post.type == 'Помещение'">Высота потолков: <span class="fw-bold">{{ post.height }}</span></p>
    <p class="col-3 mb-2" v-if="post.type == 'Квартира'">Балкон: <span class="fw-bold">{{ post.balcon }}</span></p>
    <p class="col-3 mb-2" v-if="post.type == 'Квартира'">Сан.узел: <span class="fw-bold">{{ post.toilet }}</span></p>
    <p class="col-3 mb-2" v-if="post.type == 'Квартира' || post.type == 'Помещение' || post.type == 'Дом'">Отделка: <span class="fw-bold">{{ post.otdelka }}</span></p>
    <p class="col-3 mb-2" v-if="post.type == 'Квартира'">Этаж: <span class="fw-bold">{{ post.floor }}</span></p>

    <p class="col-3 mb-2" v-if="post.type == 'Помещение'">Первая линия: <span class="fw-bold">{{ post.first_line }}</span></p>
    <p class="col-3 mb-2" v-if="post.type == 'Помещение'">Готовый бизнес: <span class="fw-bold">{{ post.ready_business }}</span></p>
    <p class="col-3 mb-2" v-if="post.type == 'Помещение'">Арендатор: <span class="fw-bold">{{ post.arendator }}</span></p>
    <p class="col-3 mb-2" v-if="post.type == 'Помещение'">Паркинг: <span class="fw-bold">{{ post.car_parking }}</span></p>

    <p class="col-3 mb-2" v-if="post.type == 'Дом' || post.type == 'Участок' || post.type == 'Завод' || post.type == 'Бизнес-Центр' || post.type == 'Гостиница'">Участок (сот): <span class="fw-bold">{{ post.uchastok }}</span></p>
    <p class="col-3 mb-2" v-if="post.type == 'Участок'">Назначение: <span class="fw-bold">{{ post.purpose }}</span></p>
    <p class="col-3 mb-2" v-if="post.type == 'Участок'">ПДП: <span class="fw-bold">{{ post.pdp }}</span></p>
    <p class="col-3 mb-2" v-if="post.type == 'Участок'">Проект: <span class="fw-bold">{{ post.project }}</span></p>
    <p class="col-3 mb-2" v-if="post.type == 'Участок'">Тип участка: <span class="fw-bold">{{ post.uchastok_type }}</span></p>

    <p class="col-3 mb-2" v-if="post.type == 'БЦ' || post.type == 'База/Склад'">Площадь офисов: <span class="fw-bold">{{ post.office_area }}</span></p>
    <p class="col-3 mb-2" v-if="post.type == 'База/Склад' || post.type == 'Завод'">Площадь складов: <span class="fw-bold">{{ post.warehouse_area }}</span></p>
    <p class="col-3 mb-2" v-if="post.type == 'Завод' || post.type == 'База/Склад'">ЖД тупик: <span class="fw-bold">{{ post.railroad }}</span></p>
    <p class="col-3 mb-2" v-if="post.type == 'База/Склад'">Отопление: <span class="fw-bold">{{ post.heating }}</span></p>
    <p class="col-3 mb-2" v-if="post.type == 'База/Склад'">Электроэнергия: <span class="fw-bold">{{ post.electricty }} кВт</span></p>
    <p class="col-3 mb-2" v-if="post.type == 'База/Склад'">Трансформатор: <span class="fw-bold">{{ post.transformator }}</span></p>

    <p class="col-3 mb-2" v-if="post.type == 'Завод'">Производительность: <span class="fw-bold">{{ post.perfomance }} тонн</span></p>
    <p class="col-3 mb-2" v-if="post.type == 'Завод'">Мобильность: <span class="fw-bold">{{ post.mobilty }}</span></p>

    <p class="col-3 mb-2" v-if="post.type == 'Авто'">Класс авто: <span class="fw-bold">{{ post.auto_class }}</span></p>
    <p class="col-3 mb-2" v-if="post.type == 'Авто'">Марка: <span class="fw-bold">{{ post.marka }}</span></p>
    <p class="col-3 mb-2" v-if="post.type == 'Авто'">Модель: <span class="fw-bold">{{ post.model }}</span></p>
    <p class="col-3 mb-2" v-if="post.type == 'Авто'">Год выпуска: <span class="fw-bold">{{ post.auto_year }}</span></p>
    <p class="col-3 mb-2" v-if="post.type == 'Авто'">Пробег: <span class="fw-bold">{{ post.probeg }}</span></p>
    <p class="col-3 mb-2" v-if="post.type == 'Авто'">Растоможен: <span class="fw-bold">{{ post.cleared }}</span></p>

    <p class="col-3 mb-2" v-if="post.type == 'Дом' || post.type == 'БЦ' || post.type == 'Гостиница'">Кол-во этажей: <span class="fw-bold">{{ post.floors_number }}</span></p>
    <p class="col-3 mb-2" v-if="post.type == 'БЦ'">Кол-во офисов: <span class="fw-bold">{{ post.offices_number }}</span></p>
    <p class="col-3 mb-2" v-if="post.type == 'БЦ' || post.type == 'Гостиница'">Кол-во парк. мест: <span class="fw-bold">{{ post.parking_number }}</span></p>

    <p class="col-3 mb-2" v-if="post.type == 'Гостиница'">Кол-во номеров: <span class="fw-bold">{{ post.hotel_rooms }}</span></p>
    <p class="col-3 mb-2" v-if="post.type == 'Гостиница'">Площадь номеров: <span class="fw-bold">{{ post.hotel_rooms_area }}</span></p>


    <p class="col-3 mb-2">Дополнительно: <span class="fw-bold" v-for="extra in post.extra" :key="extra">{{ extra }} </span></p>
  </div>
</template>

<script>
export default {
    props: ['post']
}
</script>

<style>

</style>