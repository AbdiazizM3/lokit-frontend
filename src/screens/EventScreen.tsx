import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList, Modal, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Header from '../components/Header';
import BackButton from '../components/BackButton';
import { useEffect, useState, useCallback } from 'react';
import { getEventById, getTasksByEventId, addMemberToEvent, getUserIdByEmail, getEventMemberById, removeMemberFromEvent } from '../api';
import TaskCard from '../components/TaskCard';
import { useAuth } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Task {
    task_id: number;
    task_title: string;
    task_img_url: string;
    task_location: string;
    task_start_time: string;
    task_end_time: string;
    event_id: number;
}

type RootStackParamList = {
    Task: { taskId: string; eventId: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function EventScreen({ route }: { route: any }) {
    const { eventId } = route.params;
    const navigation = useNavigation<NavigationProp>();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [eventImage, setEventImage] = useState('');
    const [eventTitle, setEventTitle] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [isAddingToCalendar, setIsAddingToCalendar] = useState(false);
    const [isMember, setIsMember] = useState(false);
    const [modalType, setModalType] = useState<'join' | 'leave'>('join');
    const [userId, setUserId] = useState<string | null>(null);

    const fetchEventData = async () => {
        setIsLoading(true);
        try {
            const response = await getEventById(eventId);
            setEventDate(response.event.event_date);
            setEventImage(response.event.event_img_url);
            setEventTitle(response.event.event_title);
            setEventLocation(response.event.event_location);

            const tasksResponse = await getTasksByEventId(eventId);
            setTasks(tasksResponse.tasks);

            if (user?.email) {
                const userResponse = await getUserIdByEmail(user.email);
                const currentUserId = userResponse.userId.user_id;
                setUserId(currentUserId);
                
                try {
                    const memberResponse = await getEventMemberById(eventId, currentUserId);
                    setIsMember(memberResponse && memberResponse.eventMember ? true : false);
                } catch (error) {
                    setIsMember(false);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchEventData();
        }, [eventId, user?.email])
    );

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
                onPress={() => {
                    navigation.navigate('Task', { taskId: item.task_id.toString(), eventId: eventId.toString() });
                }}
                spanFullWidth={false}
            />
        );
    };

    const handleAddToCalendar = async () => {
        if (!user?.email || !userId) {
            Alert.alert('Error', 'Please log in to add events to your calendar');
            return;
        }

        setIsAddingToCalendar(true);
        try {
            await addMemberToEvent(eventId, {user_id: userId});
            setIsMember(true);
            Alert.alert('Success', 'Event added to your calendar!');
            setShowModal(false);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to add event to calendar');
        } finally {
            setIsAddingToCalendar(false);
        }
    };

    const handleRemoveFromCalendar = async () => {
        if (!userId) return;

        setIsAddingToCalendar(true);
        try {
            await removeMemberFromEvent(eventId, {user_id: userId});
            setIsMember(false);
            Alert.alert('Success', 'Event removed from your calendar');
            setShowModal(false);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to remove event from calendar');
        } finally {
            setIsAddingToCalendar(false);
        }
    };

    const handleLockPress = () => {
        if (!user?.email) {
            Alert.alert('Error', 'Please log in to manage events');
            return;
        }
        setModalType(isMember ? 'leave' : 'join');
        setShowModal(true);
    };

    const RenderTasks = () => (
        <View style={styles.content}>
            <Image 
                source={
                    eventImage 
                        ? { uri: eventImage } 
                        : { uri: 'https://via.placeholder.com/150' }
                }
                style={styles.image}
                resizeMode="cover"
                onError={(e) => {
                    console.error('Error loading image:', e.nativeEvent.error);
                    setEventImage('');
                }}
            />
            <View style={styles.detailsContainer}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{eventTitle}</Text>
                    <TouchableOpacity 
                        style={[styles.addButton, isMember && styles.lockedButton]}
                        onPress={handleLockPress}
                    >
                        <Icon 
                            name={isMember ? "lock" : "lock-open"} 
                            size={24} 
                            color="#fff" 
                        />
                    </TouchableOpacity>
                </View>
                <Text style={styles.date}>{formattedDate}</Text>
                <Text style={styles.location}>{eventLocation}</Text>
            </View>
        </View>
    );
    
    return (
        <View style={styles.container}>
            <Header title="Lokit" leftComponent={<BackButton />} />
            <FlatList
                data={tasks}
                renderItem={renderTasks}
                keyExtractor={(item) => item.task_id.toString()}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={RenderTasks}
            />
            <Modal
                visible={showModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {modalType === 'join' ? 'Add to Calendar' : 'Remove from Calendar'}
                        </Text>
                        <Text style={styles.modalText}>
                            {modalType === 'join' 
                                ? 'Would you like to lock this event into your calendar?'
                                : 'Would you like to remove this event from your calendar?'}
                        </Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setShowModal(false)}
                                disabled={isAddingToCalendar}
                            >
                                <Text style={styles.buttonText}>No</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.confirmButton]}
                                onPress={modalType === 'join' ? handleAddToCalendar : handleRemoveFromCalendar}
                                disabled={isAddingToCalendar}
                            >
                                {isAddingToCalendar ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Text style={styles.buttonText}>Yes</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    addButton: {
        backgroundColor: '#2D336B',
        padding: 8,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lockedButton: {
        backgroundColor: '#4CAF50',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        width: '80%',
        maxWidth: 400,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2D336B',
        marginBottom: 12,
        textAlign: 'center',
    },
    modalText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#A9B5DF',
    },
    confirmButton: {
        backgroundColor: '#2D336B',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
