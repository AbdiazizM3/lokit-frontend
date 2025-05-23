import React, { useState } from "react";
import { Text, StyleSheet, TouchableOpacity, Image } from "react-native";

const Card = ({ eventId, eventName, eventImage, eventDate, onPress, spanFullWidth }: { eventId: string, eventName: string, eventImage: string, eventDate: string, onPress: () => void, spanFullWidth: boolean }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.card, spanFullWidth && styles.fullWidthCard]}
    >
      <Image
        source={
          eventImage ? { uri: eventImage } : { uri: 'https://via.placeholder.com/150' }
        }
        style={[styles.image, spanFullWidth && styles.fullWidthCard]}
      />
      <Text style={styles.name}>{eventName}</Text>
      <Text style={styles.date}>{eventDate}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 8,
    alignItems: "center",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    margin: 8,
  },
  fullWidthCard: {
    flex: 1,
    width: "100%",
  },
  image: {
    width: "100%",
    height: 100,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginBottom: 8,
  },
  fullWithImage: {
    height: 150,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#24565C",
    textAlign: "center",
  },
  date: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
});

export default Card;