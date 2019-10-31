<script>
  export let duration = ''
</script>

<style lang="scss">
  @import 'src/sass/mixins.scss';
  button {
    box-shadow: 0 15px 30px 0 rgba(28, 78, 132, 0.4);
    font-family: TATSanaSuksaBold;
    color: #fff;
    width: 800px;
    padding: 10px;
    background-color: #213a8f;
    border-radius: 5px;
    border: 0;
    font-size: 24px;
    line-height: 1.5;
    font-weight: bold;
    &:hover {
      background-color: #fbbc33;
      box-shadow: none;
    }
    &:focus {
      outline: 0;
    }
    @include for-phone-only {
      width: auto;
      font-size: 18px;
      margin: 10px 0;
    }
  }
  .button-container {
    width: 100%;
  }
  .button-container-2 {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .header-container {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin: 26px 15px;
    @include for-phone-only {
      margin: 26px 15px 0 15px;
    }
  }
  .since {
    font-family: TATSanaSuksaBold;
    font-weight: bold;
  }
  .duration {
    @include for-phone-only {
      font-size: 30px;
    }
    line-height: 1.8;
    margin-top: -10px;
    font-size: 48px;
    font-weight: bold;
    color: #e6332a;
  }
  hr {
    margin: -3% 0 1rem 0;
    width: 100%;
    height: 0;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }
</style>

<div class="header-container">
  <div class="since">ตั้งแต่วันที่</div>
  <div class="duration">{duration}</div>
  <div class="button-container">
    <div class="button-container-2">
      <button>
        ลงทะเบียนเฟส 2
        <br />
        ตั้งแต่วันที่ 24 ต.ค. 62 วันล่ะ 2 รอบ เวลา 6.00 และ 18:00 น.
        <br />
        (จำกัดผู้ลงทะเบียนรอบล่ะ 5 แสนคน รวม 1 ล้านคนต่อวัน)
        <br />
      </button>
    </div>
    <hr />
  </div>
</div>
