<template>
  <form>
    <md-card>
      <md-card-header data-background-color="green">
        <h4 class="title">Settings</h4>
        <p class="category">Edit configuration</p>
      </md-card-header>

      <md-card-content>
        <div class="md-layout">
          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <label>Toggl API Token</label>
              <md-input v-model="settings.token" />
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-switch v-model="settings.showHoursWorkedChart" :value="true">Show hours worked chart</md-switch>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-switch v-model="settings.showTagsChart" :value="true">Show tags chart</md-switch>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-switch v-model="settings.showProductivityChart" :value="true">Show productivity chart</md-switch>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-switch v-model="settings.showHoursWorkedStat" :value="true">Show hours worked stats</md-switch>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-switch v-model="settings.showIdleTimeStat" :value="true">Show idle time stats</md-switch>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-switch v-model="settings.showTagsStat" :value="true">Show tag stats</md-switch>
          </div>
          <div class="md-layout-item md-size-100 text-right">
            <md-field>
              <label>Max idle time (in minutes)</label>
              <md-input v-model="settings.maxIdleTime"></md-input>
            </md-field>
          </div>
          <!-- Time entry setup -->
          <div class="md-layout-item md-size-100 text-right" v-if="settings && settings.timeEntrySetup && workspaces && workspaces.length">
            <md-field>
              <label for="workspace">Workspace</label>
              <md-select v-model="settings.timeEntrySetup.wid" name="workspace" id="workspace" @change="getWorkspaceData">
                <template v-for="ws in workspaces">
                  <md-option v-bind:key="`ws-${ws.id}`" :value="ws.id">{{ws.name}}</md-option>
                </template>
              </md-select>
            </md-field>
          </div>
          <template v-if="settings && settings.timeEntrySetup && settings.timeEntrySetup.wid">
            <div class="md-layout-item md-size-100 text-right" v-if="tags.length > 0">
              <md-field>
                <label for="tags">Tags</label>
                <md-select v-model="settings.timeEntrySetup.tags" name="tags" id="tags" multiple>
                  <template v-for="tag in tags">
                    <md-option v-bind:key="`tag-${tag.id}`" :value="tag.name">{{tag.name}}</md-option>
                  </template>
                </md-select>
              </md-field>
            </div>
            <div class="md-layout-item md-size-100 text-right" v-if="projects.length > 0">
              <md-field>
                <label for="project">Project</label>
                <md-select v-model="settings.timeEntrySetup.pid" name="project" id="project">
                  <template v-for="project in projects">
                    <md-option v-bind:key="`project-${project.id}`" :value="project.id">{{project.name}}</md-option>
                  </template>
                </md-select>
              </md-field>
            </div>
            <div class="md-layout-item md-size-100 text-right">
              <md-field>
                <label>Description</label>
                <md-input v-model="settings.timeEntrySetup.description"></md-input>
              </md-field>
            </div>
            <div class="md-layout-item md-size-100 text-right">
              <md-checkbox v-model="settings.timeEntrySetup.billable">
                Billable entry
              </md-checkbox>
            </div>
          </template>
        </div>
        <div class="md-layout-item md-size-100 text-right">
          <md-button v-on:click="saveChanges" class="md-raised md-success">Save changes</md-button>
        </div>
      </md-card-content>
    </md-card>
  </form>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import axios from 'axios';
import Swal from 'sweetalert2'
import dbService from '@/database/dbService';
import { first } from 'rxjs/operators';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
});

@Component
export default class Login extends Vue {
  public settings: any = {};
  workspaces = [];
  tags = [];
  projects = [];

  async created() {
    dbService.getSettings().pipe( first() )
      .subscribe(async (settings: any = {}) => {
          this.settings = settings;
          if(!this.settings || !this.settings.token) return;
          const ws = await axios.get('https://www.toggl.com/api/v8/workspaces');
          this.workspaces = ws.data;
      });
  }

  async getWorkspaceData() {
    if (this.settings.timeEntrySetup.wid) {
      const tags = await axios.get(`https://www.toggl.com/api/v8/workspaces/${this.settings.timeEntrySetup.wid}/tags`);
      this.tags = tags.data || [];

      const projects = await axios.get(`https://www.toggl.com/api/v8/workspaces/${this.settings.timeEntrySetup.wid}/projects`);
      this.projects = projects.data || [];
    }
  }

  saveChanges(){
    if(!this.settings.token)
      return Toast.fire({
          type: 'error',
          title: 'The toggl token is not valid'
        });

    axios.get('https://www.toggl.com/api/v8/me', {
      auth: {
        username: this.settings.token,
        password: 'api_token',
      },
    }).then(async () => {
      axios.defaults.auth = {
        username: this.settings.token,
        password: 'api_token',
      };
      this.settings.timeEntrySetup.created_with = 'TOGGL_NO_HANDS';
      dbService.saveSettings(this.settings)
        .pipe(first())
        .subscribe(()=>{
          Toast.fire({
            type: 'success',
            title: 'changes saved successfully'
          })
        });

    }).catch((err) => {
      return Toast.fire({
          type: 'error',
          title: 'The toggl token is not valid'
        });
    });
  }
}
</script>

<style></style>
