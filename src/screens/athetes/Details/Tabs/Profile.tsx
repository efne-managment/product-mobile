// tabs/ProfileTab.tsx
import * as React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Linking } from "react-native";
import { Button, Layout, SectionDivider, Text } from "@/components";
import type { CategoryType } from "@/types/category";
import styles from "../../styles";
export default function ProfileTab({
  athlete,
  category,
  age,
}: {
  athlete: any; // AthleteType
  category?: CategoryType;
  age: number;
}) {
  return (
    <ScrollView
      contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
    >
      <SectionDivider title="Dados pessoais" />
      <Text variant="h5" style={styles.text}> {athlete?.name} </Text>
      <Text style={styles.text}>Data de nascimento: {new Date(athlete.born).toLocaleDateString("pt-BR")} ({age} anos)</Text>
      <Text style={styles.text}>Status: {athlete?.status}</Text>
      <Text style={styles.text}>Sexo: {athlete.gender}</Text>
      <Text style={styles.text}>Mãe: {athlete?.mother}</Text>
      <Text style={styles.text}>Pai: {athlete?.father}</Text>
      <Text variant="labelBold" style={styles.text}>Informações adicionais</Text>
      <Text style={styles.text}>{athlete?.aditionalInformation || "Não consta"}</Text>
      <SectionDivider title="Dados do atleta" />
      <Layout style={styles.sectionDataAthlete}>
        <Text style={styles.text}>Categoria: {category ? category.name : "Carregando..."}</Text>
        <Text style={styles.text}>Posição: {athlete?.position}</Text>
        <Text style={styles.text}>Peso: {athlete?.weight} kg</Text>
        <Text style={styles.text}>Altura: {athlete?.height} m</Text>
      </Layout>
      <SectionDivider title="Contato" />
      <Layout style={styles.column}>
        <Text style={styles.text}>Email: {athlete?.contact.email}</Text>
        {athlete?.contact.email && (
          <Button
            title="Enviar e-mail"
            size="semi"
            style={{ width: "100%", marginBottom: 15 }}
            onPress={() =>
              Linking.openURL(
                `mailto:${athlete.contact.email}?subject=Contato - Escolinha de Futebol Nova Esperança&body=Olá, tudo bem? Aqui é da Escolinha de Futebol Nova Esperança, podemos conversar sobre seu/sua filho(a)?.`
              )
            }
          />
        )}
      </Layout>
      <Layout style={styles.column}>
        <Text style={styles.text}>Telefone: {athlete?.contact.phone}</Text>
        {athlete?.contact.is_whatsapp && (
          <Button
            title="Enviar um Whatsapp"
            status="success"
            size="semi"
            style={{ width: "100%", marginBottom: 15 }}
            onPress={() =>
              Linking.openURL(
                `https://wa.me/${athlete.contact.phone.replace(
                  /\D/g,
                  ""
                )}?text=${encodeURIComponent(
                  `Olá! Tudo bem? Aqui é da Escolinha de Futebol Nova Esperança, podemos conversar sobre ${athlete.name} ?.`
                )}`
              )
            }
          />
        )}
      </Layout>
      <SectionDivider title="Endereço" />
      <Layout style={{ ...styles.column, width: "100%" }}>
        <Text variant="labelBold" style={styles.text}>Endereço:</Text>
        <Text style={styles.text}>
          {athlete?.contact.street}, nº {athlete?.contact.number}, bairro {athlete?.contact.neighborhood}
        </Text>
        <Text style={styles.text}>{athlete?.contact.city}, CEP: {athlete?.contact.zipCode || "Não consta"}</Text>
        <Text style={styles.text}>Ponto de Referência: {athlete.contact.referencePoint}</Text>
      </Layout>
      <SectionDivider title="Escola" />
      <Layout style={{ ...styles.column, width: "100%" }}>
        <Text style={styles.text}>Escola: {athlete.school.institution}</Text>
        <Text style={styles.text}>Turma: {athlete.school.year}</Text>
        <Text style={styles.text}>Turno: {athlete.school.shift}</Text>
      </Layout>
    </ScrollView>
  );
}
