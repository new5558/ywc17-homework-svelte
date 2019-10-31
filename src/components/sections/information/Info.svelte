<script>
  import InfoContent from './InfoContent.svelte'
</script>

<style lang="scss">
  @import 'src/sass/mixins.scss';
  .info {
    display: flex;
    justify-content: center;
    padding: 30px;
    background-color: #fafafa;
    @include for-phone-only {
      padding: 44px 30px;
    }
    &-container {
      display: flex;
      justify-content: space-between;
      max-width: 1140px;
      width: 100%;
      @include for-phone-only {
        flex-direction: column;
        justify-content: flex-start;
      }
    }
    &-image {
      width: 108px;
      @include for-phone-only {
        width: 145px;
      }
    }
  }
</style>

<div class="info">
  <div class="info-container">
    <InfoContent isLogo={true}>
      <img
        class="info-image"
        src="./image/information-logo.png"
        alt="information-logo" />
    </InfoContent>
    <InfoContent topic="ข้อมูลลงทะเบียนประชาชน">
      การรับสิทธิ การใช้งานแอปพลิเคชั่น
      <span class="nowrap">“เป๋าตัง”</span>
      และ
      <span class="nowrap">“ถุงเงิน”</span>
      <div class="detail">
        ติดต่อ ชิมช้อปใช้ Call Center by Krungthai โทร.
        <a class="ml-1" href="tel:021111144">
          <span class="nowrap">0 2111 1144</span>
        </a>
      </div>
    </InfoContent>
    <InfoContent topic="ข้อมูลลงทะเบียนผู้ประกอบการ">
      <div>เงื่อนไขและวิธีการเข้าร่วมมาตรการฯ</div>
      <div>
        ติดต่อ โทร.
        <a href="tel:022706400">
          <span class="nowrap">0 2270 6400 กด 7</span>
        </a>
      </div>
    </InfoContent>
    <InfoContent topic="ข้อมูลเที่ยวชิมช้อปใช้">
      <div>ติดต่อ ททท.</div>
      <div>
        โทร
        <a href="tel:1672">
          <span>1672</span>
        </a>
      </div>
    </InfoContent>
  </div>
</div>
