import React, {Component} from 'react';
import {View, Button, Text, TextInput, Image} from 'react-native';

import firebase from 'react-native-firebase';

export default class Settings extends Component {
  static navigationOptions = {
    title: 'Edit Settings'
  };
  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.state = {
      user: null,
      displayName: '',
      phone: ''
    };
    this.state = firebase.auth().currentUser._user;
    // this.setState({ user: user.toJSON() });
    this.handleSendClick = this.handleSendClick.bind(this);
  }
  handleSubmit(formData) {
    const displayName = formData.displayName;
    const email = formData.email;
    var user = firebase.auth().currentUser;
    user.updateProfile({displayName: displayName, photoURL: ""}).then(function() {
      // Update successful.
      console.log('Success', firebase.auth().currentUser._user);

    }).catch(function(error) {
      // An error happened.
      console.log('Error', error);
    });
  }

  handleSendClick() {
    this.handleSubmit(this.state);
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
    return (<View>
      <Text>Edit your Display Name</Text>
      <TextInput style={{
          backgroundColor: '#ededed',
          height: 60
        }} onChangeText={(displayName) => this.setState({displayName})} value={this.state.displayName}/>
      <Button onPress={this.handleSendClick} title="Send"/>
    </View>)
  }
}
