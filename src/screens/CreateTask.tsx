import React, { useState } from "react";
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Alert} from "react-native";
import { createTask } from "../api";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import DateTimePicker from '@react-native-community/datetimepicker';
import Header from "../components/Header";
import BackButton from "../components/BackButton";
type RootStackParamList = {
    CreateTask: { eventId: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function CreateTask({route}: {route: any}) {
    const { eventId } = route.params;
    const navigation = useNavigation<NavigationProp>();
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskLocation, setTaskLocation] = useState('');
    const [taskStartTime, setTaskStartTime] = useState(new Date());
    const [taskEndTime, setTaskEndTime] = useState(new Date());
    const [taskImage, setTaskImage] = useState('');
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);

    const postTask = async () => {
        if(taskTitle ===''){
            Alert.alert('Please enter a task title');
            return;
        }
        const response = await createTask(eventId, {
            task_title: taskTitle,
            task_description: taskDescription,
            task_location: taskLocation,
            task_start_time: taskStartTime.toLocaleTimeString(),
            task_end_time: taskEndTime.toLocaleTimeString()
        });
        if(response){
            navigation.goBack();
        }
    }

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

    return (
        <View style={styles.container}>
            <Header title="Eventlock" leftComponent={<BackButton />} />
            <View style={styles.form}>
            <TextInput
                placeholder="Task Title"
                value={taskTitle}
                onChangeText={setTaskTitle}
                style={styles.input}
            />
            <TextInput
                placeholder="Task Description"
                value={taskDescription}
                onChangeText={setTaskDescription}
                style={styles.input}
            />
            <TextInput
                placeholder="Task Location"
                value={taskLocation}
                onChangeText={setTaskLocation}
                style={styles.input}
            />
            <View style={styles.dateContainer}>
            <TouchableOpacity style={styles.dateButton} onPress={() => setShowStartTimePicker(true)}>
                <Text>{taskStartTime.toLocaleTimeString()}</Text>
            </TouchableOpacity>
            {showStartTimePicker && (
                <DateTimePicker
                    value={taskStartTime}
                    mode="time"
                    onChange={onStartTimeChange}
                />
            )}
            <TouchableOpacity style={styles.dateButton} onPress={() => setShowEndTimePicker(true)}>
                <Text>{taskEndTime.toLocaleTimeString()}</Text>
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
                placeholder="Task Image"
                value={taskImage}
                onChangeText={setTaskImage}
                style={styles.input}
            />
            <Button
                title="Create Task"
                onPress={postTask}
            />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    form: {
        marginTop: 20,
        padding: 20,
        gap: 10,
        backgroundColor: '#fff',
    },
    input: {
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
    },
    dateButton: {
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
    },
    button: {
        marginTop: 10,
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    textInput: {
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
    },
    dateContainer: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
});
