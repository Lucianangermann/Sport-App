import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import type { JSX } from 'react';
import { useAppStore } from './store/useAppStore';
import { AppLayout } from './components/AppLayout';
import { HomePage } from './pages/HomePage';
import { DiscoverPage } from './pages/DiscoverPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { ProfilePage } from './pages/ProfilePage';
import { SportDetailPage } from './pages/SportDetailPage';
import { LevelDetailPage } from './pages/LevelDetailPage';
import { LessonViewerPage } from './pages/LessonViewerPage';
import { ClubsPage } from './pages/ClubsPage';
import { SportMatchQuiz } from './features/sport-quiz/SportMatchQuiz';
import { TrainingPlanGenerator } from './features/training-plan/TrainingPlanGenerator';
import { ClubDetailPage } from './pages/ClubDetailPage';
import { ContactPage } from './pages/ContactPage';
import { OnboardingPage } from './pages/OnboardingPage';

const RequireOnboarding = ({ children }: { children: JSX.Element }) => {
  const done = useAppStore((s) => s.profile.onboardingComplete);
  return done ? children : <Navigate to="/onboarding" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/quiz" element={<RequireOnboarding><SportMatchQuiz /></RequireOnboarding>} />
        <Route element={<RequireOnboarding><AppLayout /></RequireOnboarding>}>
          <Route path="/" element={<HomePage />} />
          <Route path="/sport/:id/plan" element={<TrainingPlanGenerator />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/sport/:id" element={<SportDetailPage />} />
          <Route path="/sport/:id/:level" element={<LevelDetailPage />} />
          <Route path="/sport/:id/:level/:moduleId" element={<LessonViewerPage />} />
          <Route path="/sport/:id/clubs" element={<ClubsPage />} />
          <Route path="/clubs" element={<ClubsPage />} />
          <Route path="/club/:id" element={<ClubDetailPage />} />
          <Route path="/club/:id/contact" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
