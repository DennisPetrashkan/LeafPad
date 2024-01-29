import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';


const checkPermissions = async () => {
    let { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
        let { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission to receive notifications was denied!');
            return false;
        }
    }
    return true;
}


async function scheduleNotification(content, date, id) {
    if (!checkPermissions()){ return }
  
    await Notifications.scheduleNotificationAsync({
        content: {
            sound: 'default',
            title: 'Note Reminder',
            body: content,
            data: {id: id}
        },

        trigger: {
            hour: date.getHours(),
            minute: date.getMinutes(),
            repeats: true,
        },
    });
};


async function cancelNotification(id) {
    await Notifications.cancelScheduledNotificationAsync(id);
}
  

export { scheduleNotification, cancelNotification };

