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
import { GamificationHubPage } from './features/gamification/pages/GamificationHubPage';
import { PassportPage } from './features/gamification/pages/PassportPage';
import { DuellPage } from './features/gamification/pages/DuellPage';
import { SeasonPage } from './features/gamification/pages/SeasonPage';
import { LootBoxPage } from './features/gamification/pages/LootBoxPage';
import { InventoryPage } from './features/gamification/pages/InventoryPage';
import { QuestsPage } from './features/gamification/pages/QuestsPage';
import { BadgeUnlockModal } from './features/gamification/components/BadgeUnlockModal';
import { useGameEvents } from './features/gamification/hooks/useGameEvents';

const RequireOnboarding = ({ children }: { children: JSX.Element }) => {
  const done = useAppStore((s) => s.profile.onboardingComplete);
  return done ? children : <Navigate to="/onboarding" replace />;
};

const GameLayer = () => {
  useGameEvents();
  return <BadgeUnlockModal />;
};

export default function App() {
  return (
    <BrowserRouter>
      <GameLayer />
      <Routes>
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/quiz" element={<RequireOnboarding><SportMatchQuiz /></RequireOnboarding>} />
        <Route element={<RequireOnboarding><AppLayout /></RequireOnboarding>}>
          <Route path="/gamification" element={<GamificationHubPage />} />
          <Route path="/gamification/passport" element={<PassportPage />} />
          <Route path="/gamification/duels" element={<DuellPage />} />
          <Route path="/gamification/season" element={<SeasonPage />} />
          <Route path="/gamification/lootbox" element={<LootBoxPage />} />
          <Route path="/gamification/inventory" element={<InventoryPage />} />
          <Route path="/gamification/quests" element={<QuestsPage />} />
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
