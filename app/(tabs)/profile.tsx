import {
  useRouter,
  type Href,
  type Router,
} from 'expo-router';
import { Text, View } from 'react-native';

export default function ProfileScreen() {
  const router: Router = useRouter();
  function navigateTo(route: Href) {
    router.replace(route);
  }
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text>Profile</Text>
    </View>
  );
}
