import React from 'react';
import { ChefHat, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0C3426] text-stone-300 py-12 border-t border-emerald-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-emerald-900/60">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-800 flex items-center justify-center text-white">
              <ChefHat className="w-4 h-4" />
            </div>
            <span className="font-serif text-xl font-bold text-white tracking-tight">
              SmartChef AI
            </span>
            <span className="text-xs text-emerald-400 font-sans">
              · Trợ lý bếp Việt thông minh
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs text-stone-300">
            <a href="#scan-section" className="hover:text-white transition-colors">
              Quét ảnh
            </a>
            <a href="#ingredients-section" className="hover:text-white transition-colors">
              Nguyên liệu
            </a>
            <a href="#recipes-section" className="hover:text-white transition-colors">
              Công thức
            </a>
            <a href="#tips-section" className="hover:text-white transition-colors">
              Bí quyết bếp
            </a>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>
            © {new Date().getFullYear()} SmartChef AI. Tinh hoa ẩm thực Việt Nam kết hợp trí tuệ nhân tạo.
          </p>
          <p className="flex items-center gap-1.5">
            Dành cho mọi gia đình yêu thích nấu nướng chuẩn vị
          </p>
        </div>
      </div>
    </footer>
  );
};
