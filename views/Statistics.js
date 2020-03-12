import React, { Component } from 'react';
import { View, Button, FlatList, Picker, Text } from 'react-native';
import db from '../database/database';
import User from '../components/User';

class Statistics extends Component {
    constructor(props) {
        super(props);
        const { group_id } = this.props.route.params || 1;
        this.state = {
          users: [],
          statistics: [],
          joined: [],
          group_id: 1,
          passed_filter: 0
        }
        this.groupSelect(group_id || this.state.group_id);
        // this.getAllUsers();
        this.getStatistics();
        // this.joinTables();
        this.props.navigation.addListener('focus', () => {
          this.groupSelect(this.state.group_id || group_id);
          this.getStatistics();
          // this.joinTables();
        });
        
    }
    getStatistics(){
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM Statistics', [], (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
          this.setState({
            statistics: temp
          });
        });
      });
    }
    getAllUsers(){
      db.transaction(tx => {
        tx.executeSql(`SELECT * FROM Users WHERE group_id=${this.state.group_id}`, [], (tx, results) => {
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
    joinTables(){
      db.transaction(tx => {
        tx.executeSql('SELECT s.*, u.name FROM Statistics s JOIN Users u ON s.user_id = u.id', [], (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
          this.setState({
            joined: temp
          });
        });
      });
    }
    groupSelect(group_id){
      this.setState({
        group_id: group_id
      });
      this.getAllUsers();
    }
    filterUsers(itemValue){
      if(itemValue === 1 || itemValue === 2){
        let paid = 1;
        if(itemValue === 1){
          paid = 1;
        }
        if(itemValue === 2){
          paid = 0;
        }
        db.transaction(tx => {
          tx.executeSql(`SELECT * FROM Users WHERE group_id=${this.state.group_id} AND paid=${paid}`, [], (tx, results) => {
            console.log(results);
            var temp = [];
            for (let i = 0; i < results.rows.length; ++i) {
              temp.push(results.rows.item(i));
            }
            this.setState({
              users: temp
            });
          });
        });
      }else{
        db.transaction(tx => {
          tx.executeSql(`SELECT * FROM Users WHERE group_id=${this.state.group_id}`, [], (tx, results) => {
            console.log(results);
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
      
    }
    render() {
        return (
            <>
            <View style={{flexDirection:"row"}}>
              <View style={{flex:1, marginRight:2}}>
                <Button style={{flex:1}} title="Home" onPress={() => this.props.navigation.navigate('Home', {group_id:this.state.group_id})} />
              </View>
              <View style={{flex:1, marginLeft:2}}>
                <Button style={{flex:1}}title="New User" onPress={()=> this.props.navigation.navigate('NewUser', {group_id: this.state.group_id})} />
              </View>
            </View>
            <View style={{flexDirection:"row", marginTop: 5}}>
              <View style={{flex: 1}}>
                <Button title="Group 1" color={this.state.group_id === 1 || this.group_id === 1 ? "red" : "lightblue"} onPress={()=>this.groupSelect(1)}/>
              </View>
              <View style={{flex: 1,marginLeft:2, marginRight:2}}>
                <Button title="Group 2" color={this.state.group_id === 2 || this.group_id === 2 ? "red" : "lightblue"} onPress={()=>this.groupSelect(2)}/>
              </View>
              <View style={{flex: 1}}>
                <Button title="Group 3" color={this.state.group_id === 3 || this.group_id === 3 ? "red" : "lightblue"} onPress={()=>this.groupSelect(3)}/>
              </View>
            </View>
            <View style={{marginBottom: 80}}>
            <View style={{flexDirection: "row", alignItems: "center"}}>
              <Text>Filted by paid: </Text>
              <Picker
                selectedValue={this.state.passed_filter}
                style={{height: 50, width: 100}}
                onValueChange={(itemValue, itemIndex) =>
                  {this.setState({
                    passed_filter: itemValue
                  })
                  this.filterUsers(itemValue)}
                }>
                <Picker.Item label="All Users" value={0}/>
                <Picker.Item label="Yes" value={1} />
                <Picker.Item label="No" value={2} />
              </Picker>
            </View>
              <FlatList
                data={this.state.users}
                renderItem={
                  ({ item }) => <User name={item.name} paid={item.paid} id={item.id} />
                }
                keyExtractor={item => item.id}
              />
            </View> 
            </>
        );
    }
}

Statistics.propTypes = {};

export default Statistics;