# react-native-URLGet-app

React native app to use API methods and lambda funtions

# If running in docker

docker-compose up --build
<br/>
docker-compose down --remove-orphans
<br/>
docker-compose push

# Find the web app at

http://192.168.99.100:19006/

# If running in Android Studio

npm install -g expo-cli
<br/>
expo init URLGet --template blank # Also: npx URLGet run-android
<br/>
cd URLGet
<br/>
expo install expo-notifications
<br/>
Open your app.json and add the following inside of the "expo" field:
{
"expo": {
...
"android": {
...
"useNextNotificationsApi": true,
}
}
}
<br/>
npm start
<br/>

# Necessary documentation.

https://docs.expo.io/versions/latest/sdk/notifications/

# To view the app

npm start
<br/>
Run a virtual device in Android Studio AVD
<br/>
Click on "Run in android device/simulator" at http://localhost:19002/

# To build an apk

Follow the steps in https://docs.expo.io/distribution/building-standalone-apps/
<br/>
expo build:android -t apk
