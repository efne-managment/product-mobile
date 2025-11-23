import { RoutesParamList } from "@/navigation/AppNavigaton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { ToastAndroid } from "react-native";
import { initialValuesAthlete } from "@/constants/defaultValues";
import { useAthletesContext } from "@/context/AthletesContext";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import styles from "./styles";
import { useCategoriesContext } from "@/context/CategoriesContext";
import { AthleteType } from "@/types/athlete";
import { Button, Layout, Text } from "@/components";
import AthleteForm from "./AthleteForm";
import { deserializeAthlete, serializeAthlete } from "@/utils/serializesParams";

type ScreenRouteProp = RouteProp<RoutesParamList, 'EditAthlete'>;
type ScreenNavigationProp = NativeStackNavigationProp<RoutesParamList, 'EditAthlete'>;

export default function EditAthleteScreen() {
    const route = useRoute<ScreenRouteProp>();
    const navigation = useNavigation<ScreenNavigationProp>();
  const { editAthlete } = useAthletesContext();

  const [loading, setLoading] = useState(false);
 
  const { categories } = useCategoriesContext();

  const athlete = deserializeAthlete(route.params.athlete);

  if (categories.length === 0) {
    return (
      <Layout style={{ ...styles.container, justifyContent: 'center', alignItems: 'center' }}>
        <Text variant='h5'>Nenhuma categoria cadastrada.</Text>
        <Text variant='h6'>Cadastre uma categoria antes de editar um atleta.</Text>
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
      if(athlete.id){
        await editAthlete(values, athlete.id);
        ToastAndroid.show("Atleta editado com sucesso!", ToastAndroid.LONG);
        navigation.replace('DetailsAthlete', { athlete: serializeAthlete(values), age: new Date().getFullYear() - new Date(values.born).getFullYear() });
      } else {
        console.error("ID do atleta não encontrado.");
        ToastAndroid.show("Erro ao editar atleta. Tente novamente.", ToastAndroid.LONG);
        
      }
      setLoading(false);
    } catch (error) {
      console.error("Erro ao alterar os dados:", error);
      ToastAndroid.show("Erro ao cadastrar atleta. Tente novamente.", ToastAndroid.LONG);
      setLoading(false);
    }
  };
    return <AthleteForm handleSubmit={handleSubmit} initialValues={athlete} loading={loading} categories={categories} mode="edit" />

}
