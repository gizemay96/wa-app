import React from 'react'

import {
     Button,
} from "reactstrap";

function DeleteConfirmation({ actionYes, actionNo, message }) {
     return (
          <div>
               <div className="message text-center"><h4>{message}</h4></div>
               <div className="actions d-flex justify-content-center mt-5">
                    <Button className="btn-rounded mr-2 ml-2" color="danger" type="submit" onClick={actionNo}>No</Button>
                    <Button className="btn-rounded mr-2 ml-2" color="success" type="submit" onClick={actionYes}>Yes</Button>
               </div>
          </div>
     )
}

export default DeleteConfirmation;
