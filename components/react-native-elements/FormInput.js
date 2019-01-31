import React from 'react';
import { FormInput as OldFormInput } from 'react-native-elements';

const FormInput = (props) => {
  return (
    <OldFormInput {...props} inputStyle={styles.input} containerStyle={styles.container} selectionColor='white' />
  );
}

const styles = {
  input: {
    color: 'white'
  },
  container: {
    borderBottomColor: 'white',
    marginBottom: 15
  }
}

export default FormInput;