import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RoutesParamList } from "@/navigation/AppNavigaton";

export function useSafeNavigate() {
  const navigation = useNavigation<NativeStackNavigationProp<RoutesParamList>>();

  function navigateSafe<RouteName extends keyof RoutesParamList>(
    screen: RouteName,
    params: RoutesParamList[RouteName]
  ): void;

  function navigateSafe<RouteName extends keyof RoutesParamList>(
    screen: RouteName
  ): void;

  function navigateSafe<RouteName extends keyof RoutesParamList>(
    screen: RouteName,
    params?: RoutesParamList[RouteName]
  ) {
    navigation.navigate(screen, params as any);
  }

  return navigateSafe;
}
