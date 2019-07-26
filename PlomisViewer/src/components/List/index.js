
import React from 'react';
import is from 'whatitis';
import omit from 'omit.js';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { View, Text, Animated, StyleSheet, TouchableHighlight,
  TouchableWithoutFeedback } from 'react-native';


class List extends React.Component {

  static defaultProps = {
    mode: 'normal'
  };

  handleSelect = ( key ) => ( state ) => {
    const { onSelect, onPress, selectedKey } = this.props;
    if ( is.Function( onPress )) {
      onPress( key, state );
    }
    if ( key !== selectedKey && is.Function( onSelect )) {
      onSelect( key, state );
    }
  };

  render() {

    const { children, selectedKey, mode, style, title, border, ...props } = this.props;
    const count = React.Children.count( children );
    const listStyle = [];
    if ( is.Undefined( mode ) || mode === 'normal' ) {
      listStyle.push( styles.normal );
    } else if ( mode === 'card' ) {
      listStyle.push( styles.card );
    }
    if ( style ) {
      listStyle.push( style );
    }
    return (
      <View {...omit( props, ['onSelect'])} style={listStyle}>
        {title ? (
          <View style={styles.listTitle}>
            <Text style={styles.listTitleText}>{title}</Text>
          </View>
        ) : null}
        {React.Children.map( children, ( element, index ) => {
          const { children, ...props } = element.props;
          const newProps = {
            hasBorder: border,
            onListSelect: this.handleSelect( element.key )
          };
          if ( selectedKey && selectedKey === element.key ) {
            newProps.selected = true;
          }
          if ( index === 0 ) {
            newProps.firstOne = true;
          }
          if ( index === count - 1 ) {
            newProps.lastOne = true;
          }
          if ( is.Undefined( element.key )) {
            newProps.key = `list-${index}`;
          }
          return React.cloneElement(
            element,
            Object.assign( newProps, props ),
            children
          );
        })}
      </View>
    );
  }
}


function TouchableItem({ highlight, ...props }) {
  return !highlight ? (
    <TouchableWithoutFeedback {...props} />
  ) : (
    <TouchableHighlight underlayColor="#D9D9D9" {...props} />
  );
}


function ItemView({ component: Component, ...props }) {
  return <Component {...props} />;
}


class Item extends React.Component {

  static getDerivedStateFromProps( props, state ) {

    if ( state.selected !== !!props.selected ) {
      return {
        wasSelected: state.selected,
        selected: !!props.selected
      };
    }

    return null;
  }

  state = {
    selected: false,
    wasSelected: false,
    fadeOutOpacity: new Animated.Value( 0 )
  };

  componentDidMount() {
    const { selected, wasSelected, fadeOutOpacity } = this.state;
    if ( !wasSelected && selected ) {
      fadeOutOpacity.setValue( 1 );
    }
  }

  componentDidUpdate() {
    const { wasSelected, selected } = this.state;
    if ( wasSelected && !selected ) {
      this.renderUnSelect();
    }
    if ( !wasSelected && selected ) {
      this.renderSelect();
    }
    this.state.wasSelected = selected;
  }

  handleListSelect = () => {
    const { selected } = this.state;
    const { onListSelect, firstOne, lastOne, arrow } = this.props;
    if ( !selected ) {
      onListSelect({ arrow, firstOne, lastOne, selected });
    }
  };

  renderSelect() {
    Animated.timing( this.state.fadeOutOpacity, {
      toValue: 1,
      duration: 80
    }).start();
  }

  renderUnSelect() {
    Animated.timing( this.state.fadeOutOpacity, {
      toValue: 0,
      duration: 500
    }).start();
  }

  render() {

    const { selected, fadeOutOpacity } = this.state;
    const { children, style, lastOne, extra, arrow, controller, animateStyle,
      hasBorder, border } = this.props;
    const itemStyle = [styles.item];
    const titleTextStyle = [styles.titleText];

    if ( style ) {
      itemStyle.push( style );
    }

    if ( !arrow && selected ) {
      itemStyle.push( styles.itemSelected );
      titleTextStyle.push( styles.titleTextSelected );
    }

    if ( animateStyle ) {
      itemStyle.push( animateStyle );
    }

    const childrenContent = is.String( children )
      ? <Text style={titleTextStyle}>{children}</Text>
      : children;

    return (
      <TouchableItem highlight={!arrow} onPress={this.handleListSelect}>
        <ItemView component={animateStyle ? Animated.View : View} style={itemStyle}>
          {arrow ? <Animated.View style={[ styles.arrowPressed, { opacity: fadeOutOpacity }]} /> : null}
          <View style={styles.content}>
            <View style={styles.title}>
              {childrenContent}
            </View>
            {extra ? (
              <View style={styles.extra}>
                {extra}
              </View>
            ) : null}
            {arrow ? (
              <View style={styles.arrow}>
                <MaterialIcons size={24} name="keyboard-arrow-right" color="#C7C7CC" />
              </View>
            ) : controller ? (
              <View style={styles.controller}>
                {controller}
              </View>
            ) : null}
          </View>
          {( is.Boolean( border ) ? !border : ( lastOne || ( is.Boolean( hasBorder ) ? !hasBorder : selected ))) ? null : <View style={styles.divisor} />}
        </ItemView>
      </TouchableItem>
    );
  }
}


const styles = StyleSheet.create({
  normal: {
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: '#C8C7CC',
    marginBottom: 35
  },
  card: {
    overflow: 'hidden',
    borderRadius: 6,
    marginBottom: 35
  },
  listTitle: {
    height: 20,
    marginLeft: 15
  },
  listTitleText: {
    color: '#6D6D72',
    fontSize: 12
  },
  item: {
    height: 44,
    backgroundColor: '#FFFFFF'
  },
  itemSelected: {
    backgroundColor: '#4CA1FF'
  },
  content: {
    flex: 1,
    flexDirection: 'row'
  },
  title: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center'
  },
  titleText: {
    fontSize: 17
  },
  titleTextSelected: {
    color: '#ffffff'
  },
  divisor: {
    height: 0.5,
    marginLeft: 15,
    backgroundColor: '#C8C7CC'
  },
  extra: {
    justifyContent: 'center'
  },
  arrow: {
    height: 44,
    marginRight: 8,
    justifyContent: 'center'
  },
  arrowPressed: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: '#D9D9D9'
  },
  controller: {
    marginRight: 15,
    justifyContent: 'center'
  }
});

List.Item = Item;
export default List;
