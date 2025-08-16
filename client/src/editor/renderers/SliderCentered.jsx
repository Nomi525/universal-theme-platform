export default function SliderCentered({ settings = {} }) {
  const {
    images = [],
    animation_style = "SLIDE",
    slideshow_delay = 3000,
    show_dots = true,
    section_background_color = "#ffffff",
  } = settings;

  return (
    <div
      className="w-full py-6"
      style={{ backgroundColor: section_background_color }}
    >
      <div className="relative overflow-hidden">
        {images.length > 0 ? (
          images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Slide ${idx}`}
              className="mx-auto rounded-md shadow-md"
            />
          ))
        ) : (
          <div className="text-center text-gray-500">No images configured</div>
        )}
      </div>
      {show_dots && (
        <div className="flex justify-center gap-2 mt-2">
          {images.map((_, i) => (
            <span key={i} className="w-2 h-2 rounded-full bg-gray-400"></span>
          ))}
        </div>
      )}
    </div>
  );
}
