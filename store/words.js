const initialState = {
  words: [],
  language: 'spanish',
  learned: [],
  unlearned: []
}


const GOT_WORDS = 'GOT_WORDS'
const GOT_LANGUAGE = 'GOT_LANGUAGE'
const GOT_FILTERED = 'GOT_FILTERED'

export const gotWords = (words) => ({
  type: GOT_WORDS,
  words
});


export const updateWords = (words) => {
  return async (dispatch) => {
    dispatch(gotWords(words));
  }
}

export const gotLanguage = language => ({
  type: GOT_LANGUAGE,
  language
})

export const filteredWords = (words) => ({
  type: GOT_FILTERED,
  learned: words.filter(word => word.learned),
  unlearned: words.filter(word => !word.learned)
})

// export const unlearnedWords = (words) => ({
//   type: GOT_UNLEARNED,
//   unlearned: words.filter(word => !word.learned)
// })

export const updateLanguage = (language) => {
  return async (dispatch) => {
    console.log('here')
    dispatch(gotLanguage(language));
  }
}

export const wordReducer = (state = initialState, action) => {
  switch (action.type) {
    case GOT_WORDS:
      return { ...state, words: action.words }
    case GOT_LANGUAGE: 
      return {...state, language: action.language}
    case GOT_FILTERED:
      return {...state, learned: action.learned, unlearned: action.unlearned}
    default:
      return state;
  }
}