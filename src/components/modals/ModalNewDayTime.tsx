import { days, hours } from "@/constants/defaultValues";
import { CategoryType, TrainingDayType } from "@/types/category";
import { Formik, FormikHelpers } from "formik";
import React, { useEffect, useRef, useState } from "react";
import * as Yup from 'yup';
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { Layout } from "../views";
import { Text } from "../texts";
import { Select } from "../selects";
import { Option } from "../selects/select";
import { Button } from "../buttons";

type Props = {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    array: TrainingDayType[];
    setFieldValue: FormikHelpers<CategoryType>['setFieldValue'];
    editItemIndex?: number | null;
    setSelectedIndex: (index: number | null) => void;
};

export default function ModalNewDayTime({
    visible,
    setVisible,
    array,
    setFieldValue,
    editItemIndex,
    setSelectedIndex
}: Props) {
    const dayRef = useRef<View>(null);
    const startTimeRef = useRef<View>(null);
    const endTimeRef = useRef<View>(null);

    const [day, setDay] = useState<string>("");
    const [startTime, setStartTime] = useState<string>("");
    const [endTime, setEndTime] = useState<string>("");

    useEffect(() => {
        if (editItemIndex !== null && editItemIndex !== undefined) {
            const item = array[editItemIndex];
            setDay(item.day);
            setStartTime(item.trainingSchedule.start);
            setEndTime(item.trainingSchedule.end);
        }
    }, [editItemIndex, array]);

    const handleSubmit = (values: any, resetForm: () => void) => {
        const newItem: TrainingDayType = {
            day: values.day,
            trainingSchedule: {
                start: values.startTime,
                end: values.endTime,
            },
        };

        if (verifyIfExists(values.day, values.startTime, values.endTime)) {
            alert("Já existe um horário neste intervalo para este dia.");
            return;
        }

        if (editItemIndex !== null && editItemIndex !== undefined) {
            const updatedArray = [...array];
            updatedArray[editItemIndex] = newItem;
            setFieldValue("trainingDays", updatedArray);
            setSelectedIndex(null);
        } else {
            setFieldValue("trainingDays", [...array, newItem]);
        }

        resetForm();
        setVisible(false);
    };

    const convertTimeToMinutes = (time: string): number => {
        const [hour, minute] = time.split(":").map(Number);
        return hour * 60 + minute;
    };

    const verifyIfExists = (day: string, startTime: string, endTime: string): boolean => {
        const newStart = convertTimeToMinutes(startTime);
        const newEnd = convertTimeToMinutes(endTime);

        return array.some((item, idx) => {
            if (idx === editItemIndex) return false;
            if (item.day !== day) return false;

            const existing = item.trainingSchedule;
            const existingStart = convertTimeToMinutes(existing.start);
            const existingEnd = convertTimeToMinutes(existing.end);

            return (
                (newStart >= existingStart && newStart < existingEnd) ||
                (newEnd > existingStart && newEnd <= existingEnd) ||
                (newStart <= existingStart && newEnd >= existingEnd)
            );
        });
    };

    const validationSchema = Yup.object().shape({
        day: Yup.string().required("Campo obrigatório"),
        startTime: Yup.string().required("Campo obrigatório"),
        endTime: Yup.string()
            .required("Campo obrigatório")
            .test("is-greater", "A hora final deve ser maior que a inicial", function (endTime) {
                const { startTime } = this.parent;
                if (!startTime || !endTime) return true;
                return convertTimeToMinutes(endTime) > convertTimeToMinutes(startTime);
            }),
    });

    const initialValues = {
        day: day || "",
        startTime: startTime || "",
        endTime: endTime || "",
    };

    const hourOptions: Option[] = hours
    const daysOptions: Option[] = days

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
                <Formik
                    enableReinitialize
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values, { resetForm }) => handleSubmit(values, resetForm)}
                >
                    {({ handleSubmit, setFieldValue, errors, touched }) => (
                        <Layout style={styles.modalView}>
                            <Text variant="h5" style={{ marginBottom: 16, width: "100%", textAlign: 'center' }}>Novo dia e horário</Text>
                            <Layout style={{ width: "100%", }}>
                                <Select
                                    label="Dia da semana"
                                    ref={dayRef}
                                    value={day}
                                    options={daysOptions}
                                    status={errors.day ? "danger" : touched.day ? "success" : "default"}
                                    onSelect={(val) => {
                                        setDay(val);
                                        setFieldValue("day", val);
                                        startTimeRef.current?.focus();
                                    }}
                                />
                                {errors.day && <Text status="danger" style={{ width: "100%" }}>{errors.day}</Text>}
                            </Layout>

                            <Layout style={{ width: "100%", marginVertical: 10 }}>
                                <Select
                                    ref={startTimeRef}
                                    label="Hora de início"
                                    value={startTime}
                                    options={hourOptions}
                                    status={errors.startTime ? "danger" : touched.startTime ? "success" : "default"}
                                    onSelect={(val) => {
                                        setStartTime(val);
                                        setFieldValue("startTime", val);
                                        endTimeRef.current?.focus();
                                    }}
                                />
                                {errors.startTime && <Text status="danger" style={{ width: "100%" }}>{errors.startTime}</Text>}
                            </Layout>


                            <Layout style={{ width: "100%"}}>
                                <Select
                                    ref={endTimeRef}
                                    label="Hora de término"
                                    value={endTime}
                                    options={hourOptions}
                                    status={errors.endTime ? "danger" : touched.endTime ? "success" : "default"}
                                    onSelect={(val) => {
                                        setEndTime(val);
                                        setFieldValue("endTime", val);
                                    }}
                                />
                                {errors.endTime && <Text status="danger" style={{ width: "100%" }}>{errors.endTime}</Text>}
                            </Layout>


                            <View style={{ flexDirection: "row", justifyContent: "space-between", width:"100%", marginTop: 24, }}>
                                <Button title="Cancelar" status="danger" onPress={() => setVisible(false)} size="small" />
                                <Button title="Salvar" status="success" onPress={() => handleSubmit()} size="small" />
                            </View>
                        </Layout>
                    )}
                </Formik>
            </Layout>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: "#00000066",
        justifyContent: "center",
        padding: 26,
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 25,
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
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});
