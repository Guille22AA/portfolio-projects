// grabs every image dropped in src/assets/gallery/<champion>/ so no manual wiring is needed
const galleryContext = require.context("../assets/gallery", true, /\.(png|jpe?g|webp)$/i);

// { gojo: [url, url, ...], asta: [...] } with the images sorted by file name
export const galleryBySlug = galleryContext
  .keys()
  .filter((key) => key.startsWith("./"))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  .reduce((gallery, key) => {
    const slug = key.split("/")[1];
    const image = galleryContext(key);
    gallery[slug] = [...(gallery[slug] || []), image.default || image];
    return gallery;
  }, {});
