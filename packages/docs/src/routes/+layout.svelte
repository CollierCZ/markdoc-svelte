<script>
  import TopNav from "$lib/components/TopNav.svelte";
  let { children } = $props();
  import "../app.css";
</script>

<TopNav />

{@render children()}
