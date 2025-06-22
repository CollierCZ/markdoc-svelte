<script lang="ts">
  import Sidebar from "$lib/components/Sidebar.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  const title = $derived(data.page.frontmatter?.title ?? "A great page");
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>
<div class="grid grid-cols-1 md:grid-cols-[200px_minmax(900px,_1fr)_100px] gap-8 max-w-4xl mx-auto pt-6 px-6 md:px-0">
  <Sidebar />
  <div class="prose">
    <h1>{title}</h1>
    <data.page.default />
  </div>
</div>
