import * as React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RoutesParamList } from '@/navigation/AppNavigaton';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import styles from './styles';
import { Pressable, ScrollView } from 'react-native-gesture-handler';
import { Image } from 'expo-image';
import { useCategoriesContext } from '@/context/CategoriesContext';
import { Linking } from 'react-native';
import ModalOpenPhoto from '../../components/modals/modalOpenPhoto';
import { Button, FAB, Layout, SectionDivider, Text } from '@/components';
import { CategoryType } from '@/types/category';
import { useThemeContext } from '@/context/ThemeContext';


type DetailsCategoryRouteProp = RouteProp<RoutesParamList, "DetailsAthlete">;

type detailsCategoryScreenProp = NativeStackNavigationProp<RoutesParamList, "DetailsAthlete">;

export default function DetailsAthleteScreen() {
  const navigation = useNavigation<detailsCategoryScreenProp>();
  const route = useRoute<DetailsCategoryRouteProp>();
  const athlete = route.params.athlete;
  const age = route.params.age
  const uriImage = athlete?.photo ? { uri: athlete.photo } : require("../../../assets/person_default.jpg");
  const { getDefaultColors } = useThemeContext();
  const { colors } = getDefaultColors();

  const backgroundColor =  colors.background;
  if (!athlete) {
    return (
      <Layout style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text variant='h5'>Nenhum atleta encontrado.</Text>
      </Layout>
    );
  }

  const [category, getCategory] = React.useState<CategoryType>();
  const [visibleModal, setVisibleModal] = React.useState(false)
  const { getOneCategory } = useCategoriesContext();


  const setvariant = async () => {
    const categoryData = await getOneCategory(athlete.category);
    getCategory(categoryData);
  }


  React.useEffect(() => {
    if (athlete) {
      setvariant();
    }
  }
    , [athlete]);

  return (
    <Layout>
     <ScrollView contentContainerStyle={{paddingHorizontal: 20, backgroundColor}}>
        <Layout style={{ ...styles.containerImg, marginTop: 30 }}>
          <Pressable style={styles.image} onPress={() => { if (athlete.photo) setVisibleModal(true); }}>
            <Image style={styles.image} source={uriImage} />
          </Pressable>
        </Layout>

        <SectionDivider title='Dados pessoais' />
        <Text variant='h5' style={styles.text}>{athlete?.name}</Text>
        <Layout style={styles.row}>
          <Layout style={styles.column}>
            <Text variant="labelBold" style={styles.text}>Data de nascimento</Text>
            <Text style={styles.text}>{new Date(athlete.born).toLocaleDateString('pt-BR')} ({age} anos)</Text>
          </Layout>

          <Layout style={styles.column}>
            <Text variant="labelBold" style={styles.text}>Status</Text>
            <Text style={styles.text}>{athlete?.status}</Text>
          </Layout>
        </Layout>
        <Layout style={styles.column}>
            <Text variant="labelBold" style={styles.text}>Sexo</Text>
            <Text style={styles.text}>{athlete.gender}</Text>
          </Layout>

        <Layout style={{ ...styles.column, width: "100%", marginBottom: 20 }}>
          <Text variant="labelBold" style={styles.text}>Nome da mãe</Text>
          <Text style={styles.text}>{athlete?.mother}</Text>
        </Layout>
        <Layout style={{ ...styles.column, width: "100%", marginBottom: 20 }}>
          <Text variant="labelBold" style={styles.text}>Nome do pai</Text>
          <Text style={styles.text}>{athlete?.father}</Text>
        </Layout>
        <Layout style={{ ...styles.column, width: "100%", marginBottom: 20 }}>
          <Text variant="labelBold" style={styles.text}>Informação adicional</Text>
          <Text style={styles.text}>{athlete?.aditionalInformation || "Não consta"}</Text>
        </Layout>

        <SectionDivider title='Dados do atleta' />

        <Layout style={styles.row}>
          <Layout style={styles.column}>
            <Text variant="labelBold" style={styles.text}>Categoria</Text>
            <Text style={styles.text}>{category?.name}</Text>
          </Layout>
          <Layout style={styles.column}>
            <Text variant="labelBold" style={styles.text}>Posição</Text>
            <Text style={styles.text}>{athlete?.position}</Text>
          </Layout>
        </Layout>
        <Layout style={styles.row}>
          <Layout style={styles.column}>
            <Text variant="labelBold" style={styles.text}>Peso</Text>
            <Text style={styles.text}>{athlete?.weight} kg</Text>
          </Layout>
          <Layout style={styles.column}>
            <Text variant="labelBold" style={styles.text}>Altura</Text>
            <Text style={styles.text}>{athlete?.height} cm</Text>
          </Layout>
        </Layout>

        <SectionDivider title='Dados de contato' />

        <Layout style={styles.row}>
          <Layout style={styles.column}>
            <Text variant="labelBold" style={styles.text}>Email</Text>
            <Text style={styles.text}>{athlete?.contact.email}</Text>
          </Layout>
          {athlete?.contact.email && <Button title='Enviar e-mail' size='semi'
            onPress={() =>
              Linking.openURL(
                `mailto:${athlete.contact.email}?subject=Contato - Escolinha de Futebol Nova Esperança&body=Olá, tudo bem? Aqui é da Escolinha de Futebol Nova Esperança, podemos conversar sobre seu/sua filho(a)?.`
              )
            }
          >
            Enviar um e-mail
          </Button>
          }

        </Layout>
        <Layout style={styles.row}>
          <Layout style={styles.column}>
            <Text variant="labelBold" style={styles.text}>Telefone</Text>
            <Text style={styles.text}>{athlete?.contact.phone}</Text>
          </Layout>
          {athlete?.contact.is_whatsapp && <Button title='Enviar um Wharsapp'
            status="success"
            size='semi'
            onPress={() =>
              Linking.openURL(
                `https://wa.me/${athlete.contact.phone.replace(/\D/g, '')}?text=${encodeURIComponent("Olá! Tudo bem? Aqui é da Escolinha de Futebol Nova Esperança, podemos conversar sobre seu/sua filho(a)?.")}`
              )
            }
          >
            Enviar mensagem
          </Button>
          }
        </Layout>

        <Layout style={{ ...styles.column, width: "100%" }}>
          <Text variant="labelBold" style={styles.text}>Endereço</Text>
          <Text style={styles.text}>{athlete?.contact.street}, nº {athlete?.contact.number}, bairro {athlete?.contact.neighborhood}</Text>
          <Text style={styles.text}>{athlete?.contact.city}, CEP {athlete?.contact.zipCode || "Não consta"}</Text>
          <Text variant="labelBold" style={styles.text}>Ponto de Referência</Text>
          <Text style={styles.text}>{athlete.contact.referencePoint}</Text>


        </Layout>

        <SectionDivider title='Dados escolares' />

        <Layout style={{ ...styles.column, width: "100%" }}>
          <Text variant='labelBold' style={styles.text}>Escola</Text>
          <Text style={styles.text}>{athlete.school.institution}</Text>
        </Layout>
        <Layout style={{ ...styles.column, width: "100%" }}>
          <Text variant='labelBold' style={styles.text}>Turma</Text>
          <Text style={styles.text}>{athlete.school.year}</Text>
        </Layout>
        <Layout style={{ ...styles.column, width: "100%" }}>
          <Text variant='labelBold' style={styles.text}>Turno</Text>
          <Text style={styles.text}>{athlete.school.shift}</Text>
        </Layout>
      <ModalOpenPhoto setVisible={setVisibleModal} visible={visibleModal} uri={athlete.photo || ""} />

        </ScrollView>

<FAB iconName='edit' onPress={() => navigation.navigate('EditAthlete', {athlete})}/>
        </Layout>
  );
}