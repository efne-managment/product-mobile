import { Layout } from "@/components";
import FAB from "@/components/buttons/fab";
import AthleteCard from "@/components/cards/athleteCard";
import { StyleSheet } from "react-native";
import CategoryCard from "@/components/cards/categoryCard";
import { RoutesParamList } from "@/navigation/AppNavigaton";
import { AthleteType } from "@/types/athlete";
import { CategoryType } from "@/types/category";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FlatList } from "react-native";

type AthleteProps = {
    callCard: "ATHLETE";
    data: AthleteType[];
    nextRoute: Exclude<keyof RoutesParamList, "DetailsAthlete" | "DetailsCategory" | "DetailsFrequency" | "DetailsFinancial">;
};

type CategoryProps = {
    callCard: "CATEGORY";
    data: CategoryType[];
    nextRoute: Exclude<keyof RoutesParamList, "DetailsAthlete" | "DetailsCategory" | "DetailsFrequency" | "DetailsFinancial">;
};

type Props = AthleteProps | CategoryProps;

type newNavigationProp = NativeStackNavigationProp<RoutesParamList>;

export default function ListScreen({ callCard, data, nextRoute }: Props) {

  const navigation = useNavigation<newNavigationProp>();

    const renderList = () => {
        switch (callCard) {
            case "ATHLETE":
                return <FlatList
                    data={data}
                    keyExtractor={(item, index) => index.toLocaleString()}
                    renderItem={({ item }) => (<AthleteCard data={item} />)} 
                    contentContainerStyle={{ flexGrow: 1 }} 
                    style={{ width: "100%", }} />;
            case "CATEGORY":
                return <FlatList
                data={data}
                keyExtractor={(item, index) => index.toLocaleString()}
                renderItem={({ item }) => (<CategoryCard data={item} />)} 
                contentContainerStyle={{ flexGrow: 1}} 
                style={{ width: "100%"}} />;
            default:
                return <></>;
        }
    }

    return (
        <Layout style={styles.container}>
            {renderList()}
            <FAB iconName="plus" onPress={() => navigation.navigate(nextRoute === "NewAthlete" ? "NewAthlete" : "NewCategory")}/>
        </Layout>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'baseline',
        paddingHorizontal: 10,
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 10,
    },
});
