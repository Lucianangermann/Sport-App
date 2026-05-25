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
import { CommunityHubPage } from './pages/CommunityHubPage';
import { FeedPage } from './pages/community/FeedPage';
import { ChallengesPage } from './pages/community/ChallengesPage';
import { BuddyFinderPage } from './pages/community/BuddyFinderPage';
import { MentorsPage } from './pages/community/MentorsPage';
import { LiveSessionsPage } from './pages/community/LiveSessionsPage';
import { SportMapPage } from './pages/community/SportMapPage';
import { ClubCommunityPage } from './pages/community/ClubCommunityPage';

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
          <Route path="/club/:id/community" element={<ClubCommunityPage />} />
          <Route path="/community" element={<CommunityHubPage />} />
          <Route path="/community/feed" element={<FeedPage />} />
          <Route path="/community/challenges" element={<ChallengesPage />} />
          <Route path="/community/buddies" element={<BuddyFinderPage />} />
          <Route path="/community/mentors" element={<MentorsPage />} />
          <Route path="/community/live" element={<LiveSessionsPage />} />
          <Route path="/community/map" element={<SportMapPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
