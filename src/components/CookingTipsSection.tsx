import React from 'react';
import { Sparkles, Flame, Droplets, Leaf, ShieldCheck } from 'lucide-react';

export const CookingTipsSection: React.FC = () => {
  const tips = [
    {
      icon: Flame,
      title: 'Mẹo thắng nước màu cánh gián',
      desc: 'Cho 2 muỗng đường và chút dầu ăn vào nồi, đun lửa nhỏ vừa. Khi đường sủi bọt khí li ti chuyển sang màu nâu cánh gián đậm, lập tức tắt bếp cho 2 thìa nước ấm để hãm màu.',
      highlight: 'Giúp thịt kho lên màu đỏ au óng ả mà không bị đắng.',
    },
    {
      icon: Droplets,
      title: 'Nghệ thuật nêm nước mắm',
      desc: 'Với món canh và xào, luôn cho nước mắm sau cùng trước khi tắt bếp để giữ trọn hương thơm đạm cá nguyên chất. Đừng đun nước mắm quá lâu ở nhiệt độ cao.',
      highlight: 'Giữ trọn độ ngọt hậu và hương thơm quyến rũ.',
    },
    {
      icon: Leaf,
      title: 'Khử tanh cá & thịt gia cầm',
      desc: 'Rửa cá hoặc gà qua nước muối loãng pha chút gừng đập dập hoặc giấm/rượu trắng. Khi luộc thịt, cho vào 1 củ hành tím đập dập để nước luộc trong và thơm.',
      highlight: 'Thịt thơm ngọt, không còn mùi hôi đặc trưng.',
    },
    {
      icon: ShieldCheck,
      title: 'Quy tắc "Lửa to áp chảo, Lửa nhỏ thấm vị"',
      desc: 'Món xào cần chảo thật nóng và lửa bốc để rau xanh giòn không ra nước. Món kho và rim cần hạ lửa riu riu đậy nắp để nước sốt sánh keo ngấm sâu vào từng thớ thịt.',
      highlight: 'Chuẩn kỹ thuật chế biến ẩm thực truyền thống.',
    },
  ];

  return (
    <section id="tips-section" className="py-16 border-t border-[#E8DFD0] bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Cẩm nang đầu bếp
          </span>
          <h2 className="font-serif text-3xl font-bold text-stone-900 mt-1 mb-3">
            Bí quyết nêm nếm & canh lửa ẩm thực Việt
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            Những mẹo nhỏ nhưng tạo nên sự khác biệt lớn giữa một món ăn thông thường và một bữa cơm đậm đà chuẩn vị quê hương.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tips.map((tip, idx) => {
            const Icon = tip.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-[#E8DFD0] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-800 mb-4">
                    <Icon className="w-5 h-5 text-emerald-700" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">
                    {tip.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4">
                    {tip.desc}
                  </p>
                </div>
                <div className="pt-3 border-t border-stone-100 text-[11px] font-semibold text-emerald-800">
                  💡 {tip.highlight}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
