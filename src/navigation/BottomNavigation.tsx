// NAVIGATORS
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Octicons from '@expo/vector-icons/Octicons';
import { useThemeContext } from "@/context/ThemeContext";


// SCREENS
import HomeScreen from "@/screens/athetes/AthletesScreen";
import DetailsAthleteScreen from "@/screens/athetes/DetailsAthleteScreen";
import ListAthletesScreen from "@/screens/athetes/AthletesScreen";
import NewAthleteScreen from "@/screens/athetes/NewAthleteScreen";
import ListCategoriesScreen from "@/screens/categories/CategorieesScreen";
import DetailsCategoryScreen from "@/screens/categories/DetailsCategoryScreen";
import NewCategoryScreen from "@/screens/categories/NewCategoryScreen";
import ListFinancialsScreen from "@/screens/financial/FinancialsScreen";
import DetailsFinancialScreen from "@/screens/financial/DetailsFinancialScreen";
import NewFinancialScreen from "@/screens/financial/NewFinancialScreen";
import EditFinancialScreen from "@/screens/financial/EditFinancialScreen";
import ListFrequenciesScreen from "@/screens/frequencies/FrequenciesScreen";
import DetailsFrequencyScreen from "@/screens/frequencies/DetailsFrequencyScreen";
import NewFrequencyScreen from "@/screens/frequencies/NewFrequencyScreen";
import SettingsScreen from "@/screens/settings/SettingsScreen";
import { Text } from "@/components";
import EditCategoryScreen from "@/screens/categories/EditCategoryScreen";
import EditAthleteScreen from "@/screens/athetes/EditAthleteScreen";
import EditFrequencyScreen from "@/screens/frequencies/EditFrequencyScreen";
import DashboardScreen from "@/screens/dashboard/DashboardScreen";

const TabIcon = (props: any) => <Octicons {...props} name={props.name} />;
const TabTitle = (props: any) => <Text variant="label" style={{ color: props.color, fontSize: 11, fontWeight: "600" }}>{props.title}</Text>;

const Tab = createBottomTabNavigator();

function Tabs() {
  const { getDefaultColors } = useThemeContext();
  const { colors } = getDefaultColors();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          height: 76,
          paddingTop: 8,
          paddingBottom: 10,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          backgroundColor: colors.card,
          elevation: 8,
        },
        tabBarItemStyle: {
          borderRadius: 14,
          marginHorizontal: 2,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = 'graph';
          } else if (route.name === 'Athletes') {
            iconName = 'people';
          } else if (route.name === 'Categories') {
            iconName = 'repo';
          } else if (route.name === 'Financial') {
            iconName = 'credit-card';
          } else if (route.name === 'Frequencies') {
            iconName = 'checklist';
          } else if (route.name === 'Settings') {
            iconName = 'gear';
          }

          return (
            <TabIcon
              name={iconName}
              color={focused ? colors.primary : colors.mutedText}
              size={21}
            />
          );
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedText,
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: ({ color }) =>
            <TabTitle title="Início" color={color} />
        }}
      />
      <Tab.Screen
        name="Athletes"
         component={ListAthletesScreen} options={{ headerShown: true, headerTitle: 'Atletas', headerTitleAlign: 'center', 
          tabBarLabel: ({ color }) =>
            <TabTitle title="Atletas" color={color} />
        }}
      />
      <Tab.Screen
        name="Categories"
        component={ListCategoriesScreen}
        options={{
          headerShown: true, headerTitle: 'Categorias', headerTitleAlign: 'center',
          tabBarLabel: ({ color }) =>
            <TabTitle title="Categorias" color={color} />
        }}
      />
      <Tab.Screen
        name="Financial"
        component={ListFinancialsScreen}
        options={{
          headerShown: true, headerTitle: 'Financeiro', headerTitleAlign: 'center',
          tabBarLabel: ({ color }) =>
            <TabTitle title="Financeiro" color={color} />
        }}
      />
      <Tab.Screen
        name="Frequencies"
        component={ListFrequenciesScreen}
        options={{
          headerShown: true, headerTitle: 'Frequências', headerTitleAlign: 'center',
          tabBarLabel: ({ color }) =>
            <TabTitle title="Frequências" color={color} />
        }}
      /> 
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: ({ color }) =>
            <TabTitle title="Ajustes" color={color} />
        }}
      />
    </Tab.Navigator>
  )
}


const RootStack = createNativeStackNavigator();

function GlobalRoutes() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="Tabs" component={Tabs} />
      {/* Atletas */}
      <RootStack.Screen
        name="NewAthlete"
        component={NewAthleteScreen}
        options={{ headerShown: true, headerTitle: 'Novo atleta', headerTitleAlign: 'center' }} />

      <RootStack.Screen
        name="DetailsAthlete"
        component={DetailsAthleteScreen}
        options={{ headerShown: true, headerTitle: 'Detalhes do atleta' }}
      />

      <RootStack.Screen
        name="EditAthlete"
        component={EditAthleteScreen}
        options={{ headerShown: true, headerTitle: 'Edição de atleta', headerTitleAlign: 'center' }} />

      {/* Categorias */}
        <RootStack.Screen
        name="NewCategory"
        component={NewCategoryScreen}
        options={{ headerShown: true, headerTitle: 'Nova categoria', headerTitleAlign: 'center' }} />
      <RootStack.Screen
        name="DetailsCategory"
        component={DetailsCategoryScreen}
        options={{ headerShown: true, headerTitle: 'Detalhes da categoria', headerTitleAlign: 'center' }} />
     
      <RootStack.Screen
        name="EditCategory"
        component={EditCategoryScreen}
        options={{ headerShown: true, headerTitle: 'Edição da categoria', headerTitleAlign: 'center' }} />

      {/* Frequências */}
        <RootStack.Screen
        name="NewFrequency"
        component={NewFrequencyScreen}
        options={{ headerShown: true, headerTitle: 'Nova frequência', headerTitleAlign: 'center' }} />
       <RootStack.Screen
        name="DetailsFrequency"
        component={DetailsFrequencyScreen}
        options={{ headerShown: true, headerTitle: 'Detalhes da frequência', headerTitleAlign: 'center' }} />

      <RootStack.Screen
        name="EditFrequency"
        component={EditFrequencyScreen}
        options={{ headerShown: true, headerTitle: 'Edição da frequência', headerTitleAlign: 'center' }} />

      {/* Financeiro */}
        <RootStack.Screen
        name="NewFinancial"
        component={NewFinancialScreen}
        options={{ headerShown: true, headerTitle: 'Nova movimentação', headerTitleAlign: 'center' }} />
       <RootStack.Screen
        name="DetailsFinancial"
        component={DetailsFinancialScreen}
        options={{ headerShown: true, headerTitle: 'Detalhes financeiros', headerTitleAlign: 'center' }} />

        <RootStack.Screen
        name="EditFinancial"
        component={EditFinancialScreen}
        options={{ headerShown: true, headerTitle: 'Edição financeira', headerTitleAlign: 'center' }} />
    </RootStack.Navigator>

  )

}

export default GlobalRoutes
