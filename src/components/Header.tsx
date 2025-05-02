import React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";

interface HeaderProps {
  title: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Header = ({ title, style, textStyle }: HeaderProps) => {
  return (
    <View style={[styles.header, style as ViewStyle]}>
      <Text style={[styles.title, textStyle as TextStyle]}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: "100%",
    marginTop: 0,
    paddingTop: 55,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "#2D336B",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 35,
    fontWeight: "bold",
  },
});

export default Header;