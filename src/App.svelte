<script>
  import { onMount } from 'svelte'
  onMount(() => {
    fetch('https://panjs.com/ywc.json')
      .then(response => response.json())
      .then(console.log)
  })
  export let name;
</script>

<style lang="scss">
  h1 {
    &:hover {
      color: red;
    }
  }
</style>

<h1>Hello {name}!</h1>
