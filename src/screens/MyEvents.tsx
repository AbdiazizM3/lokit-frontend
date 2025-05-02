import { View, Text, Button } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import Header from '../components/Header';
interface RouterProps {
    navigation: NavigationProp<any, any>;
}

export default function Home({ navigation }: RouterProps) {
    return (
        <View style={{ flex: 1 }}>
            <Header title="Lokit" />
            <Text>My Events</Text>
        </View>
    );
}