<script lang="ts">
  let {
    children,
    class = "",
    rel = "",
    href,
  }: { children: any; class: string, href: string; rel: string } = $props();
</script>

<a {href} rel={rel ? "noopener" : ""} class={`${class} otherClass`}>
  {@render children?.()}
</a>
