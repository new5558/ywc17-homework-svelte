<script>
  export let topic = ''
  export let isLogo = false
</script>

<style lang="scss">
  @import 'src/sass/mixins.scss';
  .info {
    display: flex;
    flex-direction: column;
    text-decoration: none;
    padding: 0 15px;
    max-width: 25%;
    width: 100%;
    text-decoration: none;
    font-size: 14px;
    color: #333333;
    @include for-phone-only {
      padding: 0 30px;
      max-width: 100%;
    }
    &-topic {
      font-weight: bold;
      color: #e6332a;
      margin-top: 24px;
      font-size: 16px;
      @include for-phone-only {
        margin: 15px 0 10px 0;
      }
      &-logo {
        margin: 0;
      }
    }
  }
</style>

<div class="info">
  <div class:info-topic-logo={isLogo} class="info-topic">{topic}</div>
  <div>
    <slot />
  </div>
</div>
