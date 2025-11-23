import * as React from 'react';
import { View, Text, Button } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RoutesParamList } from '@/navigation/AppNavigaton';
import { useNavigation } from '@react-navigation/native';

type listFinancialsScreenProp = NativeStackNavigationProp<RoutesParamList, "ListFinancials">;

export default function ListFinancialsScreen() {
    const navigation = useNavigation<listFinancialsScreenProp>();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Financials Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('DetailsFinancial')}
      />
    </View>
  );
}