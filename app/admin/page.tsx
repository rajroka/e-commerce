// Redirects legacy /admin route to the proper /dashboard
import { redirect } from 'next/navigation';

export default function AdminRedirect() {
  redirect('/dashboard');
}
