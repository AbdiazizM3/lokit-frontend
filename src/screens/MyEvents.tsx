import { View, Text, Button, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { NavigationProp, useFocusEffect } from '@react-navigation/native';
import Header from '../components/Header';
import { useEffect, useCallback } from 'react';
import { getEventsByUserId, getUserIdByEmail, getEventById } from '../api';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

interface Event {
    event_id: number;
    event_title: string;
    event_img_url: string;
    event_date: string;
}

export default function MyEvents({ navigation }: RouterProps) {
    const { user } = useAuth();
    const [userId, setUserId] = useState('');
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchEvents = useCallback(async () => {
        if (!user?.email) return;
        
        setIsLoading(true);
        try {
            const userResponse = await getUserIdByEmail(user?.email);
            const newUserId = userResponse.userId.user_id;
            setUserId(newUserId);
            const response = await getEventsByUserId(newUserId);
            
            const eventDetails = await Promise.all(
                response.events.map(async (event: any) => {
                    const eventResponse = await getEventById(event.event_id);
                    return eventResponse.event;
                })
            );
            
            setEvents(eventDetails);
        } catch (error) {
            console.error(error);
            setEvents([]);
        } finally {
            setIsLoading(false);
        }
    }, [user?.email]);

    useFocusEffect(
        useCallback(() => {
            fetchEvents();
        }, [fetchEvents])
    );

    if (isLoading) {
        return <ActivityIndicator size="large" color="#2D336B" />;
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

    const EmptyState = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>You haven't signed up for any events yet</Text>
            <Button
                title="Browse Events"
                onPress={() => navigation.navigate("Home")}
                color="#2D336B"
            />
        </View>
    );
    
    return (
        <View style={styles.container}>
            <Header title="Lokit" />
            {events.length === 0 ? (
                <EmptyState />
            ) : (
                <FlatList
                    data={events}
                    renderItem={renderEvents}
                    keyExtractor={(item) => item.event_id.toString()}
                    contentContainerStyle={{ padding: 20, gap: 10 }}
                    numColumns={2}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
});
