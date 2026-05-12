export interface DirectoryData {
  title: string;
}
export interface NavItems {
  [path: string]: {
    title?: string;
    children?: NavItems;
  };
}
