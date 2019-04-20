<template>
  <div class="grid">
    <h1>Setup your default time entry configuration</h1>
    <div class="workspaces">
      <md-field>
        <label for="workspace">Workspace</label>
        <md-select v-model="userSelection.wid" name="workspace" id="workspace">
          <template v-for="ws in workspaces">
            <md-option v-bind:key="`ws-${ws.id}`" :value="ws.id">{{ws.name}}</md-option>
          </template>
        </md-select>
      </md-field>
    </div>
    <div class="tags" v-if="tags.length > 0">
      <md-field>
        <label for="tags">Tags</label>
        <md-select v-model="userSelection.tags" name="tags" id="tags" multiple>
          <template v-for="tag in tags">
            <md-option v-bind:key="`tag-${tag.id}`" :value="tag.name">{{tag.name}}</md-option>
          </template>
        </md-select>
      </md-field>
    </div>
    <div class="project" v-if="projects.length > 0">
      <md-field>
        <label for="project">Project</label>
        <md-select v-model="userSelection.pid" name="project" id="project">
          <template v-for="project in projects">
            <md-option v-bind:key="`project-${project.id}`" :value="project.id">{{project.name}}</md-option>
          </template>
        </md-select>
      </md-field>
    </div>
    <div class="description">
      <md-field>
        <label>Description</label>
        <md-input v-model="userSelection.description"></md-input>
      </md-field>
    </div>
    <div class="billable">
      <md-checkbox v-model="userSelection.billable">Billable entry #{{userSelection.billable}}</md-checkbox>
    </div>
    <div class="button" v-if="userSelection.wid">
      <button v-on:click="startTimeEntry">Start time entry</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import ElectronStore from 'electron-store';
import axios from 'axios';

const store = new ElectronStore();

@Component
export default class TimeEntrySetup extends Vue {
  workspaces = [];
  tags = [];
  projects = [];
  userSelection = {
    wid: null,
    pid: null,
    billable: false,  
    description: '',
    tags: []
  }

  @Watch('userSelection.wid')
  async getWorkspaceData(){
    if(this.userSelection.wid) {
      const tags = await axios.get(`https://www.toggl.com/api/v8/workspaces/${this.userSelection.wid}/tags`)
      this.tags = tags.data || [];

      const projects = await axios.get(`https://www.toggl.com/api/v8/workspaces/${this.userSelection.wid}/projects`)
      this.projects = projects.data || [];
    }
  }

  async created(){
    const ws = await this.getWorkspaces();
    this.workspaces = ws.data;
  }

  getWorkspaces(){
    return axios.get('https://www.toggl.com/api/v8/workspaces');
  }

  startTimeEntry(){
    axios.post('https://www.toggl.com/api/v8/time_entries/start', {
      time_entry: {
          ...this.userSelection,
          created_with: 'TOGGL_NO_HANDS'
      }
    }).then((res)=>{
      store.set('DEFAULT_TIME_ENTRY_SETUP', res.data);
      this.$emit('newTimeEntry', res.data);
    })
  }
}
</script>

<style scoped lang="scss">
</style>
