import React, { useState, useRef } from 'react';
import { Camera, Upload, RefreshCw, Sparkles, Image as ImageIcon, Video, X, Check } from 'lucide-react';
import { ASSET_IMAGES } from '../constants/images';

interface ImageUploadAreaProps {
  onImageSelected: (base64: string, previewUrl: string) => void;
  isAnalyzing: boolean;
}

export const ImageUploadArea: React.FC<ImageUploadAreaProps> = ({
  onImageSelected,
  isAnalyzing,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Convert File to Base64
  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn tệp hình ảnh hợp lệ (JPG, PNG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setPreview(base64);
      onImageSelected(base64, base64);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Open live Camera
  const startCamera = async () => {
    setCameraError(null);
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError('Không thể mở máy ảnh. Vui lòng cấp quyền truy cập camera trong trình duyệt hoặc tải ảnh lên.');
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  // Capture frame from video stream
  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 1280;
    canvas.height = videoRef.current.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      stopCamera();
      setPreview(dataUrl);
      onImageSelected(dataUrl, dataUrl);
    }
  };

  // Use pre-loaded realistic sample image for immediate zero-friction demo
  const handleUseSampleImage = async () => {
    try {
      const response = await fetch(ASSET_IMAGES.sampleIngredients);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreview(base64);
        onImageSelected(base64, base64);
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      // Direct asset URL fallback
      setPreview(ASSET_IMAGES.sampleIngredients);
      onImageSelected(ASSET_IMAGES.sampleIngredients, ASSET_IMAGES.sampleIngredients);
    }
  };

  return (
    <div className="w-full">
      {/* Upload & Preview Container */}
      <div className="bg-white rounded-3xl border border-[#E8DFD0] shadow-sm overflow-hidden p-6 sm:p-8 transition-all">
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          
          {/* Left Column: Image Area */}
          <div className="w-full lg:w-7/12 flex flex-col justify-between">
            {preview ? (
              <div className="relative rounded-2xl overflow-hidden bg-stone-900 aspect-video flex items-center justify-center group border border-[#E8DFD0]">
                <img
                  src={preview}
                  alt="Ảnh nguyên liệu đã tải lên"
                  className="w-full h-full object-cover"
                />

                {/* Scanning Laser Beam Effect when analyzing */}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-[1px] flex flex-col items-center justify-center pointer-events-none">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#34d399] animate-pulse"></div>
                    <div className="bg-white/95 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-100">
                      <RefreshCw className="w-5 h-5 text-emerald-700 animate-spin" />
                      <div className="text-left">
                        <p className="text-sm font-bold text-stone-900">AI Đang quét nguyên liệu...</p>
                        <p className="text-xs text-stone-500">Nhận diện thực phẩm & gia vị Việt</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Change photo controls */}
                {!isAnalyzing && (
                  <div className="absolute bottom-4 right-4 flex items-center gap-2">
                    <button
                      onClick={() => {
                        setPreview(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="px-4 py-2 text-xs font-semibold bg-stone-900/80 hover:bg-stone-900 text-white rounded-xl backdrop-blur-md transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Đổi ảnh khác
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-8 aspect-video flex flex-col items-center justify-center text-center transition-all ${
                  dragActive
                    ? 'border-emerald-600 bg-emerald-50/60'
                    : 'border-[#D9CFC1] hover:border-emerald-600/60 bg-[#FAF7F2]/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div className="w-16 h-16 rounded-2xl bg-white border border-[#E8DFD0] flex items-center justify-center text-[#0C3426] shadow-sm mb-4">
                  <Camera className="w-8 h-8 text-emerald-800" />
                </div>

                <h3 className="font-serif text-lg font-bold text-stone-900 mb-1">
                  Tải lên hoặc chụp ảnh nguyên liệu
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 max-w-sm mb-5">
                  Kéo thả ảnh hoặc chạm vào đây để chụp lại tủ lạnh, rổ rau, đĩa thịt tươi sống của bạn
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3 relative z-10 pointer-events-auto">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="px-4 py-2 text-xs font-semibold text-stone-800 bg-white border border-[#D9CFC1] hover:border-stone-400 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-emerald-700" />
                    Chọn ảnh từ máy
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      startCamera();
                    }}
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#0C3426] hover:bg-[#134634] rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                  >
                    <Video className="w-3.5 h-3.5 text-emerald-300" />
                    Mở Camera trực tiếp
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Guidance & 1-Click Sample Test */}
          <div className="w-full lg:w-5/12 flex flex-col justify-between py-2">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">
                Thị giác máy tính AI
              </div>
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-3 leading-snug">
                Nhận diện nhanh mọi thực phẩm Việt
              </h2>
              <p className="text-sm text-stone-600 mb-6 leading-relaxed">
                SmartChef AI phân tích thành phần, ước lượng khối lượng và độ tươi của thực phẩm. Bạn có thể tự do chỉnh sửa, thêm bớt gia vị trước khi sáng tạo món ăn.
              </p>

              {/* Tips list */}
              <div className="space-y-3 mb-6 text-xs text-stone-600">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0 mt-0.5 font-bold text-[10px]">
                    1
                  </div>
                  <span>Chụp rõ nét dưới ánh sáng tự nhiên, trải nguyên liệu ra thớt hoặc đĩa.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0 mt-0.5 font-bold text-[10px]">
                    2
                  </div>
                  <span>Nhận diện đồng thời rau củ, hải sản, thịt, các loại rau mùi và ớt tỏi.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0 mt-0.5 font-bold text-[10px]">
                    3
                  </div>
                  <span>Có thể kết hợp với các gia vị có sẵn trong căn bếp gia đình bạn.</span>
                </div>
              </div>
            </div>

            {/* Quick Demo Button with Real Photo */}
            <div className="pt-4 border-t border-[#E8DFD0]">
              <p className="text-xs text-stone-500 mb-2 font-medium">Chưa có ảnh sẵn? Trải nghiệm ngay với ảnh mẫu:</p>
              <button
                type="button"
                onClick={handleUseSampleImage}
                disabled={isAnalyzing}
                className="w-full p-3 rounded-2xl border border-emerald-800/20 bg-emerald-50/50 hover:bg-emerald-50 text-left transition-all flex items-center gap-3.5 group cursor-pointer"
              >
                <img
                  src={ASSET_IMAGES.sampleIngredients}
                  alt="Ảnh mẫu nguyên liệu tươi"
                  className="w-14 h-14 rounded-xl object-cover shrink-0 border border-emerald-200 group-hover:scale-105 transition-transform"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#0C3426] truncate">
                      Thịt ba chỉ, trứng, hành lá, ớt hiểm & gừng
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  </div>
                  <p className="text-[11px] text-stone-500 truncate mt-0.5">
                    Bấm để AI phân tích nguyên liệu mẫu ngay tức thì
                  </p>
                </div>
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Live Camera Viewfinder Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden max-w-xl w-full flex flex-col shadow-2xl">
            <div className="p-4 border-b border-stone-800 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-400" />
                <span className="font-semibold text-sm">Chụp ảnh nguyên liệu</span>
              </div>
              <button
                onClick={stopCamera}
                className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-stone-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative aspect-4/3 bg-black flex items-center justify-center overflow-hidden">
              <video
                ref={videoRef}
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Viewfinder guidelines */}
              <div className="absolute inset-8 border-2 border-white/30 rounded-2xl pointer-events-none flex items-center justify-center">
                <div className="text-center bg-black/40 backdrop-blur-sm px-4 py-1.5 rounded-full text-white/80 text-xs">
                  Hướng camera vào nguyên liệu
                </div>
              </div>

              {cameraError && (
                <div className="absolute inset-0 bg-stone-900/90 p-6 flex flex-col items-center justify-center text-center text-stone-300">
                  <p className="text-sm mb-4 text-rose-300">{cameraError}</p>
                  <button
                    onClick={stopCamera}
                    className="px-4 py-2 bg-stone-800 rounded-xl text-xs font-semibold text-white cursor-pointer"
                  >
                    Đóng
                  </button>
                </div>
              )}
            </div>

            <div className="p-4 bg-stone-950 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={stopCamera}
                className="px-5 py-2.5 rounded-xl text-stone-400 hover:text-white text-xs font-medium cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={capturePhoto}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                Chụp ảnh ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
