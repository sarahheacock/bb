import * as AdminActionTypes from '../actiontypes/admin';
import axios from 'axios';

import {blogID, key} from '../config';
import {initialPage, initialUser, initialCheckout, initialMessage} from '../components/data/options';
var CryptoJS = require("crypto-js");

// const key = '0s3W7DOZkYFzEtLS';
// const enc = CryptoJS.AES.encrypt("Message", key).toString();
// const de = CryptoJS.AES.decrypt(enc, key).toString(CryptoJS.enc.Utf8);
//
// console.log("key", enc);
// console.log("message", de);
//=======================================================


export const updateState = (newState) => {
  return {
    type: AdminActionTypes.UPDATE_STATE,
    newState
  }
}


export const getData = (url, thisPage) => {
  return (dispatch) => {

    return axios.get(url)
      .then(response => {
        console.log("response", response.data);
        dispatch(updateState({
          page: {
            ...initialPage,
            page: thisPage
          },
          message: {
            ...initialMessage
          },
          data: response.data,
        }));
      })
      .catch(error => {
        console.log("error", error);
        //alert("Unable to load content at this time.")
        dispatch(updateState({
          message: {
            error: "Unable to fetch data",
            success: ""
          }
        }));
      });
  }
};

export const putData = (url, newData) => {
  return (dispatch) => {

    return axios.put(url, newData)
      .then(response => {
        console.log("response data", response.data);
        if(response.data.success === false){
          dispatch(updateState({
            user: {
              ...initialUser,
            },
            checkout: {
              ...initialCheckout
            },
            message: {
              error: "Session expired. Log back in again to continue.",
              success: ""
            }
          }));
        }
        else {
          dispatch(updateState({
            message: {
              ...initialMessage
            },
            page: {
              ...initialPage
            },
            data: response.data,
          }));
        }
      })
      .catch(error => {
        console.log(error);
        dispatch(updateState({
          message: {
            error: "Unable to edit data",
            success: ""
          }
        }));
      });

  }
};



export const postData = (url, newData) => {
  return (dispatch) => {

    return axios.post(url, newData)
      .then(response => {
        console.log("response data", response.data);
        if(response.data.success === false){
          dispatch(updateState({
            user: {
              ...initialUser,
            },
            checkout: {
              ...initialCheckout
            },
            message: {
              error: "Session expired",
              success: ''
            }
          }));
        }
        else {
          if (url.includes('say')) { //if posting message
            dispatch(updateState({
              message: {
                "success": "Message sent!",
                "error": ""
              }
            }));
          }
          else if (url.includes('login')) { //if posting login
            dispatch(updateState({
              message: {
                ...initialMessage
              },
              page: {
                ...initialPage
              },
              checkout: {
                ...initialCheckout
              },
              user: response.data
            }));
          }
          else if (url.includes('page')) { //if posting new page
            dispatch(updateState({
              message: {
                ...initialMessage
              },
              page: {
                ...initialPage
              },
              data: response.data
            }));
          }
          else { //if posting upcoming
            dispatch(updateState({
              message: {
                "success": "Thank you",
                "error": ""
              },
              page: {
                ...initialPage
              },
              checkout: {
                ...initialCheckout
              }
            }));
          }
        }
      })
      .catch(error => {
        console.log(error);
        if (url.includes('say')) { //if posting message
          dispatch(updateState({
            message: {
              "success": "",
              "error": "Unable to send Message"
            }
          }));
        }
        else if (url.includes('login')) { //if posting login
          dispatch(updateState({
            message: {
              "success": "",
              "error": "Username and/or password not found"
            }
          }));
        }
        else if (url.includes('page')) { //if posting new page
          dispatch(updateState({
            message: {
              "success": "",
              "error": "Unable to add data"
            }
          }));
        }
        else { //if posting upcoming
          dispatch(updateState({
            message: {
              "success": "",
              "error": "Unable to book stay."
            }
          }));
        }
      });
  }
};

