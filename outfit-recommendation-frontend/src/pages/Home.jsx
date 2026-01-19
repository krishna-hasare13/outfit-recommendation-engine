import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Shirt, 
  ShoppingBag, 
  Loader2, 
  TrendingUp, 
  DollarSign, 
  AlertCircle,
  Tag,
  ChevronDown,
  Check
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Import your existing data/API logic
import { getOutfits } from "../api/recommend";
import products from "../data/products.json"; 
import { anchorProducts } from "../utils/products";

// --- Utility: Tailwind Class Merger ---
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- Component: Glass Card (Premium Container) ---
const GlassCard = ({ children, className }) => (
  // Note: overflow-hidden is default, but we will override it for the controls card
  <div className={cn("bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl rounded-3xl overflow-hidden transition-all hover:shadow-2xl hover:bg-white/90", className)}>
    {children}
  </div>
);

// --- Component: Budget Pill Selector ---
const BudgetSelector = ({ value, onChange }) => {
  const options = [
    { id: "low", label: "Budget", icon: DollarSign },
    { id: "mid", label: "Balanced", icon: ShoppingBag },
    { id: "high", label: "Premium", icon: TrendingUp },
  ];

  return (
    <div className="flex gap-2 p-1 bg-gray-100/50 rounded-xl border border-gray-200 w-full sm:w-fit">
      {options.map((opt) => {
        const isActive = value === opt.id;
        const Icon = opt.icon;
        return (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={cn(
              "flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300",
              isActive 
                ? "bg-blue-900 text-white shadow-lg scale-105" 
                : "text-gray-500 hover:text-gray-900 hover:bg-white/50"
            )}
          >
            <Icon size={14} />
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};

// --- Component: Custom Beautiful Dropdown ---
const ProductSelect = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedItem = options.find((p) => p.id === value);

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between bg-white border text-left rounded-xl px-4 py-3.5 transition-all duration-300 outline-none",
          isOpen 
            ? "border-blue-500 ring-2 ring-blue-500/20 shadow-lg" 
            : "border-gray-200 hover:border-blue-300 hover:shadow-md"
        )}
      >
        {/* Added overflow-hidden here to ensure text truncates inside the button */}
        <div className="flex items-center gap-3 overflow-hidden">
          <div className={cn("p-2 rounded-lg transition-colors flex-shrink-0", isOpen ? "bg-blue-50 text-blue-600" : "bg-gray-50 text-gray-500")}>
            <Shirt size={20} />
          </div>
          <div className="flex flex-col truncate">
            <span className={cn("text-sm font-bold truncate", selectedItem ? "text-slate-900" : "text-gray-400")}>
              {selectedItem ? selectedItem.title : "Choose a product..."}
            </span>
            {selectedItem && (
              <span className="text-xs text-blue-600 font-medium truncate">{selectedItem.brand}</span>
            )}
          </div>
        </div>
        <ChevronDown 
          size={18} 
          className={cn("text-gray-400 transition-transform duration-300 flex-shrink-0 ml-2", isOpen && "rotate-180 text-blue-500")} 
        />
      </button>

      {/* Backdrop to close when clicking outside */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-transparent" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      {/* Dropdown List */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent left-0"
          >
            <div className="p-1.5 space-y-0.5">
              {options.map((p) => {
                const isSelected = value === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      onChange(p.id);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all duration-200 group",
                      isSelected 
                        ? "bg-blue-50 text-blue-900" 
                        : "hover:bg-gray-50 text-slate-700"
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className={cn("text-sm font-semibold truncate", isSelected && "text-blue-700")}>{p.title}</p>
                      <p className={cn("text-xs truncate", isSelected ? "text-blue-500" : "text-gray-400 group-hover:text-gray-500")}>
                        {p.brand}
                      </p>
                    </div>
                    {isSelected && <Check size={16} className="text-blue-600 flex-shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Component: Product Thumbnail ---
const ProductThumbnail = ({ id, label }) => {
  const product = products[id];
  
  if (!product) return (
    <div className="flex flex-col items-center opacity-40">
       <div className="w-20 h-20 bg-gray-200 rounded-xl animate-pulse" />
       <span className="mt-2 text-[10px] uppercase font-bold text-gray-300">N/A</span>
    </div>
  );

  return (
    <div className="group relative flex flex-col items-center w-24 sm:w-28">
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-2xl border border-gray-100 shadow-sm p-2 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-blue-500/20 group-hover:border-blue-100">
        <img 
          src={product.image_url} 
          alt={product.title} 
          className="w-full h-full object-contain"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-blue-500/5 rounded-2xl transition-colors" />
      </div>
      <span className="mt-3 text-[10px] uppercase tracking-wider text-gray-400 font-bold group-hover:text-blue-600 transition-colors">
        {label}
      </span>
      <span className={cn("text-[10px] font-medium mt-0.5", product.price > 0 ? "text-gray-900" : "text-gray-400 italic")}>
        {product.price > 0 ? `₹${product.price}` : "Price Unavailable"}
      </span>
    </div>
  );
};

export default function Home() {
  const [baseId, setBaseId] = useState("");
  const [budget, setBudget] = useState("mid");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedProduct = baseId ? products[baseId] : null;

  const handleGenerate = async () => {
    if (!baseId) {
      setError("Please select a base product.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await getOutfits(baseId, budget);
      setResult(res);
    } catch (err) {
      console.error(err);
      setError("Failed to generate outfit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFD] selection:bg-blue-100 selection:text-blue-900 font-sans text-slate-900 relative overflow-x-hidden">
      
      {/* Blue & White Ambient Gradients */}
      <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-100/40 blur-[120px] rounded-full pointer-events-none mix-blend-multiply animate-pulse" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-sky-100/40 blur-[120px] rounded-full pointer-events-none mix-blend-multiply" />

      <main className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
            <Sparkles size={12} />
            AI Stylist
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 text-slate-900">
            AI Powered Outfit Recommendation <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Engine</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Select a product and compare complete outfit recommendations using real catalog data.
          </p>
        </motion.div>

        {/* Controls Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12"
        >
          {/* CRITICAL FIX: overflow-visible allows the dropdown to "pop out" of the card */}
          <GlassCard className="p-1 overflow-visible">
            <div className="flex flex-col lg:flex-row gap-6 p-6 sm:p-8 items-start lg:items-end">
              
              {/* Product Select */}
              {/* CRITICAL FIX: min-w-0 prevents flex items from overflowing horizontally if text is long */}
              <div className="flex-1 w-full space-y-2 relative z-20 min-w-0">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Select Base Product</label>
                <ProductSelect 
                  value={baseId} 
                  onChange={setBaseId} 
                  options={anchorProducts} 
                />
              </div>

              {/* Budget Select */}
              <div className="w-full lg:w-auto space-y-2 relative z-10">
                 <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Budget</label>
                 <BudgetSelector value={budget} onChange={setBudget} />
              </div>

              {/* Generate Button */}
              <div className="w-full lg:w-auto pt-6 lg:pt-0 relative z-10">
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full lg:w-auto bg-slate-900 hover:bg-blue-900 text-white px-8 py-2.5 rounded-xl font-bold transition-all hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : "Generate Outfit"}
                </button>
              </div>
            </div>

            {/* Selected Product Preview */}
            <AnimatePresence>
              {selectedProduct && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-gray-50/50 border-t border-gray-100 overflow-hidden relative z-0"
                >
                  <div className="p-4 sm:p-6 flex items-center gap-4">
                    <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
                      <img
                        src={selectedProduct.image_url}
                        alt={selectedProduct.title}
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{selectedProduct.title}</p>
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                        {selectedProduct.brand} • {selectedProduct.price > 0 ? `₹${selectedProduct.price}` : "Price Unavailable"}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 border border-red-100 shadow-sm"
              >
                <AlertCircle size={20} />
                <span className="font-medium">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Grid */}
        {result && (
          <div className="space-y-8 relative z-0">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-bold text-slate-900">Recommended Looks</h2>
              <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-500 uppercase tracking-wider shadow-sm">
                {result.outfits.length} Results
              </span>
            </div>

            {result.outfits.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-white/50 rounded-3xl border border-dashed border-gray-300"
              >
                <p className="text-gray-400 font-medium">No complete outfits found for this configuration.</p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 gap-8">
                {result.outfits.map((outfit, index) => {
                  const totalPrice = outfit.reasoning?.budget?.total_price || 0;
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                      <GlassCard className="border-white/60">
                        <div className="p-6 sm:p-8">
                          
                          {/* 1. Header: Match Score & Price */}
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-6 border-b border-gray-100 gap-4">
                             <div className="flex items-center gap-3">
                               <div className="bg-slate-900 text-white w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm shadow-lg shadow-slate-900/20">
                                 {index + 1}
                               </div>
                               <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-slate-900 uppercase tracking-wider">Match Score</span>
                                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold border border-green-200">
                                      {outfit.match_score}
                                    </span>
                                  </div>
                               </div>
                             </div>
                             
                             <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                                <Tag size={16} className="text-gray-400" />
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total</span>
                                <span className={cn("text-lg font-black", totalPrice > 0 ? "text-slate-900" : "text-gray-400 text-sm uppercase")}>
                                  {totalPrice > 0 ? `₹${totalPrice}` : "Price Unavailable"}
                                </span>
                             </div>
                          </div>

                          {/* 2. Products Grid */}
                          <div className="relative py-2">
                              {/* Decorative Line (Desktop) */}
                              <div className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gray-100 to-transparent -z-10" />
                              
                              <div className="flex flex-wrap justify-center sm:justify-between items-start gap-8 sm:gap-4">
                                <ProductThumbnail id={outfit.items.top} label="Top" />
                                <ProductThumbnail id={outfit.items.bottom} label="Bottom" />
                                <ProductThumbnail id={outfit.items.footwear} label="Footwear" />
                                <ProductThumbnail id={outfit.items.accessory} label="Accessory" />
                              </div>
                          </div>

                          {/* 3. AI Reasoning */}
                          <div className="mt-8 pt-6 border-t border-gray-100">
                            <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100/50">
                              <p className="text-sm text-slate-600 leading-relaxed">
                                <span className="font-bold text-blue-700 block mb-1 text-xs uppercase tracking-wider">AI Analysis</span>
                                {outfit.reasoning.summary}
                              </p>
                            </div>
                          </div>

                        </div>
                      </GlassCard>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}