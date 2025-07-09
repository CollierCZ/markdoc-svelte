<script lang="ts">
  import { getNavigationItems } from "$lib/utils/getNavigationItems";
  import { MediaQuery } from "svelte/reactivity";

  const medium = new MediaQuery("min-width: 768px");

  let { isOpen = $bindable() }: { isOpen: boolean } = $props();

  const closeNav = () => {
    isOpen = false;
  };
</script>

<nav class={["max-w-sm", medium ? !isOpen && "hidden" :"hidden"]}>
  {#await getNavigationItems() then navItems}
    <ul
      class="[&_a]:underline [&_a]:hover:no-underline [&_a]:focus:no-underline"
    >
      {#each Object.entries(navItems) as [itemPath, itemData] (itemPath)}
        {#if itemData.children}
          <li class="pt-2">
            {itemData.title}
            <ul class="pl-4">
              {#each Object.entries(itemData.children) as [childPath, childData] (childPath)}
                <li>
                  <a onclick={closeNav} href={`/docs/${childPath}`}
                    >{childData.title}</a
                  >
                </li>
              {/each}
            </ul>
          </li>
        {:else}
          <li>
            <a onclick={closeNav} href={`/docs/${itemPath}`}>{itemData.title}</a
            >
          </li>
        {/if}
      {/each}
    </ul>
  {/await}
</nav>
