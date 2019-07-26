
import React from 'react';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import { HeaderButtons, HeaderButton } from 'react-navigation-header-buttons';
import { StyleSheet, Image, View, Text, TouchableWithoutFeedback, Platform } from 'react-native';

// define IconComponent, color, sizes and OverflowIcon in one place
// const MaterialHeaderButton = props => (
//   <HeaderButton {...props} IconComponent={MaterialIcons} iconSize={23} color="blue" />
// );
//
// export const MaterialHeaderButtons = props => {
//   return (
//     <HeaderButtons
//       HeaderButtonComponent={MaterialHeaderButton}
//       OverflowIcon={<MaterialIcons name="more-vert" size={23} color="white" />}
//       {...props} />
//   );
// };
//
// export { Item } from 'react-navigation-header-buttons';


export const BackButton = ({ title, onPress }) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.backButton}>
        <Image style={styles.backButtonImage} source={require( '../../../node_modules/react-navigation-stack/src/views/assets/back-icon.png' )} />
        {title ? <Text style={Platform.OS === 'ios' ? styles.backButtonText : styles.androidBackButtonText}>{title}</Text> : null}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  backButton: {
    marginLeft: 8,
    alignItems: 'center',
    flexDirection: 'row'
  },
  backButtonImage: {
    marginRight: 6
  },
  backButtonText: {
    color: '#007CFF',
    fontSize: 17
  },
  androidBackButtonText: {
    fontSize: 17
  }
});
