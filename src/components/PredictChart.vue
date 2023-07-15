<template>
  <div id="chart-resize-box">
    <div id="predict-chart"></div>
  </div>
</template>
    
  <script>
import initJson from "../assets/json/init.json";
export default {
  name: "PredictChart",
  props: {},
  data() {
    return {
      startTime: 1625200000000, // 开始时间戳
      endTime: 1625286400000, // 结束时间戳
      interval: 15 * 60 * 1000, // 时间间隔（15分钟，单位为毫秒）
      show_start: 1,
      show_end: 5,
      dateList: [],
      predict_start: 1625285500000,
      real_power: [],
      predict_power: [],
      chart_data: initJson.data.turbine_data,
      history: [],
      old_trueKeys: ["yd_15"],
      max: 0,
      min: 0,
    };
  },
  computed: {
    timestampList() {
      const list = [];
      let currentTime = this.startTime;
      while (currentTime < this.endTime) {
        list.push(currentTime);
        currentTime += this.interval;
      }
      return list;
    },
    formattedTimestampList() {
      return this.timestampList.map((timestamp) => {
        const date = new Date(timestamp);
        // 使用适合您的时间格式化选项格式化时间戳
        const formattedTime = `${date.getFullYear()}-${
          date.getMonth() + 1
        }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
        return formattedTime;
      });
    },
  },
  mounted() {
    this.drawChart(this.chart_data);
    // console.log(this.chart_data)
    // console.log(this.timestampToDate(this.chart_data.map(item => (item.data_time))))
  },
  methods: {
    drawChart(chart_data) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(
        document.getElementById("predict-chart")
      );
      const colors = [
        "#5470C6",
        "#91CC75",
        "#EE6666",
        "#FFB6C1",
        "#6A5ACD",
        "#EEE8AA",
        "#FFA500",
        "#FF0000",
        "#DEB887",
      ];
      // 设置初始的图例选中状态
      var initialSelected = {
        humidity: false,
        pre_power: false,
        pressure: false,
        round_a_power: false,
        round_a_ws: false,
        temperature: false,
        wind_direction: false,
        wind_speed: false,
        yd_15: true,
      };
      let option;
      option = {
        color: colors,
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
        },
        grid: {
          right: "20%",
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        legend: {
          data: ["Evaporation", "Precipitation", "Temperature"],
        },
        xAxis: [
          {
            type: "category",
            axisTick: {
              alignWithLabel: true,
            },
            // prettier-ignore
            data: this.timestampToDate(chart_data.map(item => (item.data_time))),
          },
        ],
        yAxis: [
          {
            type: "value",
            show: false,
            alignTicks: true,
          },
          {
            type: "value",
            show: false,
            alignTicks: true,
          },
          {
            type: "value",
            show: false,
            alignTicks: true,
          },
        ],
        series: [
          {
            name: "Evaporation",
            type: "line",
            data: chart_data.map((chart_item) => chart_item[""]),
          },
          {
            name: "Precipitation",
            type: "line",
            yAxisIndex: 1,
            data: [
              2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0,
              2.3,
            ],
          },
          {
            name: "Temperature",
            type: "bar",
            yAxisIndex: 2,
            data: [
              2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2,
            ],
          },
        ],
        dataZoom: [
          {
            type: "slider",          },
        ],

      };
      // 绘制图表
      option && myChart.setOption(option);
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    timestampToDate(timestampList) {
      return timestampList.map((timestamp) => {
        const date = new Date(timestamp);
        // 使用适合您的时间格式化选项格式化时间戳
        const formattedTime = `${date.getFullYear()}-${
          date.getMonth() + 1
        }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
        return formattedTime;
      });
    },
    get_Up_Down() {
      // var keys = [
      //   "humidity",
      //   "pre_power",
      //   "pressure",
      //   "round_a_power",
      //   "round_a_ws",
      //   "temperature",
      //   "wind_direction",
      //   "wind_speed",
      //   "yd_15",
      // ];
      // this.keys.map((key) => {
      //   max = Math.max.apply(
      //     null,
      //     this.chart_data.map((item) => item[key])
      //   );
      //   min = Math.max.apply(
      //     null,
      //     this.chart_data.map((item) => item[key])
      //   );
      // });
    },
  },
  watch: {},
};
</script>
    
  <style scoped>
#chart-resize-box {
  width: 100%;
  height: 100%;
}
#predict-chart {
  height: 100%;
  width: 100%;
}
</style>
    