<template>
  <div id="chart-resize-box">
    <div id="predict-chart"></div>
  </div>
</template>
    
<script>
import predictJson from "../assets/json/pred_return.json";
export default {
  name: "PredictChart",
  props: { chart_data: {} },
  data() {
    return {
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
        const formattedTime = `${date.getFullYear()}-${date.getMonth() + 1
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
      let option;
      option = {
        color: colors,
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "line",
          },
        },
        grid: {
          right: "10%",
        },
        // toolbox: {
        //   feature: {
        //     dataView: { show: true, readOnly: false },
        //     restore: { show: true },
        //     saveAsImage: { show: true },
        //   },
        // },
        legend: {
          data: ["true_yd15", "pred_yd15", "diff"],
        },
        xAxis: [
          {
            type: "category",
            axisTick: {
              alignWithLabel: true,
            },
            // prettier-ignore
            data: this.timestampToDate(chart_data.his_result.map(item => (item['DATATIME']))).concat(this.timestampToDate(chart_data.pred_result.map(item => (item['DATATIME'])))),
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "true_yd15",
            show: false,
            alignTicks: true,
            max: Math.max.apply(
              null,
              chart_data.his_result
                .map((chart_item) => chart_item["YD15"])
                .concat(
                  chart_data.pred_result.map(
                    (chart_item) => chart_item["TRUE_YD15"]
                  )
                )
                .concat(
                  chart_data.pred_result.map(
                    (chart_item) => chart_item["PRED_YD15"]
                  )
                )
            ),
            min: Math.min.apply(
              null,
              chart_data.his_result
                .map((chart_item) => chart_item["YD15"])
                .concat(
                  chart_data.pred_result.map(
                    (chart_item) => chart_item["TRUE_YD15"]
                  )
                )
                .concat(
                  chart_data.pred_result.map(
                    (chart_item) => chart_item["PRED_YD15"]
                  )
                )
            ),
          },
          {
            type: "value",
            name: "pred_yd15",
            show: false,
            alignTicks: true,
            max: Math.max.apply(
              null,
              chart_data.his_result
                .map((chart_item) => chart_item["YD15"])
                .concat(
                  chart_data.pred_result.map(
                    (chart_item) => chart_item["TRUE_YD15"]
                  )
                )
                .concat(
                  chart_data.pred_result.map(
                    (chart_item) => chart_item["PRED_YD15"]
                  )
                )
            ),
            min: Math.min.apply(
              null,
              chart_data.his_result
                .map((chart_item) => chart_item["YD15"])
                .concat(
                  chart_data.pred_result.map(
                    (chart_item) => chart_item["TRUE_YD15"]
                  )
                )
                .concat(
                  chart_data.pred_result.map(
                    (chart_item) => chart_item["PRED_YD15"]
                  )
                )
            ),
          },
          {
            type: "value",
            name: "diff",
            show: false,
            alignTicks: false,
            max: 100,
            min: 0,
          },
        ],
        visualMap: {
          show: false,
          dimension: 0,
          seriesIndex: 1,
          pieces: [
            {
              gte: 0,
              lt: chart_data.his_result.length,
              color: "rgba(0,0,0,0)",
            },
            {
              gte: chart_data.his_result.length,
              lt: chart_data.his_result.length + chart_data.pred_result.length,
              color: "#91CC75",
            },
          ],
        },
        series: [
          {
            name: "true_yd15",
            type: "line",
            data: chart_data.his_result
              .map((chart_item) => chart_item["YD15"])
              .concat(
                chart_data.pred_result.map(
                  (chart_item) => chart_item["TRUE_YD15"]
                )
              ),
          },
          {
            name: "pred_yd15",
            type: "line",
            data: chart_data.his_result
              .map((chart_item) => 0)
              .concat(
                chart_data.pred_result.map(
                  (chart_item) => chart_item["PRED_YD15"]
                )
              ),
          },
          {
            name: "diff",
            type: "bar",
            yAxisIndex: 2,
            data: chart_data.his_result
              .map((chart_item) => 0)
              .concat(
                chart_data.pred_result.map((chart_item) => chart_item["Diff"] * 100)
              ),
          },
        ],
        dataZoom: [
          {
            type: "slider",
            startValue: this.timestampToDate(chart_data.pred_result.map(item => (item['DATATIME'])))[0],
            endValue: this.timestampToDate(chart_data.pred_result.map(item => (item['DATATIME'])))[chart_data.pred_result.length - 1]
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
        const date = new Date(timestamp * 1000);
        // 使用适合您的时间格式化选项格式化时间戳
        const formattedTime = `${date.getFullYear()}-${date.getMonth() + 1
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
  watch: {
    "chart_data": {
      handler(newVal, oldVal) {
        this.drawChart(newVal)
        // console.log(`新的值: ${newVal}`);
        // console.log(`旧的值: ${oldVal}`);
        // console.log("hellow  world");
      },
      immediate:true
    }
  },
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
    