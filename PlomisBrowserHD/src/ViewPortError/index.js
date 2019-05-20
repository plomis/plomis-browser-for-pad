
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';


function ViewPortError({ name }) {
  return (
    <View style={styles.error}>
      <Text style={styles.title}>
        Error
      </Text>
      <Text style={styles.text}>
        {name || '发生未知错误'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  error: {
    flex: 1,
    justifyContent: 'center'
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#c2c2c2',
    textAlign: 'center',
    marginBottom: 8
  },
  text: {
    fontSize: 16,
    color: '#b2b2b2',
    textAlign: 'center'
  }
});

export default ViewPortError;
