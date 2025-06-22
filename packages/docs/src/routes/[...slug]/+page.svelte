<script lang="ts">
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  const title = $derived(data.page.frontmatter?.title ?? "A great page");
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<div class="prose">
  <h1>{title}</h1>
  <data.page.default />
</div>
