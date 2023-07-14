<template>
  <div class="home">
    <!-- 页面头 -->

    <top-header />

    <!-- 数据导入的接口 -->
    <div class="upload-line">
      <input placeholder="请选择上传的风场csv数据" v-model="upload_path" disabled="true" class="datapath-input" />
      <el-upload class="upload" :action="upload_url" :limit="1" :on-change="handleUploadSuccess" :file-list="fileList">
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
    </div>

    <div class="search-line">
      <!-- 这里需要一个风机的选择  默认一个风机，全部的历史数据-->
      <dark-select message="风机" :options="turbine_options" @selected="SelectTurbine" class="turbine-version" />

      <!-- 增加一个数据版本的选择 -->
      <dark-select message="数据版本" :options="version_options" @selected="SelectVersion" class="turbine-version" />

      <dark-select message="历史数据开始时间" :options="h_datetime_start_list" @selected="SelectHistoryStart" class="time-btn" />
      <dark-select message="历史数据结束时间" :options="h_datetime_end_list" @selected="SelectHistoryEnd" class="time-btn" />
      <dark-select message="预测数据开始时间" :options="p_datetime_start_list" @selected="SelectPredictStart" class="time-btn" />


      <dark-select message="预测数据结束时间" :options="p_datetime_end_list" @selected="SelectPredictEnd" class="time-btn" />
      <dark-select message="模型" :options="model_options" @selected="SelectModel" class="time-btn" />

      <!-- 查询按钮 -->
      <div class="time-btn">
        <el-button size="small" type="primary" :disabled="!all_selected" @click="handleSearch">预测</el-button>
      </div>
    </div>
    <div id="power-chart-box">
      <power-chart />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import PowerChart from "@/components/PowerChart.vue";
import TopHeader from "@/components/TopHeader.vue";
import DarkSelect from "@/components/DarkSelect.vue";
import { baseurl, get, post } from "../network/request.js";

