<script>
  import ContactBanner from './ContactBanner.svelte'
</script>

<style lang="scss">
  @import 'src/sass/mixins.scss';
  .information-container {
    margin-top: 150px;
    display: flex;
    justify-content: center;
  }
  .image-container {
    max-width: 1140px;
    display: flex;
    justify-content: center;
    @include for-phone-only {
      flex-direction: column;
    }
  }
</style>

<div class="information-container">
  <div class="image-container">
    <ContactBanner
      href="tel:021111144"
      src="./image/Banner_KTB_SQ.png"
      alt="Banner_KTB_SQ" />
    <ContactBanner
      href="tel:022706400"
      src="./image/Banner_CGD_Sq.png"
      alt="Banner_CGD_Sq" />
    <ContactBanner
      href="tel:1672"
      src="./image/Banner_TAT_Hotline_Sq.png"
      alt="Banner_TAT_Hotline_Sq" />
  </div>
</div>
