import React from 'react';
import { Camera, Sparkles, ChefHat, ArrowDown, CheckCircle2 } from 'lucide-react';
import { ASSET_IMAGES } from '../constants/images';

interface HeroSectionProps {
  onStartScanning: () => void;
  onExploreRecipes: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartScanning,
  onExploreRecipes,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-14 md:pt-12 md:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Clean Unboxed Kicker */}
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-emerald-800 mb-4">
              <span>Trợ lý ẩm thực thông minh</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span>Công nghệ Gemini Vision</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span>Chuẩn vị gia đình</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-5xl font-bold tracking-tight text-[#0C3426] leading-[1.18] mb-5 text-balance">
              Biến nguyên liệu trong tủ lạnh thành mâm cơm Việt chuẩn vị
            </h1>

            <p className="text-base sm:text-lg text-stone-600 leading-relaxed mb-8 max-w-xl">
              Chỉ cần chụp một bức ảnh nguyên liệu có sẵn, SmartChef AI sẽ nhận diện thực phẩm tức thì và gợi ý 3–5 món ngon kèm hướng dẫn nêm nếm, canh lửa chi tiết từng bước.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 mb-10">
              <button
                onClick={onStartScanning}
                className="px-6 py-3.5 bg-[#0C3426] hover:bg-[#134634] active:bg-[#072218] text-white font-semibold text-sm rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2.5 cursor-pointer"
              >
                <Camera className="w-4 h-4 text-emerald-300" />
                <span>Chụp ảnh nguyên liệu ngay</span>
              </button>

              <button
                onClick={onExploreRecipes}
                className="px-6 py-3.5 bg-white hover:bg-stone-50 border border-[#D9CFC1] hover:border-stone-400 text-stone-800 font-semibold text-sm rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <ChefHat className="w-4 h-4 text-emerald-800" />
                <span>Xem công thức gợi ý</span>
              </button>
            </div>

            {/* Trust markers (Unboxed editorial presentation) */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#E8DFD0]">
              <div>
                <p className="font-mono text-xl sm:text-2xl font-bold text-[#0C3426]">
                  100%
                </p>
                <p className="text-xs text-stone-500 mt-0.5">
                  Nhận diện ảnh thực tế
                </p>
              </div>
              <div className="border-x border-[#E8DFD0] px-4">
                <p className="font-mono text-xl sm:text-2xl font-bold text-[#0C3426]">
                  3–5
                </p>
                <p className="text-xs text-stone-500 mt-0.5">
                  Món ngon đa dạng
                </p>
              </div>
              <div>
                <p className="font-mono text-xl sm:text-2xl font-bold text-[#0C3426]">
                  3 Miền
                </p>
                <p className="text-xs text-stone-500 mt-0.5">
                  Khẩu vị Bắc · Trung · Nam
                </p>
              </div>
            </div>

          </div>

          {/* Right Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#E8DFD0] aspect-4/3 lg:aspect-4/3 bg-stone-100">
              <img
                src={ASSET_IMAGES.heroKitchen}
                alt="Gian bếp Việt hiện đại với rau thơm, ớt hiểm, sả chanh và bát phở bốc khói"
                className="w-full h-full object-cover"
              />

              {/* Contrast Scrim for overlay badge */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>

              {/* Floating feature pill */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-white/50 shadow-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
                    <Sparkles className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-900">
                      Gợi ý mâm cơm theo nguyên liệu
                    </p>
                    <p className="text-[11px] text-stone-500">
                      Tối ưu chi tiêu & chống lãng phí thực phẩm
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-emerald-800">
                    Tức thì
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
