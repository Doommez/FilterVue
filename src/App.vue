<template>
  <div class="app">
    <base-filter
      v-model="selectedOptions"
      class="app__multiselect"
      :options="users"
      :option-label-prop="`username`"
      :selected-options="selectedOptions"
    >
      <template #head>
        <div>
          show users
        </div>
      </template>
      <template #body="{option}">
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
      <template #cheked="{option}">
        <div>
          {{ option.username }}
        </div>
      </template>
    </base-filter>
  </div>
</template>

<script setup>
  import {computed, onMounted, ref} from 'vue';
  import BaseFilter from './components/BaseFilter.vue';

  const products = ref([]);
  const users = ref([]);
  const selectedOptions = ref([]);

  const getProducts = async () => (await (await fetch('https://dummyjson.com/products')).json()).products;
  const getUsers = async () => (await (await fetch('https://dummyjson.com/users')).json()).users;

  // const deleteSelectedOption = (id) => {
  //   const index = selectedOptions.value.findIndex((option) => option.id === id);
  //   if (index !== -1) {
  //     selectedOptions.value.splice(index, 1);
  //   }
  // };


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
  .user{
    width: 100%;
    display: grid;
    grid-template-columns: 10px 1fr 1fr;
    &__img{
      max-height: 20px;
    }
  }
  .selected{
    background-color: coral;
  }

</style>
