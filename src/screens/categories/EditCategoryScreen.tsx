import * as React from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RoutesParamList } from '@/navigation/AppNavigaton';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CategoryType } from '@/types/category';
import { useCategoriesContext } from '@/context/CategoriesContext';
import CategoryForm from './CategoryForm';

type EditCategoryRouteProp = RouteProp<RoutesParamList, 'EditCategory'>;
type EditCategoryNavProp = NativeStackNavigationProp<RoutesParamList, 'EditCategory'>;

export default function EditCategoryScreen() {
    const route = useRoute<EditCategoryRouteProp>();
    const navigation = useNavigation<EditCategoryNavProp>();
    const { editCategory } = useCategoriesContext();

    const [loading, setLoading] = React.useState(false);
    const category = route.params;

   
      

    const handleSubmit = async (values: CategoryType) => {
        setLoading(true)
        try {
            await editCategory(values, values.id!);
            setLoading(false)
            navigation.replace("DetailsCategory", { category: values });
        } catch (error) {
            console.error("Erro ao editar a categoria:", error);
            setLoading(false)

        }
    };

    const formattedCategory:CategoryType = {
        ...category.category,
        trainingDays: category.category.trainingDays.map((td) => ({
          day: td.day,
          trainingSchedule: {
            start: td.trainingSchedule.start ?? "",
            end: td.trainingSchedule.end ?? "",
          },
        })),
      };

    return (
        <CategoryForm
            loading={loading}
            mode='edit'
            initialValues={formattedCategory}
            handleSubmit={handleSubmit}
        />
    );
}
