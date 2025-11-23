import * as React from 'react';
import { useCategoriesContext } from '@/context/CategoriesContext';
import Loading from '../default/loading';
import NoDataScreen from '../default/noData';
import ListScreen from '../default/listScreen';

export default function ListCategoriesScreen() {
  const { categories } = useCategoriesContext();

  if (!categories) {
    return <Loading />
  }

  if (categories.length == 0) {
    return <NoDataScreen text='Nenhuma categoria cadastrada.' nextRoute='NewCategory' />
  }

  return (
    <ListScreen callCard='CATEGORY' data={categories} nextRoute='NewCategory' />
  );
}

