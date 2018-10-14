import React from 'react';
import {
  StyleSheet,
  Platform,
  Image,
  Text,
  View,
  Button,
  ScrollView
} from 'react-native';

import firebase from 'react-native-firebase';
import t from 'tcomb-form-native'; // 0.6.9

import SignUp from './SignUp'
import LoggedIn from './LoggedIn'
import SyncContacts from './SyncContacts'
import ContactList from './ContactList'
import Settings from './Settings'
import Chat from './Chat'

import {createStackNavigator} from 'react-navigation';

const RootStack = createStackNavigator({
  SignUp: {
    screen: SignUp
  },
  LoggedIn: {
    screen: LoggedIn
  },
  SyncContacts: {
    screen: SyncContacts
  },
  ContactList: {
    screen: ContactList
  },
  Settings: {
    screen: Settings
  },
  Chat: {
    screen: Chat
  }

});

const Form = t.form.Form;

const User = t.struct({email: t.String, username: t.String, password: t.String, terms: t.Boolean});
export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true
    };
  }

  /**
   * When the App component mounts, we listen for any authentication
   * state changes in Firebase.
   * Once subscribed, the 'user' parameter will either be null
   * (logged out) or an Object (logged in)
   */
  componentDidMount() {
    this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
      // console.log('User authentication', user, user.phoneNumber)
      if (user !== null) {
        console.log('User authentication', user, user._user.phoneNumber, user._user.displayName, user._user.uid, user._user.phoneNumber)
        firebase.database().ref('users/' + user._user.uid).set({name: user._user.displayName ? user._user.displayName : '', phoneNumber: user._user.phoneNumber, email: user._user.email ? user._user.email : ''});
      }
      this.setState({loading: false, user});
    });
  }
  onLogin = () => {
    const {email, password} = this.state;
    firebase.auth().signInWithEmailAndPassword(email, password).then((user) => {
      // If you need to do anything with the user, do it here
      // The user will be logged in automatically by the
      // `onAuthStateChanged` listener we set up in App.js earlier
    }).catch((error) => {
      const {code, message} = error;
      // For details of error codes, see the docs
      // The message contains the default Firebase string
      // representation of the error
    });
  }
  onRegister = () => {
    const {email, password} = this.state;
    firebase.auth().createUserWithEmailAndPassword(email, password).then((user) => {
      // If you need to do anything with the user, do it here
      // The user will be logged in automatically by the
      // `onAuthStateChanged` listener we set up in App.js earlier
    }).catch((error) => {
      const {code, message} = error;
      // For details of error codes, see the docs
      // The message contains the default Firebase string
      // representation of the error
    });
  }
  onLoginOrRegister = () => {
    const {phoneNumber} = this.state;
    firebase.auth().signInWithPhoneNumber(phoneNumber).then((confirmResult) => {
      // This means that the SMS has been sent to the user
      // You need to:
      //   1) Save the `confirmResult` object to use later
      this.setState({confirmResult});
      //   2) Hide the phone number form
      //   3) Show the verification code form
    }).catch((error) => {
      const {code, message} = error;
      // For details of error codes, see the docs
      // The message contains the default Firebase string
      // representation of the error
    });
  }
  onVerificationCode = () => {
    const {confirmResult, verificationCode} = this.state;
    confirmResult.confirm(verificationCode).then((user) => {
      // If you need to do anything with the user, do it here
      // The user will be logged in automatically by the
      // `onAuthStateChanged` listener we set up in App.js earlier
    }).catch((error) => {
      const {code, message} = error;
      // For details of error codes, see the docs
      // The message contains the default Firebase string
      // representation of the error
    });
  }

  /**
   * Don't forget to stop listening for authentication state changes
   * when the component unmounts.
   */
  componentWillUnmount() {
    this.authSubscription();
  }
  render() {
    // The application is initialising
    if (this.state.loading)
      return null;

    // The user is an Object, so they're logged in
    if (this.state.user)
      return <RootStack/>;

    // The user is null, so they're logged out
    return <RootStack/>;
    // return (   <View style={styles.container}>
    //     <Form type={User} />
    //   </View>);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  logo: {
    height: 120,
    marginBottom: 16,
    marginTop: 64,
    padding: 10,
    width: 135
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  },
  modules: {
    margin: 20
  },
  modulesHeader: {
    fontSize: 16,
    marginBottom: 8
  },
  module: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center'
  }
});
