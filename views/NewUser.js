import React, { Component } from 'react';
import { View, Text, Button, Image, TextInput, ScrollView} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Toast from 'react-native-easy-toast';
import db from '../database/database';
import { requestCameraPermission, requestExternalPermission, requestExternalReadPermission } from '../helpers/permissions';
import { formatedDate } from '../helpers/formatedDate';

class Statistics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            avatarSource : {uri: 'https://picsum.photos/150'},
            name: "",
            dateOfBirth: ""
        }
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
    saveUser(){
      let date = formatedDate();
      if(this.state.name === ""){
        this.refs.toast.show("Name can't be empty!");
        return;
      }
      db.transaction(tx => {
        tx.executeSql(`INSERT INTO Users (image, name, date_of_birth,paid,attended,updated_at)
          VALUES ("${this.state.avatarSource.uri}","${this.state.name}"," ${this.state.dateOfBirth}", "0", "0", "${date}")`, [], (tx, results) => {
                console.log(results)
                if(!results.rowsAffected > 0){
                  this.refs.toast.show('Something went wrong :(');
                }
                this.refs.toast.show('User succesfully added!');
                this.setState({
                  name: "",
                  dateOfBirth: "",
                  avatarSource: {uri: 'https://picsum.photos/150'}
                })
            });
        });
    }
    render() {
        return (
            <>
            
            <View style={{flexDirection:"row", marginBottom: 10}}>
              <View style={{flex:1, marginRight:2}}>
                <Button style={{flex:1}}title="Home" onPress={() => this.props.navigation.navigate('Home')} />
              </View>
              <View style={{flex:1, marginLeft:2}}>
                <Button style={{flex:1}}title="Statistics" onPress={()=>this.props.navigation.navigate('Statistics')} />
              </View>
            </View>
            
            <ScrollView>
                <View style={{flexDirection:'column', alignItems: 'center',marginLeft: 10, marginRight: 10, marginBottom: 5}}>
                    <Image source={this.state.avatarSource} style={{width: 144, height: 256}}/>
                    <Button title="Image" onPress={()=>this.pickImage()}/>
                </View>
                <View style={{flexDirection:'row', alignItems: 'center',marginLeft: 10, marginRight: 10, marginBottom: 5}}>
                    <Text style={{flex:1}}>Name: </Text><TextInput style={{flex: 3,marginLeft: 5, height:50, borderColor: 'gray', borderWidth: 1 }} onChangeText={(name) => this.setState({name: name})}
          value={this.state.name}/>
                </View>
                <View style={{flexDirection:'row', alignItems: 'center',marginLeft: 10, marginRight: 10, marginBottom: 10}}>
                    <Text style={{flex:1}}>Date of Birth: </Text><TextInput keyboardType={"number-pad"} style={{flex: 3,marginLeft: 5, height:50, borderColor: 'gray', borderWidth: 1 }} onChangeText={(dateOfBirth) => this.setState({dateOfBirth: dateOfBirth})}
          value={this.state.dateOfBirth}/>
                </View>
                <Button title="Save" onPress={()=>this.saveUser()}/>
                
            </ScrollView>
            <Toast ref="toast"/>  
            </>
        );
    }
}

Statistics.propTypes = {};

export default Statistics;