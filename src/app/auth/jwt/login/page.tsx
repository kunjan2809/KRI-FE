import { JwtLoginView } from 'src/sections/auth/jwt';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'KRI: Login',
};

export default function LoginPage() {
  return <JwtLoginView />;
}
