<script>

</script>

<style lang="scss">
  .banner {
    width: (100% / 3);
    height: 350px;
    background-size: cover;
    &-container {
      display: flex;
      width: 100%;
    }
    &-left {
      background-image: url('./image/banner-left.png');
    }
    &-center {
      display: flex;
      justify-content: center;
      align-items: center;
      background-image: url('./image/banner-center.png');
    }
    &-right {
      background-image: url('./image/banner-right.png');
    }
  }
</style>

<div class="banner-container">
  <div class="banner-left banner" />
  <div class="banner-center banner">
    <img src="./image/banner.png" alt="banner" />
  </div>
  <div class="banner-right banner" />
</div>
