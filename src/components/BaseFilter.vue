<template>
  <div
    ref="filterField"
    class="multiselect"
  >
    <div
      class="multiselect__toggler"
      @click="isShown = !isShown"
    >
      <div>
        <slot
          name="head"
          class="sss"
        >
          <button>
            I'll show you: {{ props.optionLabelProp ? props.optionLabelProp : 'options' }}
            {{ isShown ? `&#708;` : `&#709;` }}
          </button>
        </slot>
      </div>

      <div>
        {{ isShown ? `&and;` : `&or;` }}
      </div>
    </div>
    <div
      class="multiselect__selected selected"
    >
      <div
        v-for="option in modelValue"
        :key="option.id"
        class="selected__item"
      >
        <slot
          name="cheked"
          :option="option"
        >
          defalt value https://robohash.org/hicveldicta.png
        </slot>
        <button @click="checkSelectedOption(option)">
          X
        </button>
      </div>
    </div>
    <div
      v-show="isShown"
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
        @click="checkSelectedOption(option)"
      >
        <slot
          name="body"
          :option="option"
        >
          <div>default value</div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
  import {
    ref, computed, watch, onMounted,
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

  const checkSelectedOption = (value) => {
    if (model.value.includes(value)) {
      const newModelValue = [...props.modelValue];
      newModelValue.splice(newModelValue.indexOf(value), 1);
      model.value = newModelValue;
    } else {
      model.value = [...props.modelValue, value];
    }
    //
    // if (props.modelValue.includes(value)) {
    //   const newModelValue = [...props.modelValue];
    //   newModelValue.splice(newModelValue.indexOf(value), 1);
    //   emit('update:modelValue', newModelValue);
    // } else {
    //   emit('update:modelValue', [...props.modelValue, value]);
    // }
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
    justify-items: center;
    width: 100%;
    padding: 10px 0;
    position: relative;

    &__toggler {
      display: grid;
      grid-template-columns: 90% 10%;
      min-width: 300px;
      cursor: pointer;
      border: solid 1px grey;
      border-radius: 2px;
      padding: 5px;
      opacity: 0.8;
    }
    &__selected{
      min-width: 100%;
    }
  }

  .selected {
    padding: 5px 0;
    display: grid;
    min-width: 100%;
    grid-template-columns: 1fr 1fr 1fr;

    &__item {
      border: solid tomato 1px;
      border-radius: 4px;
      padding: 4px;
      display: grid;
      grid-template-columns: 50px 20px;
      justify-content: space-between;
      margin: 5px;

      button {
        grid-column: 2/3;
        cursor: pointer;
      }
    }
  }

  .filter {
    display: grid;
    width: 100%;
    max-height: 300px;
    overflow: scroll;
    position: absolute;
    top: 42px;
    background-color: aliceblue;

    &__item {
      width: 100%;
      justify-self: center;
    }

    &__input {
      width: 100%;
      height: 30px;
      font-size: 20px;
    }
    .sss{
      background-color: coral;
    }
  }
</style>
