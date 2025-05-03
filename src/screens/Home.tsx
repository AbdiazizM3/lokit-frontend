import { View, Text, ActivityIndicator, FlatList } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import Header from '../components/Header';
import { useEffect, useState } from 'react';
import { getEvents } from '../api';
import Card from '../components/Card';

interface Event {
    event_id: number;
    event_title: string;
    event_img_url: string;
    location: string;
}

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

export default function Home({ navigation }: RouterProps) {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await getEvents();
                setEvents(response.events);
            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    if (loading) {
        return <ActivityIndicator />;
    }

    const renderEvents = ({ item }: { item: Event }) => (
        <Card
            eventId={item.event_id.toString()}
            eventName={item.event_title}
            eventImage={item.event_img_url}
            onPress={() =>
                navigation.navigate("Event", {
                    eventId: item.event_id,
                    eventTitle: item.event_title,
                    eventImage: item.event_img_url,
                    location: item.location,
                })
            }
            spanFullWidth={false}
        />
    );

    return (
        <View style={{ flex: 1 }}>
            <Header title="Lokit" />
            <FlatList
                data={events}
                renderItem={renderEvents}
                keyExtractor={(item) => item.event_id.toString()}
                contentContainerStyle={{ padding: 20, gap: 10 }}
                numColumns={2}
            />
        </View>
    );
}