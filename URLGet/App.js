import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import {
  StyleSheet,
  Button,
  View,
  SafeAreaView,
  Text,
  Alert,
} from "react-native";

const Separator = () => <View style={styles.separator} />;

export default class App extends Component {
  constructor() {
    super();
    this.state = { leftText: "blank!" };
  }

  leftButtonAction = () => {
    fetch(
      "https://5ketfr2si7.execute-api.us-east-2.amazonaws.com/dev/transactions?tranId=2&tranType=PURCHASE&tranAmount=100"
    )
      .then((response) => response.json())
      .then((data) => {
        this.setState({ leftText: data["tranMessage"] });
      })
      .catch((error) => console.log(error));
  };
  render() {
    console.log("App executed!");

    return (
      <SafeAreaView style={styles.container}>
        <View>
          <Text style={styles.title}>{this.state.leftText}</Text>
        </View>
        <Separator />
        <View>
          <Text style={styles.title}>
            This layout strategy lets the title define the width of the button.
          </Text>
          <View style={styles.fixToText}>
            <Button title="Get" onPress={this.leftButtonAction} />
            <Button
              title="Right button"
              onPress={() => Alert.alert("Right button pressed")}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 16,
  },
  title: {
    textAlign: "center",
    marginVertical: 8,
  },
  fixToText: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: "#737373",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
