import { View, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity, ScrollView } from "react-native";
import Header from "../components/Header";
import BackButton from "../components/BackButton";
import { useEffect, useState } from "react";
import { deleteTask, getTaskById } from "../api";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  EditTask: { eventId: string; taskId: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function TaskScreen({ route }: { route: any }) {
  const { taskId, eventId } = route.params;
  const navigation = useNavigation<NavigationProp>();
  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [taskImage, setTaskImage] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskLocation, setTaskLocation] = useState("");
  const [taskStartTime, setTaskStartTime] = useState("");
  const [taskEndTime, setTaskEndTime] = useState(""); 
  const [taskDescription, setTaskDescription] = useState("");
  const {isUserStaff} = useAuth();
  const [isDelete, setIsDelete] = useState(false);

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

  useEffect(() => {
    setIsLoading(true);
    const fetchTask = async () => {
      try {
        const tasksResponse = await getTaskById(eventId, taskId);
        setTask(tasksResponse.task);
        setTaskImage(tasksResponse.task.task_img_url);
        setTaskTitle(tasksResponse.task.task_title);
        setTaskLocation(tasksResponse.task.task_location);
        setTaskStartTime(formatTime(tasksResponse.task.task_start_time));
        setTaskEndTime(formatTime(tasksResponse.task.task_end_time));
        setTaskDescription(tasksResponse.task.task_description);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTask();
  }, [taskId]);

  const removeTask = async () => {
    await deleteTask(eventId, taskId);
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
          <Image source={{ uri: taskImage }} style={styles.image} resizeMode="cover" />
          <Text style={styles.title}>{taskTitle}</Text>
        <Text style={styles.location}>{taskLocation}</Text>
        <View style={styles.timeContainer}>
          <Text style={styles.timeLabel}>Start Time:</Text>
          <Text style={styles.time}>{taskStartTime}</Text>
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.timeLabel}>End Time:</Text>
          <Text style={styles.time}>{taskEndTime}</Text>
        </View>
        <Text style={styles.description}>{taskDescription}</Text>
        {isUserStaff && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EditTask', { eventId: eventId, taskId: taskId })}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          {!isDelete ? (
            <TouchableOpacity style={styles.button} onPress={() => setIsDelete(true)}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={removeTask}>
              <Text style={styles.buttonText}>Are you sure?</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
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
    marginBottom: 16,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeLabel: {
    fontSize: 16,
    color: '#666',
    width: 100,
  },
  time: {
    fontSize: 16,
    color: '#2D336B',
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginTop: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    backgroundColor: '#2D336B',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#FF0000',
  },
});
