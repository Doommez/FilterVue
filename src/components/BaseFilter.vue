<template>
  <div>
    <div
      ref="nodeFilter"
      class="multiselect"
    >
      <div
        class="multiselect__toggle"
        @click="toggleMultiselect"
      >
        <slot
          name="toggle"
          :is-shown="isShown"
        >
          <button>
            I'll show you: {{ props.optionLabelProp ? props.optionLabelProp : 'options' }}
          </button>
        </slot>
      </div>
      <div class="multiselect__selected selected">
        <slot
          v-for="option in modelValue"
          :key="option.id"
          name="selected-option"
          :option="option"
          :remove="checkIfOptionSelected"
        >
          {{ optionLabelProp }}
        </slot>
      </div>
      <div
        v-if="isShown"
        class="multiselect__filter filter"
      >
        <input
          v-model="searchFilter"
          type="text"
          placeholder="filter"
          class="filter__input"
        >
        <div
          v-if="!filteredOptions.length"
          class="filter__empty"
        >
          I didn't find anything
        </div>
        <div
          v-for="option in filteredOptions"
          :key="option.id"
          class="filter__item"
          @click="checkIfOptionSelected(option)"
        >
          <slot
            name="filter-option"
            :option="option"
          >
            <div>{{ optionLabelProp }}</div>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import {
    ref, computed, watch,
  } from 'vue';
  import {useClickOutside} from '../composables/useClickOutside';

  const {
    createClickOutsideListener,
    destroyClickOutsideListener,
  } = useClickOutside();

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
      default: 'Item',
    },
    modelValue: {
      type: Array,
      required: true,
    },
  });

  const searchFilter = ref(null);
  const isShown = ref(null);
  const nodeFilter = ref(null);

  const model = computed({
    get: () => props.modelValue,
    set(value) {
      emit('update:modelValue', value);
    },
  });

  const filteredOptions = computed(() => {
    if (searchFilter.value) {
      return props.options.filter((option) => option[props.optionLabelProp].toLowerCase().includes(searchFilter.value.toLowerCase()));
    }
    return props.options;
  });

  const toggleMultiselect = () => {
    isShown.value = !isShown.value;
  };

  const checkIfOptionSelected = (value) => {
    if (model.value.includes(value)) {
      const newModelValue = [...props.modelValue];
      newModelValue.splice(newModelValue.indexOf(value), 1);
      model.value = newModelValue;
    } else {
      model.value = [...props.modelValue, value];
    }
  };

  const resetFilter = () => {
    searchFilter.value = '';
    isShown.value = false;
  };

  watch(isShown, (newStateIsShown) => {
    if (newStateIsShown) {
      createClickOutsideListener({
        key: 'clickOutside',
        node: nodeFilter.value,
        callback: resetFilter,
      });
    } else {
      destroyClickOutsideListener('clickOutside');
    }
  });
</script>

<style lang="scss" scoped>
  .multiselect {
    display: grid;
    justify-content: center;
    width: 100%;
    position: relative;

    &__toggler {
      width: 100%;
      cursor: pointer;
      border: solid 1px grey;
      border-radius: 2px;
      padding: 5px;
      opacity: 0.8;
    }

    &__filter {
      width: 100%;
      max-height: 200px;
      padding: 10px;
      z-index: 100;
    }

    &__selected {
      padding: 5px 0;
      display: grid;
      min-width: 100%;
    }
  }

  .filter {
    display: grid;
    width: 100%;
    overflow-y: scroll;
    background-color: white;
    position: absolute;
    top: 40px;

    &__item {
      width: 100%;
      padding: 5px 0;
    }

    &__input {
      position: sticky;
      top: -5%;
      max-width: inherit;
      height: 30px;
      font-size: 20px;
      padding-left: 10px;
    }

    &__empty {
      color: red;
    }
  }
</style>
