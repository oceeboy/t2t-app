import {
  useRouter,
  type Href,
  type Router,
} from 'expo-router';
import {
  Pressable,
  Text,
  View,
} from 'react-native';

export default function Index() {
  const router: Router = useRouter();
  function navigateTo(route: Href) {
    router.replace(route);
  }
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        // alignItems: 'center',
      }}
    >
      <Pressable
        onPress={() => navigateTo('/home')}
        style={{
          backgroundColor: 'teal',
          padding: 20,
          marginHorizontal: 20,
          borderRadius: 10,
          alignItems: 'center',
        }}
      >
        <Text
          style={{ color: 'white', fontSize: 20 }}
        >
          Go To home
        </Text>
      </Pressable>
    </View>
  );
}
