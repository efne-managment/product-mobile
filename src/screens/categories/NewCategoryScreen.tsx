import * as React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RoutesParamList } from '@/navigation/AppNavigaton';
import { useNavigation } from '@react-navigation/native';
import { initialValuesCategory } from '@/constants/defaultValues';
import { useCategoriesContext } from '@/context/CategoriesContext';
import { CategoryType } from '@/types/category';
import CategoryForm from './CategoryForm';

type ScreenNavigationProp = NativeStackNavigationProp<RoutesParamList, "NewCategory">;

export default function NewCategoryScreen() {
  const navigation = useNavigation<ScreenNavigationProp>();
  const { createCategory } = useCategoriesContext();
  
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (values: CategoryType) => {
    setLoading(true)
    try {
      await createCategory(values);
      setLoading(false)
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar os dados:', error);
      setLoading(false)
    }
  }

  return (
    <CategoryForm
      loading={loading}
      mode='create'
      initialValues={initialValuesCategory}
      handleSubmit={handleSubmit}
    />
  );

}