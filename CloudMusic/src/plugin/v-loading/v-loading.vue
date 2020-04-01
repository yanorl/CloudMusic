<template>
  <div class="loading">
    <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
  </div>
</template>

<script>
export default {
  name: 'loading'
}
</script>

<style scoped>
  .loading{
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    z-index: 99999 !important;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .loading.fixed {
    background-color: rgba(0, 0, 0, 0.6);
    position: fixed;
  }
  .loading i {
    position: absolute;
    opacity: 1;
    color: #fff;
  }
</style>
