<script>
  import SponsorImage from './SponsorImage.svelte'
</script>

<style lang="scss">
  @import 'src/sass/mixins.scss';
  .sponsor-container {
    margin: 150px 0;
    display: flex;
    justify-content: center;
    @include for-phone-only {
      margin: 80px 0;
    }
  }
  .image-container {
    width: 100%;
    max-width: 1140px;
    display: flex;
    justify-content: space-around;
    @include for-phone-only {
      padding: 0 45px;
      flex-wrap: wrap;
    }
  }
</style>

<div class="sponsor-container">
  <div class="image-container">
    <SponsorImage
      href="https://www.mof.go.th/th/home"
      src="./image/sponsor/MOF.png" />
    <SponsorImage href="http://www.fpo.go.th" src="./image/sponsor/FPO.png" />
    <SponsorImage href="https://www.cgd.go.th" src="./image/sponsor/CGD.png" />
    <SponsorImage
      href="https://www.newcb.ktb.co.th"
      src="./image/sponsor/Krungthai.png" />
    <SponsorImage
      href="https://www.mots.go.th"
      src="./image/sponsor/MOTS.png" />
    <SponsorImage
      href="https://thai.tourismthailand.org"
      src="./image/sponsor/TAT.png" />
  </div>
</div>
