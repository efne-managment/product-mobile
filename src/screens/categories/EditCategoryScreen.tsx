import * as React from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RoutesParamList } from '@/navigation/AppNavigaton';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CategoryType } from '@/types/category';
import { useCategoriesContext } from '@/context/CategoriesContext';
import CategoryForm from './CategoryForm';
import { deserializeCategory, serializeCategory } from '@/utils/serializesParams';

type ScreenRouteProp = RouteProp<RoutesParamList, 'EditCategory'>;
type ScreenNavigationProp = NativeStackNavigationProp<RoutesParamList, 'EditCategory'>;

export default function EditCategoryScreen() {
    const route = useRoute<ScreenRouteProp>();
    const navigation = useNavigation<ScreenNavigationProp>();
    const { editCategory } = useCategoriesContext();

    const [loading, setLoading] = React.useState(false);
    const category = deserializeCategory(route.params.category);

    const handleSubmit = async (values: CategoryType) => {
        setLoading(true)
        try {
            await editCategory(values, values.id!);
            setLoading(false)
            navigation.replace("DetailsCategory", { category: serializeCategory(values) });
        } catch (error) {
            console.error("Erro ao editar a categoria:", error);
            setLoading(false)

        }
    };

    const formattedCategory:CategoryType = {
        ...category,
        trainingDays: category.trainingDays.map((td) => ({
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
