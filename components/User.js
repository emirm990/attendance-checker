import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, Button } from 'react-native';
import db from '../database/database';

class User extends Component {
    constructor(props){
        super(props);
        this.state = {
          modalVisible: false,
          statistics: [],
          user_id: ""
        }
    }
    setModalVisible(visible,id) {
      this.setState({
        modalVisible: visible,
        user_id: id
      });
    }
    modalOpened(){
      db.transaction(tx => {
        tx.executeSql(`SELECT * FROM Statistics WHERE user_id = ${this.state.user_id}`, [], (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
          this.setState({
            statistics: temp
          });
          console.log(temp);
        });
      });
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
                <View>
                    <Button onPress={() => {
                      this.setModalVisible(!this.state.modalVisible);
                    }} title="Back" />
                </View>
                <FlatList
                  data={this.state.statistics}
                  renderItem={
                  ({ item }) => <View style={{borderColor: "grey", borderWidth: 2, marginTop: 5}}><Text>Attended at: {item.attended_at}</Text><Text>Paid at: {item.paid_at}</Text></View>
                  }
                keyExtractor={item => item.id}
              />
            </Modal>
            <TouchableOpacity activeOpacity={0.8} onPress={() => this.setModalVisible(!this.state.modalVisible, this.props.id)} style={{flex: 1,borderColor: "gray", borderWidth: 2, marginBottom: 5, marginTop: 5}}>
              <Text>Name: {this.props.name}</Text>
              <Text>Paid: {this.props.paid ? "Yes" : "No"}</Text>
            </TouchableOpacity>
          </>
        )
    }
}

User.propTypes = {};
export default User;