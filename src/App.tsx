import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { lazy, Suspense, type JSX } from 'react';
import { useAppStore } from './store/useAppStore';
import { AppLayout } from './components/AppLayout';
import { OnboardingPage } from './pages/OnboardingPage';
import { BadgeUnlockModal } from './features/gamification/components/BadgeUnlockModal';
import { useGameEvents } from './features/gamification/hooks/useGameEvents';

// Route components are code-split so each screen ships as its own chunk and the
// initial load only pays for the shell + the first route. The shell (AppLayout),
// the entry screen (OnboardingPage) and the always-mounted GameLayer stay eager.
const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })));
const DiscoverPage = lazy(() => import('./pages/DiscoverPage').then((m) => ({ default: m.DiscoverPage })));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage').then((m) => ({ default: m.FavoritesPage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then((m) => ({ default: m.ProfilePage })));
const SportDetailPage = lazy(() => import('./pages/SportDetailPage').then((m) => ({ default: m.SportDetailPage })));
const LevelDetailPage = lazy(() => import('./pages/LevelDetailPage').then((m) => ({ default: m.LevelDetailPage })));
const LessonViewerPage = lazy(() => import('./pages/LessonViewerPage').then((m) => ({ default: m.LessonViewerPage })));
const ClubsPage = lazy(() => import('./pages/ClubsPage').then((m) => ({ default: m.ClubsPage })));
const SportMatchQuiz = lazy(() => import('./features/sport-quiz/SportMatchQuiz').then((m) => ({ default: m.SportMatchQuiz })));
const TrainingPlanGenerator = lazy(() => import('./features/training-plan/TrainingPlanGenerator').then((m) => ({ default: m.TrainingPlanGenerator })));
const ClubDetailPage = lazy(() => import('./pages/ClubDetailPage').then((m) => ({ default: m.ClubDetailPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })));
const CommunityHubPage = lazy(() => import('./pages/CommunityHubPage').then((m) => ({ default: m.CommunityHubPage })));
const FeedPage = lazy(() => import('./pages/community/FeedPage').then((m) => ({ default: m.FeedPage })));
const ChallengesPage = lazy(() => import('./pages/community/ChallengesPage').then((m) => ({ default: m.ChallengesPage })));
const BuddyFinderPage = lazy(() => import('./pages/community/BuddyFinderPage').then((m) => ({ default: m.BuddyFinderPage })));
const MentorsPage = lazy(() => import('./pages/community/MentorsPage').then((m) => ({ default: m.MentorsPage })));
const LiveSessionsPage = lazy(() => import('./pages/community/LiveSessionsPage').then((m) => ({ default: m.LiveSessionsPage })));
const SportMapPage = lazy(() => import('./pages/community/SportMapPage').then((m) => ({ default: m.SportMapPage })));
const ClubCommunityPage = lazy(() => import('./pages/community/ClubCommunityPage').then((m) => ({ default: m.ClubCommunityPage })));
const GamificationHubPage = lazy(() => import('./features/gamification/pages/GamificationHubPage').then((m) => ({ default: m.GamificationHubPage })));
const PassportPage = lazy(() => import('./features/gamification/pages/PassportPage').then((m) => ({ default: m.PassportPage })));
const DuellPage = lazy(() => import('./features/gamification/pages/DuellPage').then((m) => ({ default: m.DuellPage })));
const SeasonPage = lazy(() => import('./features/gamification/pages/SeasonPage').then((m) => ({ default: m.SeasonPage })));
const LootBoxPage = lazy(() => import('./features/gamification/pages/LootBoxPage').then((m) => ({ default: m.LootBoxPage })));
const InventoryPage = lazy(() => import('./features/gamification/pages/InventoryPage').then((m) => ({ default: m.InventoryPage })));
const QuestsPage = lazy(() => import('./features/gamification/pages/QuestsPage').then((m) => ({ default: m.QuestsPage })));

const RequireOnboarding = ({ children }: { children: JSX.Element }) => {
  const done = useAppStore((s) => s.profile.onboardingComplete);
  return done ? children : <Navigate to="/onboarding" replace />;
};

const GameLayer = () => {
  useGameEvents();
  return <BadgeUnlockModal />;
};

const RouteFallback = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-ink-900 dark:border-ink-700 dark:border-t-white" />
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <GameLayer />
      <Suspense fallback={<RouteFallback />}>
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
      </Suspense>
    </BrowserRouter>
  );
}
