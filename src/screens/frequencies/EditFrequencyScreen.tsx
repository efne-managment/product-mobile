import * as React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RoutesParamList } from '@/navigation/AppNavigaton';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { initialValuesFrequency } from '@/constants/defaultValues';
import { FrequencyFormType, FrequencyType } from '@/types/frequency';
import { useFrequenciesContext } from '@/context/FrequenciesContext';
import FrequencyForm from './FrequencyForm';
import { Button, Layout, Text } from '@/components';
import { useCategoriesContext } from '@/context/CategoriesContext';
import styles from './styles';
import { useAthletesContext } from '@/context/AthletesContext';
import { deserializeFrequency, serializeFrequency } from '@/utils/serializesParams';

type ScreenNavigationProp = NativeStackNavigationProp<RoutesParamList, "EditFrequency">;
type ScreenRouteProp = RouteProp<RoutesParamList, "EditFrequency">;

export default function EditFrequencyScreen() {
  const navigation = useNavigation<ScreenNavigationProp>();
  const { editFrequency } = useFrequenciesContext();
  const route = useRoute<ScreenRouteProp>();
  const frequency = deserializeFrequency(route.params.frequency);
  
  const [loading, setLoading] = React.useState(false);

  const { categories, getOneCategory } = useCategoriesContext();
  const { athletes } = useAthletesContext();


  if (categories.length === 0) {
    return (
      <Layout style={{ ...styles.container, justifyContent: 'center', alignItems: 'center' }}>
        <Text variant='h5'>Nenhuma categoria cadastrada.</Text>
        <Text variant='h6'>Cadastre uma categoria antes de cadastrar uma frequência.</Text>
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

  if (athletes.length === 0) {
    return (
      <Layout style={{ ...styles.container, justifyContent: 'center', alignItems: 'center' }}>
        <Text variant='h5'>Nenhum atleta cadastrado.</Text>
        <Text variant='h6'>Cadastre um atleta antes de cadastrar uma frequência.</Text>
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

  const handleSubmit = async (values: FrequencyType) => {
    setLoading(true)
    try {
      await editFrequency(values, frequency.id || "");  
      setLoading(false)
      navigation.replace("DetailsFrequency", {
        frequency: serializeFrequency({
          ...frequency,
          ...values,
          id: frequency.id,
          createdAt: frequency.createdAt,
          createdBy: frequency.createdBy,
        }),
      });
    } catch (error) {
      console.error('Erro ao salvar os dados:', error);
      setLoading(false)
    }
  }

  const formattedFrequency: FrequencyFormType = {
    category: frequency.category.name,
    athletes: frequency.athletes,
    date: frequency.date,
    time: frequency.time,
    notes: frequency.notes || "",
  }

  return (
    <FrequencyForm
      loading={loading}
      mode='edit'
      initialValues={formattedFrequency}
      realValues={frequency}
      categories={[]}
      athletes={[]}
      handleSubmit={handleSubmit}
    />
  );

}
