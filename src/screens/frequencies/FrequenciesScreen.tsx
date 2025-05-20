import * as React from 'react';
import { View, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RoutesParamList } from '@/navigation/AppNavigaton';
import NoDataScreen from '../default/noData';
import Loading from '../default/loading';
import FAB from '@/components/buttons/fab';
import { FlatList } from 'react-native-gesture-handler';

type listFrequenciesScreenProp = NativeStackNavigationProp<RoutesParamList, "ListFrequencies">;

export default function ListFrequenciesScreen() {
  const frequencies:any = [];
  
  if(!frequencies) {
    return <Loading />
  }

  if(frequencies.length == 0) {
    return <NoDataScreen text='Nenhuma frequência cadastrada.' nextRoute='NewFrequency'/>
  }
  

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Frequencies Screen</Text>
       <FlatList
              data={frequencies}
              style={{ width: "100%" }}
              renderItem={({ item }) => (
                <>{JSON.stringify(item)}</>
              )}
            />
      </View>
  );
}