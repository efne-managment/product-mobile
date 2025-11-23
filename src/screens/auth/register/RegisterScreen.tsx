import { Button, Layout, Text } from "@/components";
import { RoutesParamList } from "@/navigation/AppNavigaton";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type registerParamsList = NativeStackNavigationProp<RoutesParamList, "Register">;

export default function RegisterScreen() {
    const navigation = useNavigation<registerParamsList>();
    return (
        <Layout style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text variant="h3">Register Screen</Text>
            <Button title="Ir para Login"  onPress={() => navigation.navigate('Login')} />
        </Layout>
    );
}