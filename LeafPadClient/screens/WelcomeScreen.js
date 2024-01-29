import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, ImageBackground, TouchableOpacity } from 'react-native';

function WelcomeScreen({navigation}) {
  const LogInNavigation = () => {
    navigation.navigate("LoginScreen");
  }

  const RegisterNavigation = () => {
    navigation.navigate("RegisterScreen")
  }

  return (
    <ImageBackground style={styles.background} source={require('../assets/garden.png')}>
      <View style={styles.overlay} />
      <StatusBar hidden={true}/>
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={require('../assets/logo.png')}/>
        <Text style={styles.logoText}>The Right Way to Run Your Business</Text>
      </View> 
      <TouchableOpacity style={styles.loginButton} onPress={LogInNavigation}>
        <Text style={styles.Text}>Log In</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.registerButton} onPress={RegisterNavigation}>
        <Text style={styles.Text}>Register</Text>
      </TouchableOpacity>
    </ImageBackground>  
    
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center"

  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Adjust the alpha value to control darkness
  },

  loginButton: {
    backgroundColor: "#58dbca",
    height: "10%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20
  },
  registerButton: {
    backgroundColor: "#DB5869",
    height: "10%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20
  },
  Text: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#ffff"
  },
  logo: {
    height: 200,
    width: 200,
    resizeMode: "stretch",
  },
  logoContainer: {
    justifyContent: "flex-start",
    alignItems: 'center',
    position: "absolute",
    top: 20,
  },
  logoText: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffff",
    backgroundColor: "#DB5869"
  }
});

export default WelcomeScreen;