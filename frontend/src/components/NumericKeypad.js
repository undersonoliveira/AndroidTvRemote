import React from 'react';
import { 
  View, 
  TouchableOpacity, 
  Text, 
  StyleSheet 
} from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function NumericKeypad({ onPress, theme }) {
  const renderKeypadButton = (number) => {
    return (
      <TouchableOpacity
        key={number.toString()}
        style={[
          styles.keypadButton,
          { 
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border
          }
        ]}
        onPress={() => onPress(number)}
      >
        <Text style={[styles.keypadButtonText, { color: theme.colors.text }]}>
          {number}
        </Text>
      </TouchableOpacity>
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {renderKeypadButton(1)}
        {renderKeypadButton(2)}
        {renderKeypadButton(3)}
      </View>
      <View style={styles.row}>
        {renderKeypadButton(4)}
        {renderKeypadButton(5)}
        {renderKeypadButton(6)}
      </View>
      <View style={styles.row}>
        {renderKeypadButton(7)}
        {renderKeypadButton(8)}
        {renderKeypadButton(9)}
      </View>
      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.keypadButton,
            { 
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border
            }
          ]}
          onPress={() => onPress('*')}
        >
          <Text style={[styles.keypadButtonText, { color: theme.colors.text }]}>
            *
          </Text>
        </TouchableOpacity>
        {renderKeypadButton(0)}
        <TouchableOpacity
          style={[
            styles.keypadButton,
            { 
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border
            }
          ]}
          onPress={() => onPress('#')}
        >
          <Text style={[styles.keypadButtonText, { color: theme.colors.text }]}>
            #
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.enterButton,
            { 
              backgroundColor: theme.colors.primary
            }
          ]}
          onPress={() => onPress('enter')}
        >
          <Feather name="corner-down-left" size={22} color={theme.colors.buttonText} />
          <Text style={[styles.enterButtonText, { color: theme.colors.buttonText }]}>
            Enter
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  keypadButton: {
    width: '30%',
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  keypadButtonText: {
    fontSize: 24,
    fontWeight: '500',
  },
  enterButton: {
    flexDirection: 'row',
    width: '100%',
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  enterButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
