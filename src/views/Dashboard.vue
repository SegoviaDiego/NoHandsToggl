<template>
  <div class="grid">
    <TimeEntrySetup v-if="!defaultTimeEntrySetup" @newTimeEntry="onNewTimeEntry" />
    <TimeEntryDisplay v-else />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TimeEntrySetup from '@/components/dashboard/time-entry-setup.vue';
import TimeEntryDisplay from '@/components/dashboard/time-entry-display.vue';
import ElectronStore from 'electron-store';
const store = new ElectronStore();

@Component({
  components: {
    TimeEntrySetup,
    TimeEntryDisplay
  }
})
export default class Dashboard extends Vue {
  defaultTimeEntrySetup: any = store.get('DEFAULT_TIME_ENTRY_SETUP') || null;

  onNewTimeEntry(newTimeEntry: any){
    this.defaultTimeEntrySetup = store.get('DEFAULT_TIME_ENTRY_SETUP') || newTimeEntry;
  }
}
</script>

<style scoped lang="scss">
</style>
