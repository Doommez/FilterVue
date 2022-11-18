<template>
  <div>
    <div
      ref="filterField"
      class="multiselect"
    >
      <div
        class="multiselect__toggler"
        @click="isShown = !isShown"
      >
        <div>
          <slot name="toggler">
            <button>
              I'll show you: {{ props.optionLabelProp ? props.optionLabelProp : 'options' }}
            </button>
          </slot>
        </div>

        <div>
          {{ isShown ? `&#5169;` : `&#5167;` }}
        </div>
      </div>
      <div
        v-if="isShown"
        class="multiselect__filter filter"
      >
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
            <div>default value</div>
          </slot>
        </div>
      </div>
    </div>
    <div class="selected">
      <div
        v-for="option in modelValue"
        :key="option.id"
        class="selected__item"
      >
        <slot
          name="selected-option"
          :option="option"
        >
          default value
        </slot>
        <button @click="checkIfOptionSelected(option)">
          X
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import {
    ref, computed, watch,
  } from 'vue';
  import {useClickOutside} from '../composables/useClickOutside.js';

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
    filter.value = '';
    isShown.value = false;
  };

  const {
    createClickOutsideListener,
    destroyClickOutsideListener,
  } = useClickOutside();

  watch(isShown, (newStateIshow) => {
    if (newStateIshow) {
      createClickOutsideListener('clickOutside', filterField.value, resetFilter);
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
      display: grid;
      grid-template-columns: 90% 10%;
      align-items: center;
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
  }

  .selected {
    padding: 5px 0;
    display: grid;
    min-width: 100%;
    grid-template-columns: 1fr 1fr 1fr;

    &__item {
      border: solid #9d7aee 1px;
      border-radius: 50%;
      padding: 10px;
      display: grid;
      grid-template-columns: 50px 20px;
      justify-content: space-between;
      margin: 5px;
      overflow: hidden;

      button {
        grid-column: 2/3;
        cursor: pointer;
        border-radius: 50%;
        opacity: 0.7;
        border: none;

      }
    }
  }

  .filter {
    display: grid;
    width: 100%;
    overflow-y: scroll;
    position: absolute;
    top: 120%;
    background-color: white;

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
  }
</style>
