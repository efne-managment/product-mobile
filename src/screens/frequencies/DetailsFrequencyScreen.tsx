import * as React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RoutesParamList } from "@/navigation/AppNavigaton";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { FAB, Layout, SectionDivider, Text } from "@/components";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import FrequencyAthleteCard from "@/components/cards/frequencyAthleteCard";
import { ToastAndroid } from "react-native";
import { useFrequenciesContext } from "@/context/FrequenciesContext";
import { deserializeFrequency } from "@/utils/serializesParams";
import { useThemeContext } from "@/context/ThemeContext";

type ScreenNavigationProp = NativeStackNavigationProp<
  RoutesParamList,
  "DetailsFrequency"
>;
type ScreenRouteProp = RouteProp<RoutesParamList, "DetailsFrequency">;

export default function DetailsFrequencyScreen() {
  const navigation = useNavigation<ScreenNavigationProp>();
  const route = useRoute<ScreenRouteProp>();
  const frequency = deserializeFrequency(route.params.frequency);
  const { deleteFrequency } = useFrequenciesContext();
  const { getDefaultColors } = useThemeContext();
  const [isFabMenuOpen, setIsFabMenuOpen] = React.useState(false);

  // const handleDelete = () => {
  //   setIsFabMenuOpen(false);
  //   if (frequency?.id) {
  //     deleteFrequency(frequency.id);
  //     ToastAndroid.show("Frequência deletada com sucesso!", ToastAndroid.LONG);
  //     navigation.goBack();
  //   }
  // };

  const colors = getDefaultColors();

  return (
    <Layout style={{ flex: 1, padding: 16, backgroundColor: colors.colors.background }}>
      <Layout style={{ gap: 8}}>
        <Text>Categoria: {frequency.category.name}</Text>
        <Layout
          style={{ flexDirection: "row", justifyContent: "space-between" }}
        >
          <Text>
            Presentes:{" "}
            {frequency.athletes.filter((athlete) => athlete.was_present).length}{" "}
          </Text>
          <Text>
            Ausentes:{" "}
            {
              frequency.athletes.filter((athlete) => !athlete.was_present)
                .length
            }{" "}
          </Text>
        </Layout>
        <Text>
          Frequência registrada em:{" "}
          {new Date(frequency.date).toLocaleDateString("pt-BR")}
        </Text>
        <Text>Treino referente a: {frequency.time}</Text>
      </Layout>
      <SectionDivider title="Atletas" />
     
        {frequency && frequency.athletes.length > 0 ? (
          <FlatList
            data={frequency.athletes}
            keyExtractor={(item, index) => index.toLocaleString()}
            renderItem={({ item }) => (
              <FrequencyAthleteCard
                data={item}
                present={item.was_present}
                showMarkPresenceButton
                editable={false}
              />
            )}
            contentContainerStyle={{ flexGrow: 1 }}
            style={{ width: "100%" }}
          />
        ) : (
          <Text variant="h5" status="danger">
            Nenhum atleta encontrado nesta categoria.
          </Text>
        )}
      {/* FABs */}
      {/* Quando o menu estiver aberto, mostra os botões de ação */}
      {isFabMenuOpen && (
        <>
          <FAB
            iconName="edit"
            status="success"
            onPress={() =>
              navigation.replace("EditFrequency", {
                frequency: route.params.frequency,
              })
            }
            location="bottom-right"
            style={{ bottom: 110 }}
          />

          {/* <FAB
                          iconName="trash"
                          status="danger"
                          onPress={handleDelete}  
                          // location="bottom-right"
                              style={{ bottom: 190 }}  // mais acima ainda
                        /> */}
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
