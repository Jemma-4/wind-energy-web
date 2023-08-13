<template>
  <div class="home">
    <!-- 页面头 -->

    <top-header class="top-header" />

    <!-- 数据导入的接口 -->
    <div class="upload-line">
      <!-- 这里需要一个风机的选择  默认一个风机，全部的历史数据-->
      <input
        placeholder="请输入风场名称"
        v-model="upload_turbine"
        class="turbine-input"
      />
      <input
        placeholder="请输入数据版本号"
        v-model="upload_version"
        class="turbine-input"
      />
      <input
        placeholder="请选择上传的风场csv数据"
        disabled="true"
        class="datapath-input"
      />
      <el-upload
        class="upload"
        :action="upload_url"
        :limit="1"
        :on-change="handleUploadSuccess"
        :file-list="fileList"
        :before-upload="update_url"
      >
        <el-button size="small" type="primary" @click="handleUpload"
          >点击上传</el-button
        >
      </el-upload>
    </div>

    <div class="search-line">
      <!-- 这里需要一个风机的选择  默认一个风机，全部的历史数据-->
      <dark-select
        message="风机"
        :options="turbine_options"
        @selected="SelectTurbine"
        class="turbine-version"
      />

      <!-- 增加一个数据版本的选择 -->
      <dark-select
        message="数据版本"
        :options="version_options"
        @selected="SelectVersion"
        class="turbine-version"
      />

      <!-- <dark-select message="历史数据开始时间" :options="h_datetime_start_list" @selected="SelectHistoryStart" class="time-btn" />
      <dark-select message="历史数据结束时间" :options="h_datetime_end_list" @selected="SelectHistoryEnd" class="time-btn" />
      <dark-select message="预测数据开始时间" :options="p_datetime_start_list" @selected="SelectPredictStart" class="time-btn" />


      <dark-select message="预测数据结束时间" :options="p_datetime_end_list" @selected="SelectPredictEnd" class="time-btn" /> -->
      <el-date-picker
        v-model="h_datetime"
        type="datetimerange"
        start-placeholder="历史开始时间"
        end-placeholder="历史结束时间"
        :default-time="['00:00:00', '05:00:00']"
        :picker-options="historyDateLimit"
        :disabled="h_start_end.length === 0"
        @change="hisTimeRangeChange"
        class="search-time"
      >
      </el-date-picker>
      <el-date-picker
        v-model="p_datetime"
        type="datetimerange"
        start-placeholder="预测开始时间"
        end-placeholder="预测结束时间"
        :default-time="['05:00:00', '00:00:00']"
        :disabled="p_start_end.length === 0"
        @change="predTimeRangeChange"
        class="search-time"
      >
      </el-date-picker>
      <dark-select
        message="模型"
        :options="model_options"
        @selected="SelectModel"
        class="turbine-version"
      />

      <!-- 查询按钮 -->
      <div class="time-btn">
        <el-button
          size="small"
          type="primary"
          :disabled="!all_selected"
          @click="handleSearch"
          >预测</el-button
        >
      </div>
    </div>
    <div id="power-chart-box">
      <power-chart
        :chart_data="history_chart_data"
        v-if="
          history_chart_data.length != 0 &&
          Object.keys(predict_chart_data).length == 0
        "
      />
      <predict-chart
        :chart_data="predict_chart_data"
        v-if="Object.keys(predict_chart_data).length != 0"
      />
      <!-- <predict-chart/> -->
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import PowerChart from "@/components/PowerChart.vue";
import PredictChart from "@/components/PredictChart.vue";
import TopHeader from "@/components/TopHeader.vue";
import DarkSelect from "@/components/DarkSelect.vue";
import { baseurl, get, post } from "../network/request.js";
// import '../assets/dark.css'

