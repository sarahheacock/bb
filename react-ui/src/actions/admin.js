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
// export const makeModal = (vis) => {
//   return {
//     type: AdminActionTypes.MAKE_MODAL,
//     vis
//   }
// }
//
// export const selectEdit = (data) => {
//   return {
//     type: AdminActionTypes.SELECT_EDIT,
//     data
//   }
// }
//
// export const selectAdd = (data) => {
//   return {
//     type: AdminActionTypes.SELECT_ADD,
//     data
//   }
// }
//
// export const fail = (results) => {
//   return {
//     type: AdminActionTypes.FAIL,
//     results
//   };
// };

export const updateState = (newState) => {
  return {
    type: AdminActionTypes.UPDATE_STATE,
    newState
  }
}

// export const updateNewMessage = (newMessage) => {
//   return {
//     type: AdminActionTypes.UPDATE_NEW_MESSAGE,
//     newMessage
//   }
// }

// export const updateUserState = (newState) => {
//   return {
//     type: AdminActionTypes.UPDATE_USER_STATE,
//     newState
//   }
// }


//===============MESSAGING===============================================
// export const sendMessageSuccess = () => {
//   return {
//     type: AdminActionTypes.SEND_MESSAGE_SUCCESS,
//   };
// };


// export const sendMessage = (data) => {
//   return (dispatch) => {
//     console.log(data);
//     //return dispatch(sendMessageSuccess(data));
//     return axios.post(`/user/sayHello`,
//       {
//         message: `<h3>Hello, from ${data.name}</h3><p><b>Message: </b>${data.message}</p><br /><p><b>Contact: </b>${data.email} ${data.phone}</p>`
//       })
//       .then(response => {
//         console.log("response data", response.data);
//         //dispatch(sendMessageSuccess());
//         dispatch(updateState({
//           errorMessage: '',
//           messageSent: true
//         }));
// ;      })
//       .catch(error => {
//         console.log(error);
//         //dispatch(fail({"error": "Message unable to send"}));
//         dispatch(updateState({errorMessage: "Message unable to send"}));
//
//         //throw(error);
//       });
//   }
// };



//=====================PAGE LOADING==========================================
// export const fetchBlogSuccess = (results) => {
//   return {
//     type: AdminActionTypes.FETCH_BLOG_SUCCESS,
//     results
//   };
// };


// export const fetchBlog = (page) => {
//   return (dispatch) => {
//
//     return axios.get(`/page/${blogID}/${page}`)
//       .then(json => {
//         console.log("response", json);
//         dispatch(fetchBlogSuccess(json.data));
//       })
//       .catch(error => {
//         console.log(error);
//         alert("Unable to load content at this time.")
//       });
//   }
// };

// export const editBlog = (data) => {
//
//   return (dispatch) => {
//
//     return axios.put(`/api/admin/${blogID}/page/${data.section}/${data.sectionID}`, {
//       ...data.input,
//       token: data.id
//     })
//       .then(response => {
//         console.log("response data", response.data);
//         if(response.data.success === false) dispatch(logout("Session expired. You are now logged out. Log back in again to continue editing."))
//         else dispatch(fetchBlogSuccess(response.data));
//       })
//       .catch(error => {
//         console.log(error);
//         dispatch(fail({"error": "Unable to edit content at this time."}));
//       });
//   }
// };

// export const postData = (url, newData) => {
//   return (dispatch) => {
//
//     return axios.post(`/api/admin/${blogID}/page/${data.section}`,
//       {
//         ...data.input,
//         token: data.id
//       })
//       .then(response => {
//         console.log("response data", response.data);
//         if(response.data.success === false) dispatch(logout("Session expired. You are now logged out. Log back in again to continue editing."));
//         else dispatch(fetchBlogSuccess(response.data));
//       })
//       .catch(error => {
//         console.log(error);
//         dispatch(fail({"error": "Unable to add content at this time"}));
//       });
//   }
// };

