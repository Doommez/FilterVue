<template>
  <div class="app">
    <base-filter
      v-model="selectedOptions"
      class="app__base-filter"
      :options="users"
      :option-label-prop="`username`"
      :selected-options="selectedOptions"
    >
      <template #toggle="{isShown}">
        <div class="toggle">
          show users
          <div>
            {{ isShown ? `&#5169;` : `&#5167;` }}
          </div>
        </div>
      </template>
      <template #filter-option="{option}">
        <div
          class="user"
          :class="{select: selectedOptions.includes(option)}"
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
      <template #selected-option="{option, remove}">
        <div class="selected__option">
          {{ option.username }}
          <button @click="remove(option)">
            X
          </button>
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

  .toggle {
    width: 282px;
    display: grid;
    grid-template-columns: 90% 10%;
    cursor: pointer;
    border: solid 1px grey;
    border-radius: 2px;
    padding: 5px;
    opacity: 0.8;
  }

  .user {
    width: 100%;
    display: grid;
    grid-template-columns: 10px 1fr 1fr;

    &__img {
      max-height: 20px;
    }
  }

  .select {
    background-color: #9d7aee;
  }

  .selected__option {
    border: solid #9d7aee 1px;
    border-radius: 10px;
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
</style>
