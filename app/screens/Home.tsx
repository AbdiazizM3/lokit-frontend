import { View, Text, Button } from 'react-native';
import { FIREBASE_AUTH } from '../../FirebaseConfig';

export default function Home() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Home</Text>
            <Button onPress={() => FIREBASE_AUTH.signOut()} title="Logout" />
        </View>
    );
}