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
      chart_data: initJson.data.turbine_data,
      old_trueKeys: ["yd_15"],
    };
  },
  computed: {
  },
  mounted() {
    this.drawChart(
      this.old_trueKeys,
      this.chart_data,
    );
    // console.log(this.chart_data)
    // console.log(this.timestampToDate(this.chart_data.map(item => (item.data_time))))
  },
  methods: {
    drawChart(old_trueKeys, chart_data) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("power-chart"));
      const colors = [
        "#5470C6",
        "#91CC75",
        "#EE6666",
        "#FFB6C1",
        "#6A5ACD",
        "	#EEE8AA",
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
        legend: {
          data: [
            "humidity",
            "pre_power",
            "pressure",
            "round_a_power",
            "round_a_ws",
            "temperature",
            "wind_direction",
            "wind_speed",
            "yd_15",
          ],
          selected: initialSelected,
        },
        xAxis: [
          {
            type: "category",
            axisLabel: {},
            axisTick: {
              alignWithLabel: true,
            },
            // prettier-ignore
            data: this.timestampToDate(chart_data.map(item => (item.data_time))),
          },
        ],
        yAxis: Object.keys(initialSelected).map((item, index) => {
          var max = Math.max.apply(
            null,
            chart_data.map((chart_item) => chart_item[item])
          );
          var min = Math.min.apply(
            null,
            chart_data.map((chart_item) => chart_item[item])
          );
          return {
            type: "value",
            name: item,
            splitLine: {
              show: false,
            },
            show: false,
            position: "left",
            alignTicks: false,
            offset: 0,
            max: max,
            min: min,
            interval: (max - min) / 7,
            axisLine: {
              show: true,
              lineStyle: {
                color: colors[index],
              },
            },
            axisLabel: {
              formatter: "{value}",
            },
          };
        }),
        series: Object.keys(initialSelected).map((item) => {
          return {
            name: item,
            type: "line",
            data: chart_data.map((chart_item) => chart_item[item]),
            yAxisIndex:Object.keys(initialSelected).indexOf(item)
          };
        }),
        dataZoom: [
          {
            type: "slider",
            zoomOnMouseWheel:true
          },
        ],
      };
      // 绘制图表
      option && myChart.setOption(option);
      myChart.on("legendselectchanged", function (params) {
        var selected = params.selected;
        // console.log(selected);

        Object.keys(selected).forEach(function (element) {
          if (selected[element]) {
            if (
              old_trueKeys.indexOf(element) === -1 &&
              old_trueKeys.length < 3
            ) {
              // console.log("element", element);
              old_trueKeys.push(element);
            }
          } else {
            if (
              old_trueKeys.indexOf(element) !== -1 &&
              old_trueKeys.length > 1
            ) {
              old_trueKeys.splice(
                old_trueKeys.indexOf(element),
                old_trueKeys.indexOf(element)
              );
            }
          }
        });
        // console.log("old_trueKeys", old_trueKeys);

        var trueKeys = old_trueKeys;
        this.old_trueKeys = old_trueKeys;
        var iSelected = {
          humidity: false,
          pre_power: false,
          pressure: false,
          round_a_power: false,
          round_a_ws: false,
          temperature: false,
          wind_direction: false,
          wind_speed: false,
          yd_15: false,
        };
        trueKeys.map((item) => {
          iSelected[item] = true;
        });
        // console.log("n_selected", iSelected);
        // 更新图表配置项
        myChart.setOption({
          legend: {
            selected: iSelected,
          },
        });
      });
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    timestampToDate(timestampList) {
      return timestampList.map((timestamp) => {
        const date = new Date(timestamp*1000);
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
#power-chart {
  height: 100%;
  width: 100%;
}
</style>
  