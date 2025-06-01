<script lang="ts">
  export let status: "active" | "inactive" = "active";
  export let count: number = 0;
</script>

<div class="another-component" class:active={status === "active"}>
  <div class="status">
    Status: {status}
  </div>
  <div class="count">
    Count: {count}
  </div>
  <div class="content">
    <slot />
  </div>
</div>

<style>
  .another-component {
    background: #f5f5f5;
    padding: 1rem;
    margin: 1rem 0;
    border-radius: 4px;
  }
  .active {
    background: #e3f2fd;
  }
  .status {
    font-weight: bold;
    color: #1976d2;
  }
  .count {
    color: #666;
    margin: 0.5rem 0;
  }
  .content {
    margin-top: 1rem;
  }
</style> 