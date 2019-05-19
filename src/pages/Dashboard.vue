<template>
  <div class="grid">
    <div class="charts">
      <!-- Hours worked -->
      <div class="md-layout chart1">
        <chart-card
            v-if="settings.showHoursWorkedChart && hoursWorkedChart && hoursWorkedChart.data"
            :chart-data="hoursWorkedChart.data"
            :chart-options="hoursWorkedChart.options"
            :chart-type="'Line'"
            data-background-color="blue">
          <template slot="content">
            <h4 class="title">
              Hours worked
            </h4>
            <p class="category">
              <span class="text-success"
                ><i class="fas fa-long-arrow-alt-up"></i> 55%
              </span>
              more than yesterday.
            </p>
          </template>

          <template slot="footer">
            <!-- <div class="stats">
              <md-icon>access_time</md-icon>
              thi
            </div> -->
          </template>
        </chart-card>
      </div>
      <!-- Second chart -->
      <div class="md-layout chart2">
        <chart-card
            v-if="settings.showTagsChart && topUsedTagsChart && topUsedTagsChart.data"
            :chart-data="topUsedTagsChart.data"
            :chart-options="topUsedTagsChart.options"
            :chart-responsive-options="topUsedTagsChart.responsiveOptions"
            :chart-type="'Bar'"
            data-background-color="red">
          <template slot="content">
            <h4 class="title">
              Tags
            </h4>
            <p class="category">
              Most used tags this week
            </p>
          </template>

          <template slot="footer">
            <!-- <div class="stats">
              <md-icon>access_time</md-icon>
              updated 10 days ago
            </div> -->
          </template>
        </chart-card>
      </div>
      <!-- third chart -->
      <div class="md-layout chart3">
        <chart-card
          v-if="settings.showProductivityChart && productivityChart && productivityChart.data"
          :chart-data="productivityChart.data"
          :chart-options="productivityChart.options"
          :chart-type="'Line'"
          data-background-color="green">
          <template slot="content">
            <h4 class="title">
              Productivity
            </h4>
            <p class="category">
              How much time you worked without stopping (Less idle time)
            </p>
          </template>

          <template slot="footer">
            <!-- <div class="stats">
              <md-icon>access_time</md-icon>
              campaign sent 26 minutes ago
            </div> -->
          </template>
        </chart-card>
      </div>
    </div>
    <div class="stats">
      <div class="md-layout stat1">
        <stats-card
          v-if="settings.showHoursWorkedStat"
          data-background-color="green">
          <template slot="header">
            <md-icon>work</md-icon>
          </template>

          <template slot="content">
            <p class="category">Hours worked</p>
            <h3 class="title">{{hoursWorkedToday}}</h3>
          </template>

          <template slot="footer">
            <div class="stats">
              <md-icon>date_range</md-icon>
              Today
            </div>
          </template>
        </stats-card>
      </div>
      <div class="md-layout stat2">
        <stats-card
          v-if="settings.showHoursWorkedStat"
          data-background-color="orange">
          <template slot="header">
            <md-icon>work</md-icon>
          </template>

          <template slot="content">
            <p class="category">Hours worked</p>
            <h3 class="title">
              {{hoursWorkedThisWeek}}
            </h3>
          </template>

          <template slot="footer">
            <div class="stats">
              <md-icon>date_range</md-icon>
              This week
            </div>
          </template>
        </stats-card>
      </div>
      <div class="md-layout stat3">
        <stats-card
          v-if="settings.showIdleTimeStat"
          data-background-color="red">
          <template slot="header">
            <md-icon>info_outline</md-icon>
          </template>

          <template slot="content">
            <p class="category">Idle time</p>
            <h3 class="title">
              10 minutes
            </h3>
          </template>

          <template slot="footer">
            <div class="stats">
              <md-icon>date_range</md-icon>
              This week
            </div>
          </template>
        </stats-card>
      </div>
      <div class="md-layout stat4">
        <stats-card
          v-if="settings.showTagsStat"
          data-background-color="blue">
          <template slot="header">
            <md-icon>local_offer</md-icon>
          </template>

          <template slot="content">
            <p class="category">Tags</p>
            <h3 class="title">
              245
            </h3>
          </template>

          <template slot="footer">
            <div class="stats">
              <md-icon>date_range</md-icon>
              This week
            </div>
          </template>
        </stats-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import axios from 'axios';
import dbService from '@/database/dbService';
import { first } from 'rxjs/operators';
import moment from 'moment';
import _ from 'lodash';

import {
  StatsCard,
  ChartCard,
  NavTabsCard,
  NavTabsTable,
  OrderedTable
} from '@/components';

@Component({
  components: {
    StatsCard,
    ChartCard,
    NavTabsCard,
    NavTabsTable,
    OrderedTable
  }
})
export default class Dashboard extends Vue {
  public settings: any = {};
  hoursWorkedChart: any = null;
  topUsedTagsChart: any = null;
  productivityChart: any = null;
  hoursWorkedToday: any = 0;
  hoursWorkedThisWeek: any = 0;
  $Chartist: any;


