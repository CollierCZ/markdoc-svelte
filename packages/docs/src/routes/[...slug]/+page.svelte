<script lang="ts">
  import type { PageProps } from "./$types";

  import Sidebar from "$lib/components/Sidebar.svelte";
  import TableOfContents from "$lib/components/TableOfContents.svelte";

  let { data }: PageProps = $props();
  const title = $derived(data.page.frontmatter?.title ?? "A great page");
  console.log(data.page)
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>
<div
  class="grid grid-cols-1 md:grid-cols-[200px_minmax(900px,_1fr)_100px] gap-8 max-w-4xl mx-auto pt-6 px-6 md:px-0"
>
  <div class="hidden md:block">
    <Sidebar />
  </div>
  <div class="prose">
    <h1>{title}</h1>
    <data.page.default />
  </div>
  <div class="hidden md:block">
    <TableOfContents headings={data.page.headings} />
  </div>
</div>