export const deleteData = (url) => {
  return (dispatch) => {

    return axios.delete(url)
    .then(response => {
      console.log("response data", response.data);
      if(response.data.success === false){
        dispatch(updateState({
          user: {
            ...initialUser,
          },
          checkout: {
            ...initialCheckout
          },
          message: {
            error: "Session expired",
            success: ''
          }
        }));
      }
      else {
        dispatch(updateState({
          page: {
            ...initialPage
          },
          data: response.data,
        }));
      }
    })
    .catch(error => {
      console.log(error);
      dispatch(updateState({
        message: {
          error: "Unable to delete data",
          success: ""
        }
      }));
    });
  }
};



//(1) CHARGE CLIENT
//need to add later
export const chargeClient = (url, newData) => {
  return (dispatch) => {
    return dispatch(postData(url, newData))
    //return dispatch(updateClient({admin:clientInfo.admin, select:clientInfo.select}));
  }
};


//(1) REFUND CLIENT
//need to add later
///:userID/upcoming/:upcomingID
export const refundClient = (clientInfo) => {
  return (dispatch) => {
    //"/:pageID/rooms/upcoming/:request"
    //console.log(clientInfo);
    if(clientInfo.user.admin) return dispatch(deleteData(`/api/admin/${clientInfo.user.id}/${clientInfo.upcomingID}?token=${clientInfo.user.token}`));
    else return dispatch(deleteData(`/locked/user/${clientInfo.user.id}/${clientInfo.upcomingID}?token=${clientInfo.user.token}`));
  }
}


//=============GET AVAILABLE ROOMS==============================
// Sync Action
//(3) SUCCESS/UPDATE DATA PROP
//(2) GET THE ROOM DATA FROM THE ID
export const filterSearch = (data, results) => {
  //fetch rooms from page
  console.log("FILTER", results);
  return (dispatch) => {
    return axios.get(`/page/${blogID}/rooms`)
      .then(response => {
        console.log("response data", response.data);
        //filter rooms that have too low maximum occupancy
        let availableRooms = [];

        //filter rooms that are not available for each date
        response.data.forEach((o,j) => {
          //with date[0] find the index with the correct roomID
          const i = results[0].map((f, index) => {if(o._id === f.roomID) return index; });
          const index = i[0];
          //for each date at index...
          //determine if reserved < o.available
          let lookup = false;
          if(o.maximumOccupancy >= data.guests) {

            lookup = results.reduce((a,b) => {
              return ((b[index]["reserved"] < o.available) && a);
            }, true);

          }

          if(lookup){
            availableRooms.push({...o, cost: o.cost * data.days});
          }
        });
        dispatch(updateState({data: availableRooms}));

      })
      .catch(error => {
        console.log(error);
        alert("Unable to load content at this time.")
      });
  }
}

//Async Action
//(1) GET ROOMS FROM DB USING DATES
export const fetchSearch = (data) => {

  // Returns a dispatcher function
  // that dispatches an action at a later time
  return (dispatch) => {
    //CREATE AN ARRAY OF DATES OBJECTS
    let end = data.depart - (24*60*60*1000);
    const begin = data.arrive;
    let dateArr = [];
    let results = [];

    while(end >= begin){
      dateArr.push(end);
      end = end - (24*60*60*1000);
    }
    //console.log("FETCH", dateArr);

    //USE ARRAY TO CALL AVAILABILITY FOR THAT DAY
    return dateArr.forEach((date) => {
      //returns a promise
      axios.get(`/rooms/${blogID}&${date}`)
      .then(response => {

        results.push(response.data.free);
        //dispatch another action
        //to consume data
        if(results.length === dateArr.length){
          dispatch(filterSearch({...data, days: dateArr.length}, results));
        }
      })
      .catch((error) => {
        if(error.message.includes("404")){
          axios.post(`/rooms/`,{
            pageID: blogID,
            date: new Date(date)
          })
          .then(res => {

            results.push(res.data.free);
            if(results.length === dateArr.length){
              dispatch(filterSearch({...data, days: dateArr.length}, results));
            }
          })
          .catch((error) => {
            //console.log(error.message);
            alert("Unable to check availability at this time")
          });
        }
        else {
          alert("Unable to check availability")
        }
      });
    });
  };
};
