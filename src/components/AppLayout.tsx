import { Outlet, useLocation } from 'react-router-dom';
import { BottomNav } from './BottomNav';

const HIDE_NAV_ROUTES = ['/onboarding'];

export const AppLayout = () => {
  const location = useLocation();
  const hideNav = HIDE_NAV_ROUTES.some((p) => location.pathname.startsWith(p));

  return (
    <div className="app-shell">
      <main key={location.pathname} className="page-enter flex-1 overflow-y-auto pb-4">
        <Outlet />
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
};
