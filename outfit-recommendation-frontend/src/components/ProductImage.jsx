const FALLBACK_IMAGE = "/no-image.png";

export default function ProductImage({ src, label, price, compact = false }) {
  const size = compact ? "w-28 h-28" : "w-44 h-44";

  return (
    <div className="flex flex-col items-center text-center">
      
      {/* Image */}
      <div
        className={`${size} bg-gray-50 rounded-xl flex items-center justify-center border`}
      >
        <img
          src={src || FALLBACK_IMAGE}
          alt={label}
          className="w-full h-full object-contain"
          onError={(e) => {
            e.target.src = FALLBACK_IMAGE;
          }}
        />
      </div>

      {/* Label */}
      <span className="mt-2 text-sm font-medium text-gray-700">
        {label}
      </span>

      {/* Price */}
      {price > 0 ? (
      <span className="text-sm text-gray-500">
        ₹{price}
      </span>
    ) : (
      <span className="text-sm text-gray-400 italic">
        Price unavailable
      </span>
    )}

    </div>
  );
}
