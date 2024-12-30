const uppercase = {
  transform(parameters: any) {
    const string = parameters[0];

    return typeof string === "string" ? string.toUpperCase() : string;
  },
};

export default uppercase;
