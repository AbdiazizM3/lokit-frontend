import { View, Text, ActivityIndicator, FlatList, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationProp, useFocusEffect } from '@react-navigation/native';
import Header from '../components/Header';
import { useState, useCallback } from 'react';
import { getEvents } from '../api';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';

interface Event {
    event_id: number;
    event_title: string;
    event_img_url: string;
    event_date: string;
}

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

export default function Home({ navigation }: RouterProps) {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const { user, isUserStaff } = useAuth();

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await getEvents();
            setEvents(response.events);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchEvents();
        }, [])
    );

    if (loading) {
        return <ActivityIndicator />;
    }

    const renderEvents = ({ item }: { item: Event }) => {
        const isoDate = new Date(item.event_date);
        const formattedDate = isoDate.toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        return (
            <Card
                eventId={item.event_id.toString()}
                eventName={item.event_title}
                eventImage={item.event_img_url}
                eventDate={formattedDate}
                onPress={() =>
                    navigation.navigate("Event", {
                        eventId: item.event_id,
                    })
                }
                spanFullWidth={false}
            />
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <Header title="Eventlock" />
            <FlatList
                data={events}
                renderItem={renderEvents}
                keyExtractor={(item) => item.event_id.toString()}
                contentContainerStyle={{ padding: 20, gap: 10 }}
                numColumns={1}
            />
            {isUserStaff && (
                <TouchableOpacity onPress={() => navigation.navigate('CreateEvent')} style={styles.button}>
                    <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#000',
        padding: 10,
        borderRadius: 50,
    },
    buttonText: {
        color: '#fff',
    }
});