  async created() {
    dbService.getSettings().pipe( first() )
      .subscribe((settings: any = {}) => {
        this.settings = settings;
      });
    this.loadHoursWorked();
    this.loadStats();
    this.loadTags();
    this.loadProductivity();
  }

  loadStats(){
    this.loadHoursWorkedToday();
    this.loadHoursWorkedWeek();
  }

  async loadHoursWorkedToday(){
    const start_date = moment().startOf('day').toISOString();
    const end_date = moment().endOf('day').toISOString();
    const timeEntries = await axios.get(`https://www.toggl.com/api/v8/time_entries?start_date=${start_date}&end_date=${end_date}`);
    let hours = 0;
    for(const timeEntry of timeEntries.data){
      timeEntry.start = moment(timeEntry.start);
      timeEntry.stop = moment(timeEntry.stop || new Date());

      const duration = moment.duration(timeEntry.stop.diff(timeEntry.start));
      hours += duration.asHours();
    }
    this.hoursWorkedToday = hours.toFixed(0);
  }

  async loadHoursWorkedWeek(){
    const start_date = moment().startOf('week').toISOString();
    const end_date = moment().endOf('week').toISOString();
    const timeEntries = await axios.get(`https://www.toggl.com/api/v8/time_entries?start_date=${start_date}&end_date=${end_date}`);
    let hours = 0;
    for(const timeEntry of timeEntries.data){
      timeEntry.start = moment(timeEntry.start);
      timeEntry.stop = moment(timeEntry.stop || new Date());

      const duration = moment.duration(timeEntry.stop.diff(timeEntry.start));
      hours += duration.asHours();
    }
    this.hoursWorkedThisWeek = hours.toFixed(0);
  }

  async loadHoursWorked(){
    const series = [ await this.getHoursWorked() ];
    this.hoursWorkedChart = {
      data: {
        labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
        series,
      },
      options: {
        lineSmooth: this.$Chartist.Interpolation.cardinal({
          tension: 0,
        }),
        low: 0,
        high: _.max(series[0]) + 5,
        chartPadding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
      },
    };
  }

  async getHoursWorked() {
    const data = [];
    for(let day = -7; day <= -1; day++){
      const start_date = moment().weekday(day).startOf('day').toISOString();
      const end_date = moment().weekday(day).endOf('day').toISOString();
      const timeEntries = await axios.get(`https://www.toggl.com/api/v8/time_entries?start_date=${start_date}&end_date=${end_date}`);
      let hours = 0;
      for(const timeEntry of timeEntries.data){
        if(timeEntry.start && timeEntry.stop){
          timeEntry.start = moment(timeEntry.start);
          timeEntry.stop = moment(timeEntry.stop);

          const duration = moment.duration(timeEntry.stop.diff(timeEntry.start));
          hours += duration.asHours();
        }
      }
      data.push(hours);
    }
    return data;
  }

  async loadProductivity(){
    const series = [ await this.getHoursWorked() ];
    this.productivityChart = {
      data: {
        labels: ['12am', '3pm', '6pm', '9pm', '12pm', '3am', '6am', '9am'],
        series: [[230, 750, 450, 300, 280, 240, 200, 190]],
      },

      options: {
        lineSmooth: this.$Chartist.Interpolation.cardinal({
          tension: 0,
        }),
        low: 0,
        high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
        chartPadding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
      },
    };
  }

  async getTags() {
    return [12, 17, 7, 17, 23, 18, 38];
  }

  async getIdleTime() {
    return [12, 17, 7, 17, 23, 18, 38];
  }

  async loadTags(){
    const series = [ await this.getHoursWorked() ];
    this.topUsedTagsChart = {
      data: {
        labels: [
          'Ja',
          'Fe',
          'Ma',
          'Ap',
          'Mai',
          'Ju',
          'Jul',
          'Au',
          'Se',
          'Oc',
          'No',
          'De',
        ],
        series: [[542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]],
      },
      options: {
        axisX: {
          showGrid: false,
        },
        low: 0,
        high: 1000,
        chartPadding: {
          top: 0,
          right: 5,
          bottom: 0,
          left: 0,
        },
      },
    };
  }
}
</script>

<style lang="scss">
.grid {
  display: grid;
  // grid-row-gap: 20px;
  grid-template-rows: 1fr 200px;
  grid-template-columns: 1fr;
  grid-template-areas: "charts" "stats";
  padding: 0 30px;

  .charts {
    grid-area: charts;

    display: grid;
    grid-column-gap: 30px;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-areas: "chart1 chart2 chart3";

    .chart1 {
      grid-area: chart1;
    }

    .chart2 {
      grid-area: chart2;
    }

    .chart3 {
      grid-area: chart3;
    }
  }

  .stats {
    grid-area: stats;

    display: grid;
    grid-column-gap: 30px;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-areas: "stats1 stats2 stats3 stats4";

    .stats1 {
      grid-area: stats1;
    }

    .stats2 {
      grid-area: stats2;
    }

    .stats3 {
      grid-area: stats3;
    }

    .stats4 {
      grid-area: stats4;
    }
  }
}
</style>
