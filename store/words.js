const initialState = {
  words: []
};

const GOT_WORDS = "GOT_WORDS";

const gotWords = words => ({
  type: GOT_WORDS,
  words
});

export const updateWords = uid => {
  firebase
    .database()
    .ref(`${uid}/spanish`)
    .on("value", snapshot => {
      const words = Object.values(snapshot.val() || {});
      return async dispatch => {
        dispatch(gotWords(words));
      };
    });
};

export const wordReducer = (state = initialState, action) => {
  switch (action.type) {
    case GOT_WORDS:
      return { ...state, words: action.words };
    default:
      return state;
  }
};

export const deleteWord = async word => {
  const { uid } = await firebase.auth().currentUser;
  await firebase
    .database()
    .ref(`${uid}/spanish/${word}`)
    .remove();
};

export const markLearned = async word => {
  const { uid } = await firebase.auth().currentUser;
  await firebase
    .database()
    .ref(`${uid}/spanish/${word}`)
    .update({ learned: true });
};

export const markUnlearned = async word => {
  const { uid } = await firebase.auth().currentUser;
  await firebase
    .database()
    .ref(`${uid}/spanish/${word}`)
    .update({ learned: false });
};
