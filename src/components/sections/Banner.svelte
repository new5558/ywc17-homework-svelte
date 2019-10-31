<script>

</script>

<style lang="scss">
  @import 'src/sass/mixins.scss';
  .banner {
    display: flex;
    width: 100%;
    &-item {
      width: (100% / 3);
      height: 350px;
      background-size: cover;
    }
    &-left {
      background-image: url('./image/banner-left.png');
    }
    &-center {
      img {
        max-width: 240px;
        max-height: 280px;
      }
      display: flex;
      justify-content: center;
      align-items: center;
      background-image: url('./image/banner-center.png');
    }
    &-right {
      background-image: url('./image/banner-right.png');
    }
    @include for-phone-only {
      &-item {
        height: 221px;
        background-position: center;
      }
      &-image {
        height: 131px;
        width: 110px;
      }
      &-left {
        background-image: url('./image/banner-left-s.png');
      }
    }
  }
</style>

<div class="banner">
  <div class="banner-left banner-item" />
  <div class="banner-center banner-item">
    <img class="banner-image" src="./image/banner.png" alt="banner" />
  </div>
  <div class="banner-right banner-item" />
</div>
