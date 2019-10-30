<script>
  export let items = []
  let isOpen = false
  function toggle() {
    isOpen = !isOpen
  }
</script>

<style lang="scss">
  @import 'src/sass/mixins.scss';
  .navbar-container {
    padding: 0 15px;
    ul {
      display: flex;
      justify-content: center;
      flex-direction: row;
      width: 100%;
      padding: 5px 0 0 0;
      margin: 0;
      @include for-phone-only {
        flex-direction: column;
        align-items: flex-end;
      }
    }
    overflow: hidden;
    transition: height 0.35s ease;
    transition-property: height;
    transition-duration: 0.35s;
    transition-timing-function: ease;
    transition-delay: 0s;
  }
  .navbar {
    background-color: #ffffff;
    box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.1);
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    height: 60px;
    &-text {
      padding: 14px 15px;
      a {
        position: relative;
        color: rgba(0, 0, 0, 0.5);
        font-family: 'TATSanaSuksa';
        font-size: 16px;
        text-decoration: none;
        list-style-type: none;
        cursor: pointer;
        line-height: 1.8;
        @include for-desktop-only {
          color: #333333;
          font-weight: bold;
          font-family: TATSanaChon;
          font-size: 14px;
          &:after {
            content: '';
            position: absolute;
            bottom: -14px;
            left: 0px;
            width: 100%;
            height: 6px;
            background-color: #213a8f;
            visibility: hidden;
            transition: all 0.3s ease-in-out 0s;
            transform: scaleX(0);
          }
          &:hover {
            color: #213a8f;
            &:after {
              visibility: visible;
              transform: scaleX(1);
            }
          }
        }
      }
      @include for-phone-only {
        padding: 8px 0;
      }
    }
    @include for-phone-only {
      height: auto;
      padding: 8px 16px;
    }
  }
  .mobile {
    &-navbar {
      display: flex;
      justify-content: space-between;
    }
    &-logo {
      display: none;
      @include for-phone-only {
        display: block;
      }
      width: 35px;
      height: 48px;
    }
  }
  .dropdown {
    &-open {
      height: 134px;
    }
    &-close {
      height: auto;
      @include for-phone-only {
        height: 0px;
      }
    }
  }
  .hamburger {
    display: flex;
    align-items: center;
    margin: 0;
    cursor: pointer;
    border: 0;
    &-box {
      position: relative;
      width: 30px;
      height: 20px;
    }
    &-inner {
      position: absolute;
      width: 30px;
      height: 3px;
      transition-timing-function: ease-in-out;
      transition-duration: 0.25s;
      transition-property: transform, opacity;
      border-radius: 9px;
      background-color: #333333;
      &-2 {
        top: 10px;
      }
      &-3 {
        top: 20px;
      }
    }
    @include for-desktop-only {
      display: none;
    }
  }
  .hamburger-open {
    & .hamburger-inner {
      &-1 {
        top: 11px;
        transform: rotate(135deg);
      }
      &-2 {
        opacity: 0;
        transform: translateX(-60px);
      }
      &-3 {
        top: 11px;
        transform: rotate(-135deg);
      }
    }
  }
</style>

<div class="navbar">
  <div class="mobile-navbar">
    <img class="mobile-logo" alt="logo" src="./image/information-logo.png" />
    <div class:hamburger-open={isOpen} class="hamburger" on:click={toggle}>
      <div class="hamburger-box">
        <div class="hamburger-inner hamburger-inner-1" />
        <div class="hamburger-inner hamburger-inner-2" />
        <div class="hamburger-inner hamburger-inner-3" />
      </div>
    </div>
  </div>
  <div class:dropdown-open={isOpen} class:dropdown-close={!isOpen} class="navbar-container">
    <ul>
      {#each items as item (item.label)}
        <li class="navbar-text">
          <a href={item.href} target="_blank">{item.label}</a>
        </li>
      {/each}
    </ul>
  </div>
</div>
