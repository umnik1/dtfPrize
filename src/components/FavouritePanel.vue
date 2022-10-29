<template>
    <div class="pane">
      <iframe src="https://umnik.one/dtf/" id="frame">
          Ваш браузер не поддерживает плавающие фреймы!
      </iframe>
    </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#frame {
  width: 100%;
  height: 100%;
  border: 0;
}
.pane {
  height: 100%;
  overflow: hidden;
}
</style>
