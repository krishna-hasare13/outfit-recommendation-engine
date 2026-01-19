import ProductImage from "./ProductImage";

export default function OutfitRow({ outfit, products }) {
  const { items, match_score, reasoning } = outfit;

  return (
    <div className="grid grid-cols-7 items-start gap-6 py-6 border-b transition hover:bg-gray-50">
      
      {/* Score */}
      <div className="text-lg font-semibold">
        {match_score}
      </div>

      {/* Top */}
      <ProductImage
        src={products[items.top]?.image_url}
        label="Top"
        price={products[items.top]?.price}
        compact
      />

      {/* Bottom */}
      <ProductImage
        src={products[items.bottom]?.image_url}
        label="Bottom"
        price={products[items.bottom]?.price}
        compact
      />

      {/* Footwear */}
      <ProductImage
        src={products[items.footwear]?.image_url}
        label="Footwear"
        price={products[items.footwear]?.price}
        compact
      />

      {/* Accessory */}
      <ProductImage
        src={products[items.accessory]?.image_url}
        label="Accessory"
        price={products[items.accessory]?.price}
        compact
      />

      {/* Total Price */}
      <div className="text-lg font-medium">
        ₹{reasoning.budget.total_price}
      </div>

      {/* Reasoning */}
      <div className="col-span-7 text-gray-600 text-base mt-3">
        {reasoning.summary}
      </div>
    </div>
  );
}
