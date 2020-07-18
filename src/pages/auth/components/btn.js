import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Work from '../../../shared/exporter';
import BtnWrapper from '../../../shared/components/btnWrapper';

const {WP} = Work;
const Btn = ({onPress, label, style}) => {
  return (
    <View style={[styles.container, style]}>
      <BtnWrapper press={onPress}>
        <View style={styles.subContainer}>
          <Text style={styles.text}>{label}</Text>
          <Icon name="arrow-forward" size={WP('6')} />
        </View>
      </BtnWrapper>
    </View>
  );
};

export default Btn;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: Work.COLOR.yellow,
    height: WP('12'),
    justifyContent: 'center',
  },
  text: {
    fontSize: WP('4.5'),
    fontWeight: 'bold',
  },
  subContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: WP('5'),
  },
});
