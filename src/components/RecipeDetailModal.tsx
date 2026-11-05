import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Clock,
  Flame,
  ChefHat,
  CheckCircle,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Send,
  Printer,
  Share2,
  Check,
  Volume2,
  HelpCircle,
  Utensils,
} from 'lucide-react';
import { Recipe, RecipeStep } from '../types';
import { getRecipeImage, handleImageFallback } from '../constants/images';

interface RecipeDetailModalProps {
  recipe: Recipe | null;
  onClose: () => void;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  recipe,
  onClose,
}) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [checkedIngredients, setCheckedIngredients] = useState<string[]>([]);
  
  // Timer State
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number | null>(null);
  const [timerActive, setTimerActive] = useState(false);
  const [timerStepTitle, setTimerStepTitle] = useState<string>('');
  const timerIntervalRef = useRef<any>(null);

  // Ask Chef AI State
  const [chefQuestion, setChefQuestion] = useState('');
  const [chefAnswer, setChefAnswer] = useState<string | null>(null);
  const [isAskingChef, setIsAskingChef] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isModalImageLoaded, setIsModalImageLoaded] = useState(false);

  // Reset when recipe changes
  useEffect(() => {
    if (recipe) {
      setCompletedSteps([]);
      setCheckedIngredients([]);
      setTimerSecondsLeft(null);
      setTimerActive(false);
      setChefAnswer(null);
      setChefQuestion('');
      setIsModalImageLoaded(false);
    }
  }, [recipe]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (recipe) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [recipe, onClose]);

  // Timer Tick logic
  useEffect(() => {
    if (timerActive && timerSecondsLeft !== null && timerSecondsLeft > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSecondsLeft((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(timerIntervalRef.current);
            setTimerActive(false);
            playTimerSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [timerActive, timerSecondsLeft]);

  // Audio alert using standard Web Audio API (completely self-contained, no external mp3 needed)
  const playTimerSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      console.log('Audio alert fallback');
    }
  };

  const startStepTimer = (minutes: number, title: string) => {
    setTimerSecondsLeft(minutes * 60);
    setTimerStepTitle(title);
    setTimerActive(true);
  };

  const toggleStepCompleted = (stepNum: number) => {
    setCompletedSteps((prev) =>
      prev.includes(stepNum) ? prev.filter((n) => n !== stepNum) : [...prev, stepNum]
    );
  };

  const toggleIngredientChecked = (itemName: string) => {
    setCheckedIngredients((prev) =>
      prev.includes(itemName) ? prev.filter((i) => i !== itemName) : [...prev, itemName]
    );
  };

  // Ask Chef AI handler
  const handleAskChef = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chefQuestion.trim() || !recipe) return;

    setIsAskingChef(true);
    setChefAnswer(null);
    try {
      const res = await fetch('/api/ask-chef', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipeTitle: recipe.title,
          question: chefQuestion,
        }),
      });
      const data = await res.json();
      setChefAnswer(data.answer || 'Đầu bếp khuyên bạn nếm lại và nêm vừa khẩu vị nhé!');
    } catch (err) {
      setChefAnswer('Đầu bếp đang bận một chút, bạn hãy kiểm tra lại kết nối mạng nhé.');
    } finally {
      setIsAskingChef(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleShare = () => {
    if (!recipe) return;
    navigator.clipboard.writeText(
      `🍳 Công thức ${recipe.title} từ SmartChef AI:\n${recipe.shortDescription}\nThời gian: ${recipe.cookingTimeMinutes} phút · Khẩu phần: ${recipe.servings}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!recipe) return null;

  const imageUrl = getRecipeImage(recipe.imageTag, recipe.title, recipe.category);

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#E8DFD0] relative flex flex-col">
        
        {/* Sticky Close & Action Bar */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-[#E8DFD0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              {recipe.category || 'Công thức chuẩn vị'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-medium"
              title="Sao chép tóm tắt công thức"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Đã sao chép' : 'Chia sẻ'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-medium"
              title="In công thức"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">In</span>
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors cursor-pointer"
              title="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Header Split: Photo & Info */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-5 relative rounded-2xl overflow-hidden shadow-lg aspect-4/3 md:aspect-square bg-[#FAF7F2] border border-[#E8DFD0]">
              {/* Skeleton loading animation */}
              {!isModalImageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-r from-stone-100 via-[#F5EFE6] to-stone-100 animate-pulse flex flex-col items-center justify-center text-stone-400 gap-2">
                  <Utensils className="w-8 h-8 text-[#0C3426]/30 animate-bounce" />
                  <span className="text-xs font-medium tracking-wider text-stone-500 uppercase">
                    SmartChef AI
                  </span>
                </div>
              )}
              <img
                src={imageUrl}
                alt={recipe.title}
                loading="eager"
                onLoad={() => setIsModalImageLoaded(true)}
                className={`w-full h-full object-cover transition-all duration-700 ease-out ${
                  isModalImageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  setIsModalImageLoaded(true);
                  handleImageFallback(e, 'dish');
                }}
              />
              <div className="absolute inset-x-0 bottom-0 pt-8 pb-3 px-3 bg-gradient-to-t from-stone-950/85 via-stone-900/40 to-transparent">
                <div className="flex items-center justify-between text-white text-xs">
                  <span className="font-medium text-emerald-300">Khẩu phần: {recipe.servings}</span>
                  <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-sm text-[11px] font-medium text-stone-200">
                    {recipe.estimatedCalories || '~380 kcal'}
                  </span>
                </div>
              </div>
            </div>

            <div className="md:col-span-7 flex flex-col justify-between">
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-3 leading-tight">
                  {recipe.title}
                </h1>
                <p className="text-sm text-stone-600 leading-relaxed mb-5">
                  {recipe.shortDescription}
                </p>

                {recipe.flavorProfile && (
                  <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFD0] mb-5 text-xs text-emerald-800 font-medium">
                    ✨ Phong vị: {recipe.flavorProfile}
                  </div>
                )}
              </div>

              {/* Stats Bar (Unboxed text with typographic separators) */}
              <div className="grid grid-cols-3 gap-3 p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-center">
                <div>
                  <p className="text-[11px] text-stone-500 font-medium">Sơ chế</p>
                  <p className="font-mono text-sm font-bold text-stone-900 mt-0.5">
                    {recipe.prepTimeMinutes || 15}p
                  </p>
                </div>
                <div className="border-x border-stone-200">
                  <p className="text-[11px] text-stone-500 font-medium">Nấu nướng</p>
                  <p className="font-mono text-sm font-bold text-stone-900 mt-0.5">
                    {recipe.cookingTimeMinutes}p
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-stone-500 font-medium">Độ khó</p>
                  <p className="text-sm font-bold text-emerald-800 mt-0.5">
                    {recipe.difficulty}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Timer Strip if active */}
          {timerSecondsLeft !== null && (
            <div className="sticky top-16 z-10 bg-emerald-950 text-white p-4 rounded-2xl shadow-xl flex items-center justify-between border border-emerald-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-800/80 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-emerald-300 animate-pulse" />
                </div>
                <div>
                  <p className="text-xs text-emerald-300 font-medium truncate max-w-xs">
                    Đang bấm giờ: {timerStepTitle}
                  </p>
                  <p className="font-mono text-2xl font-bold tracking-wider">
                    {formatTimer(timerSecondsLeft)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTimerActive(!timerActive)}
                  className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {timerActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{timerActive ? 'Tạm dừng' : 'Tiếp tục'}</span>
                </button>
                <button
                  onClick={() => {
                    setTimerSecondsLeft(null);
                    setTimerActive(false);
                  }}
                  className="p-2 text-stone-400 hover:text-white rounded-xl transition-colors cursor-pointer"
                  title="Tắt hẹn giờ"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Section: Ingredients Checklist */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
                <Utensils className="w-5 h-5 text-emerald-800" />
                Nguyên liệu chuẩn bị
              </h3>
              <span className="text-xs text-stone-500 font-medium">
                Đã chuẩn bị {checkedIngredients.length}/{recipe.ingredientsList?.length || 0}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {recipe.ingredientsList?.map((ing, idx) => {
                const isChecked = checkedIngredients.includes(ing.item);

                return (
                  <div
                    key={idx}
                    onClick={() => toggleIngredientChecked(ing.item)}
                    className={`p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                      isChecked
                        ? 'bg-emerald-50/50 border-emerald-300 line-through text-stone-400'
                        : 'bg-[#FAF7F2] border-[#E8DFD0] hover:border-emerald-500 text-stone-800'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors shrink-0 ${
                          isChecked
                            ? 'bg-emerald-700 text-white'
                            : 'border border-stone-300 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <span className="text-xs sm:text-sm font-semibold truncate">
                        {ing.item}
                      </span>
                    </div>

                    <span className="font-mono text-xs font-bold text-emerald-800 shrink-0 ml-2">
                      {ing.amount}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Pantry Spices Callout */}
            {recipe.pantrySeasonings?.length > 0 && (
              <div className="mt-4 p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 text-xs">
                <p className="font-bold text-amber-900 mb-1">Gia vị nêm nếm cần dùng:</p>
                <p className="text-amber-800 leading-relaxed">
                  {recipe.pantrySeasonings.join(' · ')}
                </p>
              </div>
            )}
          </div>

          {/* Section: Cooking Steps */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-emerald-800" />
                Hướng dẫn nấu từng bước
              </h3>
              <span className="text-xs text-stone-500">
                Chạm vào bước để đánh dấu hoàn thành
              </span>
            </div>

            <div className="space-y-4">
              {recipe.steps?.map((step: RecipeStep) => {
                const isCompleted = completedSteps.includes(step.stepNumber);

                return (
                  <div
                    key={step.stepNumber}
                    className={`p-5 rounded-2xl border transition-all ${
                      isCompleted
                        ? 'bg-emerald-50/40 border-emerald-200 text-stone-400'
                        : 'bg-white border-[#E8DFD0] shadow-sm hover:border-emerald-600/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => toggleStepCompleted(step.stepNumber)}
                          className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs transition-colors shrink-0 cursor-pointer ${
                            isCompleted
                              ? 'bg-emerald-700 text-white'
                              : 'bg-[#FAF7F2] text-stone-700 border border-[#E8DFD0]'
                          }`}
                        >
                          {isCompleted ? <Check className="w-4 h-4" /> : step.stepNumber}
                        </button>
                        <h4
                          onClick={() => toggleStepCompleted(step.stepNumber)}
                          className={`font-semibold text-sm cursor-pointer ${
                            isCompleted ? 'line-through text-stone-500' : 'text-stone-900'
                          }`}
                        >
                          {step.title}
                        </h4>
                      </div>

                      {/* Interactive Step Timer Trigger if step has minutes */}
                      {step.timerMinutes && step.timerMinutes > 0 && (
                        <button
                          type="button"
                          onClick={() => startStepTimer(step.timerMinutes!, step.title)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          Hẹn {step.timerMinutes} phút
                        </button>
                      )}
                    </div>

                    <p
                      onClick={() => toggleStepCompleted(step.stepNumber)}
                      className={`text-xs sm:text-sm leading-relaxed pl-10 cursor-pointer ${
                        isCompleted ? 'text-stone-400' : 'text-stone-700'
                      }`}
                    >
                      {step.instruction}
                    </p>

                    {step.tip && (
                      <div className="mt-3 ml-10 p-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFD0] text-xs text-stone-600 flex items-start gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span><strong>Mẹo canh lửa:</strong> {step.tip}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chef's Secret Callout */}
          {recipe.chefSecret && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0C3426] to-[#134634] text-white shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <ChefHat className="w-5 h-5 text-amber-300" />
                <span className="font-serif text-base font-bold text-amber-200">
                  Bí quyết gia truyền từ Bếp Trưởng SmartChef AI
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
                {recipe.chefSecret}
              </p>
            </div>
          )}

          {/* Serving Suggestion */}
          {recipe.servingSuggestion && (
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD0] flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
                <Utensils className="w-4 h-4 text-emerald-700" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-0.5">
                  Thưởng thức chuẩn vị
                </p>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  {recipe.servingSuggestion}
                </p>
              </div>
            </div>
          )}

          {/* Interactive Live "Hỏi Bếp Trưởng AI" */}
          <div className="pt-6 border-t border-[#E8DFD0]">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <h4 className="font-serif text-lg font-bold text-stone-900">
                Hỏi trực tiếp Bếp Trưởng AI trong lúc nấu
              </h4>
            </div>
            <p className="text-xs text-stone-500 mb-4">
              Lỡ tay nêm mặn? Cần thay thế gia vị? Đặt câu hỏi để nhận lời khuyên ngay tức khắc:
            </p>

            <form onSubmit={handleAskChef} className="flex gap-2">
              <input
                type="text"
                value={chefQuestion}
                onChange={(e) => setChefQuestion(e.target.value)}
                placeholder="Ví dụ: Lỡ nêm mặn quá thì chữa thế nào? Lửa to hay nhỏ..."
                className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-[#FAF7F2] border border-[#D9CFC1] focus:border-emerald-600 focus:bg-white rounded-xl focus:outline-none transition-all placeholder:text-stone-400"
              />
              <button
                type="submit"
                disabled={isAskingChef || !chefQuestion.trim()}
                className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                {isAskingChef ? 'Đang suy nghĩ...' : 'Hỏi Bếp Trưởng'}
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Quick Chef Question Suggestions */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[
                'Lỡ nêm mặn thì chữa sao?',
                'Không có nước dừa thay bằng gì?',
                'Làm sao khử mùi tanh thịt?',
              ].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setChefQuestion(q)}
                  className="text-[11px] px-2.5 py-1 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>

            {chefAnswer && (
              <div className="mt-4 p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 mb-1">
                  <ChefHat className="w-4 h-4 text-emerald-700" />
                  Bếp Trưởng SmartChef AI trả lời:
                </div>
                <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed">
                  {chefAnswer}
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-50 border-t border-[#E8DFD0] flex items-center justify-between text-xs text-stone-500">
          <span>Chúc bạn có một bữa ăn ngon miệng cùng gia đình!</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-semibold cursor-pointer"
          >
            Hoàn tất & Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
