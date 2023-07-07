<template>
  <div id="app">
    <dv-full-screen-container>
      <router-view />
    </dv-full-screen-container>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  height: 100%;
  width: 100%;
  background: yellow;
  font:16px !important;
}
#dv-full-screen-container {
  background-image: url("./assets/bg.png");
  background-size: 100% 100%;
  width:100% !important; 
  height:100% !important;
  background-attachment:fixed;
  margin: 0px;
  padding:0px;
  box-shadow: 0 0 3px blue;
  display: flex;
  flex-direction: column;
  transform:scale(1) !important;
  
}
element.style {
    width:100%;
    height:100%
}

>>>div.el-picker-panel{
  background: red !important;
}

</style>
