import React, { Component, ErrorInfo, useState } from 'react';

class AppErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean; message: string }> {
  state = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, message: error?.message || 'Unknown application error' };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Math Adventure Kids runtime error:', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="min-h-screen bg-[#f4f8fd] flex items-center justify-center p-6">
        <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-xl text-center">
          <div className="text-6xl mb-4">🧭</div>
          <h1 className="text-2xl font-extrabold text-slate-800">Mini đang khởi động lại</h1>
          <p className="mt-3 text-slate-500">Ứng dụng gặp lỗi khi tải dữ liệu. Vui lòng tải lại trang.</p>
          <details className="mt-5 text-left text-xs text-slate-400">
            <summary className="cursor-pointer">Chi tiết kỹ thuật</summary>
            <pre className="mt-2 whitespace-pre-wrap break-words">{this.state.message}</pre>
          </details>
          <button
            className="mt-6 rounded-2xl bg-slate-900 px-6 py-3 font-bold text-white"
            onClick={() => window.location.reload()}
          >
            Tải lại trang
          </button>
        </div>
      </div>
    );
  }
}

import { GameProvider, useGame } from './context/GameContext';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { MobileNavigation } from './components/common/MobileNavigation';
import { LevelUpModal } from './components/common/LevelUpModal';
import { RewardToast } from './components/common/RewardToast';
import { AuthModal } from './components/common/AuthModal';
import { OnboardingModal } from './components/common/OnboardingModal';

import { HomePage } from './pages/HomePage';
import { AgesPage } from './pages/AgesPage';
import { LearnPage } from './pages/LearnPage';
import { MapPage } from './pages/MapPage';
import { GamesPage } from './pages/GamesPage';
import { ChallengesPage } from './pages/ChallengesPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { TreasurePage } from './pages/TreasurePage';
import { ProfilePage } from './pages/ProfilePage';
import { ParentDashboardPage } from './pages/ParentDashboardPage';
import { TeacherDashboardPage } from './pages/TeacherDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { PricingPage } from './pages/PricingPage';
import { ChildHomePage } from './pages/ChildHomePage';
import { WorldDetailPage } from './pages/WorldDetailPage';
import { InteractiveLessonPage } from './pages/InteractiveLessonPage';

import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResendConfirmationPage } from './pages/ResendConfirmationPage';

const AppContent: React.FC = () => {
  const { activeTab, navigateTo } = useGame();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  const isAuthRoute = ['login', 'register', 'forgot-password', 'resend-confirmation'].includes(activeTab);

  const renderCurrentView = () => {
    switch (activeTab) {
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      case 'forgot-password':
        return <ForgotPasswordPage />;
      case 'resend-confirmation':
        return <ResendConfirmationPage />;
      case 'child/home':
        return <ChildHomePage />;
      case 'home':
        return <ChildHomePage />;
      case 'landing':
        return <HomePage />;
      case 'ages':
        return <AgesPage />;
      case 'learn':
        return <LearnPage />;
      case 'map':
        return <MapPage />;
      case 'games':
        return <GamesPage />;
      case 'challenges':
        return <ChallengesPage />;
      case 'achievements':
        return <AchievementsPage />;
      case 'treasure':
        return <TreasurePage />;
      case 'profile':
        return <ProfilePage />;
      case 'parent':
        return <ParentDashboardPage />;
      case 'teacher':
        return <TeacherDashboardPage />;
      case 'admin':
        return <AdminDashboardPage />;
      case 'pricing':
        return <PricingPage />;
      default:
        if (activeTab.startsWith('world/')) {
          return <WorldDetailPage />;
        }
        if (activeTab.startsWith('lesson/')) {
          return <InteractiveLessonPage />;
        }
        return <ChildHomePage />;
    }
  };

  // If on a dedicated Auth route, render the pristine Auth experience
  if (isAuthRoute) {
    return (
      <div className="min-h-screen bg-[#f4f8fd] text-slate-800 antialiased selection:bg-amber-200 selection:text-amber-900">
        {renderCurrentView()}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#f4f8fd] text-slate-800 antialiased selection:bg-amber-200 selection:text-amber-900">
      {/* Desktop Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Top Header */}
        <Header onOpenAuth={() => setAuthModalOpen(true)} />

        {/* Dynamic Route Content */}
        <main className="flex-1 pb-24 lg:pb-12">
          {renderCurrentView()}
        </main>

        {/* Global Footer */}
        <Footer />
      </div>

      {/* Bottom Navigation for Mobile */}
      <MobileNavigation />

      {/* Floating Modals and Notifications */}
      <LevelUpModal />
      <RewardToast />
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
      <OnboardingModal
        isOpen={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppErrorBoundary>
      <GameProvider>
        <AppContent />
      </GameProvider>
    </AppErrorBoundary>
  );
}
