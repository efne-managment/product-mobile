import * as React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RoutesParamList } from '@/navigation/AppNavigaton';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Button, FAB, Layout, SectionDivider, Text } from '@/components';
import { useAthletesContext } from '@/context/AthletesContext';
import { AthleteType } from '@/types/athlete';
import { FlatList, ToastAndroid } from 'react-native';
import AthleteCard from '@/components/cards/athleteCard';
import { useCategoriesContext } from '@/context/CategoriesContext';

type DetailsCategoryRouteProp = RouteProp<RoutesParamList, "DetailsCategory">;

type detailsCategoryScreenProp = NativeStackNavigationProp<RoutesParamList, "DetailsCategory">;

export default function DetailsCategoryScreen() {
  const navigation = useNavigation<detailsCategoryScreenProp>();
  const route = useRoute<DetailsCategoryRouteProp>();
  const category = route.params.category;
  const { getAthletesByCategory } = useAthletesContext();
  const [athletes, setAthletes] = React.useState<AthleteType[]>([])

  const { deleteCategory } = useCategoriesContext();

  if (!category || !category?.id) {
    return (
      <Layout style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text variant='h5'>Nenhuma categoria encontrada.</Text>
      </Layout>
    );
  }

  const fetchAthletes = async () => {
    if (category?.id) {
      const result = await getAthletesByCategory(category.id);
      setAthletes(result);
    }
  };

    const [isFabMenuOpen, setIsFabMenuOpen] = React.useState(false);

    const handleDelete = () => {
  
      setIsFabMenuOpen(false);
      if (category?.id) {
        deleteCategory(category.id);
        ToastAndroid.show("Categoria deletada com sucesso!", ToastAndroid.LONG);
        navigation.goBack();
      }
    };

  React.useEffect(() => {
    if (category) {
      fetchAthletes();
    }
  }, [category])

  const createdAt = category?.createdAt ? new Date(category.createdAt.seconds * 1000).toLocaleDateString('pt-BR') : "Não consta"
  return (
    <Layout style={{ flex: 1, padding: 16, flexDirection: 'column', justifyContent: 'flex-start' }}>
      <Text variant='labelBold' style={{ width: "50%" }} status={category.status == 'ativo' ? 'success' : 'danger'}>{category.status}</Text>
      <Text variant='h3' style={{ width: "50%" }}>{category.name}</Text>
      <Text variant='p'>Criada em: {createdAt}</Text>
      <Text variant='p'>Total de atletas: {category.totalAthletes}</Text>

      <Layout style={{ padding: 16, }}>
        <SectionDivider title='Dias de treino' />

        {/* Cabeçalho da tabela */}
        <Layout style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
          <Text variant='labelBold' style={{ flex: 1 }}>Dia</Text>
          <Text variant='labelBold' style={{ flex: 1, textAlign: "center" }}>Início</Text>
          <Text variant='labelBold' style={{ flex: 1, textAlign: "right" }}>Fim</Text>
        </Layout>

        {/* Linhas da tabela */}
        {category.trainingDays.map((item) => (
          <Layout
            key={item.day}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 6,
              paddingVertical: 4,
              borderBottomWidth: 0.5,
              borderColor: "#ccc",
            }}
          >
            <Text style={{ flex: 1 }}>{item.day}</Text>
            <Text style={{ flex: 1, textAlign: "center" }}>{item.trainingSchedule.start}</Text>
            <Text style={{ flex: 1, textAlign: "right" }}>{item.trainingSchedule.end}</Text>
          </Layout>
        ))}
      </Layout>
      <Layout style={{ flex: 1, marginVertical: 15 }}>
 
      <SectionDivider title='Atletas' />

        {
          athletes && athletes.length > 0 ? <FlatList
            data={athletes}
            keyExtractor={(item, index) => index.toLocaleString()}
            renderItem={({ item }) => (<AthleteCard data={item} />)}
            contentContainerStyle={{ flexGrow: 1 }}
            style={{ width: "100%", }} /> : <Text variant='h5' status='danger'>Nenhum atleta encontrado nesta categoria.</Text>
        }
      </Layout>
      {/* FABs */}
          {/* Quando o menu estiver aberto, mostra os botões de ação */}
          {isFabMenuOpen && (
            <>
              <FAB iconName='edit' status='success' onPress={() => navigation.replace('EditCategory', {category})} location="bottom-right"     style={{ bottom: 110 }} />
      
              <FAB
                iconName="trash"
                status="danger"
                onPress={handleDelete}  
                // location="bottom-right"
                    style={{ bottom: 190 }}  // mais acima ainda
              />
            </>
          )}
      
          {/* FAB principal (menu) */}
          <FAB
            iconName={isFabMenuOpen ? "close" : "settings"}
            onPress={() => setIsFabMenuOpen((prev) => !prev)}
            location="bottom-right"
          />
    </Layout>
  );
}