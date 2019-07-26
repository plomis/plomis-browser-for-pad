
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { StyleSheet, Easing, Animated, View, ActivityIndicator } from 'react-native';
import List from '../../components/List';


const Item = List.Item;

class ServiceItem extends React.Component {

  state = {
    opacity: new Animated.Value( 0.5 ),
    marginTop: new Animated.Value( -44 )
  };

  componentDidMount() {
    Animated.parallel([
      Animated.timing( this.state.opacity, {
        toValue: 1,
        duration: 800
      }),
      Animated.timing( this.state.marginTop, {
        toValue: 0,
        duration: 300,
        easing: Easing.out( Easing.ease )
      })
    ]).start();
  }

  render() {

    const { marginTop, opacity } = this.state;
    const { children, id, i, selected, ...props } = this.props;
    const style = i ? { marginTop, opacity } : { opacity };
    const controller = selected ? (
      <MaterialIcons
        size={24}
        name="done"
        color="#4A7AD8" />
      ) : null;

    return (
      <Item {...props} key={id} animateStyle={style} controller={controller}>
        {children}
      </Item>
    );
  }
}


class ServiceList extends React.Component {
  render() {
    const { data, selectedKey, onSelect } = this.props;
    return (
      <List mode="card" selectedKey={selectedKey} style={styles.list} onSelect={onSelect}>
        {data.slice().reverse().map(({ id, configName }, index ) => {
          return (
            <ServiceItem
              id={id}
              key={id}
              border={!!index}
              i={data.length - index - 1}>
              {configName}
            </ServiceItem>
          );
        })}
      </List>
    );
  }
}


class Loading extends React.Component {
  render() {
    const { loading } = this.props;
    return (
      <View style={styles.loading}>
        {loading ? <ActivityIndicator /> : null}
      </View>
    );
  }
}

class Services extends React.Component {
  render() {
    const { data, selectedKey, onSelect } = this.props;
    return (
      <View style={styles.service}>
        <Loading loading={!data} />
        {data ? (
          <ServiceList
            data={data}
            onSelect={onSelect}
            selectedKey={selectedKey} />
        ): null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  service: {
  },
  loading: {
    alignItems: 'center',
    position: 'absolute',
    width: '100%'
  },
  list: {
    flexDirection: 'column-reverse'
  }
});

export default Services;
