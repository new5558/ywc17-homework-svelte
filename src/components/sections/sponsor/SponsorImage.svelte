<script>
  export let src = ''
  export let alt = ''
  export let href = ''
</script>

<style lang="scss">
  @import 'src/sass/mixins.scss';
  img {
    &:hover {
      transform: scale(1.2);
      transition: all 0.55s ease-in-out;
    }
    width: 102px;
    cursor: pointer;
    @include for-phone-only {
      width: 54px;
    }
  }
  a {
    @include for-phone-only {
      max-width: 33%;
      width: 100%;
      display: flex;
      justify-content: center;
    }
  }
</style>

<a {href} target="_blank">
  <img {src} {alt} />
</a>
