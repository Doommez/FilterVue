<template>
  <div class="app">
    <base-filter
      v-model="selectedOptions"
      class="app__base-filter"
      :options="users"
      :option-label-prop="`username`"
      :selected-options="selectedOptions"
    >
      <template #toggler>
        <div class="header-filter">
          show users
        </div>
      </template>
      <template #filter-option="{option}">
        <div
          class="user"
          :class="{selected: selectedOptions.includes(option)}"
        >
          <input
            id="option.id"
            type="checkbox"
            name="option.name"
            :checked="selectedOptions.includes(option)"
          >
          <img
            :src="option.image"
            class="user__img"
          >
          <span>
            {{ option.username }} {{ option.age }}
          </span>
        </div>
      </template>
      <template #selected-option="{option}">
        <div>
          {{ option.username }}
        </div>
      </template>
    </base-filter>
  </div>
</template>

<script setup>
  import {onMounted, ref} from 'vue';
  import BaseFilter from './components/BaseFilter.vue';

  const users = ref([]);
  const selectedOptions = ref([]);

  const getUsers = async () => (await (await fetch('https://dummyjson.com/users')).json()).users;

  onMounted(async () => {
    users.value = await getUsers();
  });
</script>

<style lang="scss" scoped>
  .app {
    margin: 0 auto;
    max-width: 1360px;

    &__base-filter {
      width: 300px;
    }
  }

  .user {
    width: 100%;
    display: grid;
    grid-template-columns: 10px 1fr 1fr;

    &__img {
      max-height: 20px;
    }
  }

  .selected {
    background-color: #9d7aee;
  }

  .header-filter {
    width: 282px;
  }
</style>
