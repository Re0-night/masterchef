import React from 'react';
import { ChefHat, Sparkles, Camera } from 'lucide-react';

interface NavbarProps {
  onStartScanning: () => void;
  onNavigateSection: (id: string) => void;
  activeSection?: string;
  hasRecipes: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onStartScanning,
  onNavigateSection,
  hasRecipes,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E8DFD0] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-[#0C3426] whitespace-nowrap shrink-0 group"
        >
          <div className="w-9 h-9 rounded-xl bg-[#0C3426] flex items-center justify-center text-[#FAF7F2] shadow-sm transition-transform group-hover:scale-105">
            <ChefHat className="w-5 h-5" />
          </div>
          <span className="font-serif text-2xl tracking-tight text-[#0C3426]">
            SmartChef <span className="text-emerald-700 font-sans text-sm font-semibold tracking-wider">AI</span>
          </span>
        </a>

        {/* Zone 2: 4 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
          <button
            onClick={() => onNavigateSection('scan-section')}
            className="hover:text-[#0C3426] transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer"
          >
            Quét nguyên liệu
          </button>
          <button
            onClick={() => onNavigateSection('ingredients-section')}
            className="hover:text-[#0C3426] transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer"
          >
            Tủ nguyên liệu
          </button>
          <button
            onClick={() => onNavigateSection('recipes-section')}
            className="hover:text-[#0C3426] transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer flex items-center gap-1.5"
          >
            Công thức gợi ý
            {hasRecipes && (
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            )}
          </button>
          <button
            onClick={() => onNavigateSection('tips-section')}
            className="hover:text-[#0C3426] transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer"
          >
            Bí quyết bếp Việt
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onStartScanning}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-[#0C3426] hover:bg-[#134634] active:bg-[#072218] rounded-xl transition-all shadow-sm hover:shadow flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Camera className="w-4 h-4 text-emerald-300" />
            <span>Chụp & Phân tích ảnh</span>
          </button>
        </div>
      </div>
    </header>
  );
};
