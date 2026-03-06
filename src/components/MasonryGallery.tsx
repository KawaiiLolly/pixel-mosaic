import { useState, useMemo } from "react";
import PhotoLightbox from "./PhotoLightbox";

const allPhotos = Array.from({ length: 12 }, (_, i) => `/photos/photo${i + 1}.jpg`);

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const MasonryGallery = () => {
  const photos = useMemo(() => shuffle(allPhotos), []);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  return (
    <>
      <div className="masonry-grid p-1">
        {photos.map((src, i) => (
          <div
            key={src}
            className="masonry-item cursor-pointer overflow-hidden"
            onClick={() => setLightboxSrc(src)}
          >
            <img
              src={src}
              alt=""
              className="w-full block transition-transform duration-300 hover:scale-[1.03]"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {lightboxSrc && (
        <PhotoLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
      )}
    </>
  );
};

export default MasonryGallery;
