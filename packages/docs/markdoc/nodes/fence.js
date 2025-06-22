import Markdoc from '@markdoc/markdoc'

const fence = {
  render: 'CodeBlock',
  attributes: {
    content: {
      type: String,
    },
    language: {
      type: String,
    },
    process: {
      ...Markdoc.nodes.fence.attributes.process,
      default: false
    },
  },
  async transform(node, config) {
    const attributes = node.transformAttributes(config)
    const children = node.transformChildren(config)
    const code =
      children.length > 0
        ? children.join()
        : attributes.content

    const codeWithoutEmptyLastLine = code.replace(/\n$/, '')

    return new Markdoc.Tag(this.render, {
      lang: attributes.language,
      code: codeWithoutEmptyLastLine,
    })
  },
}

export default fence
