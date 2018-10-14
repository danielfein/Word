import React, {Component} from 'react';
import {View, Button, Text, TextInput, Image} from 'react-native';

import firebase from 'react-native-firebase';
const successImageUri = 'https://cdn.pixabay.com/photo/2015/06/09/16/12/icon-803718_1280.png';

export default class SyncContacts extends Component {
  static navigationOptions = {
    title: 'Sync Contacts'
  };
  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.state = {
      user: null,
      message: '',
      codeInput: '',
      phoneNumber: '+1',
      confirmResult: null
    };
  }

  componentDidMount() {
    this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({user: user.toJSON()});
      } else {
        // User has been signed out, reset the state
        this.setState({user: null, message: '', codeInput: '', phoneNumber: '+1', confirmResult: null});
      }
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe)
      this.unsubscribe();
    }

  render() {
    const {user, confirmResult} = this.state;
    return (<View style={{
        flex: 1
      }}>

      <Text>{this.props.navigation.state.params}</Text>
    </View>);
  }
}
