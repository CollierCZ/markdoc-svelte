<script lang="ts">
  export let title: string = "Default Title";
  export let description: string = "Default Description";
</script>

<div class="custom-component">
  <h2>{title}</h2>
  <p>{description}</p>
  <div class="content">
    <slot />
  </div>
</div>

<style>
  .custom-component {
    border: 1px solid #ccc;
    padding: 1rem;
    margin: 1rem 0;
    border-radius: 4px;
  }
  h2 {
    color: #2c3e50;
    margin-top: 0;
  }
  .content {
    margin-top: 1rem;
  }
</style> 