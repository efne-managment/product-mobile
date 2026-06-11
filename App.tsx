import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { AthletesProvider } from './src/context/AthletesContext';
import { CategoriesProvider } from './src/context/CategoriesContext';
import { FrequenciesProvider } from './src/context/FrequenciesContext';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { SettingsProvider } from './src/context/SettingsContext';
import { FinancialProvider } from './src/context/FinancialContext';
import { CategoryLineupsProvider } from './src/context/CategoryLineupsContext';
import AppNavigation from './src/navigation/AppNavigaton';

function App() {

  return (
    <GestureHandlerRootView>
      <ThemeProvider>
        <SettingsProvider>
          <AuthProvider>
            <FrequenciesProvider>
              <FinancialProvider>
                <CategoriesProvider>
                  <CategoryLineupsProvider>
                    <AthletesProvider>
                      <NavigationContainer>
                        <AppNavigation />
                      </NavigationContainer>
                    </AthletesProvider>
                  </CategoryLineupsProvider>
                </CategoriesProvider>
              </FinancialProvider>
            </FrequenciesProvider>
          </AuthProvider>
        </SettingsProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

export default App;
