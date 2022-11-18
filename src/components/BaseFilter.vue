<template>
  <div
    ref="filterField"
    class="multiselect"
  >
    <div
      class="multiselect__toggler"
      @click="isShown = !isShown"
    >
      <slot name="head">
        <button>
          I'll show you: {{ props.optionLabelProp ? props.optionLabelProp : 'options' }}
          {{ isShown ? `&#708;` : `&#709;` }}
        </button>
      </slot>
      <div>
        {{ isShown ? `&#708;` : `&#709;` }}
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
      console.log(props.modelValue);
      return props.modelValue;
    },
    set(value) {
      console.log(value);
      emit('update:modelValue', value);
    },
  });
  const checkSelectedOption = (value) => {
    if (!model.value.includes(value)) {
      model.value.push(value);
    } else {
      model.value.splice(model.value.indexOf(value), 1);
    }

    // if (props.modelValue.includes(value)) {
    //   const newModelValue = [...props.modelValue];
    //   newModelValue.splice(newModelValue.indexOf(value), 1);
    //   emit('update:modelValue', newModelValue);
    // } else {
    //   emit('update:modelValue', [...props.modelValue, value]);
    // }
  };


  const filteredOptions = computed(() => {
    if (filter.value) {
      return props.options.filter((option) => option[props.optionLabelProp].toLowerCase().includes(filter.value.toLowerCase()));
    }
    return props.options;
  });

  //------------------------------------------------------------------------------------------------------
  const resetFilter = () => {
    filter.value = '';
    isShown.value = false;
  };

  const {
    clickOutside,
    destroyListener,
    addClickOutside,
    removeListeners,
  } = useClickOutside();
  console.log(filterField);

  onMounted(() => {
    clickOutside('aaa', filterField.value, resetFilter);
  });

  removeListeners();
  // watch(isShown, (newValue) => {
  //   if (!newValue) {
  //     destroyListener('aaa');
  //   } else {
  //   }
  // });


  // const {createListener, destroyListener} = useClickOutside();
  //
  // watch(isShown, (newValue) => {
  //   if (!newValue) {
  //     destroyListener(filterField.value, resetFilter, 'clickListener');
  //   }
  // });




  // watch(isShown, (newValue, oldValue) => {
  //   console.log(newValue, oldValue);
  //   if (newValue) {
  //     const {createListener} = useClickOutside(isShown.value, filterField.value, resetFilter);
  //     createListener(document);
  //   } else {
  //     console.log('destr');
  //     const {destroyListener} = useClickOutside();
  //     destroyListener(document);
  //   }
  // });

  //
  // const refreshFilter = (e) => {
  //   e.preventDefault();
  //   if (isShown.value) {
  //     if (!filterField.value.contains(e.target)) {
  //       filter.value = '';
  //     }
  //   }
  // };

  // addListener(document);
  // removeListener(document);
</script>

<style lang="scss" scoped>
  .multiselect {
    display: grid;
    justify-content: center;
    justify-items: center;
    width: 300px;
    padding: 10px 0;
    position: relative;

    &__toggler {
      display: grid;
      grid-template-columns: 1fr 10px;
      width: 100%;
      cursor: pointer;
      border: solid 1px grey;
      border-radius: 2px;
      padding: 5px;
      opacity: 0.8;
    }
  }

  .selected {
    padding: 5px 0;
    width: 300px;
    display: grid;
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
  }
</style>
