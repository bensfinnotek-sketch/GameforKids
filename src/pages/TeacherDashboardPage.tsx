import React, { useState } from 'react';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  Search, 
  Filter, 
  ArrowLeft, 
  Sparkles,
  Calendar,
  Send,
  Download,
  AlertCircle
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../utils/sound';

interface StudentRosterItem {
  id: string;
  name: string;
  avatar: string;
  age: string;
  lessonsDone: number;
  accuracy: number;
  xp: number;
  streak: number;
  status: 'Xuất sắc' | 'Đạt yêu cầu' | 'Cần rèn luyện thêm';
  lastActive: string;
}

export const TeacherDashboardPage: React.FC = () => {
  const { setActiveTab, switchRole } = useGame();
  const [selectedClass, setSelectedClass] = useState('Lớp 2A - Toán Tư Duy Nâng Cao');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [assignedSuccess, setAssignedSuccess] = useState(false);
  const [assignmentModal, setAssignmentModal] = useState(false);
  const [taskSubject, setTaskSubject] = useState('Phép nhân trong phạm vi 5');
  const [taskDueDate, setTaskDueDate] = useState('2026-10-15');

  const students: StudentRosterItem[] = [
    {
      id: 'st-1',
      name: 'Nguyễn Bảo Nam',
      avatar: '🤠',
      age: '7 tuổi',
      lessonsDone: 28,
      accuracy: 96,
      xp: 2840,
      streak: 12,
      status: 'Xuất sắc',
      lastActive: '15 phút trước'
    },
    {
      id: 'st-2',
      name: 'Trần Ngọc Linh',
      avatar: '👧',
      age: '7 tuổi',
      lessonsDone: 25,
      accuracy: 94,
      xp: 2490,
      streak: 9,
      status: 'Xuất sắc',
      lastActive: 'Hôm nay'
    },
    {
      id: 'st-3',
      name: 'Lê Hoàng Minh Khôi',
      avatar: '👦',
      age: '7 tuổi',
      lessonsDone: 19,
      accuracy: 88,
      xp: 1950,
      streak: 5,
      status: 'Đạt yêu cầu',
      lastActive: 'Hôm qua'
    },
    {
      id: 'st-4',
      name: 'Phạm Quỳnh Anh',
      avatar: '🐱',
      age: '7 tuổi',
      lessonsDone: 22,
      accuracy: 92,
      xp: 2180,
      streak: 7,
      status: 'Xuất sắc',
      lastActive: 'Hôm nay'
    },
    {
      id: 'st-5',
      name: 'Vũ Đức Trí',
      avatar: '🦁',
      age: '8 tuổi',
      lessonsDone: 14,
      accuracy: 74,
      xp: 1420,
      streak: 2,
      status: 'Cần rèn luyện thêm',
      lastActive: '3 ngày trước'
    },
    {
      id: 'st-6',
      name: 'Đặng Mai Phương',
      avatar: '⭐',
      age: '7 tuổi',
      lessonsDone: 21,
      accuracy: 89,
      xp: 2040,
      streak: 6,
      status: 'Đạt yêu cầu',
      lastActive: 'Hôm nay'
    }
  ];

  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || s.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleReturnStudent = () => {
    soundManager.playClick();
    switchRole('student');
    setActiveTab('home');
  };

  const handleAssignTask = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playLevelUp();
    setAssignedSuccess(true);
    setAssignmentModal(false);
    setTimeout(() => setAssignedSuccess(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider">
              <GraduationCap className="w-4 h-4 text-amber-300" />
              Cổng Giáo Viên & Quản Lý Lớp Học
            </div>
            <h1 className="text-display text-2xl sm:text-4xl font-extrabold tracking-tight">
              Quản Lý Lớp Học & Tiến Độ Học Sinh 👩‍🏫
            </h1>
            <p className="text-body-sm sm:text-body text-indigo-100 max-w-2xl font-medium">
              Theo dõi sự tiến bộ, tỷ lệ chính xác tư duy và giao bài tập theo lộ trình cá nhân hóa cho từng học sinh.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                soundManager.playClick();
                setAssignmentModal(true);
              }}
              className="btn-touch-target px-5 py-3 rounded-2xl font-bold text-sm text-indigo-900 bg-amber-300 hover:bg-amber-200 shadow-md transition flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Giao bài tập mới</span>
            </button>

            <button
              onClick={handleReturnStudent}
              className="btn-touch-target px-5 py-3 rounded-2xl font-bold text-sm text-white bg-white/20 hover:bg-white/30 backdrop-blur-md transition flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Chế độ Bé học</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {assignedSuccess && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-800 flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="text-body-sm font-bold">
              Đã giao nhiệm vụ toán thành công tới toàn bộ {students.length} học sinh trong lớp!
            </span>
          </div>
          <span className="text-caption font-bold bg-emerald-200 text-emerald-800 px-2.5 py-1 rounded-full">
            Hoàn tất
          </span>
        </div>
      )}

      {/* Class Selector & Quick Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        <div className="bg-white p-6 rounded-3xl border-2 border-indigo-100 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-caption font-bold text-slate-400 uppercase tracking-wider">Tổng số học sinh</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-h1 font-extrabold text-slate-800">26 em</div>
          <p className="text-caption font-semibold text-emerald-600 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> 100% tài khoản đang hoạt động
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border-2 border-sky-100 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-caption font-bold text-slate-400 uppercase tracking-wider">Tỷ lệ chính xác trung bình</span>
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="text-h1 font-extrabold text-slate-800">88.5%</div>
          <p className="text-caption font-semibold text-sky-600 mt-1">
            Tăng +3.2% so với tháng trước
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border-2 border-emerald-100 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-caption font-bold text-slate-400 uppercase tracking-wider">Bài hoàn thành tuần này</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="text-h1 font-extrabold text-slate-800">142 bài</div>
          <p className="text-caption font-semibold text-emerald-600 mt-1">
            Trung bình 5.4 bài/học sinh
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border-2 border-amber-100 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-caption font-bold text-slate-400 uppercase tracking-wider">Học sinh cần hỗ trợ</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-h1 font-extrabold text-slate-800">2 em</div>
          <p className="text-caption font-semibold text-amber-700 mt-1">
            Chủ đề: Hình học & Phép trừ nhớ
          </p>
        </div>

      </div>

      {/* Roster Table Card */}
      <div className="bg-white rounded-3xl border-2 border-slate-100 shadow-xs p-6 sm:p-8">
        
        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="btn-touch-target px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-body-sm font-bold text-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="Lớp 2A - Toán Tư Duy Nâng Cao">Lớp 2A - Toán Tư Duy Nâng Cao</option>
                <option value="Lớp 1B - Nhập Môn Số Học">Lớp 1B - Nhập Môn Số Học</option>
                <option value="Lớp 3C - Luyện Thi Olympic Math">Lớp 3C - Luyện Thi Olympic Math</option>
              </select>
            </div>

            <div className="inline-flex rounded-2xl bg-slate-100 p-1">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1.5 rounded-xl text-caption font-bold transition ${
                  filterStatus === 'all'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                Tất cả ({students.length})
              </button>
              <button
                onClick={() => setFilterStatus('Xuất sắc')}
                className={`px-3 py-1.5 rounded-xl text-caption font-bold transition ${
                  filterStatus === 'Xuất sắc'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                Xuất sắc
              </button>
              <button
                onClick={() => setFilterStatus('Cần rèn luyện thêm')}
                className={`px-3 py-1.5 rounded-xl text-caption font-bold transition ${
                  filterStatus === 'Cần rèn luyện thêm'
                    ? 'bg-white text-rose-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                Cần rèn luyện
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm kiếm học sinh..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-body-sm font-medium focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              onClick={() => {
                soundManager.playClick();
                alert('Tính năng xuất báo cáo PDF/Excel đã được chuẩn bị sẵn sàng cho giáo viên!');
              }}
              className="btn-touch-target p-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition"
              title="Xuất danh sách Excel"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-caption font-extrabold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 px-3">Học sinh</th>
                <th className="pb-3 px-3">Bài hoàn thành</th>
                <th className="pb-3 px-3">Độ chính xác</th>
                <th className="pb-3 px-3">Điểm XP</th>
                <th className="pb-3 px-3">Chuỗi học</th>
                <th className="pb-3 px-3">Đánh giá</th>
                <th className="pb-3 px-3 text-right">Hoạt động gần nhất</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-body-sm font-medium text-slate-700">
              {filteredStudents.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-xl shadow-xs">
                        {st.avatar}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{st.name}</div>
                        <div className="text-caption text-slate-400">{st.age}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-3 font-bold text-slate-800">
                    {st.lessonsDone} bài
                  </td>
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">{st.accuracy}%</span>
                      <div className="w-16 h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            st.accuracy >= 90
                              ? 'bg-emerald-500'
                              : st.accuracy >= 80
                              ? 'bg-sky-500'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${st.accuracy}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-3 font-bold text-amber-600">
                    ⭐ {st.xp.toLocaleString('vi-VN')} XP
                  </td>
                  <td className="py-4 px-3 font-bold text-orange-500">
                    🔥 {st.streak} ngày
                  </td>
                  <td className="py-4 px-3">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-caption font-bold ${
                        st.status === 'Xuất sắc'
                          ? 'bg-emerald-100 text-emerald-800'
                          : st.status === 'Đạt yêu cầu'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {st.status}
                    </span>
                  </td>
                  <td className="py-4 px-3 text-right text-caption text-slate-400 font-semibold">
                    {st.lastActive}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Assignment Modal */}
      {assignmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-indigo-100">
            <h3 className="text-h3 font-black text-slate-900 mb-2">
              Giao Bài Tập Cho Lớp {selectedClass}
            </h3>
            <p className="text-body-sm text-slate-500 mb-6">
              Các học sinh trong lớp sẽ nhận được thông báo nhiệm vụ trên bản đồ phiêu lưu của mình.
            </p>

            <form onSubmit={handleAssignTask} className="space-y-4">
              <div>
                <label className="block text-caption font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Chủ đề bài học:
                </label>
                <select
                  value={taskSubject}
                  onChange={(e) => setTaskSubject(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 text-body-sm font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Phép nhân trong phạm vi 5">Phép nhân trong phạm vi 5</option>
                  <option value="Nhận biết hình khối 3D trong không gian">Nhận biết hình khối 3D trong không gian</option>
                  <option value="Giải đố Logic phân loại cân thăng bằng">Giải đố Logic phân loại cân thăng bằng</option>
                  <option value="Thử thách Olympic Math: Dãy số quy luật">Thử thách Olympic Math: Dãy số quy luật</option>
                </select>
              </div>

              <div>
                <label className="block text-caption font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Hạn hoàn thành:
                </label>
                <input
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 text-body-sm font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setAssignmentModal(false)}
                  className="flex-1 py-3 px-4 rounded-2xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition text-body-sm"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-6 rounded-2xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/25 transition text-body-sm"
                >
                  Giao bài ngay 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
