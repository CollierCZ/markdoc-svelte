<script lang="ts">
  let text: string;
  const logMessage = () => {
    console.log(text);
  };
</script>

<button
  class="rounded-lg bg-green-100 text-green-900 py-1 px-2 text-base"
  on:click={logMessage}
>
  Click me
</button>
