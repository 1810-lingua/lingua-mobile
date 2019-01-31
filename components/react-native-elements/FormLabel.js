import React from 'react';
import { FormLabel as OldFormLabel } from 'react-native-elements';

const FormLabel = (props) => {
  return (
    <OldFormLabel {...props} labelStyle={styles.label} />
  );
}

const styles = {
  label: {
    color: 'white',
    fontSize: 18
  }
}

export default FormLabel;