export default {
  name: "HomeView",
  components: {
    PowerChart,
    TopHeader,
    DarkSelect,
  },
  data() {
    return {
      upload_url: baseurl + "turbine/import/3/v3",
      fileList: [],//页面：上传文件列表
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
        }
      ],//页面：可选风机列表
      model_options: [],//页面：可选模型列表
      version_options: [],//页面：可选版本列表
      h_datetime_start_list: [],//页面：历史数据时间开始列表
      h_datetime_end_list: [],//页面：历史数据时间结束列表
      tmp_p_datetime_start_list: [],//逻辑缓存值
      p_datetime_start_list: [],//页面：预测数据时间开始列表
      p_datetime_end_list: [],//页面：预测数据时间结束列表
      all_selected: false,//逻辑
      history_chart_data: [],//数据：图表历史数据
      predict_chart_data: [],//数据：图表预测数据
      turbine: 0,//逻辑：选择风机
      version: 0,//逻辑：选择版本
      model: 0,//逻辑：选择模型
      h_datetime_start: 0,//逻辑：选择历史开始时间
      h_datetime_end: 0,//逻辑：选择历史结束时间
      p_datetime_start: 0,//逻辑：选择预测开始时间
      p_datetime_end: 0,//逻辑：选择预测结束时间
    };
  },
  mounted() {
    // todo complete：请求风机列表：
    this.getTurbineList()
  },
  methods: {
    getTurbineList() {
      get({
        url: baseurl + "turbine/all",
      }).then((res) => {
        var turbine_list = res.data.data.turbine_list
        this.turbine_options = turbine_list.map((item, index) => {
          return {
            value: item,
            label: "风机" + item,
          };
        });
        // this.clearState()
      })
    },
    clearState() {
      this.turbine = 0,
        this.version = 0,
        this.model = 0,
        this.h_datetime_start = 0,
        this.h_datetime_end = 0,
        this.p_datetime_start = 0,
        this.p_datetime_end = 0
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
      this.getTurbineList()
    },
    SelectTurbine(turbine) {
      this.turbine = turbine
      get({
        url: baseurl + "turbine/versionlist/" + turbine,
      }).then((res) => {
        var version_list = res.data.data.version_list
        // console.log(version_list)
        this.version_options = version_list.map((item, index) => {
          return {
            value: item,
            label: item,
          };
        });
      })
      // console.log(this.turbine);
      // todo complete:网络请求获取对应的数据版本
      // let version = [
      //   {
      //     value: "选项1",
      //     label: "黄金糕",
      //   },
      //   {
      //     value: "选项2",
      //     label: "双皮奶",
      //   },
      //   {
      //     value: "选项3",
      //     label: "蚵仔煎",
      //   },
      //   {
      //     value: "选项4",
      //     label: "龙须面",
      //   },
      // ];
      // this.version_options = version;
    },
    SelectVersion(version) {
      this.version = version
      console.log(this.version);
      get({
        url: baseurl + "turbine/time?turbine_id=" + this.turbine + "&version=" + this.version,
      }).then((res) => {
        // var data = res.data.data
        var h_time_list = this.timestampToDate(res.data.data.past_time_list)
        var p_time_list = this.timestampToDate(res.data.data.pred_time_list)
        this.h_datetime_start_list = this.listToOptions(h_time_list);
        console.log(this.h_datetime_start_list)
        this.tmp_p_datetime_start_list = this.listToOptions(p_time_list);
        // console.log(data)
      })
      // todo complete:网络请求获取对应的时间列
      get({
        url: baseurl + "turbine/data?turbine_id=" + this.turbine + "&version=" + this.version,
      }).then((res) => {
        this.history_chart_data = res.data.data.turbine_data;
        // console.log(data)
      })
      // todo complete:请求所有历史数据:history_chart_data
    },
    SelectHistoryStart(h_start) {
      this.h_datetime_start = h_start
      console.log(this.h_datetime_start)
      this.h_datetime_end_list = this.filterDatesGreaterThan(this.h_datetime_start_list, h_start)
    },
    SelectHistoryEnd(h_end) {
      this.h_datetime_end = h_end
      console.log(this.h_datetime_end)
      this.p_datetime_start_list = this.tmp_p_datetime_start_list
    },
    SelectPredictStart(p_start) {
      this.p_datetime_start=p_start
      console.log(this.p_datetime_start)
      this.p_datetime_end_list = this.filterDatesGreaterThan(this.p_datetime_start_list, p_start)
    },
    SelectPredictEnd(p_end) {
      this.p_datetime_end = p_end
      console.log(this.p_datetime_end)
      // todo complete:请求所有可选模型
      this.model_options= [
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
      ]
    },
    SelectModel(model) {
      this.all_selected = true
      this.model = model
      console.log(this.model)
    },
    handleSearch() {
      var formData = {
        "turbine_id":this.turbine,
        "data_version":this.version,
        "past_start":this.dataToTimestamp(this.h_datetime_start),
        "past_end":this.dataToTimestamp(this.h_datetime_end),
        "model_id":this.model,
        "pred_start":this.dataToTimestamp(this.p_datetime_start),
        "pred_end":this.dataToTimestamp(this.p_datetime_end),
      }

      post({
        url: baseurl + "turbine/YD15/predict",
        data: formData
      })
        .then(res => {
          console.log(res.data);
          if (res.data.code == 400) {
            return;
          }
          this.predict_chart_data = res.data.data.pred_result
          console.log(this.predict_chart_data)
        })

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
      return datesArray.filter((date) => new Date(date['value']) >= convertedTargetDate);
    },
    timestampToDate(timestampList) {
      return timestampList.map((timestamp) => {
        const date = new Date(timestamp*1000);
        // 使用适合您的时间格式化选项格式化时间戳
        const formattedTime = `${date.getFullYear()}-${date.getMonth() + 1
          }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
        return formattedTime;
      });
    },
    dataToTimestamp(datetime){
      var date = new Date(datetime)
      return date.getTime()/1000
    }
  },
};
</script>
<style scoped>
.home {}

.upload-line {
  width: 100%;
  height: 40px;
}

.upload {
  width: 12%;
  height: 40px;
  padding: 0px;
  float: left;
  margin-left: 2%;
}

.datapath-input {
  width: 30%;
  float: left;
  background: #24262B;
  height: 27px;
  border: 0px;
  color: white !important;
  border: 1px solid #3f96a5;
  border-radius: 4px;
  margin: 0px;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.35);
}

.el-button.el-button--primary.el-button--small {
  color: white;
  background: #3f96a5;
  border: 0px;
  height: 40px;
  width: 100%;
  float: left;
  padding: 0px;
  box-shadow: 0 0 10px rgba(100, 100, 100, 1);
}

.search-line {
  width: 100%;
  float: left;
  margin-top: 20px;
}

.turbine-version {
  width: 8%;
  float: left;
  margin-right: 0.5%;
}

.time-btn {
  width: 12%;
  float: left;
  margin-right: 0.5%;
}

#power-chart-box {
  height: 800px;
  width: 100%;
  margin-top: 10%;
}
</style>
