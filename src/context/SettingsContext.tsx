import React from "react";
import * as SecureStore from "expo-secure-store";
import { initialValuesAthlete } from "@/constants/defaultValues";
import { AthleteType, SchoolDataAthleteType } from "@/types/athlete";
import {
  AppSettings,
  AthleteBirthDateRange,
  SettingsContextType,
} from "@/types/settings";

const STORAGE_KEY = "@efne-settings";

export const defaultAppSettings: AppSettings = {
  organizationName: "Escolinha de Futebol Nova Esperança",
  minAge: 4,
  maxAge: 15,
  defaultCity: "Jequié",
  defaultZipCode: "",
  defaultNeighborhood: "",
  defaultSchool: "",
  defaultSchoolShift: "",
  defaultSchoolYear: "",
  defaultStatus: "matriculado",
  defaultWhatsApp: false,
};

const SettingsContext = React.createContext<SettingsContextType>({
  settings: defaultAppSettings,
  loading: true,
  updateSettings: async () => {},
  resetSettings: async () => {},
  getInitialAthleteValues: () => initialValuesAthlete,
  getAthleteBirthDateRange: () => createBirthDateRange(defaultAppSettings),
});

function coerceAge(value: unknown, fallback: number) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(Math.max(Math.trunc(parsed), 0), 120);
}

function sanitizeSettings(nextSettings: Partial<AppSettings>): AppSettings {
  const source = { ...defaultAppSettings, ...nextSettings };
  const minAge = coerceAge(source.minAge, defaultAppSettings.minAge);
  const maxAge = Math.max(
    minAge,
    coerceAge(source.maxAge, defaultAppSettings.maxAge),
  );

  return {
    organizationName:
      String(source.organizationName || "").trim() ||
      defaultAppSettings.organizationName,
    minAge,
    maxAge,
    defaultCity: String(source.defaultCity || "").trim(),
    defaultZipCode: String(source.defaultZipCode || "").trim(),
    defaultNeighborhood: String(source.defaultNeighborhood || "").trim(),
    defaultSchool: String(source.defaultSchool || "").trim(),
    defaultSchoolShift: String(source.defaultSchoolShift || ""),
    defaultSchoolYear: String(source.defaultSchoolYear || ""),
    defaultStatus: ["matriculado", "ativo", "inativo"].includes(
      source.defaultStatus,
    )
      ? source.defaultStatus
      : defaultAppSettings.defaultStatus,
    defaultWhatsApp: Boolean(source.defaultWhatsApp),
  };
}

function createBirthDateRange(settings: AppSettings): AthleteBirthDateRange {
  const currentYear = new Date().getFullYear();
  const minBirthYear = currentYear - settings.maxAge;
  const maxBirthYear = currentYear - settings.minAge;

  return {
    minBirthYear,
    maxBirthYear,
    fullMinDate: new Date(minBirthYear, 0, 1),
    fullMaxDate: new Date(maxBirthYear, 11, 31),
  };
}

function SettingsProvider({ children }: React.PropsWithChildren) {
  const [settings, setSettings] =
    React.useState<AppSettings>(defaultAppSettings);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;

    async function loadSettings() {
      try {
        const storedSettings = await SecureStore.getItemAsync(STORAGE_KEY);
        if (!mounted || !storedSettings) return;

        setSettings(sanitizeSettings(JSON.parse(storedSettings)));
      } catch (error) {
        console.warn("Erro ao carregar ajustes:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadSettings();

    return () => {
      mounted = false;
    };
  }, []);

  const updateSettings = React.useCallback(
    async (nextSettings: Partial<AppSettings>) => {
      const sanitizedSettings = sanitizeSettings({
        ...settings,
        ...nextSettings,
      });

      setSettings(sanitizedSettings);
      await SecureStore.setItemAsync(
        STORAGE_KEY,
        JSON.stringify(sanitizedSettings),
      );
    },
    [settings],
  );

  const resetSettings = React.useCallback(async () => {
    setSettings(defaultAppSettings);
    await SecureStore.setItemAsync(
      STORAGE_KEY,
      JSON.stringify(defaultAppSettings),
    );
  }, []);

  const getAthleteBirthDateRange = React.useCallback(
    () => createBirthDateRange(settings),
    [settings],
  );

  const getInitialAthleteValues = React.useCallback((): AthleteType => {
    const { fullMinDate } = createBirthDateRange(settings);

    return {
      ...initialValuesAthlete,
      born: fullMinDate,
      status: settings.defaultStatus,
      contact: {
        ...initialValuesAthlete.contact,
        city: settings.defaultCity,
        zipCode: settings.defaultZipCode,
        neighborhood: settings.defaultNeighborhood,
        is_whatsapp: settings.defaultWhatsApp,
      },
      school: {
        ...initialValuesAthlete.school,
        institution: settings.defaultSchool,
        shift: settings.defaultSchoolShift as SchoolDataAthleteType["shift"],
        year: settings.defaultSchoolYear,
      },
    };
  }, [settings]);

  const value = React.useMemo(
    () => ({
      settings,
      loading,
      updateSettings,
      resetSettings,
      getInitialAthleteValues,
      getAthleteBirthDateRange,
    }),
    [
      getAthleteBirthDateRange,
      getInitialAthleteValues,
      loading,
      resetSettings,
      settings,
      updateSettings,
    ],
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

const useSettingsContext = () => React.useContext(SettingsContext);

export { SettingsProvider, useSettingsContext };
