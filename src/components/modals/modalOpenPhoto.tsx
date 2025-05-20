import React from 'react';
import { Image } from 'expo-image';
import { Modal, Pressable, StyleSheet } from 'react-native';
import { Layout } from '../views';
import { Button } from '../buttons';

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
            <Pressable
                onPress={() => setVisible(false)}
                style={styles.overlay}
            ></Pressable>
            <Layout style={styles.centeredView}>
                <Layout style={styles.modalView}>
                    <Image
                        source={{ uri }}
                        style={{ width: 400, height: 600, resizeMode: 'contain', }}
                    />
                    <Button title='Fechar' onPress={() => setVisible(false)} style={{ marginTop: 50, borderRadius: 25 }} />
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
        flexDirection: 'column',
        backgroundColor: "#00000066",
        justifyContent: "center",
        padding: 26,
    },
    modalView: {
        width: 450,
        margin: 10,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
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