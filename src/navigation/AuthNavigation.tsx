import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RoutesParamList } from "./AppNavigaton";
import LoginScreen from "@/screens/auth/login/LoginScreen";
import RegisterScreen from "@/screens/auth/register/RegisterScreen";
import { useAuth } from "@/context/AuthContext";

const Stack = createNativeStackNavigator<RoutesParamList>();

export default function AuthNavigation() {
    const { isFirstAccess } = useAuth();
    
    return (
        <Stack.Navigator initialRouteName={isFirstAccess ? "Register" : "Login"} screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
    );
}