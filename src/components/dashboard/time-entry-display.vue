<template>
  <div class="grid">
    <h1>Time entry display</h1>
    <div class="maxIdleTime">
      <md-field>
        <label for="maxIdleTime">Max Idle Time</label>
        <md-select v-model="maxIdleTime" name="maxIdleTime" id="maxIdleTime">
          <template v-for="i in 11">
            <md-option v-bind:key="`maxIdleTime-${i*5}`" :value="i*5">{{i*5}} minutes</md-option>
          </template>
          <md-option :value="60">1 hour</md-option>
          <md-option :value="90">1.5 hours</md-option>
          <md-option :value="120">2 hours</md-option>
          <md-option :value="180">3 hours</md-option>
        </md-select>
      </md-field>
    </div>
    <div class="stopBtn">
      <button v-if="this.timeEntry" v-on:click="stopTimeEntry">Stop time entry</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator';
import { ipcRenderer, app } from 'electron';
import ElectronStore from 'electron-store';
import axios from 'axios';

const store = new ElectronStore();

@Component
export default class TimeEntryDisplay extends Vue {
  timeEntry: any = null;
  idleTimeInterval: any = null;
  idleTimeIntervalStep: number = 60000;
  maxIdleTime: any = store.get('MAX_IDLE_TIME') || null;
  waitingForTogglResponse: boolean = false;
  
  @Watch('maxIdleTime')
  onMaxIdleTimeChange(){
    store.set('MAX_IDLE_TIME', this.maxIdleTime);
  }

  test() {
    ipcRenderer.send('get-idle-time');
  }

  async created(){
    const timeEntry = await this.getRunningTimeEntry();
    if(timeEntry && timeEntry.data && timeEntry.data.data) this.timeEntry = timeEntry.data.data;

    ipcRenderer.on('app-shut-down', () => {
      this.stopTimeEntry({}, true);
    })

    ipcRenderer.on('app-close', () => {
      this.stopTimeEntry({});
    })

    ipcRenderer.on('get-idle-time', (event: any, idleTime: any) => {
      if(this.maxIdleTime && !this.waitingForTogglResponse)
        this.evaluateIdleTime(idleTime);
    })
    this.startIdleTimeInterval();
  }

  getRunningTimeEntry(){
    return axios.get('https://www.toggl.com/api/v8/time_entries/current');
  }

  secondsToMs(seconds: any){
    return seconds * 1000;
  }

  minutesToSeconds(minutes: any){
    return minutes * 60;
  }

  calculateLastActiveTime(idleTime: any){
    return new Date(Date.now() - this.secondsToMs(idleTime));
  }

  evaluateIdleTime(idleTime: any){
    if(this.timeEntry) {
      if(idleTime >= this.minutesToSeconds(this.maxIdleTime))
        this.stopTimeEntry({ stop: this.calculateLastActiveTime(idleTime) });
    } else if(idleTime < this.minutesToSeconds(this.maxIdleTime)) {
      this.startTimeEntry({ start: this.calculateLastActiveTime(idleTime) });
    }
  }

  startIdleTimeInterval(){
    this.clearIdleTimeInterval();
    ipcRenderer.send('get-idle-time');
    this.idleTimeInterval = setInterval(()=>{
      ipcRenderer.send('get-idle-time');
    }, this.idleTimeIntervalStep);
  }

  clearIdleTimeInterval(){
    clearInterval(this.idleTimeInterval);
  }

  startTimeEntry(data: any){
    this.waitingForTogglResponse = true;
    axios.post('https://www.toggl.com/api/v8/time_entries/start', {
      time_entry: {
        ...store.get('DEFAULT_TIME_ENTRY_SETUP'),
        ...data
      }
    })
      .then((res)=>{
        this.waitingForTogglResponse = false;
        this.timeEntry = res.data.data;
      })
      .catch((err)=>{
        this.waitingForTogglResponse = false;
      })
  }

  stopTimeEntry(data: any = {}, appQuit?: boolean){
    this.waitingForTogglResponse = true;
    axios.put(`https://www.toggl.com/api/v8/time_entries/${this.timeEntry.id}/stop`, data)
      .then((res)=>{
        this.waitingForTogglResponse = false;
        this.timeEntry = null;
        if(appQuit) app.quit();
      })
      .catch((err)=>{
        this.waitingForTogglResponse = false;
        if(appQuit) app.quit();
      })

  }
}
</script>

<style scoped lang="scss">
</style>
