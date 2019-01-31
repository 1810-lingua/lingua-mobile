import React from 'react';
import { FormValidationMessage as OldFormValidationMessage } from 'react-native-elements';

const FormValidationMessage = (props) => {
  return (
    <OldFormValidationMessage {...props} labelStyle={styles.label} containerStyle={styles.container} />
  );
}

const styles = {
  label: {
    color: 'white',
    fontSize: 18
  },
  container: {
    width: '100%'
  }
}

export default FormValidationMessage;