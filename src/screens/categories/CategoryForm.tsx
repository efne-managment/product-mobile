import * as React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RoutesParamList } from '@/navigation/AppNavigaton';
import { useNavigation } from '@react-navigation/native';
import ModalNewDayTime from '../../components/modals/ModalNewDayTime';
import styles from './styles';
import { ScrollView } from 'react-native';
import { Formik } from 'formik';
import { saveCategorySchema } from '@/validators/saveCategorySchema';
import { CategoryType } from '@/types/category';
import { Button, IconButton, Input, Layout, SectionDivider, Text } from '@/components';
import { useThemeContext } from '@/context/ThemeContext';

type Props = {
  initialValues: CategoryType;
  mode: "edit" | "create";
  handleSubmit: (values: CategoryType) => any
  loading: boolean
}

type newCategoryScreenProp = NativeStackNavigationProp<RoutesParamList>;

export default function CategoryForm({ initialValues, handleSubmit, loading = false }: Props) {

  const navigation = useNavigation<newCategoryScreenProp>();
  const [openModal, setOpenModal] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);
  const { getDefaultColors } = useThemeContext();


  const { colors } = getDefaultColors();
 
  return (

    <Layout style={{ flex: 1 }}>
      <Formik
        initialValues={initialValues}
        validationSchema={saveCategorySchema}
        onSubmit={(values) => {
          handleSubmit(values)
        }}
      >

        {({ values, touched, errors, handleSubmit, handleChange, setFieldValue }) => (

          <Layout style={styles.container}>
            <Layout style={{ ...styles.containerForm }}>
              <Layout style={styles.containerInput}>
                <Input
                  label="Nome da categoria"
                  placeholder="Ex. Sub-15 Masculino"
                  returnKeyType="next"
                  autoCapitalize="words"
                  autoCorrect={false}
                  autoComplete="name"
                  value={values.name}
                  onChangeText={handleChange('name')}
                  status={errors.name ? "danger" : touched.name ? "success" : "default"}
                />
                {errors.name && <Text status="danger">{errors.name}</Text>}
              </Layout>
              <Button title=" Adicionar dia e horário de treino" size='medium' status='success' onPress={() => setOpenModal(true)} style={styles.button} />

            </Layout>
            <ScrollView style={{ marginTop: 50 }}>
              <SectionDivider title='Dias e horários de treino' />

              {
                values.trainingDays.map((item, index) =>


                    <Layout key={index} style={{flexDirection: 'row', marginVertical: 5, justifyContent: 'space-between'}}>

                      <Text style={{ width: "75%" }} >
                        {item?.day} - {item?.trainingSchedule?.start} - {item?.trainingSchedule?.end}
                      </Text>

                      <IconButton
                        iconName='trash'
                        iconColor={colors.danger}
                        appearance='outline'
                        status='basic'
                        onPress={() => {
                          setFieldValue('trainingDays', values.trainingDays.filter((_, i) => i !== index));
                        }}
                      />
                      <IconButton
                        iconName='edit'
                        iconColor={colors.warning}
                        appearance='outline'
                        status='basic'
                        onPress={() => {
                          setOpenModal(true);
                          setSelectedIndex(index);
                        }}
                      />

                    </Layout>
                )
              }

            </ScrollView>
            {typeof errors.trainingDays === 'string' && (
              <Text status="danger" style={{ marginTop: 8 }}>
                {errors.trainingDays}
              </Text>
            )}

            {Array.isArray(errors.trainingDays) &&
              errors.trainingDays.map((error, index) => (
                <Text key={index} status="danger" style={{ marginTop: 8 }}>
                  {typeof error === 'string' ? error : 'Erro no item'}
                </Text>
              ))}

            <Layout style={{ ...styles.row }}>
              <Button
                size="semi"
                disabled={loading}
                title="Cancelar"
                appearance={'default'}
                status={loading ? "basic" : "warning"}
                onPress={() => navigation.goBack()}
              />

              <Button
                size="semi"
                disabled={loading}
                title={loading ? 'Salvando...' : 'Salvar'}
                appearance={'default'}
                status={loading ? "basic" : "primary"}
                onPress={() =>
                  handleSubmit()}

              />

            </Layout>
            {openModal && (
              <ModalNewDayTime
                visible={openModal}
                setVisible={setOpenModal}
                array={values.trainingDays}
                setFieldValue={setFieldValue}
                setSelectedIndex={setSelectedIndex}
                editItemIndex={selectedIndex}
              />
            )}
          </Layout>
        )}
      </Formik>
    </Layout>
  );
}