import React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";

interface HeaderProps {
  title: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftComponent?: React.ReactNode;
}

const Header = ({ title, style, textStyle, leftComponent }: HeaderProps) => {
  return (
    <View style={[styles.header, style as ViewStyle]}>
      <View style={styles.headerContent}>
        <View style={styles.leftSection}>
          {leftComponent || <View style={styles.backButtonPlaceholder} />}
        </View>
        <Text style={[styles.title, textStyle as TextStyle]}>{title}</Text>
      </View>
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
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftSection: {
    width: 40, // Fixed width for the left section
  },
  backButtonPlaceholder: {
    width: 40, // Same width as the back button area
  },
  title: {
    color: "#FFFFFF",
    fontSize: 35,
    fontWeight: "bold",
  },
});

export default Header;