<script lang="ts">
  import type { PageData } from './$types'
  
  let { data }: { data: PageData } = $props()
  const title = $derived(data.page.frontmatter?.title);
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>


<div class="grid h-screen place-items-center pb-32">
  <div class="grid place-items-center px-4 md:px-0">
    <h1 class="font-extrabold text-4xl">{title}</h1>
    <div class="prose">
      <data.page.default />
    </div>
    <a
      class="rounded-lg bg-green-100 p-4 text-green-900"
      href="/docs/01-get-started">Get started</a
    >
  </div>
</div>
