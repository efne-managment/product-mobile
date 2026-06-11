import { Layout } from "@/components";
import FAB from "@/components/buttons/fab";
import AthleteCard from "@/components/cards/athleteCard";
import { StyleSheet } from "react-native";
import CategoryCard from "@/components/cards/categoryCard";
import { RoutesParamList, RoutesWithoutParams } from "@/navigation/AppNavigaton";
import { AthleteType } from "@/types/athlete";
import { CategoryType } from "@/types/category";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FlatList } from "react-native";
import { FrequencyType } from "@/types/frequency";
import FrequencyCard from "@/components/cards/frequencyCard";

type AthleteProps = {
    callCard: "ATHLETE";
    data: AthleteType[];
    nextRoute: RoutesWithoutParams;
};

type CategoryProps = {
    callCard: "CATEGORY";
    data: CategoryType[];
    nextRoute: RoutesWithoutParams;
};

type FrequencyProps = {
    callCard: "FREQUENCY";
    data: FrequencyType[];
    nextRoute: RoutesWithoutParams;
};

type Props = AthleteProps | CategoryProps | FrequencyProps;

type newNavigationProp = NativeStackNavigationProp<RoutesParamList>;

export default function ListScreen({ callCard, data, nextRoute }: Props) {

  const navigation = useNavigation<newNavigationProp>();

    const renderList = () => {
        switch (callCard) {
            case "ATHLETE":
                return <FlatList
                    data={data}
                    keyExtractor={(item, index) => item.id ?? `athlete-${index}`}
                    renderItem={({ item }) => (<AthleteCard data={item} />)} 
                    contentContainerStyle={styles.listContent}
                    style={{ width: "100%", }} />;
            case "CATEGORY":
                return <FlatList
                data={data}
                keyExtractor={(item, index) => item.id ?? `category-${index}`}
                renderItem={({ item }) => (<CategoryCard data={item} />)} 
                contentContainerStyle={styles.listContent}
                style={{ width: "100%"}} />;

            case "FREQUENCY":
                return <FlatList
                data={data}
                keyExtractor={(item, index) => item.id ?? `frequency-${index}`}
                renderItem={({ item }) => (<FrequencyCard data={item} />)} 
                contentContainerStyle={styles.listContent}
                style={{ width: "100%"}} />;
            default:
                return <></>;
        }
    }

    return (
        <Layout style={styles.container}>
            {renderList()}
            <FAB iconName="plus" onPress={() => navigation.navigate(nextRoute)}/>
        </Layout>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    listContent: {
        flexGrow: 1,
        paddingTop: 12,
        paddingBottom: 120,
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 10,
    },
});
