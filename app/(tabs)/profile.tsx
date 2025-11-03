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
      <Pressable
        style={{
          backgroundColor: 'teal',
          padding: 20,
          marginHorizontal: 20,
          borderRadius: 10,
          alignItems: 'center',
        }}
        onPress={() => navigateTo('/home')}
      >
        <Text
          style={{
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          Profile
        </Text>
      </Pressable>
    </View>
  );
}
