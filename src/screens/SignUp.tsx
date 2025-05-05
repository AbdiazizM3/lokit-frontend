import { Text, View, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, ActivityIndicator } from "react-native"
import { useState } from "react"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { FIREBASE_AUTH } from "../../FirebaseConfig"
import { createUser } from "../api"

export default function SignUp({navigation}: {navigation: any}) {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState('');
    const auth = FIREBASE_AUTH;

    const signUp = async () => {
        if (!firstname || !lastname || !email || !password || !confirmPassword) {
            setErr("All fields are required");
            return;
        }

        if (password !== confirmPassword) {
            setErr("Passwords do not match");
            return;
        }
        setLoading(true);
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            await createUser({user_email: email, user_name: `${firstname} ${lastname}`,});
            setFirstname('');
            setLastname('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            navigation.navigate('Main');
        } catch (error: any) {
            alert(`Sign up failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Eventlock</Text>
            <KeyboardAvoidingView behavior="padding">
            <View style={{flexDirection: "row", justifyContent: "space-between"}}>
            <TextInput
              placeholder="First Name"
              value={firstname}
              onChangeText={setFirstname}
              style={[styles.input, styles.halfInput]}
              placeholderTextColor="#888"
            />
            <TextInput
              placeholder="Last Name"
              value={lastname}
              onChangeText={setLastname}
              style={[styles.input, styles.halfInput, styles.lastInput]}
              placeholderTextColor="#888"
            />
          </View>
                <TextInput
                    value={email}
                    style={styles.input}
                    placeholder="Email"
                    autoCapitalize="none"
                    onChangeText={(text) => setEmail(text)}
                />
                <TextInput
                    secureTextEntry={true}
                    value={password}
                    style={styles.input}
                    placeholder="Password"
                    autoCapitalize="none"
                    onChangeText={(text) => setPassword(text)}
                />
                <TextInput
                    secureTextEntry={true}
                    value={confirmPassword}
                    style={styles.input}
                    placeholder="Confirm Password"
                    autoCapitalize="none"
                    onChangeText={(text) => setConfirmPassword(text)}
                />
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <View style={{ justifyContent: 'space-between' }}>
                        <TouchableOpacity style={styles.signup} onPress={signUp}>
                            <Text style={styles.buttonText}>Sign up</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </KeyboardAvoidingView>
            {err
            ? <Text style={styles.err}>
                {err}
              </Text>
            : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 20,
        justifyContent: 'center',
    },
    input: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    signup: {
        backgroundColor: '#7886C7',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginVertical: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    header: {
        color: '#2D336B',
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
    },
    halfInput: {
        width: '48%',
    },
    lastInput: {
        marginLeft: '4%',
    },
    err: {
        color: "red",
        marginBottom: 10,
        textAlign: "center"
      }
});