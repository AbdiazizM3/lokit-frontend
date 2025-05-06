import React, { useEffect } from "react";
import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity, ActivityIndicator } from "react-native";
import { useState } from "react";
import BackButton from "../components/BackButton";
import Header from "../components/Header";
import { updateEvent, deleteEvent, getEventById} from "../api";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
interface RouterProps {
    navigation: NavigationProp;
    route: any;
}

type RootStackParamList = {
    Home: undefined;
    EditEvent: { eventId: string };
    Main: { screen: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function EditEvent({route}: RouterProps) {
    const { eventId } = route.params;
    const navigation = useNavigation<NavigationProp>();
    const [eventTitle, setEventTitle] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [eventLocation, setEventLocation] = useState("");
    const [eventImage, setEventImage] = useState("");
    const [eventDate, setEventDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(true);
    const [isDelete, setIsDelete] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setIsLoading(true);
                const event = await getEventById(eventId);
                setEventTitle(event.event.event_title);
                setEventDescription(event.event.event_description);
                setEventLocation(event.event.event_location);
                setEventImage(event.event.event_img_url);
                setEventDate(new Date(event.event.event_date));
            } catch (error) {
                console.error("Error fetching event:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchEvent();
    }, []);

    const changeEvent = async () => {
        await updateEvent(eventId, {
            event_title: eventTitle,
            event_description: eventDescription,
            event_location: eventLocation,
            event_image: eventImage,
        });
        navigation.goBack();
    }

    const removeEvent = async () => {
        await deleteEvent(eventId);
        navigation.navigate('Main', {
            screen: 'Home'
        });
    }

    if (isLoading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

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
                <TouchableOpacity 
                    style={styles.dateButton}
                >
                    <Text>Event Date: {eventDate.toLocaleDateString()}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={changeEvent}
                    style={[styles.button, styles.saveButton]}
                >
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                {!isDelete ? (
                    <TouchableOpacity
                        onPress={() => setIsDelete(true)}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        onPress={removeEvent}
                        style={[styles.button, styles.deleteButton]}
                    >
                        <Text style={styles.buttonText}>Are you sure?</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    form: {
        padding: 20,
        gap: 10,
        backgroundColor: "#fff",
        borderRadius: 10,
        shadowColor: "#000",
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
    },
    button: {
        backgroundColor: "#2D336B",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    saveButton: {
        backgroundColor: "#2D336B",
    },
    deleteButton: {
        backgroundColor: "#FF0000",
    },
    buttonText: {
        color: '#fff',
    }
});