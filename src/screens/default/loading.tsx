import { Layout, Text } from '@/components';
import { useThemeContext } from '@/context/ThemeContext';
import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

const Loading: React.FC = () => {
    const {getDefaultColors} = useThemeContext();
    const { colors } = getDefaultColors();
    return (
        <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
            <ActivityIndicator size='large' color={colors.primary}/>
            <Text variant='h4'>Carregando...</Text>
        </Layout>
    );
};

export default Loading;