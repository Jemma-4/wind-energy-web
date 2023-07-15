<template>
  <el-select
    v-model="item_selected"
    :placeholder="message"
    :popper-append-to-body="false"
    @change="handleSelected"
    :disabled="disabled"
    :mtitle="message"
  >  
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
      :disabled="item.disabled"
      class="option-item"
    >
    </el-option>
  </el-select>
</template>
    
<script>
export default {
  name: "DarkSelect",
  props: {
    message: String,
    options: Array,
  },
  data() {
    return {
      item_selected: "",
    };
  },
  methods: {
    handleSelected() {
      this.$emit("selected", this.item_selected);
    },
  },
  computed: {
    disabled() {
      return this.options.length === 0
    }
  },
  watch: {
    "options": {
      handler(newVal, oldVal) {
        this.item_selected = "";
      },
      immediate:true
    }
  },
};
</script>
    
<style scoped>
.el-select-dropdown__item,
.option-item {
  color: white;
}

.el-select-dropdown__item.selected,
.option-item.selected,
.el-select-dropdown__item.selected.hover,
.option-item.selected:hover {
  color: #3f96a5;
}

.el-select-dropdown__item.hover,
.option-item:hover {
  background: #24262B !important;
  color: white;
}

</style>