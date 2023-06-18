<template>
  <div class="loaderWrapper w-100 h-100 mh-100">
    <div class="w-100 h-100 d-flex justify-content-center loaderBox d-flex">
      <p class="tracking-in-expand fs-1 loaderText fw-bold">Ali-Group</p>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
.loaderText{
    position: absolute;
    top: 50%;
}
.loaderWrapper{
    position: relative;
}
.loaderBox {
  position: absolute;
  background: var(--component);
}
.tracking-in-expand {
  -webkit-animation: tracking-in-expand 1s cubic-bezier(0.215, 0.61, 0.355, 1)
    infinite alternate-reverse both;
  animation: tracking-in-expand 1s cubic-bezier(0.215, 0.61, 0.355, 1) infinite
    alternate-reverse both;
}
@-webkit-keyframes tracking-in-expand {
  0% {
    letter-spacing: -0.5em;
    opacity: 0;
  }
  40% {
    opacity: 0.6;
  }
  100% {
    opacity: 1;
  }
}
@keyframes tracking-in-expand {
  0% {
    letter-spacing: -0.5em;
    opacity: 0;
  }
  40% {
    opacity: 0.6;
  }
  100% {
    opacity: 1;
  }
}
</style>