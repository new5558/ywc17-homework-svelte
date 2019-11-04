<script>
  import createDOMPurify  from 'dompurify';
  export let detail = ''
  export let condition = ''
  const dompurify  =  createDOMPurify(window);
  $: detailSafe = dompurify.sanitize(detail);
  $: conditionSafe  =  dompurify.sanitize(condition);
</script>

<style lang="scss">
  @import 'src/sass/mixins.scss';
  .about {
    display: flex;
    justify-content: center;
    margin-top: 70px;
    @include for-phone-only {
      padding: 0 15px;
    }
    &-container {
      width: 100%;
      max-width: 1140px;
      @include for-phone-only {
        max-width: 100%;
      }
    }
    &-content {
      padding: 0 15px;
      max-width: 83.33%;
      text-align: left;
      @include for-phone-only {
        max-width: 100%;
      }
    }
    &-title {
      font-family: TATSanaSuksaBold;
      line-height: 1.8;
      font-size: 36px;
      font-weight: bold;
      color: #e6332a;
      @include for-phone-only {
        font-size: 24px;
        line-height: 1.6;
      }
    }
  }
  .detail {
    &-condition {
      margin-top: 1.5rem;
    }
    &-description {
      margin-top: 1.5rem;
    }
    &-topic {
      font-family: TATSanaSuksaBold;
      font-weight: bold;
      font-size: 18px;
      line-height: 1.8;
    }
    font-size: 18px;
    line-height: 1.8;
    color: #333333;
    box-sizing: border-box;
    @include for-phone-only {
      font-size: 16px;
    }
  }
</style>

<div class="about">
  <div class="about-container">
    <div class="about-content">
      <div class="about-title">
        มาตรการส่งเสริมการบริโภค
        <br />
        ในประเทศ “ชิมช้อปใช้”
      </div>
      <div class="detail detail-description">
        {@html detailSafe}
      </div>
      <div class="detail-condition">
        <div class="detail detail-topic">เงื่อนไขการเข้าร่วมมาตรการ</div>
        <div class="detail">
          {@html conditionSafe}
        </div>
      </div>
    </div>
  </div>
</div>
