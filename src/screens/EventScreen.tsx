import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function EventScreen({ route }: { route: any }) {
    const { eventId, eventTitle, eventImage, location } = route.params;

    return (
        <View style={styles.container}>
            <Text>{eventTitle}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
