<script lang="ts">
  import { MediaQuery } from "svelte/reactivity";

  import SiteNav from "./SiteNav.svelte";

  import { resolve } from "$app/paths";

  const medium = new MediaQuery("min-width: 768px");

  let isOpen = $state(false);
</script>

<nav
  class="px-6 lg:px-0 py-4 flex justify-between max-w-4xl mx-auto items-center border-b-2"
>
  <a class={!medium.current && "hidden"} href={resolve("/")}>Home </a>
  <button
    class={medium.current && "hidden"}
    onclick={() => {
      isOpen = !isOpen;
    }}
  >
    <svg viewBox="0 0 100 80" width="24" height="24">
      <title>Open navigation</title>
      <rect y="5" width="100" height="15" rx="8"></rect>
      <rect y="30" width="100" height="15" rx="8"></rect>
      <rect y="55" width="100" height="15" rx="8"></rect>
    </svg>
  </button>
  <section class="*:pl-2">
    <a href={resolve("/docs/get-started")}>Docs</a>
    <a href="https://github.com/CollierCZ/markdoc-svelte">GitHub</a>
  </section>
</nav>

<div class={isOpen && "p-4"}>
  <SiteNav bind:isOpen />
</div>
