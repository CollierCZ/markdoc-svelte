<script lang="ts">
  import CopyButton from "./CopyButton.svelte";
  import "./CodeBlock.css";

  let {
    code,
    codeHtml,
    lang,
  }: { code: string; codeHtml: string; lang?: string } = $props();
</script>

<div class="code-block-wrapper rounded-md bg-codeblock-500">
  <div
    class="flex {lang
      ? 'justify-between'
      : 'justify-end'} pl-4 pr-4 pt-4 lg:pl-6"
  >
    {#if lang}
      <div class="text-green-300">{lang}</div>
    {/if}
    <CopyButton textToCopy={code} />
  </div>
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html codeHtml}
</div>
