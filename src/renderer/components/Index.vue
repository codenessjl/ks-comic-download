<template>
  <v-layout wrap>
    <v-flex xs12>
      <v-alert :color="themeColor" :value="true">欢迎使用KS漫画下载工具</v-alert>
      <usage-steps></usage-steps>
    </v-flex>
  </v-layout>
</template>

<script>
import {mapState} from 'vuex'
import UsageSteps from './Index/UsageSteps'

export default {
  name: 'index',
  computed: {
    ...mapState({
      themeColor: state => state.setting.themeColor
    })
  },
  components: { UsageSteps }
}
</script>

<style>

</style>
