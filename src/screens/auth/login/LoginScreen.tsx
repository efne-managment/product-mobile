import { RoutesParamList } from "@/navigation/AppNavigaton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { useRef, useState } from "react";
import { Formik } from "formik";
import LoginSchema from "@/validators/loginSchema";
import { useAuth } from "@/context/AuthContext";
import { Image } from "expo-image";
import styles from "./styles";
import { useAssets } from "expo-asset";
import { KeyboardAvoidingView, Platform, ScrollView, TextInput } from "react-native";
import { Button, Checkbox, Input, Layout, Text } from "@/components";
import { useThemeContext } from "@/context/ThemeContext";

type loginParamsList = NativeStackNavigationProp<RoutesParamList, "Login">;

export default function LoginScreen() {
  const { login } = useAuth();
  const [assets, error] = useAssets([require('assets/splash_v2.png')]);
  const navigation = useNavigation<loginParamsList>();
  const passwordRef = useRef<TextInput>(null);

  const { getDefaultColors } = useThemeContext();
  const { colors } = getDefaultColors();
  
  const onSubmitting = async (value: { username: string, password: string, keepConnected: boolean }) => {
    try {
      await login(value);
    } catch (e) {
      alert("Erro ao logar.")
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <Layout style={styles.container}>
        <Layout style={styles.containerImg}>
          <Image
            source={assets ? assets[0] : null}
            contentFit="contain"
            style={styles.image}
          />
        </Layout>

        <Formik
          initialValues={{ username: '', password: '', keepConnected: false }}
          validationSchema={LoginSchema}
          onSubmit={(value) => onSubmitting(value)}
        >
          {
            ({ handleChange, handleBlur, handleSubmit, values, setFieldValue, errors, touched, isSubmitting }) => (

              <Layout style={styles.containerForm}>
                <Layout style={styles.containerInput}>
                  <Input
                    label="E-mail"
                    placeholder="Seu e-mail"
                    returnKeyType="next"
                    onSubmitEditing={() => passwordRef.current?.focus()}
                    autoCapitalize="none"
                    value={values.username}
                    onChangeText={handleChange('username')}
                    onBlur={handleBlur('username')}
                    status={errors.username ? "danger" : touched.username ? "success" : "default"}
                  />
                  {errors.username ? <Text status="danger">{errors.username}</Text> : null}
                </Layout>

                <Layout style={styles.containerInput}>
                  <Input
                    label="Senha"
                    placeholder="Sua senha"
                    secureTextEntry
                    ref={passwordRef}
                    autoCapitalize="none"
                    returnKeyType="done"
                    value={values.password}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    status={errors.password ? "danger" : touched.password ? "success" : "default"}
                  />
                  {errors.password ? <Text status="danger">{errors.password}</Text> : null}
                </Layout>


                <Layout style={styles.containerInput}>
                  <Checkbox
                    label="Mantenha-me conectado"
                    status="default"
                    checked={values.keepConnected}
                    onChange={(value) => setFieldValue('keepConnected', value)}
                  />
                </Layout>


                <Layout style={styles.containerInput}>
                  <Button title="Esqueci minha senha" size="semi" status="warning" appearance="ghost" onPress={() => navigation.navigate("ForgotPassword")} />
                </Layout>

                <Button size="large" title={isSubmitting ? "Entrando..." : "Entrar"} status={isSubmitting ? "basic" : "primary"} onPress={handleSubmit as any} disabled={isSubmitting} />
              </Layout>

            )
          }
        </Formik>


        <Layout style={styles.containerFooter}>
          {/* <Button
          title="Cadastrar-me"
          size="medium"
            appearance='ghost'
            status="danger"
            onPress={() => navigation.navigate("Register")}
         /> */}
        </Layout>

      </Layout>
    </KeyboardAvoidingView>
  );
}
