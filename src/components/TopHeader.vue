<template>
  <div id="top-header">
    <dv-decoration-8 class="header-left-decoration" />
    <dv-decoration-5 class="header-center-decoration" />
    <dv-decoration-8 class="header-right-decoration" :reverse="true" />
    <div class="center-title">龙源电力新能源电最预测分析系统</div>
  </div>
</template>
  
  <script>
export default {
  name: "TopHeader",
};
</script>
  
<style scoped>
#top-header {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-shrink: 0;
}

.header-center-decoration {
  width: 40%;
  height: 60px;
  margin-top: 30px;
}

.header-left-decoration,
.header-right-decoration {
  width: 25%;
  height: 60px;
}

.center-title {
  position: absolute;
  font-size: clamp(0.58rem, 0.137rem + 2.83vw, 1.2rem) !important;
  font-weight: bold;
  left: 50%;
  top: 12px;
  width:50%;
  transform: translateX(-50%);
  color:white;
  /* background: red; */
}
</style>