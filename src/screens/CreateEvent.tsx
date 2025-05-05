import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet, Platform, TouchableOpacity } from "react-native";
import Header from "../components/Header";
import { useState, useEffect } from "react";
import { createEvent } from "../api";
import { useUserId } from "../context/UserIdContext";
import DateTimePicker from '@react-native-community/datetimepicker';
import { NavigationProp } from "@react-navigation/native";
import BackButton from "../components/BackButton";

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

export default function CreateEvent({ navigation }: RouterProps) {
    const [eventTitle, setEventTitle] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [eventDate, setEventDate] = useState(new Date());
    const [eventLocation, setEventLocation] = useState('');
    const [eventImage, setEventImage] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const { userId } = useUserId();

    const handleCreateEvent = async () => {
        if (!userId) return;
        const event = await createEvent({event_title: eventTitle, event_descritpion: eventDescription, event_date: eventDate, event_location: eventLocation, event_img_url: eventImage, event_created_by: userId});
        setEventTitle('');
        setEventDescription('');
        setEventDate(new Date());
        setEventLocation('');
        setEventImage('');
        if (event) {
            navigation.goBack();
        }
    }

    const onDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setEventDate(selectedDate);
        }
    };

    return (
        <View style={styles.container}>
            <Header title="Eventlock" leftComponent={<BackButton />} />
            <View style={styles.form}>
                <TextInput
                    placeholder="Event Title"
                    value={eventTitle}
                    onChangeText={setEventTitle}
                    style={styles.input}
                />
                <TouchableOpacity 
                    style={styles.dateButton}
                    onPress={() => setShowDatePicker(true)}
                >
                    <Text>{eventDate.toLocaleDateString()}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={eventDate}
                        mode="date"
                        onChange={onDateChange}
                        minimumDate={new Date()}
                    />
                )}
                <TextInput
                    placeholder="Event Description"
                    value={eventDescription}
                    onChangeText={setEventDescription}
                    style={styles.input}
                    multiline
                />
                <TextInput
                    placeholder="Event Location"
                    value={eventLocation}
                    onChangeText={setEventLocation}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Event Image"
                    value={eventImage}
                    onChangeText={setEventImage}
                    style={styles.input}
                />
                <Button title="Create Event" onPress={handleCreateEvent} />
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
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 5,
    },
    dateButton: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#f8f8f8',
    }
});