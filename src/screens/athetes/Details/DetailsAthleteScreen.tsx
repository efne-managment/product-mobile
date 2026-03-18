// src/screens/Athletes/DetailsAthlete/index.tsx
import * as React from "react";
import { Alert, Dimensions } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Layout, Text } from "@/components";
import { RoutesParamList } from "@/navigation/AppNavigaton";
import { deserializeAthlete } from "@/utils/serializesParams";
import { useThemeContext } from "@/context/ThemeContext";
import { useCategoriesContext } from "@/context/CategoriesContext";
import { useAthletesContext } from "@/context/AthletesContext";

import type { CategoryType } from "@/types/category";
import ProfileTab from "./Tabs/Profile";
import AthleteHeader from "./Header";
import OverviewTab from "./Tabs/Overview";
import FinanceTab from "./Tabs/Finance";
import AttendanceTab from "./Tabs/Attendance";

type ScreenRouteProp = RouteProp<RoutesParamList, "DetailsAthlete">;
type ScreenNavigationProp = NativeStackNavigationProp<
  RoutesParamList,
  "DetailsAthlete"
>;

const initialLayout = { width: Dimensions.get("window").width };

export default function DetailsAthleteScreen() {
  const navigation = useNavigation<ScreenNavigationProp>();
  const route = useRoute<ScreenRouteProp>();

  const athlete = React.useMemo(
    () => deserializeAthlete(route.params.athlete),
    [route.params.athlete]
  );

  const age = route.params.age;

  const { getDefaultColors } = useThemeContext();
  const { colors } = getDefaultColors();

  const { deleteAthlete } = useAthletesContext();
  const { getOneCategory } = useCategoriesContext();

  const [category, setCategory] = React.useState<CategoryType | undefined>();

  React.useEffect(() => {
    let isMounted = true;
    async function loadCategory() {
      if (!athlete) return;
      const cat = await getOneCategory(athlete.category);
      if (isMounted) setCategory(cat);
    }
    loadCategory();
    return () => {
      isMounted = false;
    };
  }, [athlete, getOneCategory]);

  // Tabs
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "overview", title: "Resumo" },
    { key: "finance", title: "Financeiro" },
    { key: "attendance", title: "Frequência" },
    { key: "profile", title: "Cadastro" },
  ]);

  if (!athlete) {
    return (
      <Layout style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text variant="h5">Nenhum atleta encontrado.</Text>
      </Layout>
    );
  }

  // Você pode calcular KPIs aqui (mock agora, depois integra no contexto/DB):
  const kpis = React.useMemo(() => {
    return {
      overdueCount: 2,          // mensalidades em atraso
      paidThisMonth: true,      // pagou este mês?
      attendanceRate: 0.78,     // 78%
      absences30d: 3,           // faltas (30 dias)
    };
  }, []);

  const handleEdit = () => {
    navigation.replace("EditAthlete", { athlete: route.params.athlete });
  };

  const handleDelete = () => {
    if (athlete.id) {
      deleteAthlete(athlete.id);
      navigation.goBack();
    }
  };

  const renderScene = React.useMemo(
    () =>
      SceneMap({
        overview: () => (
          <OverviewTab athlete={athlete} category={category} age={age} />
        ),
        finance: () => <FinanceTab athleteId={athlete.id} />,
        attendance: () => <AttendanceTab athleteId={athlete.id} />,
        profile: () => (
          <ProfileTab athlete={athlete} category={category} age={age} />
        ),
      }),
    [athlete, category, age]
  );

  return (
    <Layout style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header fixo */}
      <AthleteHeader
        athlete={athlete}
        age={age}
        categoryName={category?.name}
        kpis={kpis}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Tabs */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={(props: any) => (
          <TabBar
            {...props}
            scrollEnabled={false}
            style={{ backgroundColor: colors.background }}
            indicatorStyle={{ backgroundColor: colors.primary }}
            activeColor={colors.primary}
            inactiveColor={colors.grayDark ?? "#777"}
            labelStyle={{ fontSize: 12, fontWeight: "600" }}
          />
        )}
      />
    </Layout>
  );
}
