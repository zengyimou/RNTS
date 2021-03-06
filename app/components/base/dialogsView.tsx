import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Easing,
  TouchableOpacity,
  BackHandler
} from 'react-native';
import PropTypes from 'prop-types';

interface Props {
  type?: string;
  message?:string;
  cancelTxt?: string;
  confirmTxt?: string;
  [propName: string]: any;
}
interface State {
  type?: string;
  cancelTxt?: string;
  confirmTxt?: string;
  message?: string;
}

export default class DislogsView extends Component<Props, State> {

  static propTypes = {
    type: PropTypes.string,
    message:PropTypes.string,
    cancelPress: PropTypes.func,
    confirmPress: PropTypes.func,
    cancelTxt: PropTypes.string,
    confirmTxt: PropTypes.string,
  };

  static defaultProps = {
    type: "alert", //alert、confirm
    message: "暂无提示信息",
    cancelPress: ()=>{},
    confirmPress: ()=>{},
    cancelTxt: "取消",
    confirmTxt: "确定",
  };

  opacityAnim = new Animated.Value(0);
  dismissHandler: any;
  backHandler: any;

  constructor(props: Props) {
    super(props);
    this.state = {
      type: props.type,
      cancelTxt: props.cancelTxt,
      confirmTxt: props.confirmTxt,
      message: props.message,
    }
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      return true;
    });
    Animated.timing(
      this.opacityAnim,
      {
        toValue: 1,
        duration: 200,
        easing: Easing.linear
      },
    ).start();
  }

  componentWillReceiveProps(nextProps: any) {
    console.log("nextProps", nextProps);
    this.setState({
      type: nextProps.type,
      cancelTxt: nextProps.cancelTxt,
      confirmTxt: nextProps.confirmTxt,
      message: nextProps.message,
    });
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  dismiss = (onDismiss: any) => {
    Animated.timing(
      this.opacityAnim,
      {
        toValue: 0,
        duration: 100,
        easing: Easing.linear
      },
    ).start(onDismiss);
  };

  onCancelPress = () => {
    if (this.props.cancelPress) {
      this.props.cancelPress()
    }
  };

  onConfirmPress = () => {
    if (this.props.confirmPress) {
      this.props.confirmPress()
    }
  };

  cancelFun = ()=>{
    this.dismiss(this.onCancelPress);
  };

  confirmFun = ()=>{
    this.dismiss(this.onConfirmPress);
  };

  render() {
    const { type, message, cancelTxt, confirmTxt } = this.state;
    return (
      <View style={styles.container} pointerEvents='box-none'>
        <Animated.View style={[styles.textContainer, {opacity: this.opacityAnim, transform: [{ scale: this.opacityAnim }]}]}>
          <View style={styles.textBox}>
            <Text style={styles.defaultText}>{message}</Text>
          </View>
          <View style={styles.btnBox}>
            {type == 'confirm' && <TouchableOpacity onPress={this.cancelFun} style={[styles.btn, {borderRightWidth: StyleSheet.hairlineWidth, borderColor: '#efefef'}]}>
              <Text>{cancelTxt}</Text>
            </TouchableOpacity>}
            <TouchableOpacity onPress={this.confirmFun} style={styles.btn}>
              <Text>{confirmTxt}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  textContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#efefef',
    maxWidth: 300,
    minWidth: 200,
  },
  textBox: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    alignItems: 'center'
  },
  defaultText: {
    color: "#333",
    fontSize: 15,
  },
  btnBox: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#efefef',
    flexDirection: 'row',
  },
  btn: {
    flex: 1,
    color: "#333",
    paddingVertical: 10,
    alignItems: 'center'
  },
  container: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
  }
});