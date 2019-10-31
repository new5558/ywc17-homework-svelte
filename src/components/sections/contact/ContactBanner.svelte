<script>
  export let src = ''
  export let href = ''
  export let alt = ''
</script>

<style lang="scss">
  @import 'src/sass/mixins.scss';
  a {
    display: flex;
    justify-content: center;
    padding: 0 15px;
    @include for-phone-only {
      padding: 0 30px;
      img {
        width: 80%;
      }
    }
  }
</style>

<a {href}>
  <img {src} {alt} />
</a>