export default {
  name: "HomeView",
  components: {
    PowerChart,
    TopHeader,
    DarkSelect,
    PredictChart,
  },
  data() {
    return {
      upload_url: "",
      upload_path: "",
      fileList: [], //页面：上传文件列表
      upload_turbine: "",
      upload_version: "",
      turbine_ani: "../../public/turbine/wind.html",
      turbine_options: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
        {
          value: "选项3",
          label: "蚵仔煎",
        },
      ], //页面：可选风机列表
      model_options: [], //页面：可选模型列表
      version_options: [], //页面：可选版本列表

      // h_datetime_start_list: [], //页面：历史数据时间开始列表
      // h_datetime_end_list: [], //页面：历史数据时间结束列表
      // tmp_p_datetime_start_list: [], //逻辑缓存值
      // p_datetime_start_list: [], //页面：预测数据时间开始列表
      // p_datetime_end_list: [], //页面：预测数据时间结束列表
      all_selected: false, //逻辑
      history_chart_data: [], //数据：图表历史数据
      predict_chart_data: {}, //数据：图表预测数据
      turbine: 0, //逻辑：选择风机
      version: 0, //逻辑：选择版本
      model: 0, //逻辑：选择模型
      // h_datetime_start: 0, //逻辑：选择历史开始时间
      // h_datetime_end: 0, //逻辑：选择历史结束时间
      // p_datetime_start: 0, //逻辑：选择预测开始时间
      // p_datetime_end: 0, //逻辑：选择预测结束时间
      h_start_end: [], // 页面，历史起止时间，两元素
      p_start_end: [], // 页面，预测起止时间，两元素
      h_datetime: [],
      p_datetime: [],
    };
  },
  mounted() {
    // todo complete：请求风机列表：
    this.getTurbineList();
  },
  methods: {
    update_url(file) {
      this.upload_url =
        baseurl +
        "turbine/import/" +
        this.upload_turbine +
        "/" +
        this.upload_version;
    },
    getTurbineList() {
      get({
        url: baseurl + "turbine/all",
      }).then((res) => {
        var turbine_list = res.data.data.turbine_list;
        this.turbine_options = turbine_list.map((item, index) => {
          return {
            value: item,
            label: "风机" + item,
          };
        });
        // this.clearState()
      });
    },
    clearState() {
      this.all_selected = false;
      this.model_options = [];
      this.predict_chart_data = {};
      this.history_chart_data = [];
      this.version_options = [];
      this.h_start_end = []; // 页面，历史起止时间，两元素
      this.p_start_end = []; // 页面，预测起止时间，两元素
      this.h_datetime = [];
      this.p_datetime = [];
      // console.log('clear')
    },
    handleUpload() {
      console.log("iubhubhuvbu");
    },
    handleUploadSuccess(file, fileList) {
      console.log(file);
      console.log(fileList);
      let local_path_new =
        document.getElementsByClassName("el-upload__input")[0].value;
      if (local_path_new != "") {
        this.upload_url =
          document.getElementsByClassName("el-upload__input")[0].value;
      }
      console.log(document.getElementsByClassName("el-upload__input")[0].value);
      this.getTurbineList();
      this.upload_path =
        document.getElementsByClassName("el-upload__input")[0].value;
    },
    SelectTurbine(turbine) {
      this.turbine = turbine;
      this.clearState();
      get({
        url: baseurl + "turbine/versionlist/" + turbine,
      }).then((res) => {
        var version_list = res.data.data.version_list;
        this.version = 0;
        this.version_options = version_list.map((item, index) => {
          return {
            value: item,
            label: item,
          };
        });
      });
    },
    SelectVersion(version) {
      this.version = version;
      console.log(this.version);
      get({
        url:
          baseurl +
          "turbine/time?turbine_id=" +
          this.turbine +
          "&version=" +
          this.version,
      }).then((res) => {
        // var data = res.data.data
        this.h_start_end = this.timestampToDate(res.data.data.past_time_range);
        this.p_start_end = this.timestampToDate(res.data.data.pred_time_range);
        console.log(this.h_start_end, this.p_start_end);
        // this.h_datetime_start_list = this.listToOptions(h_time_list);
        // console.log(this.h_datetime_start_list);
        // this.tmp_p_datetime_start_list = this.listToOptions(p_time_list);
        // console.log(data)
      });
      // todo complete:网络请求获取对应的时间列
      get({
        url:
          baseurl +
          "turbine/data?turbine_id=" +
          this.turbine +
          "&version=" +
          this.version,
      }).then((res) => {
        this.history_chart_data = res.data.data.turbine_data;
        // console.log(data)
      });
      // todo complete:请求所有历史数据:history_chart_data
    },
    // SelectHistoryStart(h_start) {
    //   this.h_datetime_start = h_start
    //   console.log(this.h_datetime_start)
    //   this.h_datetime_end_list = this.filterDatesGreaterThan(this.h_datetime_start_list, h_start)
    // },
    // SelectHistoryEnd(h_end) {
    //   this.h_datetime_end = h_end
    //   console.log(this.h_datetime_end)
    //   this.p_datetime_start_list = this.tmp_p_datetime_start_list
    // },
    // SelectPredictStart(p_start) {
    //   this.p_datetime_start = p_start
    //   console.log(this.p_datetime_start)
    //   this.p_datetime_end_list = this.filterDatesGreaterThan(this.p_datetime_start_list, p_start)
    // },
    // SelectPredictEnd(p_end) {
    //   this.p_datetime_end = p_end
    //   console.log(this.p_datetime_end)
    //   // todo complete:请求所有可选模型
    //   this.model_options = [
    //     {
    //       value: 1,
    //       label: "mix",
    //     },
    //     {
    //       value: 2,
    //       label: "mlp",
    //     },
    //     {
    //       value: 3,
    //       label: "seq2seq",
    //     },
    //   ]
    // },
    SelectModel(model) {
      this.all_selected = true;
      this.model = model;
      console.log(this.model);
    },
    handleSearch() {
      var formData = {
        turbine_id: this.turbine,
        data_version: this.version,
        past_start: this.formatdatetime(this.h_datetime[0]),
        past_end: this.formatdatetime(this.h_datetime[1]),
        model_id: this.model,
        pred_start: this.formatdatetime(this.p_datetime[0]),
        pred_end: this.formatdatetime(this.p_datetime[1]),
      };

      post({
        url: baseurl + "turbine/YD15/predict",
        data: formData,
      }).then((res) => {
        // console.log(res.data);
        if (res.data.code == 400) {
          return;
        }
        this.predict_chart_data = res.data.data;
        console.log(this.predict_chart_data);
      });

      // todo:请求预测数据:predict_chart_data
    },
    listToOptions(arr) {
      return arr.map((item, index) => {
        return {
          value: item,
          label: item,
        };
      });
    },
    filterDatesGreaterThan(datesArray, targetDate) {
      const convertedTargetDate = new Date(targetDate);
      return datesArray.filter(
        (date) => new Date(date["value"]) >= convertedTargetDate
      );
    },
    timestampToDate(timestampList) {
      return timestampList.map((timestamp) => {
        const date = new Date(timestamp * 1000);
        // 使用适合您的时间格式化选项格式化时间戳
        const formattedTime = `${date.getFullYear()}-${
          date.getMonth() + 1
        }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
        return formattedTime;
      });
    },
    dataToTimestamp(datetime) {
      var date = new Date(datetime);
      return date.getTime() / 1000;
    },
    // 规范时间15min为单位
    formatdatetime(datetime) {
      var timestamp = this.dataToTimestamp(datetime);
      console.log(timestamp);
      return timestamp - (timestamp % (15 * 60));
      // console.log(new_timestamp)
      // return new Date(new_timestamp * 1000);
    },
    hisTimeRangeChange() {
      if (this.h_datetime.length == 0) {
        return;
      }
      if (
        this.dataToTimestamp(this.h_datetime[0]) <
        this.dataToTimestamp(this.h_start_end[0])
      ) {
        this.$message.error("错了哦，开始时间过早");
        this.h_datetime = [];
        return;
      }
      if (
        this.dataToTimestamp(this.h_datetime[1]) >
        this.dataToTimestamp(this.h_start_end[1])
      ) {
        this.$message.error("错了哦，结束时间过晚");
        this.h_datetime = [];
        return;
      }
      this.timeRangeChange();
    },
    predTimeRangeChange() {
      if (this.p_datetime.length == 0) {
        return;
      }
      if (
        this.dataToTimestamp(this.p_datetime[0]) <
        this.dataToTimestamp(this.p_start_end[0])
      ) {
        this.$message.error("错了哦，开始时间过早");
        this.p_datetime = [];
        return;
      }
      if (
        this.dataToTimestamp(this.p_datetime[1]) >
        this.dataToTimestamp(this.p_start_end[1])
      ) {
        this.$message.error("错了哦，结束时间过晚");
        this.p_datetime = [];
        return;
      }
      if (
        this.dataToTimestamp(this.p_datetime[0]) <
        this.dataToTimestamp(this.h_datetime[1])
      ) {
        this.$message.error("错了哦，预测起始时间应晚于历史结束时间");
        this.p_datetime = [];
        return;
      }
      this.timeRangeChange();
    },
    timeRangeChange() {
      console.log("变化");
      // console.log(this.h_datetime)
      // console.log(this.p_datetime)
      if (!(this.h_datetime.length == 0 || this.p_datetime.length == 0)) {
        console.log(this.h_datetime, this.p_datetime);
        this.model_options = [
          {
            value: 1,
            label: "mix",
          },
          {
            value: 2,
            label: "mlp",
          },
          {
            value: 3,
            label: "seq2seq",
          },
        ];
      }
    },
  },
};
</script>
<style scoped>

@media only screen and (min-device-width: 768px) {
  .home {
    height: 100%;
  }

  .upload {
    width: 12%;
    height: 100%;
    padding: 0px;
    float: left;
    margin-left: 2%;

  }

  .turbine-input,
  .turbine-input:focus,
  .turbine-input:active {
    width: 7.8%;
    margin-right: 0.5%;
    float: left;
    background: #24262b;
    height: 100%;
    border: 0px;
    color: white !important;
    border: 1px solid #3f96a5;
    border-radius: 4px;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.35);
    outline: none;
  }

  .datapath-input {
    width: 30%;
    float: left;
    background: #24262b;
    height: 100%;
    border: 0px;
    color: white !important;
    border: 1px solid #3f96a5;
    border-radius: 4px;
    margin: 0px;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.35);
  }

  .el-button.el-button--primary.el-button--small,
  .my-btn {
    color: white;
    background: #3f96a5;
    border: 0px;
    height: 100%;
    width: 100%;
    float: left;
    padding: 0px;
    box-shadow: 0 0 10px rgba(100, 100, 100, 1);
  }

  .turbine-version {
    width: 8%;
    float: left;
    margin-right: 0.5%;
    height: 100%;
  }

  .search-time {
    width: 27%;
    float: left;
    margin-right: 0.5%;
    height: 100%;
  }

  .time-btn {
    width: 12%;
    float: left;
    margin-right: 0.5%;
    height: 100%;
  }

  .top-header {
    height: 120px;
  }

  .upload-line {
    padding-left: 1%;
    width: 100%;
    height: 5%;
  }

  .search-line {
    padding-left: 1%;
    width: 100%;
    height: 5%;
    float: left;
    margin-top: 1%;
  }

  #power-chart-box {
    margin-top: 6%;
    height: 67%;
    width: 100%;
  }
}

@media only screen and (max-device-width : 768px) {
  .home {
    height: 100%;
  }

  .upload {
    margin-top: 3%;
    width: 21.5%;
    height: 100%;
    padding: 0px;
    float: left;
    margin-left: 2%;
  }

  .turbine-input,
  .turbine-input:focus,
  .turbine-input:active {
    width: 45%;
    margin-right: 2%;
    float: left;
    background: #24262b;
    height: 100%;
    border: 0px;
    color: white !important;
    border: 1px solid #3f96a5;
    border-radius: 4px;
    outline: none;
  }

  .datapath-input {
    width: 70%;
    float: left;
    background: #24262b;
    height: 100%;
    border: 0px;
    color: white !important;
    border: 1px solid #3f96a5;
    border-radius: 4px;
    margin: 0px;
    margin-top:3%;
  }

  .el-button.el-button--primary.el-button--small,
  .my-btn {
    color: white;
    background: #3f96a5;
    border: 0px;
    height: 100%;
    width: 100%;
    float: left;
    padding: 0px;
    margin-top:2%;

  }

  .turbine-version {
    width: 46.5%;
    float: left;
    margin-right: 2%;
    height: 100%;
    margin-top: 2%;
  }

  .search-time {
    width: 95%;
    float: left;
    margin-right: 0.5%;
    height: 100%;
    margin-top: 2%;

  }

  .time-btn {
    width: 46.5%;
    float: left;
    margin-right: 0.5%;
    height: 100%;
    margin-top: 1%;

  }

  .top-header {
    height: 100px;
  }

  .upload-line {
    padding-left:2% ;
    width: 100%;
    height: 5%;
  }

  .search-line {
    padding-left:2% ;
    width: 100%;
    height: 5%;
    float: left;
  }

  #power-chart-box {
    margin-top: 60%;
    height: 45%;
    width: 100%;
  }
}
</style>
