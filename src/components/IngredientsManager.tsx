import React, { useState } from 'react';
import { Plus, X, Sparkles, Check, Edit2, AlertCircle, ShoppingBag, Trash2 } from 'lucide-react';
import { Ingredient, IngredientCategory } from '../types';

interface IngredientsManagerProps {
  ingredients: Ingredient[];
  analysisSummary?: string;
  cookingOverview?: string;
  onAddIngredient: (name: string, category: IngredientCategory, quantity?: string) => void;
  onRemoveIngredient: (id: string) => void;
  onUpdateIngredient: (id: string, name: string, quantity?: string) => void;
  onClearAll: () => void;
}

const COMMON_PANTRY_ITEMS = [
  { name: 'Nước mắm truyền thống', category: 'condiment' as IngredientCategory },
  { name: 'Tiêu đen xay', category: 'spice' as IngredientCategory },
  { name: 'Hành tím băm', category: 'spice' as IngredientCategory },
  { name: 'Tỏi tép / Tỏi băm', category: 'spice' as IngredientCategory },
  { name: 'Ớt hiểm tươi', category: 'spice' as IngredientCategory },
  { name: 'Hành lá tươi', category: 'herb' as IngredientCategory },
  { name: 'Gừng tươi', category: 'spice' as IngredientCategory },
  { name: 'Đường phèn / Đường cát', category: 'condiment' as IngredientCategory },
  { name: 'Hạt nêm', category: 'condiment' as IngredientCategory },
  { name: 'Dầu ăn', category: 'condiment' as IngredientCategory },
  { name: 'Sả cây', category: 'herb' as IngredientCategory },
  { name: 'Chanh tươi', category: 'vegetable' as IngredientCategory },
];

