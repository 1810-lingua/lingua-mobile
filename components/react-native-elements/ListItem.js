import React from 'react';
import { ListItem as OldListItem } from 'react-native-elements';

const ListItem = (props) => {
  return (
    <OldListItem {...props} containerStyle={styles.containerStyle} />
  );
}

const styles = {
  containerStyle: {
    borderBottomColor: '#E6E6E6',
    borderBottomWidth: 0.5,
    backgroundColor: 'white'
  }
}

export default ListItem;