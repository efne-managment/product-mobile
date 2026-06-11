import { RoutesParamList } from "@/navigation/AppNavigaton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { ToastAndroid } from "react-native";
import { useAthletesContext } from "@/context/AthletesContext";
import { useSettingsContext } from "@/context/SettingsContext";
import { useNavigation } from "@react-navigation/native";
import styles from "./styles";
import { useCategoriesContext } from "@/context/CategoriesContext";
import { AthleteType } from "@/types/athlete";
import { Button, Layout, Text } from "@/components";
import AthleteForm from "./AthleteForm";

type ScreenNavigationProp = NativeStackNavigationProp<RoutesParamList, "NewAthlete">;

export default function NewAthleteScreen() {
  const navigation = useNavigation<ScreenNavigationProp>();
  const { createAthlete } = useAthletesContext();
  const { getInitialAthleteValues } = useSettingsContext();

  const [loading, setLoading] = useState(false);
 
  const { categories } = useCategoriesContext();


  if (categories.length === 0) {
    return (
      <Layout style={{ ...styles.container, justifyContent: 'center', alignItems: 'center' }}>
        <Text variant='h5'>Nenhuma categoria cadastrada.</Text>
        <Text variant='h6'>Cadastre uma categoria antes de cadastrar um atleta.</Text>
        <Layout style={{ ...styles.row, height: 'auto', marginTop: 20 }}>
          <Button
            title="Voltar"
            size="large"
            onPress={() => navigation.goBack()}
            status="warning"
          />
        </Layout>
      </Layout>
    )
  }

  const handleSubmit = async (values: AthleteType) => {
    setLoading(true);
    try {
      await createAthlete(values);
      ToastAndroid.show("Atleta cadastrado com sucesso!", ToastAndroid.LONG);
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao salvar os dados:", error);
      ToastAndroid.show("Erro ao cadastrar atleta. Tente novamente.", ToastAndroid.LONG);
    } finally {
      setLoading(false);
    }
  };

    return <AthleteForm handleSubmit={handleSubmit} initialValues={getInitialAthleteValues()} loading={loading} categories={categories} mode="create" />

}
