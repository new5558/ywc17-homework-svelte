<script>
  import InfoContent from './InfoContent.svelte'
</script>

<style lang="scss">
  .item-container {
    display: flex;
    justify-content: space-between;
    max-width: 1140px;
    width: 100%;
  }
  .info-container {
    display: flex;
    justify-content: center;
    padding: 30px;
    background-color: #fafafa;
  }
  .item {
    &-image {
      width: 108px;
    }
    padding: 0 15px;
    max-width: 25%;
    width: 100%;
    text-decoration: none;
    color: #333333;
    font-size: 14px;
    a {
      &:hover {
        text-decoration: none;
      }
      margin-left: 0.25rem;
    }
  }
</style>

<div class="info-container">
  <div class="item-container">
    <div class="item">
      <img
        class="item-image"
        src="./image/information-logo.png"
        alt="information-logo" />
    </div>
    <div class="item">
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
    </div>
    <div class="item">
      <InfoContent topic="ข้อมูลลงทะเบียนผู้ประกอบการ">
        <div>เงื่อนไขและวิธีการเข้าร่วมมาตรการฯ</div>
        <div>
          ติดต่อ โทร.
          <a href="tel:022706400">
            <span class="nowrap">0 2270 6400 กด 7</span>
          </a>
        </div>
      </InfoContent>
    </div>
    <div class="item">
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
</div>
