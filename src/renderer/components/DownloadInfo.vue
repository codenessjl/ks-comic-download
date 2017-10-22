<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-data-table :headers="headers" :items="downloadList" hide-actions class="elevation-2 bg-opacity">
        <template slot="items" slot-scope="props">
          <td>{{ props.item.name }}</td>
          <td>
            <p class="mb-0" v-if="props.item.sumNum !== 0">{{ props.item.downloadedNum + '/' + props.item.sumNum }}</p>
            <p class="mb-0" v-else>还未开始下载</p>
          </td>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'download-info',
  data () {
    return {
      headers: [{
        text: '标题',
        align: 'left',
        sortable: false
      }, {
        text: '进度',
        align: 'left',
        sortable: false
      }]
    }
  },
  computed: {
    ...mapState({
      downloadList: state => state.download.list,
      themeColor: state => state.setting.themeColor
    })
  },
  created () {
  }
}
</script>

<style>

</style>
