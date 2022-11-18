<template>
  <div>
    {{ option.firstName }}
  </div>
</template>

<script setup>
  import {onBeforeUpdate, onMounted, onUpdated} from 'vue';

  const props = defineProps({
    option: {
      type: Object,
      required: true,
    },
  });
  onMounted(() => {
    console.log(props.option.firstName);
  });
  onBeforeUpdate(() => {
    console.log(props.option.firstName);
  });
  onUpdated(() => {
    console.log(props.option.firstName);
  });
</script>

<style lang="scss" scoped>

</style>
