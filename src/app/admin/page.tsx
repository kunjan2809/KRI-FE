import { OverviewAppView } from 'src/sections/overview/app/view';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { useAuthContext } from 'src/auth/hooks/use-auth-context';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'KRI: App',
};


export default function OverviewAppPage() {
  const router = useRouter();
  const { user, authenticated } = useAuthContext();

  // Determine if user is admin based on user data
  const isAdmin = authenticated && user && (
    user.is_admin === true
  );
  if (!isAdmin) {
    router.push(paths.user.landing);
  } else {
    return <OverviewAppView />;
  }
}