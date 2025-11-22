import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { AthletesProvider } from './src/context/AthletesContext';
import { CategoriesProvider } from './src/context/CategoriesContext';
import { FrequenciesProvider } from './src/context/FrequenciesContext';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import AppNavigation from './src/navigation/AppNavigaton';

function App() {

  return (
    <GestureHandlerRootView>
      <ThemeProvider>
        <AuthProvider>
          <FrequenciesProvider>
          <CategoriesProvider>
            <AthletesProvider>
                <NavigationContainer>
                  <AppNavigation />
                </NavigationContainer>
            </AthletesProvider>
          </CategoriesProvider>
          </FrequenciesProvider>
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

export default App;
