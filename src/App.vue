<template>
  <div class="app">
    <base-filter
      v-model="selectedOptions"
      class="app__multiselect"
      :options="users"
      :option-label-prop="`username`"
      :selected-options="selectedOptions"
    >
      <template #body="{option}">
        <img
          :src="option.image"
          class="user-img"
        > <span>{{ option.username }} {{ option.age }}</span>
      </template>
      <template #cheked="{option}">
        <div>
          {{ option.username }}
          <button @click="deleteSelectedOption(option.id)">
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

  const products = ref([]);
  const users = ref([]);
  const selectedOptions = ref([]);

  const getProducts = async () => (await (await fetch('https://dummyjson.com/products')).json()).products;
  const getUsers = async () => (await (await fetch('https://dummyjson.com/users')).json()).users;

  const deleteSelectedOption = (id) => {
    const index = selectedOptions.value.findIndex((option) => option.id === id);
    if (index !== -1) {
      selectedOptions.value.splice(index, 1);
    }
  };

  onMounted(async () => {
    products.value = await getProducts();
    users.value = await getUsers();
    console.log(users.value);
    console.log(products.value);
  });
</script>

<style lang="scss" scoped>
  .app {
    margin: 0 auto;
    max-width: 1360px;
  }
  .user-img{
    max-height: 50px;
  }
</style>
