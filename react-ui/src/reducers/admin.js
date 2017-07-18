import * as AdminActionTypes from '../actiontypes/admin';


//==============================================================
//state={} is overwritten by initialState provided in index.js
export default function Admin(state={}, action){
  switch (action.type) {

    case AdminActionTypes.UPDATE_STATE: {

      let stateObj = {...state};
      Object.keys(action.newState).forEach((k) => {
        if(k === "billing" || k === "selected" || k === "payment"){
          stateObj["checkout"][k] = Object.assign({}, action.newState[k]);
        }
        else if(stateObj[k]){
          stateObj[k] = action.newState[k];
        }
      });

      console.log("action.newState", action.newState);
      console.log("stateObj", stateObj);

      return stateObj;
    }

    default:
      return state;
  }
}
