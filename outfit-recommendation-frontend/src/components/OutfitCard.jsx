import ProductImage from "./ProductImage";


export default function OutfitCard({ outfit, products }) {
  const { items, match_score, reasoning } = outfit;

  return (
    <div className="bg-white rounded-3xl shadow-xl p-10 w-full">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-semibold">
          Match Score: {match_score}
        </h3>
        <span className="text-xl font-medium text-gray-700">
          ₹{reasoning.budget.total_price}
        </span>
      </div>

      {/* Outfit Items */}
      <div className="grid grid-cols-4 gap-8 mb-8">
        <ProductImage
          src={products[items.top]?.image_url}
          label="Top"
        />
        <ProductImage
          src={products[items.bottom]?.image_url}
          label="Bottom"
        />
        <ProductImage
          src={products[items.footwear]?.image_url}
          label="Footwear"
        />
        <ProductImage
          src={products[items.accessory]?.image_url}
          label="Accessory"
        />
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 mb-6"></div>

      {/* Reasoning */}
      <p className="text-lg text-gray-700 leading-relaxed">
        {reasoning.summary}
      </p>
    </div>
  );
}
  