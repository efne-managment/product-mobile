import React from 'react';
import { Image } from 'expo-image';
import { Modal, Pressable, StyleSheet } from 'react-native';
import { Layout } from '../views';
import { Button } from '../buttons';
import { Text } from '../texts';

interface OpenPhotoProps {
    uri: string;
    visible: boolean;
    setVisible: (visible: boolean) => void;
}

const ModalOpenPhoto: React.FC<OpenPhotoProps> = ({ uri, visible, setVisible }) => {
    return (
        <Modal visible={visible}
            animationType="slide"
            transparent
        >
          
            <Layout style={styles.centeredView}>
                <Layout style={styles.modalView}>
                    <Image
                        source={{ uri }}
                        style={{width: "100%", height: "80%", objectFit: 'contain', }}
                    />
                    <Button title='Fechar' onPress={() => setVisible(false)} size='small' style={{marginTop: 50}}/>
                </Layout>
            </Layout>

        </Modal>
    );
};

export default ModalOpenPhoto;



const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: "#00000066",
        justifyContent: "center",
        padding: 15,
    },
    modalView: {
        width: "100%",
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 10,
        gap: 5,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    overlay: {
        flex: 1,
        backgroundColor: "#00000066",
        justifyContent: "center",
        alignItems: 'center',
        padding: 24,
    },
})