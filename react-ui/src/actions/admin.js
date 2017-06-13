import * as AdminActionTypes from '../actiontypes/admin';
import axios from 'axios';

const url = "https://peaceful-shelf-12195.herokuapp.com";
const blogID = "593d5eca1e17e126ddff6d0a";


// export const fetchApiSuccess = (mess) => {
//   return {
//     type: AdminActionTypes.API_SUCCESS,
//     mess
//   }
//   // this.setState({
//   //   message: json.message,
//   //   fetching: false
//   // });
// }
//
// export const fetchApiFail = (mess) => {
//   return {
//     type: AdminActionTypes.API_FAIL,
//     mess
//   }
//   // this.setState({
//   //   message: `API call failed: ${e}`,
//   //   fetching: false
//   // });
// }
//
// export const fetchApi = (action) => {
//   return (dispatch) => {
//     //return dispatch(sendMessageSuccess(data));
//     return fetch('/api')
//       .then(response => {
//         if (!response.ok) {
//           throw new Error(`status ${response.status}`);
//         }
//         return response.json();
//       })
//       .then(json => {
//         dispatch(fetchApiSuccess(json.message))
//       }).catch(e => {
//         dispatch(fetchApiFail(e))
//       })
//   }
//
// }

//=======================================================
export const makeModal = (vis) => {
  return {
    type: AdminActionTypes.MAKE_MODAL,
    vis
  }
}

export const selectEdit = (data) => {
  return {
    type: AdminActionTypes.SELECT_EDIT,
    data
  }
}

export const selectAdd = (data) => {
  return {
    type: AdminActionTypes.SELECT_ADD,
    data
  }
}

export const fail = (results) => {
  return {
    type: AdminActionTypes.FAIL,
    results
  };
};

//===============MESSAGING===============================================
export const sendMessageSuccess = () => {
  return {
    type: AdminActionTypes.SEND_MESSAGE_SUCCESS,

  };
};


export const sendMessage = (data) => {
  return (dispatch) => {
    console.log(data);
    //return dispatch(sendMessageSuccess(data));
    return axios.post(`${url}/user/sayHello`,
      {
        message: `<h3>Hello, from ${data.name}</h3><p><b>Message: </b>${data.message}</p><br /><p><b>Contact: </b>${data.email} ${data.phone}</p>`
      })
      .then(response => {
        console.log("response data", response.data);
        dispatch(sendMessageSuccess());
      })
      .catch(error => {
        console.log(error);
        dispatch(fail({"error": "Message unable to send"}));
        //throw(error);
      });
  }
};


//=====================PAGE LOADING==========================================
export const fetchBlogSuccess = (results) => {
  return {
    type: AdminActionTypes.FETCH_BLOG_SUCCESS,
    results
  };
};

export const fetchBlog = (data) => {
  return (dispatch) => {

    return axios.get(`${url}/user/${blogID}/${data}`)
      .then(response => {
        console.log("response data", response.data);
        dispatch(fetchBlogSuccess(response.data));
      })
      .catch(error => {
        throw(error);
      });
  }
};

export const editBlog = (data) => {

  return (dispatch) => {

    return axios.put(`${url}/api/admin/${blogID}/${data.section}/${data.sectionID}`, {
      ...data.input,
      token: data.id
    })
      .then(response => {
        console.log("response data", response.data);
        if(response.data.success === false) dispatch(logout("Session expired. You are now logged out. Log back in again to continue editing."))
        else dispatch(fetchBlogSuccess(response.data));
      })
      .catch(error => {
        throw(error);
      });
  }
};

export const addBlog = (data) => {
  return (dispatch) => {

    return axios.post(`${url}/api/admin/${blogID}/${data.section}`,
      {
        ...data.input,
        token: data.id
      })
      .then(response => {
        console.log("response data", response.data);
        if(response.data.success === false) dispatch(logout("Session expired. You are now logged out. Log back in again to continue editing."));
        else dispatch(fetchBlogSuccess(response.data));
      })
      .catch(error => {
        throw(error);
      });
  }
};

export const deleteBlog = (data) => {
  return (dispatch) => {

    return axios.delete(`${url}/api/admin/${blogID}/${data.section}/${data.sectionID}?token=${data.id}`)
      .then(response => {
        console.log("response data", response.data);
        if(response.data.success === false) dispatch(logout("Session expired. You are now logged out. Log back in again to continue editing."))
        else dispatch(fetchBlogSuccess(response.data));
      })
      .catch(error => {
        throw(error);
      });
  }
};


//=================AUTHENTICATION==================================================
export const logout = (message) => {
  if(message === "Session expired. You are now logged out. Log back in again to continue editing.") alert("Session expired");
  return {
    type: AdminActionTypes.LOGOUT,
    message
  };
};

export const verifyEmailSuccess = (results) => {
  return {
    type: AdminActionTypes.VERIFY_EMAIL_SUCCESS,
    results
  };
};

export const verifyEmail = (data) => {
  return (dispatch) => {

    return axios.post(`${url}/api/login`, {
      username: data.username,
      password: data.password
    })
      .then(response => {
        console.log("response data", response.data);
        dispatch(verifyEmailSuccess(response.data));
      })
      .catch(error => {
        console.log(error);
        dispatch(fail({"error": "username and/or password not found"}));
        //throw(error);
      });
  }
};
