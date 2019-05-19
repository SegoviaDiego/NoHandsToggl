<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { ipcRenderer, app } from 'electron';
import axios from 'axios';
import dbService from '@/database/dbService';
import { first } from 'rxjs/operators';

@Component
export default class TimeEntryLoop extends Vue {
  timeEntry: any = null;
  idleTimeInterval: any = null;
  idleTimeIntervalStep: number = 60000;
  maxIdleTime: any = null;
  waitingForTogglResponse: boolean = false;

  async created() {
    ipcRenderer.on('app-shut-down', () => {
      this.stopTimeEntry({}, true);
    });

    ipcRenderer.on('app-close', () => {
      this.stopTimeEntry({});
    });

    ipcRenderer.on('get-idle-time', (event: any, idleTime: any) => {
      if (this.maxIdleTime && !this.waitingForTogglResponse) { this.evaluateIdleTime(idleTime); }
    });

    dbService.getSettings().pipe( first() )
      .subscribe((settings: any = {}) => {
          if(settings && settings.token){
            axios.defaults.auth = {
              username: `${settings.token}`,
              password: 'api_token',
            };
          }
          if(settings) {
            this.maxIdleTime = settings.maxIdleTime || 10
          }
          this.loadTimeEntryAndStartTimeInterval();
      });
  }

  async loadTimeEntryAndStartTimeInterval(){
    const timeEntry = await axios.get('https://www.toggl.com/api/v8/time_entries/current');
    if (timeEntry && timeEntry.data && timeEntry.data.data) {
      this.timeEntry = timeEntry.data.data;
    } else {
      await this.startTimeEntry({ start: new Date() });
    }
    this.startIdleTimeInterval();
  }

  secondsToMs(seconds: any) {
    return seconds * 1000;
  }

  minutesToSeconds(minutes: any) {
    return minutes * 60;
  }

  calculateLastActiveTime(idleTime: any) {
    return new Date(Date.now() - this.secondsToMs(idleTime));
  }

  evaluateIdleTime(idleTime: any) {
    if (this.timeEntry) {
      if (idleTime >= this.minutesToSeconds(this.maxIdleTime)) { this.stopTimeEntry({ stop: this.calculateLastActiveTime(idleTime) }); }
    } else if (idleTime < this.minutesToSeconds(this.maxIdleTime)) {
      this.startTimeEntry({ start: this.calculateLastActiveTime(idleTime) });
    }
  }

  startIdleTimeInterval() {
    this.clearIdleTimeInterval();
    ipcRenderer.send('get-idle-time');
    this.idleTimeInterval = setInterval(() => {
      ipcRenderer.send('get-idle-time');
    }, this.idleTimeIntervalStep);
  }

  clearIdleTimeInterval() {
    clearInterval(this.idleTimeInterval);
  }

  async startTimeEntry(data: any) {
    dbService.getSettings().pipe( first() )
      .subscribe((settings: any = {}) => {
        const timeEntrySetup = settings.timeEntrySetup || {};
    
        this.waitingForTogglResponse = true;
        axios.post('https://www.toggl.com/api/v8/time_entries/start', {
          time_entry: {
            ...timeEntrySetup,
            ...data,
          },
        })
          .then((res) => {
            this.waitingForTogglResponse = false;
            this.timeEntry = res.data.data;
          })
          .catch((err) => {
            this.waitingForTogglResponse = false;
          });
      });
  }

  stopTimeEntry(data: any = {}, appQuit?: boolean) {
    this.waitingForTogglResponse = true;
    axios.put(`https://www.toggl.com/api/v8/time_entries/${this.timeEntry.id}/stop`, data)
      .then((res) => {
        this.waitingForTogglResponse = false;
        this.timeEntry = null;
        if (appQuit) app.quit();
      })
      .catch((err) => {
        this.waitingForTogglResponse = false;
        if (appQuit) app.quit();
      });
  }
}
</script>

<style lang="scss"> </style>
