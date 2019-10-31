<script>
  export let src = ''
  export let alt = ''
  export let href = ''
</script>

<style lang="scss">
  @import 'src/sass/mixins.scss';
  a {
    @include for-phone-only {
      padding: 0 15px;
      display: flex;
      justify-content: center;
      min-width: 33%;
    }
    img {
      width: 102px;
      cursor: pointer;
      @include for-phone-only {
        width: 54px;
        height: 65px;
      }
      &:hover {
        transform: scale(1.2);
        transition: all 0.55s ease-in-out;
      }
    }
  }
</style>

<a {href} target="_blank">
  <img {src} {alt} />
</a>
