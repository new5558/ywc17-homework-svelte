<script>
  import { onMount } from 'svelte'
  import Navbar from './components/sections/Navbar.svelte'
  import Banner from './components/sections/Banner.svelte'
  import Announcement from './components/sections/Announcement.svelte'
  import About from './components/sections/About.svelte'
  import Contact from './components/sections/contact/Contact.svelte'
  import Sponsor from './components/sections/sponsor/Sponsor.svelte'
  import Info from './components/sections/information/Info.svelte'
  import Footer from './components/sections/Footer.svelte'
  let apiData = {}
  onMount(async () => {
    const response = await fetch('https://panjs.com/ywc.json')
    const apiData = await response.json()
  })
  export let name
</script>

<style lang="scss">
  .content {
    margin-top: 60px;
  }
</style>

<Navbar items={apiData.navbarItems} />
<div class="content">
  <Banner />
  <Announcement duration={apiData.duration} />
  <About detail={apiData.detail} condition={apiData.condition} />
  <Contact />
  <Sponsor />
  <footer>
    <Info />
    <Footer />
  </footer>
</div>
