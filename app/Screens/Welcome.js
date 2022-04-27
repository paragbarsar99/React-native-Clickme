import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';

const Welcome = props => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          {
            padding: 5,
            borderRadius: 10,
            height: 50,
            backgroundColor: 'orange',
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
        activeOpacity={0.8}
        onPress={() => props.navigation.navigate('ClickMe')}>
        <Text style={styles.clicMeTxt}>Play Click Me</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clicMeTxt: {
    fontSize: 15,
    color: 'black',
  },
});
