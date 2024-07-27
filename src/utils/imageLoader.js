// utils/imageLoader.js
export const importImages = async (imagePaths) => {
  const importedImages = await Promise.all(
    imagePaths.map(async (path) => {
      const adjustedPath = `../${path}`; // Adjust path as needed
      const image = await import(adjustedPath);
      return image.default;
    })
  );
  return importedImages;
};
