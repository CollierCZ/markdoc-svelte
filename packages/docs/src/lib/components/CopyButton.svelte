<script lang="ts">
  // eslint-disable-next-line import/no-unresolved
  import { browser } from "$app/environment";

  let { textToCopy }: { textToCopy: string } = $props();
  let copyText = $state("Copy");

  const copy = async (text: string): Promise<string | null> => {
    if (browser) {
      const clipboardResult = await navigator.clipboard
        ?.writeText(text)
        .then(() => {
          return "Copied text";
        })
        .catch(() => {
          return null;
        }) as string;
      return clipboardResult;
    }
    return null;
  };

  const handleClick = async (text: string): Promise<void> => {
    const result = await copy(text);
    if (result) {
      copyText = "Copied";
      setTimeout(() => {
        copyText = "Copy";
      }, 1500);
    } else {
      copyText = "Error copying";
      setTimeout(() => {
        copyText = "Copy";
      }, 1500);
    }
  };
</script>

<button
  class="rounded-lg bg-green-100 px-2 py-1 text-base text-green-900 {copyText ===
  'Copy'
    ? ''
    : 'font-extralight'}"
  onclick={() => handleClick(textToCopy)}
>
  {copyText}
</button>
