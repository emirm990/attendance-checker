import React, { Component } from 'react';
import { View, Text, Button, Image, Switch,TouchableOpacity,Modal,TextInput,ScrollView, Alert } from 'react-native';
import Toast from 'react-native-easy-toast';
import ImagePicker from 'react-native-image-picker';
import Swiper from 'react-native-swiper';
import { formatedDate } from '../helpers/formatedDate';
import { requestCameraPermission, requestExternalPermission, requestExternalReadPermission } from '../helpers/permissions';
import db from '../database/database';
import Database from '../database/Database2';
import NavButtons from '../components/NavButtons';
import GroupSelector from '../components/GroupSelector';
const Db = new Database();
class Home extends Component {
    constructor(props) {
        super(props);
        const { group_id } = this.props.route.params || 1;
        this.state = {
            users: [],
            modalVisible: false,
            user_id: "",
            group_id: 1,
            name: "",
            date_of_birth: "",
            avatarSource : {uri: 'https://picsum.photos/150'}
          };
          this.groupSelect(group_id || this.state.group_id);
          this.props.navigation.addListener('focus', () => {

            let routeParameters = this.props.route.params;
            if(routeParameters){
              this.groupSelect(this.props.route.params.group_id || group_id);
            }

          });
    }
    componentDidMount(){
      this.groupSelect(this.state.group_id);
    }
    getAllUsers(group_id){
      Db.getAllUsersFromDb(group_id).then(data=>{
        this.setState({
          users: data
        });
      });
    }
    
    updatePaid(value, id){
      Db.updatePaid(value,id);
      this.getAllUsers(this.state.group_id);
    }

    updateAttended(value, id){
      Db.updateAttended(value,id);
      this.getAllUsers(this.state.group_id);
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
              Db.deleteUser(id);
              this.getAllUsers(this.state.group_id);
              this.setState({
                name: "",
                date_of_birth: "",
                user_id: "",
                avatarSource: {uri: 'https://picsum.photos/150'},
                modalVisible: false
              });
          }},
        ]
      );
    }
    setModalVisible(visible,id) {
      this.setState({
        modalVisible: visible,
        user_id: id
      });
    }
    modalOpened(user_id){
      Db.modalOpened(user_id).then(data=>{
        this.setState({
          date_of_birth: data.date_of_birth,
          avatarSource: data.image ? {uri: data.image} : {uri:'https://picsum.photos/150'},
          name: data.name,
        })
      });
    }
    modalClosed(group_id){
      this.getAllUsers(group_id);
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

          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
          } else {
            const source = { uri: response.uri };
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
              updated_at="${date}",
              group_id=${this.state.group_id}
          WHERE id=${id}`,
          [], (tx, results) => {
            if(!results.rowsAffected > 0 ){
              this.refs.toast.show('Something went wrong :(');
              return;
            }
            this.modalClosed(this.state.group_id);
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

    groupSelect = (group_id) => {

      this.setState({
        group_id: group_id
      });
      this.getAllUsers(group_id);
    }
    setButtonColor(){
      return "red";
    }
    viewsList() {
      if(this.state.users.length === 0){
        return (
          <View style={{flex: 1, justifyContent:"center",alignItems:"center", marginBottom: 40}}>
            <Text style={{fontSize: 25}}>No users available</Text>
          </View>
        )
      }
      return this.state.users.map((user) => {
        return (
          <TouchableOpacity activeOpacity={0.8} key={user.id} onLongPress={() => this.setModalVisible(!this.state.modalVisible, user.id)} style={{flex: 1, justifyContent:'center', alignItems:'center'}}>
          <ScrollView >
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
          </ScrollView>
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
                onShow={()=>this.modalOpened(this.state.user_id)}
                onDismiss={() => {
                  this.modalClosed(this.state.group_id);
                }}
                >
                <View style={{flexDirection:"row", flex: 1}}>
                  <View style={{flex:1, marginRight:2}}>
                    <Button style={{flexBasis: 1}} onPress={() => {
                      this.setModalVisible(!this.state.modalVisible);
                    }} title="Back" />
                  </View>
                  <View style={{flex:1, marginLeft:2}}>
                    <TouchableOpacity style={{borderColor: 'red', borderWidth: 1 }} activeOpacity={0.8} title="Delete user" onPress={()=>this.deleteUser(this.state.user_id)} >
                      <View style={{height: 35,alignItems: 'center',justifyContent:'center'}}>
                        <Text style={{textAlign: 'center',padding: 20,color: 'red'}}>Delete user</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
                <GroupSelector 
                  groupTitle1="Group 1" 
                  groupTitle2="Group 2" 
                  groupTitle3="Group 3" 
                  active={this.state.group_id} 
                  selectGroup={this.groupSelect}
                />
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

            <NavButtons 
              title1='Statistics' 
              title2='New User' 
              link1={() => this.props.navigation.navigate('Statistics', {group_id: this.state.group_id})} 
              link2={()=>this.props.navigation.navigate('NewUser', {group_id: this.state.group_id})} 
            />
            <GroupSelector 
              groupTitle1="Group 1" 
              groupTitle2="Group 2" 
              groupTitle3="Group 3" 
              active={this.state.group_id} 
              selectGroup={this.groupSelect}
              />
            <Swiper showsButtons={true} key={this.state.users.length} style={{marginTop: 25}}>
              {this.viewsList()}
            </Swiper>
            <Toast ref="toast"/>    
            </>
        );
    }
}

export default Home;