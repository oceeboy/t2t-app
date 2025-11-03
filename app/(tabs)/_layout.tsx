import { Ionicons } from '@expo/vector-icons';
import {
  Stack,
  Tabs,
  usePathname,
  useRouter,
  type Href,
  type Router,
} from 'expo-router';
import { useEffect } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

type Route = '/' | '/home' | '/chat' | '/profile';
type Tab = {
  name: string;
  route: Route;
  icon: keyof typeof Ionicons.glyphMap;
  iconOutline: keyof typeof Ionicons.glyphMap;
};

// Animated Tab Bar Container Component
interface TabBarContainerProps {
  tabBarTranslateY: any;
  tabBarOpacity: any;
  isHidden?: boolean;
  children: React.ReactNode;
}

const TabBarContainer = ({
  tabBarTranslateY,
  tabBarOpacity,
  isHidden = false,
  children,
}: TabBarContainerProps) => {
  const animatedContainerStyle = useAnimatedStyle(
    () => ({
      transform: [
        { translateY: tabBarTranslateY.value },
      ],
      opacity: tabBarOpacity.value,
    }),
  );

  return (
    <Animated.View
      style={[
        styles.tabBarContainer,
        animatedContainerStyle,
      ]}
      pointerEvents={isHidden ? 'none' : 'auto'}
      accessibilityElementsHidden={isHidden}
      importantForAccessibility={
        isHidden ? 'no-hide-descendants' : 'auto'
      }
    >
      {children}
    </Animated.View>
  );
};

