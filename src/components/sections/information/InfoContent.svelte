<script>
  export let topic = ''
</script>

<style lang="scss">
  @import 'src/sass/mixins.scss';
  .info {
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: #333333;
    &-topic {
      font-weight: bold;
      color: #e6332a;
      margin-top: 24px;
      font-size: 16px;
      @include for-phone-only {
        margin-top: 15px;
      }
    }
  }
</style>

<div class="info">
  <div class="info-topic">{topic}</div>
  <div>
    <slot />
  </div>
</div>
