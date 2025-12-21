<script lang="ts">
  let {level = 1, children, attributes} = $props();
</script>

<svelte:element this={`h${level}`} class="heading-component" {...attributes}>
  {@render children()}
</svelte:element>

<style>
  .heading-component {
    background: #f5f5f5;
    padding: 1rem;
    margin: 1rem 0;
    border-radius: 4px;
  }
</style> 