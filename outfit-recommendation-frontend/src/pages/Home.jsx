import { useState } from "react";
import { getOutfits } from "../api/recommend";
import products from "../data/products.json";
import { anchorProducts } from "../utils/products";
import OutfitRow from "../components/OutfitRow";

export default function Home() {
  const [baseId, setBaseId] = useState("");
  const [budget, setBudget] = useState("mid");
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
      const res = await getOutfits(baseId, budget);
      setResult(res);
    } catch {
      setError("Failed to generate outfit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 sm:px-6 py-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          AI-Powered Outfit Recommendation System
        </h1>
        <p className="text-gray-600 mb-6 text-sm sm:text-base">
          Select a product and compare complete outfit recommendations using real catalog data.
        </p>

        {/* Controls */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow mb-8">
          <div className="flex flex-col gap-5">
            {/* Product Dropdown */}
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

            {/* Budget Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Budget Preference
              </label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="border rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="low">Low (Budget-friendly)</option>
                <option value="mid">Mid (Balanced)</option>
                <option value="high">High (Premium)</option>
              </select>
            </div>

            {/* Selected Product Preview */}
            {selectedProduct && (
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <img
                  src={selectedProduct.image_url}
                  alt={selectedProduct.title}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-xl bg-white border"
                />
                <div>
                  <p className="text-base sm:text-lg font-medium">
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
              className="bg-black text-white px-8 py-3 rounded-lg disabled:opacity-50 w-full sm:w-fit"
            >
              {loading ? "Generating..." : "Generate Outfit"}
            </button>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
          </div>
        </div>

        {/* Results */}
        {result && (
          <>
            <p className="text-sm text-gray-500 mb-4">
              Showing results for <span className="font-medium">{budget}</span> budget
            </p>

            {result.outfits.length === 0 && (
              <div className="bg-white p-6 rounded-xl shadow text-gray-700">
                <p className="font-medium mb-1">No outfits found.</p>
                <p className="text-sm text-gray-500">
                  This product may not have enough compatible items to form a complete outfit.
                </p>
              </div>
            )}

            {result.outfits.length > 0 && (
              /* 👇 KEY MOBILE FIX */
              <div className="bg-white rounded-2xl shadow overflow-x-auto">
                <div className="min-w-[900px] px-6 sm:px-8">
                  
                  {/* Header Row */}
                  <div className="grid grid-cols-7 gap-6 py-4 border-b text-gray-500 font-medium text-sm sm:text-base">
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
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
