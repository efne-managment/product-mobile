import * as React from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import Octicons from "@expo/vector-icons/Octicons";
import { Button, Checkbox, Input, Layout, Select, Text } from "@/components";
import { useAuth } from "@/context/AuthContext";
import { useThemeContext } from "@/context/ThemeContext";
import {
  defaultAppSettings,
  useSettingsContext,
} from "@/context/SettingsContext";
import { shifts, statusValues, years } from "@/constants/defaultValues";
import { AppSettings } from "@/types/settings";

type SettingsFormState = Omit<AppSettings, "minAge" | "maxAge"> & {
  minAge: string;
  maxAge: string;
};

function toFormState(settings: AppSettings): SettingsFormState {
  return {
    ...settings,
    minAge: String(settings.minAge),
    maxAge: String(settings.maxAge),
  };
}

export default function SettingsScreen() {
  const { toggleTheme, theme, getDefaultColors } = useThemeContext();
  const { colors } = getDefaultColors();
  const { logout } = useAuth();
  const { settings, updateSettings, resetSettings } = useSettingsContext();
  const [form, setForm] = React.useState<SettingsFormState>(
    toFormState(settings),
  );
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    setForm(toFormState(settings));
  }, [settings]);

  const updateField = <Key extends keyof SettingsFormState>(
    field: Key,
    value: SettingsFormState[Key],
  ) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const updateAgeField = (field: "minAge" | "maxAge", value: string) => {
    updateField(field, value.replace(/\D/g, ""));
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      await updateSettings({
        ...form,
        minAge: Number(form.minAge) || defaultAppSettings.minAge,
        maxAge: Number(form.maxAge) || defaultAppSettings.maxAge,
      });
      Alert.alert("Ajustes salvos", "Os padrões do cadastro foram atualizados.");
    } catch (error) {
      console.error("Erro ao salvar ajustes:", error);
      Alert.alert("Erro", "Não foi possível salvar os ajustes.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    Alert.alert(
      "Restaurar padrões",
      "Os dados padrão de novos cadastros voltarão para a configuração inicial.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Restaurar",
          style: "destructive",
          onPress: async () => {
            await resetSettings();
            Alert.alert("Padrões restaurados", "Os ajustes iniciais foram aplicados.");
          },
        },
      ],
    );
  };

  const handleLogout = () => {
    Alert.alert("Sair da conta", "Deseja encerrar a sessão atual?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: logout,
      },
    ]);
  };

  return (
    <Layout style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.hero, { backgroundColor: colors.primary }]}>
            <View style={styles.heroIcon}>
              <Octicons name="gear" size={22} color={colors.primary} />
            </View>
            <View style={styles.heroText}>
              <Text variant="h4" style={styles.heroTitle}>
                Ajustes
              </Text>
              <Text variant="label" style={styles.heroSubtitle}>
                Padrões usados nos próximos cadastros de atletas.
              </Text>
            </View>
          </View>

          <SettingsCard title="Instituição" icon="organization">
            <Input
              label="Nome da escolinha"
              value={form.organizationName}
              onChangeText={(value) => updateField("organizationName", value)}
              autoCapitalize="words"
            />
          </SettingsCard>

          <SettingsCard title="Cadastro do atleta" icon="person">
            <View style={styles.inlineFields}>
              <View style={styles.inlineField}>
                <Input
                  label="Idade mínima"
                  value={form.minAge}
                  onChangeText={(value) => updateAgeField("minAge", value)}
                  keyboardType="number-pad"
                />
              </View>
              <View style={styles.inlineField}>
                <Input
                  label="Idade máxima"
                  value={form.maxAge}
                  onChangeText={(value) => updateAgeField("maxAge", value)}
                  keyboardType="number-pad"
                />
              </View>
            </View>
            <Select
              label="Status inicial"
              value={form.defaultStatus}
              options={statusValues}
              onSelect={(value) =>
                updateField("defaultStatus", value as AppSettings["defaultStatus"])
              }
            />
          </SettingsCard>

          <SettingsCard title="Endereço padrão" icon="home">
            <Input
              label="Cidade"
              value={form.defaultCity}
              onChangeText={(value) => updateField("defaultCity", value)}
              autoCapitalize="words"
            />
            <Input
              label="Bairro"
              value={form.defaultNeighborhood}
              onChangeText={(value) => updateField("defaultNeighborhood", value)}
              autoCapitalize="words"
            />
            <Input
              label="CEP"
              value={form.defaultZipCode}
              onChangeText={(value) => updateField("defaultZipCode", value)}
              keyboardType="number-pad"
              placeholder="00.000-000"
            />
          </SettingsCard>

          <SettingsCard title="Escola padrão" icon="mortar-board">
            <Input
              label="Nome da escola"
              value={form.defaultSchool}
              onChangeText={(value) => updateField("defaultSchool", value)}
              autoCapitalize="words"
            />
            <Select
              label="Turno"
              value={form.defaultSchoolShift}
              options={[{ label: "Sem padrão", value: "" }, ...shifts]}
              onSelect={(value) => updateField("defaultSchoolShift", value)}
            />
            <Select
              label="Ano/Série"
              value={form.defaultSchoolYear}
              options={[{ label: "Sem padrão", value: "" }, ...years]}
              onSelect={(value) => updateField("defaultSchoolYear", value)}
            />
          </SettingsCard>

          <SettingsCard title="Contato" icon="device-mobile">
            <Checkbox
              label="Marcar telefone como WhatsApp por padrão"
              checked={form.defaultWhatsApp}
              onChange={(value) => updateField("defaultWhatsApp", value)}
            />
          </SettingsCard>

          <View style={styles.actionGroup}>
            <Button
              title={saving ? "Salvando..." : "Salvar padrões"}
              onPress={handleSave}
              disabled={saving}
              status={saving ? "basic" : "primary"}
              size="full"
            />
            <View style={styles.actionRow}>
              <Button
                title="Restaurar"
                onPress={handleReset}
                appearance="outline"
                status="warning"
                size="semi"
              />
              <Button
                title={theme === "dark" ? "Modo claro" : "Modo escuro"}
                onPress={toggleTheme}
                appearance="outline"
                status="success"
                size="semi"
              />
            </View>
            <Button
              title="Sair da conta"
              status="danger"
              appearance="ghost"
              size="full"
              onPress={handleLogout}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Layout>
  );
}

function SettingsCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: keyof typeof Octicons.glyphMap;
  children: React.ReactNode;
}) {
  const { getDefaultColors } = useThemeContext();
  const { colors } = getDefaultColors();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.cardIcon, { backgroundColor: colors.primaryLight }]}>
          <Octicons name={icon} size={17} color={colors.primary} />
        </View>
        <Text variant="h5">{title}</Text>
      </View>
      <View style={styles.cardBody}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 36,
    gap: 16,
  },
  hero: {
    minHeight: 132,
    borderRadius: 22,
    padding: 18,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 14,
    overflow: "hidden",
  },
  heroIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  heroText: {
    flex: 1,
    gap: 4,
  },
  heroTitle: {
    color: "#FFFFFF",
  },
  heroSubtitle: {
    color: "#D7EAF8",
  },
  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 14,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  cardIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: {
    gap: 14,
  },
  inlineFields: {
    flexDirection: "row",
    gap: 12,
  },
  inlineField: {
    flex: 1,
  },
  actionGroup: {
    gap: 12,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
});
