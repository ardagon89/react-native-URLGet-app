import { StatusBar } from "expo-status-bar";
import React, { Component, useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Button,
  View,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";

const Separator = () => <View style={styles.separator} />;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  console.log("App executed!");

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [leftText, setleftText] = useState("Blank!");
  const [tranParams, onChangeText] = React.useState(
    "tranId=2&tranType=PURCHASE&tranAmount=100"
  );
  const [alertFreq, setAlertFreq] = useState("10");

  function leftButtonAction() {
    console.log(tranParams);
    fetch(
      "https://5ketfr2si7.execute-api.us-east-2.amazonaws.com/dev/transactions?" +
        tranParams
    )
      .then((response) => response.json())
      .then((data) => {
        setleftText(
          data["tranId"] +
            "-" +
            data["tranType"] +
            " for $" +
            data["tranAmount"]
        );
      })
      .catch((error) => console.log(error));
  }

  async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "You've got mail! 📬",
        body: "Here is the notification body",
        data: { data: "goes here" },
      },
      trigger: { seconds: parseInt(alertFreq, 10), repeats: true },
    });

    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        leftButtonAction();
      }
    );
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log(response);
      }
    );

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Separator />
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <Text>Your expo push token: {expoPushToken}</Text>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ height: 40, textAlignVertical: "center" }}>Freq:</Text>
          <TextInput
            style={{
              height: 40,
              width: 40,
              borderColor: "gray",
              borderWidth: 1,
            }}
            onChangeText={(text) => setAlertFreq(text)}
            value={alertFreq}
          />
        </View>
        <View
          style={{
            width: "100%",
          }}
        >
          <Text>Params:</Text>
          <TextInput
            style={{
              height: 40,
              width: "100%",
              borderColor: "gray",
              borderWidth: 1,
            }}
            onChangeText={(text) => onChangeText(text)}
            value={tranParams}
          />
        </View>

        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Text>
            Title: {notification && notification.request.content.title}{" "}
          </Text>
          <Text>Body: {notification && notification.request.content.body}</Text>
          <Text>
            Data:{" "}
            {notification && JSON.stringify(notification.request.content.data)}
          </Text>
          <Text>Message: {leftText}</Text>
        </View>
        <Button
          title="Press to schedule a notification"
          onPress={async () => {
            await schedulePushNotification();
          }}
        />
        <Button
          title="Press to cancell all notifications"
          onPress={async () => {
            await Notifications.cancelAllScheduledNotificationsAsync();
            notificationListener.current.remove();
          }}
        />
      </View>
      <Separator />
      <View>
        <Text style={styles.title}>
          This layout strategy lets the title define the width of the button.
        </Text>
        <View style={styles.fixToText}>
          <Button title="Get" onPress={leftButtonAction} />
          <Button
            title="Right button"
            onPress={() => Alert.alert("Right button pressed")}
          />
        </View>
      </View>
    </SafeAreaView>
  );
  // }
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const {
      status: existingStatus,
    } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
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
