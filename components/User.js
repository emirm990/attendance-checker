import React, { Component } from 'react';
import { View, Text } from 'react-native';

class User extends Component {
    constructor(props){
        super(props);
    }
    render() {
        return (
          <View style={{flex: 1,borderColor: "gray", borderWidth: 2, marginBottom: 5, marginTop: 5}}>
            <Text>Name: {this.props.name}</Text>
            <Text>Paid: {this.props.paid}</Text>
            <Text>Paid at: {this.props.paid_at}</Text>
            <Text>Attended: {this.props.attended}</Text>
            <Text>Attended at: {this.props.attended_at}</Text>
          </View>
        )
    }
}

User.propTypes = {};
export default User;