export default {
  testFunction: {
    transform(parameters: any[]) {
      return "TRANSFORMED: " + parameters[0];
    }
  }
}; 