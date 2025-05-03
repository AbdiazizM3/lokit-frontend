import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ActivityIndicator } from 'react-native';
import { getUser, getUserIdByEmail, updateUser } from '../api';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';

interface UserData {
  user_avatar_img_url: string;
  user_name: string;
  user_email: string;
  user_id: string;
  user_is_staff: boolean;
  user_created_at: string;
}

const Profile = () => {
  const { signOut, user } = useAuth();
  const [userId, setUserId] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    const getUserId = async () => {
      setIsLoading(true);
      if (!user?.email) return;
      
      try {
        const response = await getUserIdByEmail(user.email);
        const newUserId = response.userId.user_id;
        setUserId(newUserId);
        
        const userResponse = await getUser(newUserId);
        setUserData(userResponse.user);
        setName(userResponse.user.user_name);
        setEmail(userResponse.user.user_email);
        setAvatar(userResponse.user.user_avatar_img_url);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    getUserId();
  }, [user?.email, isEditing]);

  const saveChanges = async () => {
    try {
      const response = await updateUser(userId, {
        user_name: name,
        user_email: email,
        user_avatar_img_url: avatar,
      });
      setIsEditing(!isEditing);
      alert("Changes saved successfully");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Lokit" />
      {isLoading ? (
        <ActivityIndicator size="large" color="#2D336B" />
      ) : (
        <>
        </>
      )}
        <View style={styles.profileInfo}>
        {userData && (
          <Image 
            source={{ uri: userData.user_avatar_img_url }} 
            style={styles.profileImage} 
          />
        )}
        <TextInput style={styles.nameInput} value={name} onChangeText={setName} />
        <TextInput style={styles.emailInput} editable={false} value={email} onChangeText={setEmail} />
        <TextInput style={styles.avatarInput} value={avatar} onChangeText={setAvatar} />
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileInfo: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 75,
    alignSelf: 'center',
  },
  email: {
    fontSize: 18,
    color: '#2D336B',
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#2D336B',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginVertical: 5,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nameInput: {
    borderWidth: 1,
    borderColor: '#2D336B',
    borderRadius: 10,
    padding: 10,
    width: '80%',
  },
  emailInput: {
    borderWidth: 1,
    borderColor: '#2D336B',
    borderRadius: 10,
    padding: 10,
    width: '80%',
  },
  avatarInput: {
    borderWidth: 1,
    borderColor: '#2D336B',
    borderRadius: 10,
    padding: 10,
    width: '80%',
  },
  saveButton: {
    backgroundColor: '#2D336B',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginVertical: 5,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Profile; 