<script lang="ts">
  import type { LayoutProps } from "./$types";

  import TopNav from "$lib/components/TopNav.svelte";

  let { children }: LayoutProps = $props();
  import "../app.css";
</script>

<TopNav />

{@render children()}
