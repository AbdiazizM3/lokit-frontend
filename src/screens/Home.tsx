import { View, Text, Button } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import Header from '../components/Header';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

export default function Home({ navigation }: RouterProps) {
    return (
        <View style={{ flex: 1 }}>
            <Header title="Home" />
            <View style={{ padding: 20, gap: 10 }}>
                <Button onPress={() => navigation.navigate('MyEvents')} title="My Events" />
            </View>
        </View>
    );
}