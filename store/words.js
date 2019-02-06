const initialState = {
  words: []
}

const GOT_WORDS = 'GOT_WORDS';

const gotWords = (words) => ({
  type: GOT_WORDS,
  words
});


export const updateWords = (words) => {
  return async (dispatch) => {
    dispatch(gotWords(words));
  }
}


export const wordReducer = (state = initialState, action) => {
  switch (action.type) {
    case GOT_WORDS:
      return { ...state, words: action.words }
    default:
      return state;
  }
}