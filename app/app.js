import '../styles/globals.css';
import PrivateRoute from '@/hooks/PrivateRoute';

function MyApp({ Component, pageProps }) {
  return (
    <PrivateRoute>
      <Component {...pageProps} />
    </PrivateRoute>
  );
}

export default MyApp;