<template>
  <div class="multiselect">
    <div
      class="multiselect__toggler"
      @click="isShown = !isShown"
    >
      <slot name="head">
        <button>
          I'll show you: {{ props.optionLabelProp ? props.optionLabelProp : 'options' }} {{ isShown ? `&#708;` : `&#709;` }}
        </button>
      </slot>
    </div>
    <div
      v-if="isShown"
      ref="filterField"
      class="multiselect__body filter"
    >
      <div class="filter">
        <input
          v-model="filter"
          type="text"
          placeholder="filter"
          class="filter__input"
        >
        <div
          v-if="!filteredOptions.length"
          class="filter__error"
        >
          I didn't find anything
        </div>
        <label
          v-for="option in filteredOptions"
          :key="option.id"
          class="filter__item"
        >
          <input
            id="item.id"
            v-model="model"
            :value="option"
            type="checkbox"
            :name="option.id"
          >
          <slot
            name="body"
            :option="option"
          >
            default value https://robohash.org/hicveldicta.png
          </slot>
        </label>
      </div>
      <div class="selected-item">
        <div
          v-for="option in modelValue"
          :key="option.id"
          class="selected-item__item"
        >
          <slot
            name="cheked"
            :option="option"
          >
            defalt value https://robohash.org/hicveldicta.png
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import {
    ref, computed, onMounted, onBeforeUnmount, watch,
  } from 'vue';
  import {UseClickOutside} from '../Use/UseClickOutside.js';

  const emit = defineEmits([
    'update:modelValue',
  ]);

  const props = defineProps({
    options: {
      type: Object,
      required: true,
    },
    optionLabelProp: {
      type: String,
      required: true,
    },
    modelValue: {
      type: Array,
      required: true,
    },
  });
  const filter = ref(null);
  const isShown = ref(null);
  const filterField = ref(null);
  // const addSelectedOption = (e, value) => {
  //   if (e.target.checked) {
  //     emit('update:modelValue', [...props.modelValue, value]);
  //   } else {
  //     const newModelValue = [...props.modelValue];
  //     newModelValue.splice(newModelValue.indexOf(value), 1);
  //     emit('update:modelValue', newModelValue);
  //   }
  // };

  const model = computed({
    get() {
      return props.modelValue;
    },
    set(value) {
      emit('update:modelValue', value);
    },
  });

  const filteredOptions = computed(() => {
    if (filter.value) {
      return props.options.filter((option) => option[props.optionLabelProp].toLowerCase().includes(filter.value.toLowerCase()));
    }
    return props.options;
  });

  //------------------------------------------------------------------------------------------------------

  const {addListener, removeListener} = UseClickOutside(filterField, filter);

  let clickFilter = null;

  const resetFilter = (e) => {
    console.log(e.target);

    if (!clickFilter) {
      filter.value = '';
    }
    clickFilter = null;
  };
  const getClickFilter = (e) => clickFilter = e.currentTarget;

  watch(filterField, () => {
    console.log(addListener, removeListener);
    if (filterField.value) {
      filterField.value.addEventListener('click', getClickFilter);
    }
  });

  onMounted(() => {
    document.addEventListener('click', resetFilter);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('click', resetFilter);
    filterField.value.removeEventListener('click', getClickFilter);
  });

</script>

<style lang="scss" scoped>
  .multiselect {
    display: grid;
    justify-content: center;

    &__toggler {
      max-width: 300px;
    }

    &__multiselect__body {
      max-width: 700px;
    }
  }

  .filter {
    display: grid;
  }
</style>
