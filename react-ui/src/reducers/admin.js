import * as AdminActionTypes from '../actiontypes/admin';


//==============================================================
//state={} is overwritten by initialState provided in index.js
export default function Admin(state={}, action){
  switch (action.type) {

    case AdminActionTypes.MAKE_MODAL: {
      const newVis = {
        ...state.modalVisible,
        ...action.vis
      };
      return {
        ...state,
        modalVisible: newVis,
        messageSent: false,
        errorMessage: {}
      }
    }

    case AdminActionTypes.SELECT_EDIT: {
      const newVis = {
        ...state.modalVisible,
        edit: true
      };
      return {
        ...state,
        modalVisible: newVis,
        messageSent: false,
        errorMessage: {},
        selectedEdit: action.data,
      }
    }

    case AdminActionTypes.SELECT_ADD: {
      const newVis = {
        ...state.modalVisible,
        add: true
      };
      return {
        ...state,
        modalVisible: newVis,
        messageSent: false,
        errorMessage: {},
        selectedAdd: action.data
      }
    }

    case AdminActionTypes.SEND_MESSAGE_SUCCESS: {
      return {
        ...state,
        messageSent: true,
        errorMessage: {}
      }
    }

    case AdminActionTypes.FETCH_BLOG_SUCCESS: {
      const Data = {
        current: action.results
      }
      return {
        ...state,
        data: Data,
        modalVisible: {"edit": false, "add": false, "message": false, "client": false, "login": false},
        newPage: false
      }
    }

    case AdminActionTypes.VERIFY_EMAIL_SUCCESS: {
      return {
        ...state,
        admin: action.results,
        errorMessage: {}
      }
    }

    case AdminActionTypes.LOGOUT: {
      const newAdmin = {
        admin: false,
        id: "",
        user: "",
        username: "",
      };
      return {
        ...state,
        admin: newAdmin,
        errorMessage: {"error": action.message}
      }
    }

    case AdminActionTypes.FAIL: {
      return {
        ...state,
        errorMessage: action.results
      }
    }

    case AdminActionTypes.UPDATE_CHECKOUT: {
      return {
        ...state,
        select: action.select,
        checkout: action.checkout
      }
    }

    default:
      return state;
  }
}
