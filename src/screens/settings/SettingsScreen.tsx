import * as React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RoutesParamList } from "@/navigation/AppNavigaton";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@/context/AuthContext";
import { Button, Layout, Text } from "@/components";
import { useThemeContext } from "@/context/ThemeContext";

type settingsScreenProp = NativeStackNavigationProp<
  RoutesParamList,
  "Settings"
>;

export default function SettingsScreen() {
  const navigation = useNavigation<settingsScreenProp>();

  const { toggleTheme } = useThemeContext();

  const { logout } = useAuth();

  return (
    <Layout
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 18,
      }}
    >
      <Text variant="h2">Configurações</Text>

      <Button
        title="Modo escuro/claro"
        status="basic"
        size="large"
        onPress={() => toggleTheme()}
      />
      <Button
        title="Sair da conta"
        status="danger"
        size="large"
        onPress={() => logout()}
      />
    </Layout>
  );
}
