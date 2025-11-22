import * as React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RoutesParamList } from "@/navigation/AppNavigaton";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import styles from "./styles";
import { Pressable, ScrollView } from "react-native-gesture-handler";
import { Image } from "expo-image";
import { useCategoriesContext } from "@/context/CategoriesContext";
import { Linking, ToastAndroid } from "react-native";
import ModalOpenPhoto from "../../components/modals/modalOpenPhoto";
import { Button, FAB, Layout, SectionDivider, Text } from "@/components";
import { CategoryType } from "@/types/category";
import { useThemeContext } from "@/context/ThemeContext";
import { useAthletesContext } from "@/context/AthletesContext";
import { deserializeAthlete } from "@/utils/serializesParams";

type ScreenRouteProp = RouteProp<RoutesParamList, "DetailsAthlete">;
type ScreenNavigationProp = NativeStackNavigationProp<
  RoutesParamList,
  "DetailsAthlete"
>;

export default function DetailsAthleteScreen() {
  const navigation = useNavigation<ScreenNavigationProp>();
  const route = useRoute<ScreenRouteProp>();
  const athlete = deserializeAthlete(route.params.athlete);
  const age = route.params.age;
  const uriImage = athlete?.photo
    ? { uri: athlete.photo }
    : require("../../../assets/person_default.jpg");
  const { getDefaultColors } = useThemeContext();
  const { colors } = getDefaultColors();
  const { deleteAthlete } = useAthletesContext();

  const backgroundColor = colors.background;
  if (!athlete) {
    return (
      <Layout
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text variant="h5">Nenhum atleta encontrado.</Text>
      </Layout>
    );
  }

  const [category, getCategory] = React.useState<CategoryType>();
  const [visibleModal, setVisibleModal] = React.useState(false);

  const [isFabMenuOpen, setIsFabMenuOpen] = React.useState(false);

  const { getOneCategory } = useCategoriesContext();

  const setvariant = async () => {
    const categoryData = await getOneCategory(athlete.category);
    getCategory(categoryData);
  };

  const handleDelete = () => {
    setIsFabMenuOpen(false);
    if (athlete?.id) {
      deleteAthlete(athlete.id);
      ToastAndroid.show("Atleta deletado com sucesso!", ToastAndroid.LONG);
      navigation.goBack();
    }
  };

  React.useEffect(() => {
    if (athlete) {
      setvariant();
    }
  }, [athlete]);

  return (
    <Layout>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, backgroundColor }}
      >
        <Layout style={{ ...styles.containerImg, marginTop: 30 }}>
          <Pressable
            style={styles.image}
            onPress={() => {
              if (athlete.photo) setVisibleModal(true);
            }}
          >
            <Image style={styles.image} source={uriImage} />
          </Pressable>
        </Layout>

        <SectionDivider title="Dados pessoais" />
        <Text variant="h5" style={styles.text}>
          {athlete?.name}
        </Text>
        <Text style={styles.text}>
          Data de nascimento:{" "}
          {new Date(athlete.born).toLocaleDateString("pt-BR")} ({age} anos)
        </Text>

        <Text style={styles.text}>Status: {athlete?.status}</Text>

        <Text style={styles.text}>Sexo: {athlete.gender}</Text>

        <Text style={styles.text}>Mãe: {athlete?.mother}</Text>

        <Text style={styles.text}>Pai: {athlete?.father}</Text>

        <Text variant="labelBold" style={styles.text}>
          Informações adicionais
        </Text>
        <Text style={styles.text}>
          {athlete?.aditionalInformation || "Não consta"}
        </Text>

        <SectionDivider title="Dados do atleta" />

        <Layout style={styles.sectionDataAthlete}>
          <Text style={styles.text}>
            Categoria: {category ? category.name : "Carregando..."}
          </Text>

          <Text style={styles.text}>Posição: {athlete?.position}</Text>
          <Text style={styles.text}>Peso: {athlete?.weight} kg</Text>
          <Text style={styles.text}>Altura: {athlete?.height} m</Text>
        </Layout>

        <SectionDivider title="Contato" />
        <Layout style={styles.column}>
          <Text style={styles.text}>Email: {athlete?.contact.email}</Text>

          {athlete?.contact.email && (
            <Button
              title="Enviar e-mail"
              size="semi"
              style={{ width: "100%", marginBottom: 15 }}
              onPress={() =>
                Linking.openURL(
                  `mailto:${athlete.contact.email}?subject=Contato - Escolinha de Futebol Nova Esperança&body=Olá, tudo bem? Aqui é da Escolinha de Futebol Nova Esperança, podemos conversar sobre seu/sua filho(a)?.`
                )
              }
            >
              Enviar um e-mail
            </Button>
          )}
        </Layout>

        <Layout style={styles.column}>
          <Text style={styles.text}>Telefone: {athlete?.contact.phone}</Text>

          {athlete?.contact.is_whatsapp && (
            <Button
              title="Enviar um Whatsapp"
              status="success"
              size="semi"
              style={{ width: "100%", marginBottom: 15 }}
              onPress={() =>
                Linking.openURL(
                  `https://wa.me/${athlete.contact.phone.replace(
                    /\D/g,
                    ""
                  )}?text=${encodeURIComponent(
                    `Olá! Tudo bem? Aqui é da Escolinha de Futebol Nova Esperança, podemos conversar sobre ${athlete.name} ?.`
                  )}`
                )
              }
            >
              Enviar mensagem
            </Button>
          )}
        </Layout>
        <SectionDivider title="Endereço" />

        <Layout style={{ ...styles.column, width: "100%" }}>
          <Text variant="labelBold" style={styles.text}>
            Endereço:
          </Text>
          <Text style={styles.text}>
            {athlete?.contact.street}, nº {athlete?.contact.number}, bairro{" "}
            {athlete?.contact.neighborhood}
          </Text>
          <Text style={styles.text}>
            {athlete?.contact.city}, CEP{" "}
            {athlete?.contact.zipCode || "Não consta"}
          </Text>
          <Text style={styles.text}>
            Ponto de Referência: {athlete.contact.referencePoint}
          </Text>
        </Layout>

        <SectionDivider title="Escola" />

        <Layout style={{ ...styles.column, width: "100%" }}>
          <Text style={styles.text}>Escola: {athlete.school.institution}</Text>
        </Layout>
        <Layout style={{ ...styles.column, width: "100%" }}>
          <Text style={styles.text}>Turma: {athlete.school.year}</Text>
        </Layout>
        <Layout style={{ ...styles.column, width: "100%" }}>
          <Text style={styles.text}>Turno: {athlete.school.shift}</Text>
        </Layout>
        <ModalOpenPhoto
          setVisible={setVisibleModal}
          visible={visibleModal}
          uri={athlete.photo || ""}
        />
      </ScrollView>
      {/* FABs */}
      {/* Quando o menu estiver aberto, mostra os botões de ação */}
      {isFabMenuOpen && (
        <>
          <FAB
            iconName="edit"
            status="success"
            onPress={() =>
              navigation.replace("EditAthlete", {
                athlete: route.params.athlete,
              })
            }
            location="bottom-right"
            style={{ bottom: 110 }}
          />

          <FAB
            iconName="trash"
            status="danger"
            onPress={handleDelete}
            // location="bottom-right"
            style={{ bottom: 190 }} // mais acima ainda
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
