import React from 'react';
import { StyleSheet, Text, ScrollView, View, TextInput, Alert, KeyboardAvoidingView} from 'react-native';
import * as firebase from 'firebase';
import CheckBox from 'react-native-checkbox';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {textList: [], text:""};
    this.saveToFireBase();
    this.getFireBaseData();
  }
  saveToFireBase(){
    var config = {
      apiKey: "AIzaSyBRL7_z0WxtmNJtupibWk2a3UB0RTKgWRM",
      authDomain: "shoppinglist-ed37a.firebaseapp.com",
      databaseURL: "https://shoppinglist-ed37a.firebaseio.com",
      storageBucket: "shoppinglist-ed37a.appspot.com",
    };
    firebase.initializeApp(config);
    console.ignoredYellowBox = [
         'Setting a timer',
         'Warning: checkPropTypes has been',
     ];
  }
  getFireBaseData(){
    var listItemsRef = firebase.database().ref('listItems');
    listItemsRef.on('value', function(snapshot) {
      var tempList = [];
      snapshot.forEach(function(childSnapshot) {
          var childData = {
              id: childSnapshot.key,
              item: childSnapshot.val().item,
          };
          tempList.push(childData);
      }.bind(this));
      this.setState({textList:tempList});
    }.bind(this));
  }
  mySubmit(){
    firebase.database().ref('listItems').push({ item: this.state.text});
    this.setState({text:""});
      this.refs.scrollView.scrollToEnd();
  }
  render() {
    return (
      <View style={styles.container}>

          <KeyboardAvoidingView style={{alignSelf:"stretch"}} behavior='position'>
              <ScrollView ref="scrollView" style={{alignSelf:"stretch", marginTop: 30}}>

                    {this.state.textList.map((listItem,index)=>{
                      return <ListItem listItem={listItem} key={index}/>
                    })}
                      <TextInput
                          style={styles.textInput}
                          blurOnSubmit={false}
                          returnKeyType={"next"}
                          onChangeText={(text) => this.setState({text})}
                          onSubmitEditing={this.mySubmit.bind(this)}
                          value={this.state.text}

                      />

            </ScrollView>
          </KeyboardAvoidingView>
          <Header/>
    </View>
    );
  }
}

class Header extends React.Component {
    render() {
        return (
            <Text style={styles.headerText}>Handlingslista</Text>
            )
    }
}

class ListItem extends React.Component{
  render(){
    return(
        <View style={styles.itemView} blurOnSubmit={true} >
            <DeleteButton listItem={this.props.listItem}/>
            <Text style={styles.itemText}>{this.props.listItem.item}</Text>
        </View>
    )
  }
}

class DeleteButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {checked: false, leTimeout:0}
    }

    myFunction(checked){
        this.setState({checked: !checked});
        var myTimeout = setTimeout(() => {
            var listItemsRef = firebase.database().ref('listItems');
            listItemsRef.child(this.props.listItem.id).remove();
        }, 300)
        this.setState({leTimeout: myTimeout});
    }
    componentWillUnmount() {
        this.setState({checked: false});
        var id = this.state.leTimeout;
        clearTimeout(id);
    }
    render() {
        return (
        <CheckBox
            style={styles.itemCheckBox}
            labelStyle={styles.labelStyle}
            label={this.props.listItem.item}
            checked={this.state.checked}
            onChange={this.myFunction.bind(this)}
        />)
    }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:5,
    paddingTop:50,
    backgroundColor: '#fff888',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
    headerText: {
      position: "absolute",
        paddingTop: 25,
        top: 0,
        fontSize: 50,
    },
  textInput: {
      alignSelf: 'stretch',
      padding: 5,
      height: 50,
      marginBottom: 100,
  },
    itemView: {
        flexDirection: "row",
        justifyContent: 'flex-start',
        alignItems: 'flex-end'
    },
    itemText: {
        fontSize: 30,
    },
    itemCheckBox: {
    },
    labelStyle: {
        color: '#000',
        width: 0,
    }

});
