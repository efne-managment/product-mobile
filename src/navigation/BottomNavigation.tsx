// NAVIGATORS
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Octicons from '@expo/vector-icons/Octicons';


// SCREENS
import HomeScreen from "@/screens/athetes/AthletesScreen";
import DetailsAthleteScreen from "@/screens/athetes/Details/DetailsAthleteScreen";
import ListAthletesScreen from "@/screens/athetes/AthletesScreen";
import NewAthleteScreen from "@/screens/athetes/Form/NewAthleteScreen";
import ListCategoriesScreen from "@/screens/categories/CategorieesScreen";
import DetailsCategoryScreen from "@/screens/categories/DetailsCategoryScreen";
import NewCategoryScreen from "@/screens/categories/NewCategoryScreen";
import ListFinancialsScreen from "@/screens/financial/FinancialsScreen";
import DetailsFinancialScreen from "@/screens/financial/DetailsFinancialScreen";
import NewFinancialScreen from "@/screens/financial/NewFinancialScreen";
import ListFrequenciesScreen from "@/screens/frequencies/FrequenciesScreen";
import DetailsFrequencyScreen from "@/screens/frequencies/DetailsFrequencyScreen";
import NewFrequencyScreen from "@/screens/frequencies/NewFrequencyScreen";
import SettingsScreen from "@/screens/settings/SettingsScreen";
import { Text } from "@/components";
import EditCategoryScreen from "@/screens/categories/EditCategoryScreen";
import EditAthleteScreen from "@/screens/athetes/Form/EditAthleteScreen";
import EditFrequencyScreen from "@/screens/frequencies/EditFrequencyScreen";

const TabIcon = (props: any) => <Octicons {...props} name={props.name} />;
const TabTitle = (props: any) => <Text variant="label" status="basic">{props.title}</Text>;

const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          height: 70,
          borderTopWidth: 0,
          backgroundColor: '#fff',
          elevation: 10,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Athletes') {
            iconName = 'people';
          } else if (route.name === 'Categories') {
            iconName = 'tag';
          } else if (route.name === 'Financial') {
            iconName = 'book';
          } else if (route.name === 'Frequencies') {
            iconName = 'checklist';
          } else if (route.name === 'Settings') {
            iconName = 'gear';
          }

          return (
            <TabIcon
              name={iconName}
              color={focused ? '#0a7ea4' : '#687076'}
              size={21}
            />
          );
        },
        tabBarActiveTintColor: '#0a7ea4',
        tabBarInactiveTintColor: '#687076',
      })}
    >
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
      {/* <Tab.Screen
        name="Financial"
        component={FinancialStackScreen}
        options={{
          tabBarLabel: ({ color }) =>
            <TabTitle title="Financeiro" color={color} />
        }}
      />*/}
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
    </RootStack.Navigator>

  )

}

export default GlobalRoutes