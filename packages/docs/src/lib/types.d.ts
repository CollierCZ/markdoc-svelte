export interface NavItems {
  [path: string]: {
    title: string;
    children?: NavItems;
  };
}
