<script lang="ts">
  import { MediaQuery } from "svelte/reactivity";

  import { resolve } from "$app/paths";
  import { navStyles } from "$lib/utils/classConst";
  import { getNavigationItems } from "$lib/utils/getNavigationItems";
  import { removeNumbersFromNavLinks } from "$lib/utils/handleNavNumbers";

  const medium = new MediaQuery("min-width: 768px");

  let { isOpen = $bindable() }: { isOpen: boolean } = $props();

  const closeNav = () => {
    // On smaller screens, hide the nav to emphasize new page
    if (!medium.current) {
      isOpen = false;
    }
  };
</script>

<nav class={["max-w-sm", !isOpen && "hidden"]}>
  {#await getNavigationItems() then navItems}
    <ul class={navStyles}>
      {#each Object.entries(navItems) as [itemPath, itemData] (itemPath)}
        {#if itemData.children}
          <li class="pt-2">
            {itemData.title}
            <ul class="pl-4">
              {#each Object.entries(itemData.children) as [childPath, childData] (childPath)}
                <li>
                  <a
                    onclick={closeNav}
                    href={resolve(
                      `/docs/${removeNumbersFromNavLinks(childPath)}`
                    )}>{childData.title}</a
                  >
                </li>
              {/each}
            </ul>
          </li>
        {:else}
          <li>
            <a
              onclick={closeNav}
              href={resolve(`/docs/${removeNumbersFromNavLinks(itemPath)}`)}
              >{itemData.title}</a
            >
          </li>
        {/if}
      {/each}
    </ul>
  {/await}
</nav>
