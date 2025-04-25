import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSpring,
  withSequence
} from 'react-native-reanimated';

// Components
import LayoutSelector from './LayoutSelector';
import LayoutEditor from './LayoutEditor';

// Contexts
import { ThemeContext } from '../context/ThemeContext';
import { RemoteLayoutContext } from '../context/RemoteLayoutContext';

export default function OneClickLayoutButton() {
  const { theme } = useContext(ThemeContext);
  const { currentLayout, toggleEditMode, isEditMode } = useContext(RemoteLayoutContext);
  
  const [layoutModalVisible, setLayoutModalVisible] = useState(false);
  const [editorModalVisible, setEditorModalVisible] = useState(false);
  
  // Animation values
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  
  // Animated styles for the button
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotate.value}deg` }
      ]
    };
  });
  
  // Button animation
  const animateButton = () => {
    scale.value = withSequence(
      withTiming(0.8, { duration: 100 }),
      withSpring(1.1, { damping: 10 }),
      withTiming(1, { duration: 100 })
    );
  };
  
  // Animation when in edit mode
  const animateEditMode = () => {
    if (isEditMode) {
      rotate.value = withTiming(360, { duration: 500 });
    } else {
      rotate.value = withTiming(0, { duration: 500 });
    }
  };
  
  const handlePress = () => {
    animateButton();
    setLayoutModalVisible(true);
  };
  
  const handleLongPress = () => {
    animateButton();
    toggleEditMode();
    animateEditMode();
    
    if (!isEditMode) {
      setEditorModalVisible(true);
    }
  };
  
  return (
    <>
      <Animated.View style={[styles.container, animatedStyle]}>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isEditMode ? theme.colors.primary : theme.colors.card }
          ]}
          onPress={handlePress}
          onLongPress={handleLongPress}
          delayLongPress={500}
        >
          <Feather 
            name={isEditMode ? "check" : "layout"} 
            size={24} 
            color={isEditMode ? theme.colors.buttonText : theme.colors.text} 
          />
        </TouchableOpacity>
      </Animated.View>
      
      {/* Layout Selector Modal */}
      <Modal
        visible={layoutModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setLayoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <LayoutSelector onClose={() => setLayoutModalVisible(false)} />
        </View>
      </Modal>
      
      {/* Layout Editor Modal */}
      <Modal
        visible={editorModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setEditorModalVisible(false);
          toggleEditMode();
          animateEditMode();
        }}
      >
        <View style={styles.modalOverlay}>
          <LayoutEditor 
            onClose={() => {
              setEditorModalVisible(false);
              toggleEditMode();
              animateEditMode();
            }} 
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 100,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});