<script>
  export let items = []
</script>

<style lang="scss">
  .navbar-container {
    padding: 0 15px;
    ul {
      display: flex;
      justify-content: center;
      flex-direction: row;
      width: 100%;
      padding: 5px 0 0 0;
      margin: 0;
    }
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
        color: #333333;
        text-decoration: none;
        font-weight: bold;
        font-family: TATSanaChon;
        font-size: 14px;
        list-style-type: none;
        cursor: pointer;
        line-height: 1.8;
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
  }
</style>

<div class="navbar">
  <div class="navbar-container">
    <ul>
      {#each items as item (item.label)}
        <li class="navbar-text">
          <a href={item.href} target="_blank">{item.label}</a>
        </li>
      {/each}
    </ul>
  </div>
</div>
