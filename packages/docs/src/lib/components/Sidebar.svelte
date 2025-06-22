<script lang="ts">
  import { getNavigationItems } from "$lib/utils/getNavigationItems";
</script>

<nav class="max-w-sm">
  {#await getNavigationItems() then navItems}
    <ul class="[&_a]:underline hover:[&_a]:no-underline focus:[&_a]:no-underline">
      {#each Object.entries(navItems) as [itemPath, itemData]}
        {#if itemData.children}
          <li class="pt-2">
            {itemData.title}
            <ul class="pl-4">
              {#each Object.entries(itemData.children) as [childPath, childData]}
                <li><a href={`/docs/${childPath}`}>{childData.title}</a></li>
              {/each}
            </ul>
          </li>
        {:else}
          <li><a href={`/docs/${itemPath}`}>{itemData.title}</a></li>
        {/if}
      {/each}
    </ul>
  {/await}
</nav>
