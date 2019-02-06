const initialState = {
  words: [],
  language: ''
}
const GOT_LANGUAGE = 'GOT_LANGUAGE'
  
  
  export const gotLanguage = language => ({
    type: GOT_LANGUAGE,
    language
  })
  


  export const updateLanguage = (language) => {
    return async (dispatch) => {
      console.log('here')
      dispatch(gotLanguage(language));
    }
  }
  
  // export const languageReducer = (state = initialState, action) => {
  //   switch (action.type) {
  //     case GOT_LANGUAGE: 
  //       return {...state, language: action.language}
  //     default:
  //       return state;
  //   }
  // }

const GOT_WORDS = 'GOT_WORDS';

export const gotWords = (words) => ({
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
    case GOT_LANGUAGE: 
      return {...state, language: action.language}
    default:
      return state;
  }
}