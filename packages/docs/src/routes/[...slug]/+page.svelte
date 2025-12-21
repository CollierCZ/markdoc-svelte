<script lang="ts">
  import Sidebar from "$lib/components/Sidebar.svelte";
  import TableOfContents from "$lib/components/TableOfContents.svelte";

  let { data } = $props();
  const title = $derived(data.page.frontmatter?.title ?? "A great page");
  const headings = $derived(data.page.headings);
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>
<div
  class="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-6 gap-8 max-w-4xl mx-auto pt-6 px-6 md:px-0"
>
  <div class="hidden md:block">
    <Sidebar />
  </div>
  <div class="prose {headings ? "sm:col-span-3" : "sm:col-span-4"} {headings ? "md:col-span-4" : "md:col-span-5"}">
    <h1>{title}</h1>
    <data.page.default />
  </div>
  {#if headings}
    <div class="hidden sm:block sm:sticky top-0">
      <TableOfContents {headings} />
    </div>
  {/if}
</div>
