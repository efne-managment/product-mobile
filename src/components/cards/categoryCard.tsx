import { CategoryType } from "@/types/category";
import { Layout } from "../views";
import { Text } from "../texts";
import { Button } from "../buttons";
import { StyleSheet } from "react-native";
import { RoutesParamList } from "@/navigation/AppNavigaton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

type Props = {
    data: CategoryType,
}

type ListScreensProp = NativeStackNavigationProp<RoutesParamList>;

export default function CategoryCard({ data }: Props) {
    const navigation = useNavigation<ListScreensProp>();
    return (
        <Layout style={styles.container}>
            <Text variant='h6' style={styles.text}>{data.name}</Text>
            <Text variant="p" style={styles.text}>Total de atletas: {data.totalAthletes}</Text>
            <Layout style={styles.containerRow}>
                <Text variant="p"  style={styles.text}>
                    Criado em: {data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleDateString('pt-BR') : "Data não disponível"}
                </Text>
                <Text variant="p"  style={styles.text}>{data.status}</Text>
            </Layout>

            <Button title="Ver mais" size="small" style={{width: "100%"}} onPress={() => navigation.navigate('DetailsCategory', { category: data})}/>
        </Layout>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        width: "95%",
        marginLeft: 10,
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