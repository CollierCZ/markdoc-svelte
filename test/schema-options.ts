// Schema options to be passed directly to markdoc() for testing
// These test the direct configuration vs schema directory loading

export const directTags = {
  directTag: {
    render: "DirectTag",
    attributes: {},
    children: ["inline"]
  },
  overrideTag: {
    render: "OverrideTag",
    attributes: {},
    children: ["inline"]
  },
  additionalTag: {
    render: "AdditionalTag",
    attributes: {},
    children: ["inline"]
  }
};

export const directFunctions = {
  overrideFunction: {
    transform(parameters: any[]) {
      return "DIRECT_OVERRIDE";
    }
  }
};

export const directVariables = {
  additionalVar: "additional value"
};

export const directNodes = {
  paragraph: {
    render: "p",
    attributes: {
      class: { type: String, default: "direct-paragraph" }
    },
    children: ["inline"]
  }
}; 