import React from 'react';
import {
  StyleSheet,
  Platform,
  Image,
  Text,
  View,
  Button,
  Alert,
  ScrollView,
  TouchableOpacity,
  ListView
} from 'react-native';
// https://medium.com/react-native-development/easily-build-forms-in-react-native-9006fcd2a73b
import firebase from 'react-native-firebase';
import Contacts from 'react-native-contacts';
import Spinner from "react-native-loading-spinner-overlay";

const contactsOnApp = this.props;
console.log(contactsOnApp);
var uid = '';
var contacts = [];

var items = [];
export default class ContactList extends React.Component {
  static navigationOptions = {
    title: 'Contact List'
  };
  constructor() {
    super();
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      }),
      loading: true
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

  listenForItems(contacts) {
    items = []
    for (var k in contacts) {
      for (var u in contacts[k]) {
        items.push({uid: u, number: contacts[k].number, name: contacts[k][u].name,
          phoneNumber: contacts[k][u].phoneNumber
        });
      }
    }
    this.setState({dataSource: this.state.dataSource.cloneWithRows(items), loading: false});
  }
  componentWillMount() {

    for (var k in contacts) {
      for (var u in contacts[k]) {
        items.push({uid: u, number: contacts[k].number, name: contacts[k][u].name,
          phoneNumber: contacts[k][u].phoneNumber
        });
      }
    }
    if (items.length == 0) {
      this.setState({dataSource: this.state.dataSource.cloneWithRows(items), loading: false});
    }
  }
  componentDidMount() {
    const {navigate} = this.props.navigation;
    uid = this.props.navigation.state.params.user.uid;
    contacts = this.props.navigation.state.params.contactsOnApp;
    this.listenForItems(contacts);
  }

  renderRow = rowData => {
    console.log("rendering Row", rowData.name, rowData.phoneNumber, rowData.uid)
    return (<TouchableOpacity onPress={() => {
        name = rowData.name;
        phoneNumber = rowData.phoneNumber;
        uid = rowData.uid;
        this.props.navigation.navigate("Chat", {
          name: name,
          phoneNumber: phoneNumber,
          uid: uid
        });
      }}>
      <View style={styles.profileContainer}>
        <Image source={{
            uri: "https://www.gravatar.com/avatar/"
          }} style={styles.profileImage}/>
        <Text style={styles.profileName}>{rowData.name ? rowData.name : rowData.phoneNumber}</Text>
      </View>
    </TouchableOpacity>);
  };

  render() {
    return (<View style={styles.container}>
      <View style={styles.topGroup}>
        <Text style={styles.myFriends}>My Friends</Text>
      </View>
      <ListView dataSource={this.state.dataSource} renderRow={this.renderRow}/>

      <Spinner visible={this.state.loading}/>
    </View>);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    marginRight: 10,
    marginLeft: 10
  },
  rightButton: {
    marginTop: 10,
    marginLeft: 5,
    marginRight: 10,
    padding: 0
  },
  topGroup: {
    flexDirection: "row",
    margin: 10
  },
  myFriends: {
    flex: 1,
    color: "#3A5BB1",
    //secondaryColor: '#E9E9E9',
    //grayColor: '#A5A5A5',
    fontSize: 16,
    padding: 15
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginLeft: 6,
    marginBottom: 8
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 6
  },
  profileName: {
    marginLeft: 6,
    fontSize: 16
  }
});
