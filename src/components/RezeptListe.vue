<template>
  <div>
    <h2>Meine Lieblingsrezepte:</h2>
    <ul>
      <li v-for="rezept in rezepte" :key="rezept.id">
        {{ rezept.name }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'RezeptListe',
  data() {
    return {
      rezepte: [
        { id: 1, name: 'Pizza Margherita' },
        { id: 2, name: 'Spaghetti Bolognese' },
        { id: 3, name: 'Vegane Lasagne' }
      ]
    };
  }
};
</script>

<style scoped>
h2 {
  margin-bottom: 10px;
}
</style>
