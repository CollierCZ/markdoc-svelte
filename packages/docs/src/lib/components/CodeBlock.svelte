<script lang="ts">
  import { getSingletonHighlighter, type BundledLanguage } from "shiki";
  import CopyButton from "./CopyButton.svelte";
  import "./CodeBlock.css";
  let { code, lang }: { code: string; lang?: BundledLanguage } = $props();

  const highlighter = async (highCode: string, highLang?: BundledLanguage) => {
    const langToLoad = highLang || "text";
    const highlighterTool = await getSingletonHighlighter({
      themes: ["nord"],
      langs: [langToLoad],
    });
    await highlighterTool.loadTheme("nord");
    const html = highlighterTool.codeToHtml(highCode, {
      lang: langToLoad,
      theme: "nord",
    });
    return html;
  };
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
  {#await highlighter(code, lang) then highlightedCode}
    {@html highlightedCode}
  {/await}
</div>
