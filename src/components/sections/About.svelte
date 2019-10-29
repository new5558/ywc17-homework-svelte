<script>
  export let detail = ''
  export let condition = ''
</script>

<style lang="scss">
  .content {
    padding: 0 15px;
    max-width: 83.33%;
    text-align: left;
  }
  .container {
    &-center {
      display: flex;
      justify-content: center;
      margin-top: 70px;
    }
    width: 100%;
    max-width: 1140px;
  }
  .title {
    font-family: TATSanaSuksaBold;
    line-height: 1.8;
    font-size: 32px;
    font-weight: bold;
    color: #e6332a;
  }
  .condition {
    margin-top: 1.5rem;
  }
  .detail {
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
  }
</style>

<div class="container-center">
  <div class="container">
    <div class="content">
      <div class="title">
        มาตรการส่งเสริมการบริโภค
        <br />
        ในประเทศ “ชิมช้อปใช้”
      </div>
      <div class="detail detail-description">
        {@html detail}
      </div>
      <div class="condition">
        <div class="detail-topic">เงื่อนไขการเข้าร่วมมาตรการ</div>
        <div class="detail detail-condition">
          {@html condition}
        </div>
      </div>
    </div>
  </div>
</div>
