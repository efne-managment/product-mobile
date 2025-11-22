import { FrequencyType } from "@/types/frequency";
import { Layout } from "../views";
import { Text } from "../texts";
import { StyleSheet } from "react-native";
import { Button } from "../buttons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RoutesParamList } from "@/navigation/AppNavigaton";
import { useNavigation } from "@react-navigation/native";
import { serializeFrequency } from "@/utils/serializesParams";

type FrequencyCardProps = {
    data: FrequencyType
};

type ListScreensProp = NativeStackNavigationProp<RoutesParamList>;

export default function FrequencyCard({ data }: FrequencyCardProps) {
    const navigation = useNavigation<ListScreensProp>();
    
  return (
    <Layout style={styles.container}>
        <Layout style={styles.containerRow}>
            <Text variant="p" status="success">Categoria: {data.category.name}</Text>
            <Text status="primary"> {new Date(data.date).toLocaleDateString('pt-BR')}</Text>
         </Layout>
        <Text>Presentes: {data.athletes.filter(athlete => athlete.was_present).length}</Text>

         <Text variant="label" status="basic">Treino referente a: {data.time}</Text>
        <Button title="Ver mais" size="small" style={{width: "100%"}} onPress={() => navigation.navigate('DetailsFrequency', { frequency: serializeFrequency(data) })} />
         
    </Layout>
  )
}


const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        width: "95%",
        marginLeft: 10,
        gap: 8,
        alignItems: "baseline",
        paddingVertical: 10,
        paddingHorizontal: 20,
        shadowColor: "#000",
        borderWidth: 0,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 8,
        marginVertical: 10,
        borderRadius: 15,
    },
    containerRow: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    text: {
        marginBottom: 16,
        width: "100%",
    }
})