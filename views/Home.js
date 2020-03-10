import React, { Component } from 'react';
import { View, Text, Button, Image, Switch,TouchableOpacity,Modal,TextInput,ScrollView, Alert } from 'react-native';
import Toast from 'react-native-easy-toast';
import ImagePicker from 'react-native-image-picker';
import Swiper from 'react-native-swiper';
import { formatedDate } from '../helpers/formatedDate';
import { requestCameraPermission, requestExternalPermission, requestExternalReadPermission } from '../helpers/permissions';
import db from '../database/database';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            modalVisible: false,
            user_id: "",
            name: "",
            date_of_birth: "",
            avatarSource : {uri: 'https://picsum.photos/150'},
          };
          this.getAllUsers();
          this.props.navigation.addListener('focus', () => {
            this.getAllUsers();
          });
    }
    getAllUsers(){
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM Users', [], (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
          this.setState({
            users: temp
          });
        });
      });
    }
    updatePaid(value,id){
      let date = formatedDate();   
      db.transaction(tx => {
        tx.executeSql(`UPDATE Users SET paid = ${value ? 1:0} WHERE id = ${id}`, [], (tx, results) => {
          if(results.rowsAffected > 0){
            this.refs.toast.show('User succesfully updated!');
          }else{
            this.refs.toast.show('Something went wrong :(');
          }
          tx.executeSql(`INSERT INTO Statistics (user_id, paid_at)
          VALUES (${id}, "${date}")`, [], (tx, results) => {
            this.getAllUsers();
          });
      });
    })}
    updateAttended(value,id){  
      let date = formatedDate();
      db.transaction(tx => {
        tx.executeSql(`UPDATE Users SET attended = ${value ? 1:0}, updated_at = "${date}" WHERE id = ${id}`, [], (tx, results) => {
          if(results.rowsAffected > 0){
            this.refs.toast.show('User succesfully updated!');
          }else{
            this.refs.toast.show('Something went wrong :(');
          }
          tx.executeSql(`INSERT INTO Statistics (user_id, attended_at)
          VALUES (${id}, "${date}")`, [], (tx, results) => {
            this.getAllUsers();
          });
        });
      });
    }
    setModalVisible(visible,id) {
      this.setState({
        modalVisible: visible,
        user_id: id
      });
    }
    modalOpened(){
      db.transaction(tx => {
            tx.executeSql(`SELECT name,image,date_of_birth FROM Users WHERE id=${this.state.user_id}`, [], (tx, results) => {
              if(results){
                
                var temp = [];
                for (let i = 0; i < results.rows.length; ++i) {
                  temp.push(results.rows.item(i));
                }
                this.setState({
                  name: temp[0].name,
                  date_of_birth: temp[0].date_of_birth,
                  avatarSource: temp[0].image ? {uri: temp[0].image} : {uri:'https://picsum.photos/150'}
                });
              }else{
                this.refs.toast.show('Something went wrong :(');
              }
            });
      });
    }
    async pickImage(){
      await requestCameraPermission();
      await requestExternalPermission();
      await requestExternalReadPermission();

      const options = {
          title: 'Select Avatar',
          storageOptions: {
            skipBackup: true,
            path: 'images',
          },
        };
      ImagePicker.showImagePicker(options, (response) => {
          console.log('Response = ', response);
        
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
          } else {
            const source = { uri: response.uri };
        
            // You can also display the image using data:
            // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        
            this.setState({
              avatarSource: source,
            });
          }
        });
  }
    editUser(id){
      let date = formatedDate();  
      if(this.state.name === ""){
        this.refs.toastModal.show("Name can't be empty!");
        return;
      }
      db.transaction(tx => {
        tx.executeSql(`UPDATE Users 
          SET image="${this.state.avatarSource.uri}",
              name="${this.state.name}", 
              date_of_birth="${this.state.date_of_birth}",
              updated_at="${date}"
          WHERE id=${id}`,
          [], (tx, results) => {
            if(!results.rowsAffected > 0 ){
              this.refs.toast.show('Something went wrong :(');
              return;
            }
            this.getAllUsers();
            this.setState({
              name: "",
              date_of_birth: "",
              avatarSource: {uri: 'https://picsum.photos/150'},
              modalVisible: false,
              user_id: ""
            });
            
        });
      });
    }
    deleteUser(id) {
      Alert.alert(
        'Delete user',
        'Delete user?',
          [
            {text: 'NO', onPress: () => {
              this.setState({
                modalOpened: false
              });
            }},
            {text: 'YES', onPress: () => {
              db.transaction(tx => {
                tx.executeSql(`DELETE FROM Users WHERE id=${id}`, [], (tx, results) => {
                  if(!results.rowsAffected>0){
                    this.refs.toast.show('Something went wrong :(');
                    return;
                  }
                  this.refs.toast.show('User succesfully deleted!');
                  this.getAllUsers();
                  this.setState({
                    name: "",
                    date_of_birth: "",
                    user_id: "",
                    avatarSource: {uri: 'https://picsum.photos/150'},
                    modalVisible: false
                  });
              });
            });
          }},
        ]
      );
    } 
    viewsList() {
      if(this.state.users.length === 0){
        return (
          <View style={{flex: 1, justifyContent:"center",alignItems:"center"}}>
            <Text style={{fontSize: 25}}>No users available</Text>
          </View>
        )
      }
      return this.state.users.map((user) => {
        return (
          <TouchableOpacity activeOpacity={0.8} key={user.id} onLongPress={() => this.setModalVisible(!this.state.modalVisible, user.id)} style={{flex: 1, justifyContent:'center', alignItems:'center'}}>
          <View >
              {user.image ? 
              <Image style={{width: 144, height: 256}}
              source={{uri: user.image}}/> : 
              <Image style={{width: 144, height: 256}}
              source={{uri: 'https://picsum.photos/150'}}/>}
              <Text style={{fontSize: 25, marginBottom: 5, marginTop: 5}}>{user.name}</Text>
              <Text style={{fontSize: 18, marginBottom: 5}}>{user.date_of_birth}</Text>
              <View style={{flexDirection:'row'}}>
                <Text style={{width:100, fontSize: 16}}>Prisutan: </Text>
                <Switch onValueChange={()=>this.updateAttended(!user.attended, user.id)} value={Boolean(user.attended)}/>
              </View>
              <View style={{flexDirection:'row'}}>
                <Text style={{width: 100, fontSize: 16}}>Platio: </Text>
                <Switch onValueChange={()=>this.updatePaid(!user.paid, user.id)} value={Boolean(user.paid)}/>
              </View>
          </View>
          </TouchableOpacity>
        )
      })
  
  }
    render() {
        return (
            <>
            <Modal
                animationType="slide"
                transparent={false}
                visible={this.state.modalVisible}
                style={{justifyContent:"space-between"}}
                onShow={()=>this.modalOpened()}
                >
                <View style={{flexDirection:"row", flex: 1}}>
                  <View style={{flex:1, marginRight:2}}>
                    <Button style={{flexBasis: 1}} onPress={() => {
                      this.setModalVisible(!this.state.modalVisible);
                    }} title="Back" />
                  </View>
                  <View style={{flex:1, marginLeft:2}}>
                    <TouchableOpacity style={{borderColor: 'red', borderWidth: 1 }} activeOpacity={0.8} title="Delete user" onLongPress={()=>this.deleteUser(this.state.user_id)} >
                      <View style={{height: 35,alignItems: 'center',justifyContent:'center'}}>
                        <Text style={{textAlign: 'center',padding: 20,color: 'red'}}>Delete user</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
                <ScrollView style={{marginTop: 10}}>
                    <View style={{flexDirection:'column', alignItems: 'center',marginLeft: 10, marginRight: 10, marginBottom: 5}}>
                      <Image source={this.state.avatarSource} style={{width: 144, height: 256}}/>
                      <Button title="Image" onPress={()=>this.pickImage()}/>
                    </View>
                    <TextInput style={{borderColor: 'gray', borderWidth: 1,alignSelf:"center", width: 220,marginTop:5 }} onChangeText={(name) => this.setState({name: name})}
                        value={this.state.name}/>
                    <TextInput style={{borderColor: 'gray', borderWidth: 1,alignSelf:"center", width: 220,marginTop:5,marginBottom:5 }} onChangeText={(date_of_birth) => this.setState({date_of_birth: date_of_birth})}
                        value={this.state.date_of_birth}/>
                    <Button title="Save" onPress={()=>this.editUser(this.state.user_id)}/>
                </ScrollView>
                <Toast ref="toastModal"/>   
              </Modal>
            <View style={{flexDirection:"row"}}>
              <View style={{flex:1, marginRight:2}}>
                <Button style={{flex:1}}title="Statistics" onPress={() => this.props.navigation.navigate('Statistics')} />
              </View>
              <View style={{flex:1, marginLeft:2}}>
                <Button style={{flex:1}}title="New User" onPress={()=>this.props.navigation.navigate('NewUser')} />
              </View>
            </View>
            <Swiper showsButtons={true}>
              {this.viewsList()}
            </Swiper>
            <Toast ref="toast"/>    
            </>
        );
    }
}

Home.propTypes = {};

export default Home;