export default function TabsLayout() {
  const router: Router = useRouter();
  const pathname = usePathname();
  const activeTab = (() => {
    const segments = pathname
      .split('/')
      .filter(Boolean);
    const lastSegment =
      segments[segments.length - 1] || 'home';
    return lastSegment.toLowerCase();
  })();

  const isTabBarHidden = [
    'profile',
    'settings',
  ].includes(activeTab);

  // Reanimated shared values for tab bar entrance/exit
  const tabBarTranslateY = useSharedValue(100);
  const tabBarOpacity = useSharedValue(0);

  // Shared values for each tab
  const tabScales = {
    home: useSharedValue(1),
    chat: useSharedValue(1),
    profile: useSharedValue(1),
  };

  const tabOpacities = {
    home: useSharedValue(0),
    chat: useSharedValue(0),
    profile: useSharedValue(0),
  };

  const tabBackgrounds = {
    home: useSharedValue(0),
    chat: useSharedValue(0),
    profile: useSharedValue(0),
  };

  useEffect(() => {
    if (isTabBarHidden) {
      // Exit animation for tab bar on profile
      tabBarTranslateY.value = withTiming(100, {
        duration: 220,
        easing: Easing.out(Easing.quad),
      });
      tabBarOpacity.value = withTiming(0, {
        duration: 180,
        easing: Easing.out(Easing.quad),
      });
    } else {
      // Entrance animation for tab bar on other tabs
      tabBarTranslateY.value = withSpring(0, {
        damping: 20,
        stiffness: 300,
      });
      tabBarOpacity.value = withTiming(1, {
        duration: 250,
        easing: Easing.out(Easing.quad),
      });
    }
  }, [isTabBarHidden]);

  useEffect(() => {
    // Update animations when active tab changes with staggered timing
    Object.keys(tabScales).forEach(
      (tabName, index) => {
        const isActive = activeTab === tabName;

        // Scale animation with slight delay for smooth transitions
        tabScales[
          tabName as keyof typeof tabScales
        ].value = withDelay(
          index * 50, // Stagger the animations
          withSpring(isActive ? 1.05 : 1, {
            damping: 15,
            stiffness: 400,
            mass: 0.8,
          }),
        );

        // Opacity animation for text/icon
        tabOpacities[
          tabName as keyof typeof tabOpacities
        ].value = withTiming(isActive ? 1 : 0, {
          duration: 250,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        });

        // Background animation with smooth cubic easing
        tabBackgrounds[
          tabName as keyof typeof tabBackgrounds
        ].value = withTiming(isActive ? 1 : 0, {
          duration: 350,
          easing: Easing.bezier(
            0.25,
            0.1,
            0.25,
            1,
          ),
        });
      },
    );
  }, [activeTab]);

  const tabs: Tab[] = [
    {
      name: 'Home',
      route: '/home',
      icon: 'home',
      iconOutline: 'home-outline',
    },
    {
      name: 'Chat',
      route: '/chat',
      icon: 'chatbubble',
      iconOutline: 'chatbubble-outline',
    },
    // {
    //   name: 'Search',
    //   route: '/search',
    //   icon: 'search',
    //   iconOutline: 'search-outline',
    // },
    // {
    //   name: 'Add',
    //   route: '/add',
    //   icon: 'add-circle',
    //   iconOutline: 'add-circle-outline',
    // },
    // {
    //   name: 'Library',
    //   route: '/library',
    //   icon: 'library',
    //   iconOutline: 'library-outline',
    // },
    {
      name: 'Profile',
      route: '/profile',
      icon: 'person-circle',
      iconOutline: 'person-circle-outline',
    },
  ];

  const handleTabPress = (tab: Tab) => {
    if (pathname !== tab.route) {
      router.push(tab.route as Href);
    }
  };

  const renderTab = (tab: Tab) => {
    const isActive =
      activeTab === tab.name.toLowerCase();
    const tabName =
      tab.name.toLowerCase() as keyof typeof tabScales;

    const handlePress = () => {
      // Enhanced press animation with haptic feedback feel
      const currentScale = tabScales[tabName];
      currentScale.value = withSequence(
        withTiming(0.88, {
          duration: 80,
          easing: Easing.out(Easing.quad),
        }),
        withSpring(isActive ? 1.05 : 1, {
          damping: 12,
          stiffness: 500,
          mass: 0.6,
        }),
      );

      // Add subtle bounce to background for active tabs
      if (isActive) {
        tabBackgrounds[tabName].value =
          withSequence(
            withTiming(0.8, { duration: 100 }),
            withSpring(1, {
              damping: 20,
              stiffness: 300,
            }),
          );
      }

      // Call the tab press handler
      runOnJS(handleTabPress)(tab);
    };

    // Animated styles using useAnimatedStyle
    const animatedTabStyle = useAnimatedStyle(
      () => {
        const backgroundColor = interpolateColor(
          tabBackgrounds[tabName].value,
          [0, 1],
          ['transparent', '#D4FF4A'],
        );

        const borderRadius = interpolate(
          tabBackgrounds[tabName].value,
          [0, 1],
          [10, 20],
        );

        // Add subtle shadow animation
        const shadowOpacity = interpolate(
          tabBackgrounds[tabName].value,
          [0, 1],
          [0, 0.15],
        );

        const shadowRadius = interpolate(
          tabBackgrounds[tabName].value,
          [0, 1],
          [0, 8],
        );

        return {
          transform: [
            { scale: tabScales[tabName].value },
          ],
          backgroundColor,
          borderRadius,
          shadowColor: '#D4FF4A',
          shadowOpacity,
          shadowRadius,
          shadowOffset: { width: 0, height: 2 },
          elevation: shadowOpacity * 10, // For Android
        };
      },
    );

    const animatedIconStyle = useAnimatedStyle(
      () => ({
        opacity: tabOpacities[tabName].value,
      }),
    );

    const animatedTextStyle = useAnimatedStyle(
      () => ({
        opacity: tabOpacities[tabName].value,
        transform: [
          {
            translateX: interpolate(
              tabOpacities[tabName].value,
              [0, 1],
              [-15, 0],
            ),
          },
          {
            scale: interpolate(
              tabOpacities[tabName].value,
              [0, 1],
              [0.8, 1],
            ),
          },
        ],
      }),
    );

    const animatedInactiveIconStyle =
      useAnimatedStyle(() => ({
        opacity: interpolate(
          tabOpacities[tabName].value,
          [0, 1],
          [1, 0],
        ),
      }));

    return (
      <Pressable
        key={tab.name}
        onPress={handlePress}
        accessibilityLabel={`Go to ${tab.name}`}
        accessibilityRole="button"
      >
        <Animated.View
          style={[
            styles.tabButton,
            animatedTabStyle,
          ]}
        >
          {isActive ? (
            <View style={styles.activeTabContent}>
              <Animated.View
                style={animatedIconStyle}
              >
                <Ionicons
                  name={tab.icon}
                  size={22}
                  color="#000" // control of icon shown when active
                  style={styles.activeIcon}
                />
              </Animated.View>
              <Animated.Text
                style={[
                  styles.activeTabText,
                  animatedTextStyle,
                ]}
              >
                {tab.name}
              </Animated.Text>
            </View>
          ) : (
            <Animated.View
              style={animatedInactiveIconStyle}
            >
              <Ionicons
                name={tab.iconOutline}
                size={22}
                color="#999"
              />
            </Animated.View>
          )}
        </Animated.View>
      </Pressable>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{ headerShown: false }}
      />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{ title: 'Home' }}
        />

        <Tabs.Screen
          name="chat"
          options={{ title: 'Chat' }}
        />

        <Tabs.Screen
          name="profile"
          options={{ title: 'Profile' }}
        />
      </Tabs>

      {/* Floating Custom Tab Bar */}
      <TabBarContainer
        tabBarTranslateY={tabBarTranslateY}
        tabBarOpacity={tabBarOpacity}
        isHidden={isTabBarHidden}
      >
        <View style={styles.tabBar}>
          {/** Custom Tab Bar  */}
          {tabs.map(renderTab)}
        </View>
      </TabBarContainer>
    </>
  );
}

type Styles = {
  tabBarContainer: ViewStyle;
  tabBar: ViewStyle;
  tabButton: ViewStyle;
  activeTabContent: ViewStyle;
  activeIcon: TextStyle;
  activeTabText: TextStyle;
};

const styles = StyleSheet.create<Styles>({
  tabBarContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#000',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 100,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    minWidth: 50,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
  },
  activeTabContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeIcon: {
    marginRight: 6,
  },
  activeTabText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
});
