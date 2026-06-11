import { AthleteType } from "./athlete";

export type AppSettings = {
  organizationName: string;
  minAge: number;
  maxAge: number;
  defaultCity: string;
  defaultZipCode: string;
  defaultNeighborhood: string;
  defaultSchool: string;
  defaultSchoolShift: string;
  defaultSchoolYear: string;
  defaultStatus: AthleteType["status"];
  defaultWhatsApp: boolean;
};

export type AthleteBirthDateRange = {
  minBirthYear: number;
  maxBirthYear: number;
  fullMinDate: Date;
  fullMaxDate: Date;
};

export type SettingsContextType = {
  settings: AppSettings;
  loading: boolean;
  updateSettings: (nextSettings: Partial<AppSettings>) => Promise<void>;
  resetSettings: () => Promise<void>;
  getInitialAthleteValues: () => AthleteType;
  getAthleteBirthDateRange: () => AthleteBirthDateRange;
};
