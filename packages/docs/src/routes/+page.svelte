<script lang="ts">
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  const title = data.page.frontmatter.title;
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>


<div class="grid h-screen place-items-center">
  <div>
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
