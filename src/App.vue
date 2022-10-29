<template>
  <div id="app">
    <MainPanel/>
  </div>
</template>

<script>
import MainPanel from './components/MainPanel.vue'

export default {
  name: 'App',
  components: {
    MainPanel
  }
}
</script>

<style>
#app {
  overflow: hidden;
}

a {
  color: #2387fa;
  text-decoration: none;
  cursor: pointer;
}
</style>