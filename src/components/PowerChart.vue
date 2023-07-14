<template>
  <div id="chart-resize-box">
    <div id="power-chart"></div>
  </div>
</template>
  
<script>
import initJson from "../assets/json/init.json";
export default {
  name: "PowerChart",
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
      history:[],
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
    this.drawChart(this.chart_data, this.show_start, this.show_end);
  },
  methods: {
    drawChart(chart_data, show_start, show_end) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("power-chart"));
      const colors = ["#5470C6", "#91CC75", "#EE6666"];
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
            axisLabel: {
            },
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
            name: "预测功率",
            position: "right",
            alignTicks: true,
            axisLine: {
              show: true,
              lineStyle: {
                color: colors[0],
              },
            },
            axisLabel: {
              formatter: "{value} w",
            },
          },
          {
            type: "value",
            name: "真实功率",
            position: "right",
            alignTicks: true,
            offset: 80,
            axisLine: {
              show: true,
              lineStyle: {
                color: colors[1],
              },
            },
            axisLabel: {
              formatter: "{value} w",
            },
          },
          {
            type: "value",
            name: "误差情况",
            interval: 20,
            position: "left",
            min: 0,
            max: 100,
            alignTicks: true,

            axisLine: {
              show: true,
              lineStyle: {
                color: colors[2],
              },
            },
            axisLabel: {
              formatter: "{value} %",
            },
          },
        ],
        dataZoom: [
          {
            type: "slider",
            start: show_start,
            end: show_end,
          },
        ],
        series: [
          {
             name: "Evaporation",
            type: "line",
            data: [
              2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4,
              3.3,
            ],
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
            data: [2, 2.2, 3.3, 4.5, 3.3, 0.2, 0.3, 3.4, 3.0, 1.5, 2.0, 3.2],
          },
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
  },
  watch: {},
};
</script>
  
<style scoped>
#chart-resize-box {
  width: 100%;
  height: 100%;
}
#power-chart {
  height: 600px;
  width: 100%;
}
</style>
  