<template>
  <div class="center-box">
    <div class="ui main container" style="background-color: white" id="app">
      <search-engine></search-engine>
    </div>
  </div>
</template>

<script>
import SearchEngine from "../src/components/SearchEngine";

export default {
  name: 'app',
  components: {
    SearchEngine
  }
}
</script>

<style>
  .main.container {
    padding-top: 100px;
  }
  .head.item {
    height: 50px;
  }
  .over-pink:hover {
    background-color: deeppink;
  }
  .center-box {
    width: 75%;
    padding: 20px;
    margin-left: auto;
    margin-right: auto;
    background-color: white;
    -webkit-box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.66);
    -moz-box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.66);
    box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.66);
  }
</style>
