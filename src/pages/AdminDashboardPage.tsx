import React, { useEffect, useState } from 'react';
import { 
  ShieldAlert, 
  Settings, 
  Database, 
  Users, 
  Activity, 
  Layers, 
  ArrowLeft, 
  CheckCircle2, 
  Sliders, 
  Sparkles,
  Server,
  Zap,
  BarChart3,
  Lock
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../utils/sound';
import { fetchAllUserProfilesFromFirestore } from '../firebase/auth';
import { INITIAL_LESSONS } from '../data/mockData';

export const AdminDashboardPage: React.FC = () => {
  const { setActiveTab, switchRole } = useGame();
  const [xpMultiplier, setXpMultiplier] = useState(1.5);
  const [dailyLessonLimit, setDailyLessonLimit] = useState(10);
  const [safeModeEnabled, setSafeModeEnabled] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [savedSettings, setSavedSettings] = useState(false);
  const [accountCount, setAccountCount] = useState<number | null>(null);
  const [studentCount, setStudentCount] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchAllUserProfilesFromFirestore().then((profiles) => {
      if (!mounted) return;
      setAccountCount(profiles.length);
      setStudentCount(profiles.filter((profile) => profile.role === 'student').length);
    }).catch(() => {
      if (!mounted) return;
      setAccountCount(null);
      setStudentCount(null);
    });
    return () => { mounted = false; };
  }, []);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playLevelUp();
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 3500);
  };

  const handleReturnStudent = () => {
    soundManager.playClick();
    switchRole('student');
    setActiveTab('home');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-rose-500/20 text-rose-300 text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider border border-rose-500/30">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              Bảng Điều Khiển Quản Trị Hệ Thống (Super Admin)
            </div>
            <h1 className="text-display text-2xl sm:text-4xl font-extrabold tracking-tight">
              Trung Tâm Quản Trị Math Adventure Kids ⚙️
            </h1>
            <p className="text-body-sm sm:text-body text-slate-300 max-w-2xl font-medium">
              Giám sát tình trạng máy chủ, quản lý ngân hàng câu hỏi, kiểm soát an toàn dữ liệu và điều chỉnh hệ số phần thưởng Gamification.
            </p>
          </div>

          <button
            onClick={handleReturnStudent}
            className="btn-touch-target px-5 py-3 rounded-2xl font-bold text-sm text-white bg-slate-700/80 hover:bg-slate-700 transition flex items-center gap-2 self-start md:self-auto border border-slate-600"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Chế độ Bé học</span>
          </button>
        </div>
      </div>

      {/* Save Success Notice */}
      {savedSettings && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-800 flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="text-body-sm font-bold">
              Đã cập nhật tham số hệ thống và đồng bộ tức thời tới toàn bộ cụm máy chủ!
            </span>
          </div>
          <span className="text-caption font-bold bg-emerald-200 text-emerald-800 px-2.5 py-1 rounded-full">
            Đã đồng bộ
          </span>
        </div>
      )}

      {/* System Health Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-caption font-bold text-slate-400 uppercase tracking-wider">Tổng tài khoản bé</span>
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-h1 font-extrabold text-slate-800">{accountCount === null ? '—' : accountCount}</div>
          <p className="text-caption font-semibold text-emerald-600 mt-1">
            {studentCount === null ? 'Chưa có dữ liệu tài khoản' : `${studentCount} tài khoản học sinh`}
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-caption font-bold text-slate-400 uppercase tracking-wider">Tổng bài học kích hoạt</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Database className="w-5 h-5" />
            </div>
          </div>
          <div className="text-h1 font-extrabold text-slate-800">{INITIAL_LESSONS.length} bài</div>
          <p className="text-caption font-semibold text-indigo-600 mt-1">
            Nội dung hiện có trong ngân hàng bài học của ứng dụng
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-caption font-bold text-slate-400 uppercase tracking-wider">Độ ổn định máy chủ</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Server className="w-5 h-5" />
            </div>
          </div>
          <div className="text-h1 font-extrabold text-slate-800">—</div>
          <p className="text-caption font-semibold text-emerald-600 mt-1">
            Chưa kết nối hệ thống giám sát máy chủ
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-caption font-bold text-slate-400 uppercase tracking-wider">Chỉ số hài lòng NPS</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="text-h1 font-extrabold text-slate-800">—</div>
          <p className="text-caption font-semibold text-amber-700 mt-1">
            Chưa có dữ liệu khảo sát thực tế
          </p>
        </div>

      </div>

      {/* Configuration & Management Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Gamification & System Config */}
        <div className="lg:col-span-2 bg-white rounded-3xl border-2 border-slate-100 shadow-xs p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-h3 font-black text-slate-900">
                Tham Số Vận Hành Gamification
              </h2>
              <p className="text-body-sm text-slate-500 mt-1">
                Điều chỉnh động lực học tập, quy chuẩn thưởng và bảo vệ sức khỏe màn hình của trẻ em.
              </p>
            </div>
            <Sliders className="w-6 h-6 text-indigo-600" />
          </div>

          <form onSubmit={handleSaveConfig} className="space-y-6">
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-caption font-bold text-slate-700 uppercase tracking-wider">
                  Hệ số nhân điểm XP sự kiện:
                </label>
                <span className="text-body-sm font-extrabold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                  x{xpMultiplier} XP
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="3.0"
                step="0.1"
                value={xpMultiplier}
                onChange={(e) => setXpMultiplier(parseFloat(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <p className="text-caption text-slate-400 mt-1">
                Tăng hệ số XP vào cuối tuần để khuyến khích trẻ ôn tập các bài học nâng cao.
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-caption font-bold text-slate-700 uppercase tracking-wider">
                  Giới hạn số bài tối đa mỗi ngày (Chống mỏi mắt):
                </label>
                <span className="text-body-sm font-extrabold text-sky-600 bg-sky-50 px-3 py-1 rounded-full">
                  {dailyLessonLimit} bài/ngày
                </span>
              </div>
              <input
                type="range"
                min="3"
                max="20"
                step="1"
                value={dailyLessonLimit}
                onChange={(e) => setDailyLessonLimit(parseInt(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer"
              />
              <p className="text-caption text-slate-400 mt-1">
                Tự động nhắc nhở bé nghỉ ngơi và tập thể dục nhẹ khi đạt tới giới hạn an toàn.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-4">
              <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition cursor-pointer">
                <div>
                  <div className="text-body-sm font-bold text-slate-900">
                    Chế độ an toàn tuyệt đối cho trẻ em (Kid-Safe Mode)
                  </div>
                  <div className="text-caption text-slate-500">
                    Tuân thủ nghiêm ngặt COPPA & GDPR-K, không quảng cáo, không chia sẻ dữ liệu thứ ba.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={safeModeEnabled}
                  onChange={(e) => setSafeModeEnabled(e.target.checked)}
                  className="w-5 h-5 accent-emerald-600 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition cursor-pointer">
                <div>
                  <div className="text-body-sm font-bold text-slate-900">
                    Chế độ bảo trì máy chủ (Maintenance Mode)
                  </div>
                  <div className="text-caption text-slate-500">
                    Chỉ cho phép tài khoản quản trị viên truy cập trong khi nâng cấp dữ liệu.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                  className="w-5 h-5 accent-rose-600 cursor-pointer"
                />
              </label>
            </div>

            <button
              type="submit"
              className="btn-touch-target w-full py-3.5 px-6 rounded-2xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/25 transition text-body-sm text-center"
            >
              Lưu Cấu Hình Quản Trị Hệ Thống 💾
            </button>

          </form>
        </div>

        {/* Right Col: Admin Audit Log & Quick Tools */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border-2 border-slate-100 shadow-xs p-6">
            <h3 className="text-h4 font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-sky-600" />
              Nhật Ký Hoạt Động Gần Nhất
            </h3>
            <div className="space-y-3">
              {[
                { text: 'Thêm 12 câu hỏi trắc nghiệm hình học 3D mới', time: '10 phút trước', tag: 'Content' },
                { text: 'Đồng bộ sao lưu cơ sở dữ liệu học tập Cloud', time: '45 phút trước', tag: 'Backup' },
                { text: 'Cập nhật hệ thống âm thanh Web Audio API v2', time: '2 giờ trước', tag: 'Core' },
                { text: 'Phụ huynh xác nhận kích hoạt gói VIP Family', time: '3 giờ trước', tag: 'Billing' },
              ].map((log, i) => (
                <div key={i} className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {log.tag}
                    </span>
                    <span className="text-[11px] text-slate-400 font-semibold">{log.time}</span>
                  </div>
                  <p className="text-caption text-slate-700 font-medium">{log.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Lock className="w-5 h-5 text-amber-700" />
              <h4 className="text-body-sm font-black text-amber-900">Chứng Chỉ Bảo Mật Trẻ Em</h4>
            </div>
            <p className="text-caption text-amber-800 leading-relaxed font-medium">
              Toàn bộ dữ liệu bài giải và thông tin cá nhân được mã hóa SSL/TLS chuẩn ngân hàng. Math Adventure Kids cam kết bảo vệ sự riêng tư của trẻ em Việt Nam.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
