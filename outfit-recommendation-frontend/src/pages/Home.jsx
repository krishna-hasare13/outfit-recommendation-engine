import { useState } from "react";
import { getOutfits } from "../api/recommend";
import products from "../data/products.json";
import { anchorProducts } from "../utils/products";
import OutfitRow from "../components/OutfitRow";

export default function Home() {
  const [baseId, setBaseId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedProduct = baseId ? products[baseId] : null;

  const handleGenerate = async () => {
    if (!baseId) {
      setError("Please select a product.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await getOutfits(baseId);
      setResult(res);
    } catch (err) {
      setError("Failed to generate outfit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-2">AI-Powered Outfit Recommendation System</h1>
        <p className="text-gray-600 mb-6">
          Select a product and compare complete outfit recommendations using real catalog data.
        </p>

        {/* Controls */}
        <div className="bg-white p-6 rounded-2xl shadow mb-8">
          <div className="flex flex-col gap-5">
            {/* Dropdown */}
            <select
              value={baseId}
              onChange={(e) => setBaseId(e.target.value)}
              className="border rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">Select a base product</option>
              {anchorProducts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.brand})
                </option>
              ))}
            </select>

            {/* Selected Product Preview */}
            {selectedProduct && (
              <div className="flex items-center gap-5 p-4 bg-gray-50 rounded-xl">
                <img
                  src={selectedProduct.image_url}
                  alt={selectedProduct.title}
                  className="w-24 h-24 object-contain rounded-xl bg-white border"
                />
                <div>
                  <p className="text-lg font-medium">
                    {selectedProduct.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedProduct.brand}
                  </p>
                </div>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="bg-black text-white px-8 py-3 rounded-lg disabled:opacity-50 w-fit"
            >
              {loading ? "Generating..." : "Generate Outfit"}
            </button>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-600">
                {error}
              </p>
            )}
          </div>
        </div>

        {/* Results */}
        {result && (
          <>
            {/* No outfits */}
            {result.outfits.length === 0 && (
              <div className="bg-white p-6 rounded-xl shadow text-gray-700">
                <p className="font-medium mb-1">No outfits found.</p>
                <p className="text-sm text-gray-500">
                  This product may not have enough compatible items to form a complete outfit.
                </p>
              </div>
            )}

            {/* Outfit Rows */}
            {result.outfits.length > 0 && (
              <div className="bg-white rounded-2xl shadow px-8">
                
                {/* Header Row */}
                <div className="grid grid-cols-7 gap-6 py-4 border-b text-gray-500 font-medium text-base">
                  <div>Score</div>
                  <div className="text-center">Top</div>
                  <div className="text-center">Bottom</div>
                  <div className="text-center">Footwear</div>
                  <div className="text-center">Accessory</div>
                  <div>Price</div>
                  <div></div>
                </div>

                {/* Outfit Rows */}
                {result.outfits.map((outfit, index) => (
                  <OutfitRow
                    key={index}
                    outfit={outfit}
                    products={products}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
