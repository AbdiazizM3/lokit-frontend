import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { useEffect, useState } from 'react';
import { getEventById, getTasksByEventId } from '../api';
import TaskCard from '../components/TaskCard';

interface Task {
    task_id: number;
    task_title: string;
    task_img_url: string;
    task_location: string;
    task_start_time: string;
    task_end_time: string;
}

export default function EventScreen({ route }: { route: any }) {
    const { eventId } = route.params;
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(true);
    const [eventImage, setEventImage] = useState('');
    const [eventTitle, setEventTitle] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        const fetchEvent = async () => {
            setIsLoading(true);
            try{
                const response = await getEventById(eventId);
                setEventDate(response.event.event_date);
                setEventImage(response.event.event_img_url);
                setEventTitle(response.event.event_title);
                setEventLocation(response.event.event_location);

                const tasksResponse = await getTasksByEventId(eventId);
                setTasks(tasksResponse.tasks);
            }catch(error){
                console.error(error);
            }finally{
                setIsLoading(false);
            }
        };
        fetchEvent();
    },[eventId])

    if(isLoading){
        return <ActivityIndicator size="large" color="#2D336B" />;
    }

    const isoDate = new Date(eventDate);
    const formattedDate = isoDate.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    const formatTime = (timeString: string) => {
        if (!timeString) return 'Time not specified';

        const timeParts = timeString.split(':');
        if (timeParts.length >= 2) {
            const hours = timeParts[0].padStart(2, '0');
            const minutes = timeParts[1].padStart(2, '0');
            return `${hours}:${minutes}`;
        }
        
        return 'Invalid time';
    };

    const renderTasks = ({ item }: { item: Task }) => {
        const formattedTimeStart = formatTime(item.task_start_time);
        const formattedTimeEnd = formatTime(item.task_end_time);
        return (
            <TaskCard
                taskId={item.task_id.toString()}
                taskName={item.task_title}
                taskImage={item.task_img_url}
                taskStart={formattedTimeStart}
                taskEnd={formattedTimeEnd}
                taskLocation={item.task_location}
                onPress={() => {}}
                spanFullWidth={false}
            />
        );
    };

    const RenderTasks = () => (
        <View style={styles.content}>
            <Image 
                source={{ uri: eventImage }} 
                style={styles.image}
                resizeMode="cover"
            />
            <View style={styles.detailsContainer}>
                <Text style={styles.title}>{eventTitle}</Text>
                <Text style={styles.date}>{formattedDate}</Text>
                <Text style={styles.location}>{eventLocation}</Text>
            </View>
        </View>
    );
    
    return (
        <View style={styles.container}>
            <Header title="Lokit" />
            <FlatList
                data={tasks}
                renderItem={renderTasks}
                keyExtractor={(item) => item.task_id.toString()}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={RenderTasks}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    listContent: {
        padding: 16,
        gap: 10,
    },
    content: {
        marginBottom: 16,
    },
    image: {
        width: '100%',
        height: 120,
        borderRadius: 12,
        marginTop: 16,
    },
    detailsContainer: {
        marginTop: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2D336B',
        marginBottom: 8,
    },
    location: {
        fontSize: 16,
        color: '#666',
    },
    date: {
        fontSize: 16,
        color: '#666',
    },
});
