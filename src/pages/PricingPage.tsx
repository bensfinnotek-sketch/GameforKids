import React, { useState } from 'react';
import { 
  Sparkles, 
  Check, 
  ShieldCheck, 
  Star, 
  Crown, 
  Flame, 
  Gift, 
  HelpCircle, 
  Zap, 
  ArrowRight, 
  Clock, 
  Heart,
  QrCode,
  X,
  CheckCircle2
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../utils/sound';

interface PricingPlan {
  id: string;
  name: string;
  badge: string;
  price: string;
  period: string;
  originalPrice?: string;
  popular?: boolean;
  highlightColor: string;
  description: string;
  features: string[];
  ctaText: string;
}

export const PricingPage: React.FC = () => {
  const { setActiveTab } = useGame();
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'yearly' | 'monthly'>('yearly');

  const plans: PricingPlan[] = [
    {
      id: 'free',
      name: 'Gói Trải Nghiệm',
      badge: 'Bắt đầu miễn phí',
      price: '0 đ',
      period: 'mãi mãi',
      highlightColor: 'border-slate-200 bg-white',
      description: 'Dành cho các bé mới làm quen với thế giới Toán tư duy.',
      features: [
        'Truy cập 15 bài học căn bản đầu tiên',
        '3 mini game rèn phản xạ',
        'Tích lũy XP và lên cấp cơ bản',
        'Báo cáo tuần cơ bản cho phụ huynh',
        'Có giới hạn số câu hỏi mỗi ngày'
      ],
      ctaText: 'Đang Sử Dụng'
    },
    {
      id: 'vip-year',
      name: 'Gói Thám Hiểm VIP',
      badge: 'Được 85% Phụ Huynh Chọn',
      popular: true,
      price: billingCycle === 'yearly' ? '799.000 đ' : '99.000 đ',
      period: billingCycle === 'yearly' ? '/năm (chỉ 66k/tháng)' : '/tháng',
      originalPrice: billingCycle === 'yearly' ? '1.599.000 đ' : '150.000 đ',
      highlightColor: 'border-amber-400 bg-gradient-to-b from-amber-50/60 to-white ring-2 ring-amber-400 shadow-xl',
      description: 'Lộ trình phát triển toàn diện tư duy logic, hình học & số học cho 1 bé.',
      features: [
        'Mở khóa toàn bộ 450+ bài học & 4 thế giới phiêu lưu',
        'Luyện thi Olympic Math & Toán tiếng Anh song ngữ',
        'Toàn bộ kho báu, avatar, skin & huy hiệu độc quyền',
        'Không giới hạn số lượt học & không quảng cáo',
        'Báo cáo phân tích chuyên sâu AI gợi ý điểm cần cải thiện',
        'Tải phiếu bài tập in PDF về làm tại nhà',
        'Hỗ trợ giải đáp 1-1 cùng trợ giảng sư phạm'
      ],
      ctaText: 'Đăng Ký Gói VIP Ngay 👑'
    },
    {
      id: 'family-lifetime',
      name: 'Gói Family Trọn Đời',
      badge: 'Tiết kiệm nhất cho gia đình',
      price: '1.490.000 đ',
      period: 'trọn đời (cho 3 bé)',
      originalPrice: '2.990.000 đ',
      highlightColor: 'border-sky-300 bg-gradient-to-b from-sky-50/60 to-white shadow-lg',
      description: 'Khoản đầu tư thông minh nhất cho cả gia đình cùng học Toán vui.',
      features: [
        'Mở khóa vĩnh viễn cho 3 tài khoản bé trong gia đình',
        'Tự động cập nhật toàn bộ bài học & thế giới mới trọn đời',
        'Chế độ thi đấu vui nhộn giữa các anh chị em',
        'Tất cả quyền lợi của gói VIP Thám Hiểm',
        'Bảo hành hỗ trợ tài khoản trọn đời 24/7'
      ],
      ctaText: 'Sở Hữu Trọn Đời 🚀'
    }
  ];

  const handleSelectPlan = (plan: PricingPlan) => {
    soundManager.playClick();
    if (plan.id === 'free') {
      setActiveTab('learn');
      return;
    }
    setSelectedPlan(plan);
  };

  const handleConfirmPayment = () => {
    soundManager.playFanfare();
    setPaymentSuccess(true);
    setTimeout(() => {
      setPaymentSuccess(false);
      setSelectedPlan(null);
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
      
      {/* Title & Slogan Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-caption font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4 border border-amber-300">
          <Crown className="w-4 h-4 text-amber-600" />
          Đầu Tư Thông Minh Cho Tương Lai Của Con
        </div>
        <h1 className="text-display text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Chọn Gói Học Toán Tư Duy Phù Hợp Cho Bé 🌟
        </h1>
        <p className="text-body sm:text-body-lg text-slate-600 mt-4 leading-relaxed font-medium">
          Biến mỗi bài Toán thành niềm say mê bất tận. Đảm bảo tiến bộ rõ rệt chỉ sau 3 tuần cùng phương pháp Gamification độc quyền!
        </p>

        {/* Billing cycle switcher */}
        <div className="mt-8 inline-flex items-center bg-slate-200/80 p-1.5 rounded-full border border-slate-300 shadow-inner">
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`btn-touch-target px-5 py-2 rounded-full text-caption font-bold transition flex items-center gap-1.5 ${
              billingCycle === 'yearly'
                ? 'bg-white text-sky-700 shadow-md scale-105'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <span>Thanh toán theo Năm</span>
            <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
              -50%
            </span>
          </button>
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`btn-touch-target px-5 py-2 rounded-full text-caption font-bold transition ${
              billingCycle === 'monthly'
                ? 'bg-white text-sky-700 shadow-md scale-105'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Thanh toán theo Tháng
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-16">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-3xl p-6 sm:p-8 border-2 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl ${
              plan.highlightColor
            } ${plan.popular ? 'lg:-translate-y-4' : ''}`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-caption uppercase tracking-wider py-1.5 px-4 rounded-full shadow-md flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5" />
                {plan.badge}
              </div>
            )}

            <div>
              {!plan.popular && (
                <div className="inline-block text-caption font-bold text-slate-500 uppercase tracking-wider mb-2">
                  {plan.badge}
                </div>
              )}

              <h3 className="text-h2 font-black text-slate-900 mt-2">
                {plan.name}
              </h3>
              <p className="text-body-sm text-slate-500 mt-2 min-h-[44px]">
                {plan.description}
              </p>

              <div className="my-6 pb-6 border-b border-slate-100">
                <div className="flex items-baseline gap-2">
                  <span className="text-h1 font-black text-slate-900">
                    {plan.price}
                  </span>
                  <span className="text-caption font-bold text-slate-400">
                    {plan.period}
                  </span>
                </div>
                {plan.originalPrice && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-caption line-through text-slate-400 font-bold">
                      {plan.originalPrice}
                    </span>
                    <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                      Tiết kiệm 50%
                    </span>
                  </div>
                )}
              </div>

              {/* Feature items */}
              <div className="space-y-3 mb-8">
                <div className="text-caption font-extrabold text-slate-700 uppercase tracking-wider">
                  Quyền lợi bao gồm:
                </div>
                {plan.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span className="text-body-sm font-medium text-slate-700 leading-snug">
                      {feat}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleSelectPlan(plan)}
              disabled={plan.id === 'free'}
              className={`btn-touch-target w-full py-4 px-6 rounded-2xl font-bold transition text-body-sm flex items-center justify-center gap-2 shadow-md ${
                plan.popular
                  ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-amber-500/30'
                  : plan.id === 'free'
                  ? 'bg-slate-100 text-slate-500 cursor-default'
                  : 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-600/25'
              }`}
            >
              <span>{plan.ctaText}</span>
              {plan.id !== 'free' && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        ))}
      </div>

      {/* 100% Money Back Guarantee Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 mb-16">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl flex-shrink-0">
            🛡️
          </div>
          <div>
            <h4 className="text-h3 font-black">Cam Kết Hoàn Tiền 100% Trong 7 Ngày</h4>
            <p className="text-body-sm text-emerald-100 mt-1 max-w-xl font-medium">
              Nếu con bạn không yêu thích việc học Toán hoặc bạn chưa hoàn toàn hài lòng, Math Adventure Kids xin hoàn lại 100% học phí không cần lý do.
            </p>
          </div>
        </div>
        <div className="flex-shrink-0 text-center sm:text-right">
          <span className="inline-block bg-white text-emerald-900 font-extrabold text-caption px-4 py-2 rounded-2xl uppercase tracking-wider">
            An tâm trải nghiệm 100%
          </span>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto">
        <h3 className="text-h2 font-black text-center text-slate-900 mb-8">
          Câu Hỏi Thường Gặp Của Phụ Huynh 💬
        </h3>
        <div className="space-y-4">
          {[
            {
              q: 'Bé mấy tuổi có thể bắt đầu học trên Math Adventure Kids?',
              a: 'Chương trình được thiết kế chuyên biệt cho 3 nhóm tuổi: 4-5 tuổi (làm quen trực quan), 6-8 tuổi (toán tư duy tiểu học) và 9-11 tuổi (logic nâng cao & Olympic Math).'
            },
            {
              q: 'Một tài khoản có thể đăng nhập trên nhiều thiết bị không?',
              a: 'Có! Bé có thể học liền mạch trên máy tính bàn, laptop, iPad, máy tính bảng hoặc điện thoại thông minh của phụ huynh.'
            },
            {
              q: 'Phương thức thanh toán nào được hỗ trợ?',
              a: 'Hệ thống hỗ trợ quét mã QR chuyển khoản ngân hàng 24/7 (VietQR), ví điện tử MoMo, ZaloPay, VNPAY và thẻ thanh toán quốc tế Visa/MasterCard an toàn tuyệt đối.'
            },
            {
              q: 'Làm thế nào để phụ huynh theo dõi tiến độ của con?',
              a: 'Phụ huynh có khu vực Dashboard riêng có mã bảo vệ, hiển thị thời gian học mỗi ngày, độ chính xác và gợi ý chuyên sâu để ba mẹ đồng hành cùng con.'
            }
          ].map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
              <h4 className="text-body font-bold text-slate-900 mb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-sky-500 flex-shrink-0" />
                {faq.q}
              </h4>
              <p className="text-body-sm text-slate-600 pl-6 leading-relaxed font-medium">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Checkout Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-amber-200">
            <button
              onClick={() => setSelectedPlan(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {paymentSuccess ? (
              <div className="text-center py-6 animate-in zoom-in-95">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 text-3xl">
                  🎉
                </div>
                <h3 className="text-h3 font-black text-slate-900 mb-2">
                  Kích Hoạt Gói Học Thành Công!
                </h3>
                <p className="text-body-sm text-slate-600 mb-6 font-medium">
                  Chào mừng bé đến với phiên bản VIP của Math Adventure Kids. Toàn bộ 450+ bài học và kho báu đã được mở khóa!
                </p>
                <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 font-bold px-4 py-2 rounded-2xl text-caption">
                  <CheckCircle2 className="w-4 h-4" />
                  Đã gửi hóa đơn điện tử về email phụ huynh
                </div>
              </div>
            ) : (
              <div>
                <div className="text-center mb-6">
                  <span className="text-caption font-black text-amber-700 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-wider">
                    Xác nhận đăng ký
                  </span>
                  <h3 className="text-h3 font-black text-slate-900 mt-2">
                    {selectedPlan.name}
                  </h3>
                  <div className="text-h2 font-black text-amber-600 mt-1">
                    {selectedPlan.price}
                  </div>
                </div>

                {/* Mock VietQR box */}
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center mb-6">
                  <div className="w-36 h-36 bg-white border border-slate-200 rounded-xl mx-auto flex flex-col items-center justify-center p-2 shadow-xs mb-3">
                    <QrCode className="w-24 h-24 text-slate-800" />
                    <span className="text-[10px] font-extrabold text-slate-500">VietQR 24/7</span>
                  </div>
                  <p className="text-caption font-bold text-slate-600">
                    Mở app Ngân hàng hoặc MoMo quét mã QR thanh toán nhanh
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Nội dung: MAK {Math.floor(100000 + Math.random() * 900000)}
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleConfirmPayment}
                    className="btn-touch-target w-full py-4 px-6 rounded-2xl font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/25 transition text-body-sm text-center flex items-center justify-center gap-2"
                  >
                    <span>Mô Phỏng Thanh Toán Thành Công</span>
                    <Sparkles className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setSelectedPlan(null)}
                    className="w-full py-2.5 text-center text-caption font-bold text-slate-400 hover:text-slate-600 transition"
                  >
                    Để sau
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
