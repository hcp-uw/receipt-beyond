import { Tabs } from 'expo-router';
import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

export default () => {
    return (
        <Tabs>
            <Tabs.Screen name="SummaryTab" options={{
                tabBarLabel:'',
                tabBarIcon:({color, size}) => (<Entypo name="home" size={24} color="black" />)
            }}/>
            <Tabs.Screen name="PriceWatchTab" options={{
                tabBarLabel:'',
                tabBarIcon:({color, size}) => (<AntDesign name="eye" size={24} color="black" />)
            }}/>
            <Tabs.Screen name="UserValidTab" options={{
                tabBarLabel:'',
                tabBarIcon:({color, size}) => (<Entypo name="camera" size={24} color="black" /> )
            }}/>
            <Tabs.Screen name="HistoryTab" options={{
                tabBarLabel:'',
                tabBarIcon:({color, size}) => (<Foundation name="list-bullet" size={24} color="black" />)
            }}/>
            <Tabs.Screen name="AccountTab" options={{
                tabBarLabel:'',
                tabBarIcon:({color, size}) => (<MaterialIcons name="account-circle" size={24} color="black" />)
            }}/>
        </Tabs>
    );
}