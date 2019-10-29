<script>
  export let src = ''
  export let alt = ''
  export let href = ''
</script>

<style lang="scss">
  img {
    &:hover {
      transform: scale(1.2);
      transition: all 0.55s ease-in-out;
    }
    width: 102px;
    cursor: pointer;
  }
</style>

<a {href} target="_blank">
  <img {src} {alt} />
</a>
