import { Redirect } from 'expo-router';

export default function ProfileRedirect() {
  // Redirect to the tabbed version
  return <Redirect href="/profile-menu" />;
}
