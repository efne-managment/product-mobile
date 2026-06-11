import { useAuth } from "@/context/AuthContext";
import AuthNavigation from "./AuthNavigation";
import Loading from "@/screens/default/loading";
import { AthleteParam, AthleteType } from "@/types/athlete";
import { CategoryParam, CategoryType } from "@/types/category";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DetailsAthleteScreen from "@/screens/athetes/DetailsAthleteScreen";
import GlobalRoutes from "./BottomNavigation";
import { FrequencyParam, FrequencyType } from "@/types/frequency";
import { FinancialMovementParam, MonthlyFeePresetParam } from "@/types/financial";

export type RoutesParamList = {
  Dashboard: undefined;

  // Auth Routes
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;

  // Athlete Routes
  ListAthletes: undefined;
  EditAthlete: { athlete: AthleteParam };
  DetailsAthlete: { athlete: AthleteParam; age: number };
  NewAthlete: undefined;

  // Category Routes
  ListCategories: undefined;
  DetailsCategory: { category: CategoryParam };
  EditCategory: { category: CategoryParam };
  NewCategory: undefined;

  // Frequency Routes
  ListFrequencies: undefined;
  DetailsFrequency: { frequency: FrequencyParam };
  NewFrequency: undefined;
  EditFrequency: { frequency: FrequencyParam };

  // Financial Routes
  ListFinancials: undefined;
  DetailsFinancial: { financial: FinancialMovementParam };
  NewFinancial: { monthlyFee?: MonthlyFeePresetParam } | undefined;
  EditFinancial: { financial: FinancialMovementParam };

  // Settings Routes
  Settings: undefined;
};

export type RoutesWithoutParams = {
  [K in keyof RoutesParamList]: RoutesParamList[K] extends undefined
    ? K
    : never;
}[keyof RoutesParamList];

export default function AppNavigation() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return isAuthenticated ? <GlobalRoutes /> : <AuthNavigation />;
}
