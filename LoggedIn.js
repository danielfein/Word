import React from 'react';
import {
  StyleSheet,
  Platform,
  Image,
  Text,
  View,
  Button,
  Alert,
  ScrollView
} from 'react-native';
import firebase from 'react-native-firebase';
import Contacts from 'react-native-contacts';

const contactsOnApp = [];
export default class LoggedIn extends React.Component {
  static navigationOptions = {
    title: 'Welcome, find friends'
  };
  constructor() {
    super();
    this.state = {
      loading: false
    };
  }

  signOut = () => {
    firebase.auth().signOut().then(function() {
      console.log('Signed Out');
      this.props.navigation.navigate('SignUp')
    }, function(error) {
      console.error('Sign Out Error', error);
    });
  }
  storeContacts = (uid, contact) => {
    firebase.database().ref('contacts/' + contact.number).set({name: contact.name, label: contact.label});
  }

  checkContact = (contact) => {
    firebase.database().ref('users/').orderByChild("phoneNumber").equalTo("+" + contact.number).once("value", snapshot => {

      if (snapshot.exists()) {
        const userData = snapshot.val();
        //this may be where the numbers are being added to contacts too many times.
        console.log('pushing', userData);
        contactsOnApp.push(userData);
      }
    });
    console.log('coa', contactsOnApp);
  }
  sendToSettings = () => {
    this.props.navigation.navigate('Settings', {user: this.props.navigation.state.params.user});
  }
  sendToChat = () => {
    this.props.navigation.navigate('Chat', {user: this.props.navigation.state.params.user});
  }
  handleContacts = () => {
    Contacts.getAll((err, contacts) => {
      if (err)
        throw err;

      const uid = this.props.navigation.state.params.user.uid;
      const contactNumbers = []
      for (var i in contacts) {
        for (var n in contacts[i].phoneNumbers) {
          const num = contacts[i].phoneNumbers[n].number;
          if (num.charAt(0) != '+') { //assume it's US
            num = '+1' + num
          }
          contact = {
            name: contacts[i].givenName + " " + contacts[i].familyName,
            number: num.replace(/[^\d]/g, '').replace('(', '').replace(')', '').replace('.', '').replace('-', '').replace(' ', ''),
            label: contacts[i].phoneNumbers[n].label
          }
          this.checkContact(contact);
          this.storeContacts(uid, contact);
        }
      }
      var user = this.props.navigation.state.params.user;

      this.props.navigation.navigate('ContactList', {
        user: user,
        contactsOnApp: contactsOnApp
      });

    });

  }

  render() {
    const {navigate} = this.props.navigation;
    const uid = this.props.navigation.state.params.user.uid;
    return (<View>
      <Text>User's ID: {uid}</Text>
      <Text>Loading: {this.state.loading}</Text>
      <Button title="Sync Contacts" onPress={this.handleContacts}/>
      <Button title="Edit Settings" onPress={this.sendToSettings}/>
      <Button title="Chat" onPress={this.sendToChat}/>
      <Button title="ChatShortcut" onPress={() => {
          this.props.navigation.navigate("Chat", {
            name: 'Dan',
            label: 'Dan Label',
            number: '2372813'
          });
        }}/>
      <Button title="Sign Out" onPress={this.signOut}/>
    </View>);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  }
});
