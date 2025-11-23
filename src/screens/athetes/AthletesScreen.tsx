import * as React from 'react';
import { useAthletesContext } from '@/context/AthletesContext';
import Loading from '../default/loading';
import NoDataScreen from '../default/noData';
import ListScreen from '../default/listScreen';

export default function ListAthletesScreen() {
  const { athletes } = useAthletesContext()

  if (!athletes) {
    return <Loading />
  }

  if (athletes.length == 0) {
    return <NoDataScreen text='Nenhum atleta cadastrado.' nextRoute='NewAthlete'/>
  }

  return (
   <ListScreen callCard='ATHLETE' data={athletes} nextRoute='NewAthlete' />
  );
}