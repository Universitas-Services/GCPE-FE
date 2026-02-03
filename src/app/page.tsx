import { redirect } from 'next/navigation';

export default function Home() {
  // Redirige al usuario inmediatamente a /login
  redirect('/login');
}
