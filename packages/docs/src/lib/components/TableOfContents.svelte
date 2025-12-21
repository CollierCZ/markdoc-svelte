<script lang="ts">
  import { navStyles } from "$lib/utils/classConst";
  import type { MarkdocModule } from "markdoc-svelte";
  const { headings }: MarkdocModule = $props();

  // Include only headings up to h3
  const filteredHeadings = $derived(
    headings?.filter((heading) => heading.level <= 3) ?? []
  );
</script>

{#if filteredHeadings.length > 0}
  <nav>
    <h2 class="pb-2 font-semibold">On This Page</h2>
    <ul class={navStyles}>
      {#each filteredHeadings as heading (heading.id)}
        <li class="pb-1">
          <a href={`#${heading.id}`}>{heading.title}</a>
        </li>
      {/each}
    </ul>
  </nav>
{/if}
