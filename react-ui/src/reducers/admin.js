import * as AdminActionTypes from '../actiontypes/admin';


//==============================================================
//state={} is overwritten by initialState provided in index.js
export default function Admin(state={}, action){
  switch (action.type) {

    case AdminActionTypes.UPDATE_STATE: {

      return {
        ...state,
        ...action.newState
      }
    }

    case AdminActionTypes.UPDATE_NEW_MESSAGE: {

      return {
        ...state,
        page: {
          ...state.page,
          message: action.newMessage
        }
      }
    }

    // case AdminActionTypes.MAKE_MODAL: {
    //   const newVis = {
    //
    //   };
    //   return {
    //     ...state,
    //     modalVisible: newVis,
    //     messageSent: false,
    //     errorMessage: {}
    //   }
    // }

    // case AdminActionTypes.SELECT_EDIT: {
    //   const newVis = {
    //     ...state.modalVisible,
    //     edit: true
    //   };
    //   return {
    //     ...state,
    //     modalVisible: newVis,
    //     messageSent: false,
    //     errorMessage: {},
    //     selectedEdit: action.data,
    //   }
    // }
    //
    // case AdminActionTypes.SELECT_ADD: {
    //   const newVis = {
    //     ...state.modalVisible,
    //     add: true
    //   };
    //   return {
    //     ...state,
    //     modalVisible: newVis,
    //     messageSent: false,
    //     errorMessage: {},
    //     selectedAdd: action.data
    //   }
    // }
    //
    // case AdminActionTypes.SEND_MESSAGE_SUCCESS: {
    //   return {
    //     ...state,
    //     messageSent: true,
    //     errorMessage: {}
    //   }
    // }
    //
    // case AdminActionTypes.FETCH_BLOG_SUCCESS: {
    //   const Data = {
    //     current: action.results
    //   }
    //   return {
    //     ...state,
    //     data: Data,
    //     modalVisible: {"edit": false, "add": false, "message": false, "client": false, "login": false},
    //     newPage: false
    //   }
    // }
    //
    // case AdminActionTypes.VERIFY_EMAIL_SUCCESS: {
    //   return {
    //     ...state,
    //     admin: action.results,
    //     errorMessage: {}
    //   }
    // }
    //
    // case AdminActionTypes.LOGOUT: {
    //   const newAdmin = {
    //     admin: false,
    //     id: "",
    //     user: "",
    //     username: "",
    //   };
    //   return {
    //     ...state,
    //     admin: newAdmin,
    //     errorMessage: {"error": action.message}
    //   }
    // }
    //
    // case AdminActionTypes.FAIL: {
    //   return {
    //     ...state,
    //     errorMessage: action.results
    //   }
    // }
    //
    // case AdminActionTypes.VERIFY_PAYMENT: {
    //   const newAdmin = {
    //     ...state.admin,
    //     credit: action.credit
    //   };
    //   return {
    //     ...state,
    //     admin: newAdmin
    //   }
    // }
    //
    // case AdminActionTypes.UPDATE_CHECKOUT: {
    //   return {
    //     ...state,
    //     select: action.select,
    //     checkout: action.checkout,
    //     errorMessage: {}
    //   }
    // }
    //
    // case AdminActionTypes.COMPLETE_CHECKOUT: {
    //   const temp = new Date().toString().split(' ');
    //   let NOW = new Date(temp[0] + " " + temp[1] + " " + temp[2] + " " + temp[3] + " 10:00:00").getTime();
    //   const newAdmin = {
    //     ...state.admin,
    //     credit: {}
    //   };
    //   return {
    //     ...state,
    //     admin: newAdmin,
    //     checkout: {
    //       selected: false,
    //       billing: false,
    //       payment: false,
    //       confirmation: false
    //     },
    //     select: {
    //       roomID: {},
    //       arrive: NOW,
    //       depart: NOW + 24*60*60*1000,
    //       guests: 2
    //     },
    //     errorMessage: {}
    //   }
    // }

    default:
      return state;
  }
}
