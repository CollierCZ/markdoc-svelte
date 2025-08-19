<script lang="ts">
  import type { MarkdocModule } from "markdoc-svelte"
  const { headings }: MarkdocModule = $props();

  // Filter only h1 and h2 headings
  const filteredHeadings = headings?.filter((heading) => heading.level <= 2) ?? [];
</script>

{#if filteredHeadings.length > 0}
  <ul>
    {#each filteredHeadings as heading}
      <li>
        <a href={`#${heading.id}`}>{heading.title}</a>
      </li>
    {/each}
  </ul>
{/if}