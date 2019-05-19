<template>
  <div class="grid">
    <div class="charts">
      <!-- Hours worked -->
      <div class="md-layout chart1">
        <chart-card
            v-if="settings.showHoursWorkedChart"
            :chart-data="dailySalesChart.data"
            :chart-options="dailySalesChart.options"
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
            <div class="stats">
              <md-icon>access_time</md-icon>
              updated 4 minutes ago
            </div>
          </template>
        </chart-card>
      </div>
      <!-- Second chart -->
      <div class="md-layout chart2">
        <chart-card
            v-if="settings.showTagsChart"
            :chart-data="emailsSubscriptionChart.data"
            :chart-options="emailsSubscriptionChart.options"
            :chart-responsive-options="emailsSubscriptionChart.responsiveOptions"
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
            <div class="stats">
              <md-icon>access_time</md-icon>
              updated 10 days ago
            </div>
          </template>
        </chart-card>
      </div>
      <!-- third chart -->
      <div class="md-layout chart3">
        <chart-card
          v-if="settings.showProductivityChart"
          :chart-data="dataCompletedTasksChart.data"
          :chart-options="dataCompletedTasksChart.options"
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
            <div class="stats">
              <md-icon>access_time</md-icon>
              campaign sent 26 minutes ago
            </div>
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
            <md-icon>store</md-icon>
          </template>

          <template slot="content">
            <p class="category">Hours worked</p>
            <h3 class="title">6</h3>
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
            <md-icon>content_copy</md-icon>
          </template>

          <template slot="content">
            <p class="category">Hours worked</p>
            <h3 class="title">
              72
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
            <i class="fab fa-twitter"></i>
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
  dailySalesChart: any;
  dataCompletedTasksChart: any;
  emailsSubscriptionChart: any;
  $Chartist: any;

  async created() {
    dbService.getSettings().pipe( first() )
      .subscribe((settings: any = {}) => {
          this.settings = settings;
      });
    this.dailySalesChart = {
      data: {
        labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
        series: [[12, 17, 7, 17, 23, 18, 38]],
      },
      options: {
        lineSmooth: this.$Chartist.Interpolation.cardinal({
          tension: 0,
        }),
        low: 0,
        high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
        chartPadding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
      },
    };
    this.dataCompletedTasksChart = {
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
    this.emailsSubscriptionChart = {
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
      responsiveOptions: [
        [
          'screen and (max-width: 640px)',
          {
            seriesBarDistance: 5,
            axisX: {
              labelInterpolationFnc(value) {
                return value[0];
              },
            },
          },
        ],
      ],
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