// export const deleteBlog = (data) => {
//   return (dispatch) => {
//
//     return axios.delete(`/api/admin/${blogID}/page/${data.section}/${data.sectionID}?token=${data.id}`)
//       .then(response => {
//         console.log("response data", response.data);
//         if(response.data.success === false) dispatch(logout("Session expired. You are now logged out. Log back in again to continue editing."))
//         else dispatch(fetchBlogSuccess(response.data));
//       })
//       .catch(error => {
//         console.log(error);
//         dispatch(fail({"error": "Unable to delete content at this time."}));
//       });
//   }
// };

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
              ...initialMessage
            },
            page: {
              ...initialPage
            }
          }));
        }
        else {
          dispatch(updateState({
            message: {
              "success": "data edited",
              "error": ""
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
}



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

//===================CHECKOUT=================================
// export const updateCheckout = (select, checkout) => {
//   return {
//     type: AdminActionTypes.UPDATE_CHECKOUT,
//     select,
//     checkout
//   }
// };
//
// export const verifyPayment = (credit) => {
//   return {
//     type: AdminActionTypes.VERIFY_PAYMENT,
//     credit
//   }
// };

//(3) CHECKOUT
// export const completeCheckout = (response) => {
//   return {
//     type: AdminActionTypes.COMPLETE_CHECKOUT,
//     response
//   }
// };
//
// //(2) UPDATE CLIENT INFO
// export const updateClient = (clientInfo) => {
//   return (dispatch) => {
//     console.log(clientInfo);
//     if(clientInfo.admin.admin){
//       return axios.post(`/api/admin/${clientInfo.admin.user}`, {
//         ...clientInfo.select,
//         token: clientInfo.admin.id
//       })
//       .then(response => {
//         console.log("response", response);
//         dispatch(completeCheckout(response.data));
//       })
//       .catch(error => {
//         dispatch(fail({"error": "Unable to confirm reservation"}));
//       });
//     }
//     else {
//       console.log({...clientInfo.select,
//       token: clientInfo.admin.id});
//       return axios.post(`/locked/user/${clientInfo.admin.user}`, {
//         ...clientInfo.select,
//         token: clientInfo.admin.id
//       })
//       .then(response => {
//         console.log("response", response);
//         dispatch(completeCheckout(response.data));
//       })
//       .catch(error => {
//         dispatch(fail({"error": "Unable to confirm reservation"}));
//       });
//     }
//   };
// }

//(1) CHARGE CLIENT
//need to add later
export const chargeClient = (url, newData) => {
  return (dispatch) => {
    return dispatch(postData(url, newData))
    //return dispatch(updateClient({admin:clientInfo.admin, select:clientInfo.select}));
  }
};

//(2) DELETE UPCOMING WITH USER AUTH
// export const updateUpcoming = (url) => {
//   return (dispatch) => {
//     console.log(url);
//     //return dispatch(fetchBlogSuccess([]));
//     return axios.delete(url)
//     .then(res => {
//       console.log("res", res.data);
//
//       if(res.data) dispatch(fetchBlogSuccess(res.data));
//       //dispatch(fail({}));
//     })
//     .catch(error => {
//       dispatch(fail({"error": "Unable to cancel reservation"}));
//     });
//   }
// }

//(1) REFUND CLIENT
//need to add later
///:userID/upcoming/:upcomingID
export const refundClient = (clientInfo) => {
  return (dispatch) => {
    //"/:pageID/rooms/upcoming/:request"
    //console.log(clientInfo);
    if(clientInfo.user.admin) return dispatch(deleteData(`/api/admin/${clientInfo.user.id}/${clientInfo.upcomingID}?token=${clientInfo.user.token}`));
    else return dispatch(deleteData(`/locked/user/${clientInfo.user.id}/${clientInfo.upcomingID}?token=${clientInfo.user.token}`));
    //return dispatch(deleteData(url));
  }
}


//=================FETCH CLIENT INFO==============================================
// (2) MAKE RESULT DATA CURRENT
// (1) FETCH CLIENT INFO
// export const fetchClient = (user) => {
//   return (dispatch) => {
//     //get("/locked/user/:userID/"
//     console.log(user);
//       return axios.get(user)
//       .then(response => {
//         dispatch(fetchBlogSuccess(response.data));
//         //else dispatch(fetchBlogSuccess([response.data]))
//       })
//       .catch(error => {
//         console.log(error);
//         dispatch(fail({"error": "Unable to fetch account information"}));
//       });
//   };
// };

//===============UPDATE CLIENT INFO===============================================
// (1) MAKE RESULT PART OF STATE.ADMIN
// (2) UPDATE CLIENT INFO
// export const updateEmail = (profile, credit) => {
//   return (dispatch) => {
//       return axios.put(`/locked/user/${profile.userID}`, {
//         ...credit,
//         token: profile.token
//       })
//       .then(response => {
//         //dispatch(fetchBlogSuccess([response.data]))
//         dispatch(verifyPayment(credit));
//       })
//       .catch(error => {
//         dispatch(fail({"error": "Unable to update account information"}));
//       });
//   };
// };

//=============MAKE/CANCEL RESERVATION============================================


//=================AUTHENTICATION==================================================
// export const logout = (message) => {
//   if(message === "Session expired. You are now logged out. Log back in again to continue editing.") alert("Session expired");
//   return {
//     type: AdminActionTypes.LOGOUT,
//     message
//   };
// };
//
// export const verifyEmailSuccess = (results) => {
//   return {
//     type: AdminActionTypes.VERIFY_EMAIL_SUCCESS,
//     results
//   };
// };
//
// export const verifyEmail = (data) => {
//   return (dispatch) => {
//
//     if(data.admin){
//       //admin login
//       return axios.post(`/api/login`, {
//         username: data.username,
//         password: data.password
//       })
//         .then(response => {
//           console.log("response data", response.data);
//           dispatch(verifyEmailSuccess(response.data));
//         })
//         .catch(error => {
//           console.log(error);
//           dispatch(fail({"error": "username and/or password not found"}));
//           //throw(error);
//         });
//     }
//     else {
//       //user login
//       return axios.post(`/locked/userlogin`, {
//         email: data.username,
//         password: data.password
//       })
//         .then(response => {
//           console.log("response data", response.data);
//           dispatch(verifyEmailSuccess(response.data));
//         })
//         .catch(error => {
//           console.log(error);
//           dispatch(fail({"error": "username and/or password not found"}));
//           //throw(error);
//         });
//     }
//   }
// };

//==============CREATE CLIENT=====================================
// (3) VERIFY_EMAIL_SUCCESS
// (2) SIGN IN
// (1) UPDATE CLIENT'S ACCOUNT
// export const createEmail = (formData) => {
//   return (dispatch) => {
//     //post("/:userID/:password/upcoming"
//     console.log(formData.email);
//       return axios.post(`/page/user-setup`, {
//         "email": formData.email,
//         "password": formData.password,
//         "billing": formData.billing,
//         "pageID": blogID
//       })
//       .then(response => {
//         console.log(response.data);
//         dispatch(verifyEmail({admin: false, username: response.data.email, password: formData.password }))
//       })
//       .catch(error => {
//         dispatch(fail({"error": "Unable to create new account"}));
//       });
//   };
// }

//=============GET AVAILABLE ROOMS==============================
// Sync Action
//(3) SUCCESS/UPDATE SEARCHRESULTS PROP
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
