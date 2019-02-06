

const initialState = {
    language: ''
  }
  
  const GOT_LANGUAGE = 'GOT_LANGUAGE'
  
  
  const gotLanguage = language => ({
    type: GOT_LANGUAGE,
    language
  })
  


  export const updateLanguage = (language) => {
    return async (dispatch) => {
      dispatch(gotLanguage(language));
    }
  }
  
  export const languageReducer = (state = initialState, action) => {
    switch (action.type) {
      case GOT_LANGUAGE: 
        return {...state, language: action.language}
      default:
        return state;
    }
  }