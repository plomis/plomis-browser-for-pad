
import React from 'react';
import { Platform } from 'react-native';
import AppStoreReview from 'react-native-app-store-review';


function withRate( Component ) {

  return class Wrapped extends React.Component {

    componentDidMount() {
      if ( Platform.OS === 'ios' ) {
        setTimeout(() => {
          AppStoreReview.requestReview( '1474338848' );
        }, 5000 );
      }
    }

    render() {
      return (
        <Component />
      );
    }
  };
}

export default withRate;
