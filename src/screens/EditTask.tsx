import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Image, ScrollView } from "react-native";
import Header from "../components/Header";
import BackButton from "../components/BackButton";
import { getTaskById, updateTask } from "../api";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
    EditTask: { eventId: string; taskId: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function EditTask({ route }: { route: any }) {
    const { eventId, taskId } = route.params;
    const navigation = useNavigation<NavigationProp>();
    const [isLoading, setIsLoading] = useState(true);
    const [taskTitle, setTaskTitle] = useState("");
    const [taskLocation, setTaskLocation] = useState("");
    const [taskStartTime, setTaskStartTime] = useState(new Date());
    const [taskEndTime, setTaskEndTime] = useState(new Date());
    const [taskDescription, setTaskDescription] = useState("");
    const [taskImgUrl, setTaskImgUrl] = useState("");
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                setIsLoading(true);
                const task = await getTaskById(eventId, taskId);
                setTaskTitle(task.task.task_title);
                setTaskLocation(task.task.task_location);
                const startTimeParts = task.task.task_start_time.split(':');
                const endTimeParts = task.task.task_end_time.split(':');
                const startDate = new Date();
                const endDate = new Date();
                startDate.setHours(parseInt(startTimeParts[0]), parseInt(startTimeParts[1]));
                endDate.setHours(parseInt(endTimeParts[0]), parseInt(endTimeParts[1]));
                setTaskStartTime(startDate);
                setTaskEndTime(endDate);
                setTaskDescription(task.task.task_description);
                setTaskImgUrl(task.task.task_img_url);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchTask();
    }, []);

    const onStartTimeChange = (event: any, selectedDate?: Date) => {
        setShowStartTimePicker(false);
        if (selectedDate) {
            setTaskStartTime(selectedDate);
        }
    };

    const onEndTimeChange = (event: any, selectedDate?: Date) => {
        setShowEndTimePicker(false);
        if (selectedDate) {
            setTaskEndTime(selectedDate);
        }
    };

    const saveTask = async () => {
        await updateTask(eventId, taskId, {
            task_title: taskTitle,
            task_start_time: taskStartTime.toLocaleTimeString(),
            task_end_time: taskEndTime.toLocaleTimeString(),
            task_location: taskLocation,
            task_description: taskDescription,
            task_img_url: taskImgUrl,
        });
        navigation.goBack();
    }

    if (isLoading) {
        return <ActivityIndicator size="large" color="#2D336B" />;
    }

    return (
        <View style={styles.container}>
            <Header title="Eventlock" leftComponent={<BackButton />} />
            <ScrollView>
                <View style={styles.content}>
                    <View style={styles.form}>
                        <Image source={{ uri: taskImgUrl }} style={styles.image} resizeMode="cover" />
                <TextInput
                    style={styles.input}
                    value={taskTitle}
                    onChangeText={setTaskTitle}
                    placeholder="Task Title"
                />
                <TextInput
                    style={styles.input}
                    value={taskLocation}
                    onChangeText={setTaskLocation}
                    placeholder="Task Location"
                />
                <View style={styles.timeContainer}>
                    <TouchableOpacity style={styles.dateButton} onPress={() => setShowStartTimePicker(true)}>
                        <Text>Start Time: {taskStartTime.toLocaleTimeString()}</Text>
                    </TouchableOpacity>
                    {showStartTimePicker && (
                        <DateTimePicker
                            value={taskStartTime}
                            mode="time"
                            onChange={onStartTimeChange}
                        />
                    )}
                    <TouchableOpacity style={styles.dateButton} onPress={() => setShowEndTimePicker(true)}>
                        <Text>End Time: {taskEndTime.toLocaleTimeString()}</Text>
                    </TouchableOpacity>
                    {showEndTimePicker && (
                        <DateTimePicker
                            value={taskEndTime}
                            mode="time"
                            onChange={onEndTimeChange}
                        />
                    )}
                </View>
                <TextInput
                    style={styles.input}
                    value={taskDescription}
                    onChangeText={setTaskDescription}
                    placeholder="Task Description"
                    multiline
                />
                <TextInput
                    style={styles.input}
                    value={taskImgUrl}
                    onChangeText={setTaskImgUrl}
                    placeholder="Task Image URL"
                />
                <TouchableOpacity style={styles.button} onPress={saveTask}>
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
    },
    form: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        gap: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    timeContainer: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    dateButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        backgroundColor: '#f8f8f8',
    },
    button: {
        backgroundColor: '#2D336B',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});