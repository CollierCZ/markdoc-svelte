export const removeNumbersFromNavLinks = (originalLink: string): string => {
  const linkWithoutInitialNumbers = originalLink.replaceAll(/\d\d-/g, "");
  return linkWithoutInitialNumbers;
};
