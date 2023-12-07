<template>
<div class="window">

<!-- .toolbar-header sits at the top of your app -->
<header class="toolbar toolbar-header">
  <h1 class="title">DTFPass</h1>
</header>

<!-- Your app's content goes inside .window-content -->
<div class="window-content">
  <div class="pane-group">
    <div class="pane pane-sm sidebar">
      <nav class="nav-group">
        <h5 class="nav-group-title">Меню</h5>
        <span @click="ChangeComponent('StatisticPanel', 0)" :class="tab == 0 ? 'nav-group-item active' : 'nav-group-item'">
          <span class="icon icon-chart-bar"></span>
          Итоги 2023
        </span>
        <span @click="ChangeComponent('PrizePanel', 1)" :class="tab == 1 ? 'nav-group-item active' : 'nav-group-item'">
          <span class="icon icon-shuffle"></span>
          Розыгрыш
        </span>
      </nav>
    </div>

    <div class="pane">
      <component v-bind:is = "CurrentComponent"/>
    </div>
  </div>
</div>
</div>
</template>

<script>
import StatisticPanel from './StatisticPanel.vue'
import PrizePanel from './PrizePanel.vue'

export default {
  name: 'MainPanel',
  data(){
    return{
      tab: 0,
      CurrentComponent: StatisticPanel,
    }
  },
  components: {
    StatisticPanel,
    PrizePanel,
  },
  methods:{
    ChangeComponent(NewComponent, num){
      this.tab = num;
      this.CurrentComponent = NewComponent
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
