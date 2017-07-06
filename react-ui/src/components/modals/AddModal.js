import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Modal, Button, Form, FormControl, ControlLabel, FormGroup, Alert } from 'react-bootstrap';

import { blogID } from '../data/options';
import EditForm from '../forms/EditForm';

class AddModal extends React.Component {
  static propTypes = {
    //selectedAdd: PropTypes.object.isRequired,
    page: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    postData: PropTypes.func.isRequired,
    updateState: PropTypes.func.isRequired,
  }

  constructor(props){
    super(props);
    let input = {};

    if(Object.keys(this.props.page.edit).length > 0){
      Object.keys(this.props.page.edit).forEach((k) => {
        input[k] = '';
      });
    }

    this.state = {
      input: input,
      section: props.page.page,
      sectionID: props.page.edit._id,
      token: props.user.token
    }
  }

  componentWillReceiveProps(nextProps, prevProps){
    if(Object.keys(nextProps.page.edit).length > 0){
      let input = {};
      Object.keys(this.props.page.edit).forEach((k) => {
        input[k] = '';
      });

      this.setState({
        input: input,
        section: nextProps.page.page,
        sectionID: nextProps.page.edit._id,
        token: nextProps.user.token
      });
    }
  }

  onFormChange = (e) => {
    let value = e.target.value;
    this.state.input[e.target.name] = value;
    this.setState(this.state);
  }

  send = (e) => {
    if(e) e.preventDefault();
    let results = {};
    (Object.keys(this.state.input)).forEach((k) => {
      if(k === "carousel" && Array.isArray(this.state["input"][k]) && this.state["input"][k].length === 1) results[k] = this.state["input"][k][0].split(',');
      else if(k === "carousel" && Array.isArray(this.state["input"][k]) === false) results[k] = this.state["input"][k].split(',');
      else if(k !== "_id") results[k] = this.state["input"][k]
    });
    this.props.postData(``, results);
  }

  pop = (e) => {
    this.props.updateState({
      page: {
        ...this.props.page,
        modalVisible: {
          modalOne: false,
          modalTwo: false,
          modalThree: false,
          modalFour: false,
          modalFive: false
        }
      }
    });
  }

  render(){


    return (
      <div>
        <Modal show={this.props.page.modalVisible.modalOne}>
          <Modal.Header>
            <Modal.Title>Add Content</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <EditForm
              formChange={this.onFormChange}
              pop={this.pop}
              submit={this.send}
              edit={this.state.input}
              message={this.props.page.message}
            />
          </Modal.Body>

          <Modal.Footer>
            *Fill out required fields
            <br />
            Make sure lists are only separated by commas
            <br />
            Empty fields will be filled with default text
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default AddModal;

// class AddModal extends React.Component {
//   static propTypes = {
//     addVisible: PropTypes.bool.isRequired,
//     makeModal: PropTypes.func.isRequired,
//     addBlog: PropTypes.func.isRequired,
//     errorMessage: PropTypes.object.isRequired,
//     selectedAdd: PropTypes.object.isRequired,
//     admin: PropTypes.object.isRequired,
//   }
//
//   constructor(props){
//     super(props);
//
//     this.state = {
//       input: props.selectedAdd.data,
//       section: props.selectedAdd.section,
//       id: props.admin.id
//     }
//   }
//
//   componentWillReceiveProps(nextProps){
//     if(nextProps.selectedAdd !== undefined) {
//       this.setState({
//         input: nextProps.selectedAdd.data,
//         section: nextProps.selectedAdd.section,
//         id: nextProps.admin.id
//       });
//     }
//   }
//
//   onFormChange = (e) => {
//     let value = e.target.value;
//     this.state.input[e.target.name] = value;
//     this.setState(this.state);
//   }
//
//   send = (e) => {
//     if(e) e.preventDefault();
//     let results = {};
//     (Object.keys(this.state.input)).forEach((k) => {
//       if(k === "carousel") results[k] = this.state["input"][k].split(',');
//       else if(k !== "_id") results[k] = this.state["input"][k]
//     });
//     this.props.addBlog({...this.state, input:results});
//   }
//
//   pop = (e) => {
//     this.props.makeModal({"add": false});
//   }
//
//   render(){
//     const alert = (Object.keys(this.props.errorMessage).length !== 0) ?
//       <Alert className="content text-center alertMessage" bsStyle="warning">{this.props.errorMessage.error}</Alert> :
//       <div></div>;
//
//
//     const formItems = (this.state.input === undefined) ?
//       <div></div>:
//       (Object.keys(this.state.input)).map((k, index) => {
//         //let value =
//         if(k !== "_id") {
//           return (
//             <FormGroup key={`formgroup${index}`}>
//               <ControlLabel>{k}</ControlLabel>
//               <FormControl componentClass="Textarea"
//                 name={k}
//                 type="text"
//                 onChange={this.onFormChange}
//               />
//             </FormGroup>
//           );
//         }
//       });
//
//     const buttons = (this.props.admin.admin) ?
//       <div>
//         <Button className="edit" bsStyle="primary" type="submit">
//           Submit
//         </Button>
//         <Button className="edit" bsStyle="danger" onClick={this.pop}>
//           Cancel
//         </Button>
//       </div> :
//       <div>
//         <Button className="edit" bsStyle="info">
//           <NavLink className="select" to="/login" onClick={this.pop}>
//             Login Again
//           </NavLink>
//         </Button>
//         <Button className="edit" bsStyle="danger" onClick={this.pop}>
//           Cancel
//         </Button>
//       </div>
//
//     return (
//       <div>
//         <Modal show={this.props.addVisible}>
//           <Modal.Header>
//             <Modal.Title>Add Content</Modal.Title>
//           </Modal.Header>
//
//           <Modal.Body>
//             <Form className="content" onSubmit={this.send}>
//               {formItems}
//               <div className="text-center">
//                 {alert}
//                 {buttons}
//               </div>
//             </Form>
//           </Modal.Body>
//
//           <Modal.Footer>
//             *Fill out required fields
//             <br />
//             Make sure lists are only separated by commas
//             <br />
//             Empty fields will be filled with default text
//           </Modal.Footer>
//         </Modal>
//       </div>
//     );
//   }
// }
//
// export default AddModal;
