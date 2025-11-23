import * as React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RoutesParamList } from '@/navigation/AppNavigaton';
import { useNavigation } from '@react-navigation/native';
import { initialValuesFrequency } from '@/constants/defaultValues';
import { FrequencyType } from '@/types/frequency';
import { useFrequenciesContext } from '@/context/FrequenciesContext';
import FrequencyForm from './FrequencyForm';
import { Button, Layout, Text } from '@/components';
import { useCategoriesContext } from '@/context/CategoriesContext';
import styles from './styles';
import { useAthletesContext } from '@/context/AthletesContext';

type ScreenNavigationProp = NativeStackNavigationProp<RoutesParamList, "NewFrequency">;

export default function NewFrequencyScreen() {
  const navigation = useNavigation<ScreenNavigationProp>();
  const { createFrequency } = useFrequenciesContext();
  
  const [loading, setLoading] = React.useState(false);


  const { categories } = useCategoriesContext();
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
      await createFrequency(values);
      setLoading(false)
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar os dados:', error);
      setLoading(false)
    }
  }

  return (
    <FrequencyForm
      loading={loading}
      mode='create'
      initialValues={initialValuesFrequency}
      categories={categories}
      athletes={athletes}
      handleSubmit={handleSubmit}
    />
  );

}