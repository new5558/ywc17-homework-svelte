<script>

</script>

<style lang="scss">
  @import 'src/sass/mixins.scss';
  .footer {
    display: flex;
    justify-content: center;
    padding: 0 15px;
    font-family: 'TATSanaSuksaBold';
    background-color: #213a8f;
    color: #fff;
    font-size: 14px;
    @include for-phone-only {
      padding: 15px;
      font-size: 12px;
    }
    &-container {
      display: flex;
      max-width: 1140px;
      width: 100%;
      padding: 0 15px;
      @include for-phone-only {
        flex-direction: column;
      }
      li {
        padding: 8px 31px;
        width: 100%;
        max-width: 75%;
        @include for-phone-only {
          max-width: 100%;
        }
        a {
          color: #fff;
          &:hover {
            text-decoration: none;
          }
        }
      }
    }
  }
  #copyright {
    width: 100%;
    padding: 8px 31px 8px 0;
    @include for-phone-only {
      padding: 8px 31px;
    }
  }
</style>

<div class="footer">
  <ul class="footer-container">
    <li id="copyright">Copyright © 2003-2019</li>
    <li>
      <a
        href="https://regist.xn--b3caa1e2a7e2b0h2be.com/Register/"
        target="_blank">
        ลงทะเบียนเข้าร่วมมาตรการ
      </a>
    </li>
    <li>
      <a
        href="https://www2.xn--b3caa1e2a7e2b0h2be.com/howto-register"
        target="_blank">
        ขั้นตอนการเข้าร่วมทั้งหมด
      </a>
    </li>
    <li>
      <a
        href="https://www2.xn--b3caa1e2a7e2b0h2be.com/thung-ngern-shop-province"
        target="_blank">
        รายชื่อร้านค้าที่เข้าร่วมรายการ
      </a>
    </li>
  </ul>
</div>
