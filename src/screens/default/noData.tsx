import { Layout, Text } from "@/components";
import FAB from "@/components/buttons/fab";
import { RoutesParamList } from "@/navigation/AppNavigaton";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";

type Props = {
    text: string;
    nextRoute: Exclude<keyof RoutesParamList, "DetailsAthlete" | "DetailsCategory" | "DetailsFrequency" | "DetailsFinancial">;
  };
  
  type newNavigationProp = NativeStackNavigationProp<RoutesParamList>;
  
  export default function NoDataScreen({ text, nextRoute }: Props) {
    
    
      const navigation = useNavigation<newNavigationProp>();
    return (
      <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text variant="h4">{text}</Text>
                    <FAB iconName="plus" onPress={() => navigation.navigate(nextRoute as "NewAthlete" | "NewCategory" | "NewFrequency" | "NewFinancial")}/>
      </Layout>
    );
  }