export const IngredientsManager: React.FC<IngredientsManagerProps> = ({
  ingredients,
  analysisSummary,
  cookingOverview,
  onAddIngredient,
  onRemoveIngredient,
  onUpdateIngredient,
  onClearAll,
}) => {
  const [newIngredientName, setNewIngredientName] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editQty, setEditQty] = useState('');

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIngredientName.trim()) return;
    onAddIngredient(newIngredientName.trim(), 'other', newQuantity.trim() || undefined);
    setNewIngredientName('');
    setNewQuantity('');
  };

  const startEdit = (item: Ingredient) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditQty(item.estimatedQuantity || '');
  };

  const saveEdit = (id: string) => {
    if (editName.trim()) {
      onUpdateIngredient(id, editName.trim(), editQty.trim() || undefined);
    }
    setEditingId(null);
  };

  // Group by category for clear culinary presentation
  const categoryLabels: Record<string, string> = {
    meat: 'Thịt & Gia cầm',
    seafood: 'Hải sản',
    vegetable: 'Rau củ tươi',
    herb: 'Rau thơm & Hành ngò',
    spice: 'Gia vị & Hành tỏi ớt',
    condiment: 'Nước chấm & Dầu ăn',
    staple: 'Trứng, Đậu & Tinh bột',
    other: 'Nguyên liệu khác',
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-[#E8DFD0] shadow-sm p-6 sm:p-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8DFD0]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Danh mục thực phẩm
            </span>
            <span className="text-xs text-stone-400">·</span>
            <span className="text-xs font-semibold text-stone-600">
              {ingredients.length} nguyên liệu sẵn sàng
            </span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-900">
            Nguyên liệu hiện có trong bếp
          </h2>
        </div>

        {ingredients.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs font-medium text-stone-500 hover:text-rose-600 transition-colors flex items-center gap-1.5 self-start sm:self-center cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Xóa toàn bộ
          </button>
        )}
      </div>

      {/* AI Analysis Summary Callout if available */}
      {analysisSummary && (
        <div className="my-6 p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD0] flex items-start gap-3.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#0C3426] mb-0.5">
              Kết quả AI phân tích thị giác
            </p>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {analysisSummary}
            </p>
            {cookingOverview && (
              <p className="text-xs text-stone-500 mt-2 font-medium italic">
                💡 {cookingOverview}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Active Ingredients List */}
      <div className="mt-6">
        {ingredients.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-[#E8DFD0] rounded-2xl p-6">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] flex items-center justify-center text-stone-400 mx-auto mb-3">
              <ShoppingBag className="w-6 h-6 text-stone-400" />
            </div>
            <p className="font-serif text-base font-bold text-stone-800 mb-1">
              Chưa có nguyên liệu nào được chọn
            </p>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mb-4">
              Hãy chụp ảnh nguyên liệu ở trên, hoặc chọn nhanh các nguyên liệu gia vị quen thuộc dưới đây.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ingredients.map((item) => {
              const isEditing = editingId === item.id;

              return (
                <div
                  key={item.id}
                  className="group relative bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] border border-[#E8DFD0] hover:border-emerald-600/30 rounded-2xl p-3.5 transition-all flex items-center justify-between gap-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                >
                  {isEditing ? (
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full text-xs bg-white border border-emerald-500 rounded-lg px-2.5 py-1.5 focus:outline-none"
                        placeholder="Tên nguyên liệu"
                        autoFocus
                      />
                      <input
                        type="text"
                        value={editQty}
                        onChange={(e) => setEditQty(e.target.value)}
                        className="w-24 text-xs bg-white border border-stone-300 rounded-lg px-2 py-1.5 focus:outline-none"
                        placeholder="Số lượng"
                      />
                      <button
                        onClick={() => saveEdit(item.id)}
                        className="p-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg cursor-pointer"
                        title="Lưu"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-stone-900 truncate">
                            {item.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-0.5">
                          <span className="text-stone-400 font-medium">
                            {item.categoryName || categoryLabels[item.category] || 'Nguyên liệu'}
                          </span>
                          {item.estimatedQuantity && (
                            <>
                              <span className="text-stone-300">·</span>
                              <span className="text-emerald-800 font-medium truncate">
                                {item.estimatedQuantity}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => startEdit(item)}
                          className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-white rounded-lg transition-colors cursor-pointer"
                          title="Sửa"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onRemoveIngredient(item.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                          title="Xóa"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Manual Add Input */}
      <form onSubmit={handleAddNew} className="mt-6 pt-6 border-t border-[#E8DFD0]">
        <p className="text-xs font-semibold text-stone-700 mb-2">
          Thêm nguyên liệu hoặc gia vị khác vào danh sách:
        </p>
        <div className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            value={newIngredientName}
            onChange={(e) => setNewIngredientName(e.target.value)}
            placeholder="Ví dụ: Thịt bò, cà rốt, nấm rơm, sả..."
            className="flex-1 px-4 py-2.5 text-sm bg-stone-50/70 border border-[#D9CFC1] focus:border-emerald-600 focus:bg-white rounded-xl focus:outline-none transition-all placeholder:text-stone-400"
          />
          <input
            type="text"
            value={newQuantity}
            onChange={(e) => setNewQuantity(e.target.value)}
            placeholder="Định lượng (tùy chọn: 300g, 2 củ...)"
            className="w-full sm:w-48 px-4 py-2.5 text-sm bg-stone-50/70 border border-[#D9CFC1] focus:border-emerald-600 focus:bg-white rounded-xl focus:outline-none transition-all placeholder:text-stone-400"
          />
          <button
            type="submit"
            disabled={!newIngredientName.trim()}
            className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 disabled:hover:bg-emerald-800 text-white font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm</span>
          </button>
        </div>
      </form>

      {/* Quick Add Pantry Shortcuts */}
      <div className="mt-5">
        <p className="text-xs text-stone-500 mb-2 font-medium">
          Gia vị & hương liệu thường có sẵn (chạm để thêm nhanh):
        </p>
        <div className="flex flex-wrap gap-1.5">
          {COMMON_PANTRY_ITEMS.map((item) => {
            const isAlreadyAdded = ingredients.some(
              (ing) => ing.name.toLowerCase() === item.name.toLowerCase()
            );

            return (
              <button
                key={item.name}
                type="button"
                disabled={isAlreadyAdded}
                onClick={() => onAddIngredient(item.name, item.category)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  isAlreadyAdded
                    ? 'bg-stone-100 text-stone-400 cursor-default'
                    : 'bg-[#FAF7F2] text-stone-700 hover:bg-emerald-50 hover:text-emerald-800 border border-[#E8DFD0] hover:border-emerald-300 cursor-pointer'
                }`}
              >
                {isAlreadyAdded ? (
                  <Check className="w-3 h-3 text-emerald-600" />
                ) : (
                  <Plus className="w-3 h-3 text-stone-400" />
                )}
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
