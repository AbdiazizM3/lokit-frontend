import React, { useState } from "react";
import { Text, StyleSheet, TouchableOpacity, Image } from "react-native";

const Card = ({ taskId, taskName, taskImage, taskStart, taskEnd, taskLocation, onPress, spanFullWidth }: { taskId: string, taskName: string, taskImage: string, taskStart: string, taskEnd: string, taskLocation: string, onPress: () => void, spanFullWidth: boolean }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.card, spanFullWidth && styles.fullWidthCard]}
    >
      <Image
        source={
          taskImage ? { uri: taskImage } : { uri: 'https://via.placeholder.com/150' }
        }
        style={[styles.image, spanFullWidth && styles.fullWidthCard]}
      />
      <Text style={styles.name}>{taskName}</Text>
      <Text style={styles.date}>{taskStart} - {taskEnd}</Text>
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