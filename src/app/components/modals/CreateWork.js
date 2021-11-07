import React, { useState } from 'react';
import { useFormik } from 'formik';

import { createWork, updateWork } from '../../../services/works.service'

import createWorkValidationShema from "../../../assets/validations/createWorkValidation";
// import '../../assets/scss/black-dashboard-react/custom/createWork.scss'

import {
     FormGroup,
     Label,
     Input,
     Button,
     Card,
     CardBody
} from "reactstrap";


function CreateWork(props) {
     const [itemForUpdate] = useState(props.updateItem)
     const [environments, setEnvironment] = useState({
          dev: itemForUpdate ? itemForUpdate.dev : {
               active: false,
               date: `${new Date().toLocaleDateString()}`
          },
          fut: itemForUpdate ? itemForUpdate.fut : {
               active: false,
               date: ''
          },
          uat: itemForUpdate ? itemForUpdate.uat : {
               active: false,
               date: ''
          },
          preprod: itemForUpdate ? itemForUpdate.preprod : {
               active: false,
               date: ''
          },
          prod: itemForUpdate ? itemForUpdate.prod : {
               active: false,
               date: ''
          },
     });

     const formik = useFormik({
          initialValues: {
               type: itemForUpdate ? itemForUpdate.type : 'Development',
               ticketId: itemForUpdate ? itemForUpdate.ticketId : '',
               name: itemForUpdate ? itemForUpdate.name : '',
               branch: itemForUpdate ? itemForUpdate.branch : '',
               currentEnv: itemForUpdate ? itemForUpdate.currentEnv : 0,
               ...environments
          },
          onSubmit: values => {
               if (itemForUpdate) {
                    updateWork(values, itemForUpdate.id)
                         .then(res => {
                              formik.resetForm();
                              props.closeModal(true)
                         });
               } else {
                    createWork(values)
                         .then(res => {
                              formik.resetForm();
                              props.closeModal(true)
                         });
               }

          },
          validationSchema: createWorkValidationShema,
     });

     const changeEnv = (key) => {
          const data = environments;
          const keys = Object.keys(environments);
          const ind2 = keys.findIndex(item => item === key)
          keys.map((mapKey, ind) => {
               if (ind > ind2) {
                    data[mapKey].active = false
                    data[mapKey].date = '';
               }
               else if (!data[mapKey].active) {
                    data[mapKey].active = true;
                    data[mapKey].date = `${new Date().toISOString()}`;
               }
               formik.setFieldValue("currentEnv", ind2 + 1);
          });

          setEnvironment({ ...data });
     }


     return (
          <div>
               <div className="content">
                    <Card className="container">
                         <div className="text-center mt-3">
                              <h3>Create Work</h3>
                         </div>
                         <CardBody>
                              <form onSubmit={formik.handleSubmit}>
                                   <FormGroup>
                                        <Label className="log-reg-label" for="type">Work Type</Label>
                                        <Input
                                             autocomplete="off"
                                             type="select"
                                             name="type"
                                             id="type"
                                             onChange={formik.handleChange}
                                             value={formik.values.type}
                                        >
                                             <option>Development</option>
                                             <option>Bug</option>
                                        </Input>
                                   </FormGroup>
                                   <FormGroup>
                                        <Label className="log-reg-label" for="ticketId">Ticket Id</Label>
                                        <Input
                                             autocomplete="off"
                                             id="ticketId"
                                             name="ticketId"
                                             type="ticketId"
                                             onChange={formik.handleChange}
                                             value={formik.values.ticketId}
                                        />
                                   </FormGroup>
                                   <FormGroup>
                                        <Label className="log-reg-label" for="name">Work Name</Label>
                                        <Input
                                             autocomplete="off"
                                             id="name"
                                             name="name"
                                             type="name"
                                             onChange={formik.handleChange}
                                             value={formik.values.name}
                                        />
                                   </FormGroup>
                                   <FormGroup>
                                        <Label className="log-reg-label" for="branch">Work Branch</Label>
                                        <Input
                                             autocomplete="off"
                                             id="branch"
                                             name="branch"
                                             type="branch"
                                             onChange={formik.handleChange}
                                             value={formik.values.branch}
                                        />
                                   </FormGroup>
                                   <Label className="log-reg-label" for="branch">Environments</Label>
                                   <div className="d-flex justify-content-between">
                                        <FormGroup>
                                             <span style={{ textDecoration: "underline", color: "blue" }} href="#" id="TooltipExample1">
                                                  <Button type="button" onClick={() => changeEnv('dev')} className="btn-icon btn-rounded " size="sm"
                                                       color={environments.dev.active === true ? "success" : "danger"}
                                                  >
                                                       <small>Dev</small>
                                                  </Button>
                                             </span>
                                        </FormGroup>
                                        <FormGroup>
                                             <span style={{ textDecoration: "underline", color: "blue" }} href="#" id="TooltipExample1">
                                                  <Button type="button" onClick={() => changeEnv('fut')} className="btn-icon btn-rounded " size="sm"
                                                       color={environments.fut.active === true ? "success" : "danger"}
                                                  >
                                                       <small>Fut</small>
                                                  </Button>
                                             </span>
                                        </FormGroup>

                                        <FormGroup>
                                             <span style={{ textDecoration: "underline", color: "blue" }} href="#" id="TooltipExample1">
                                                  <Button type="button" onClick={() => changeEnv('uat')} className="btn-icon btn-rounded " size="sm"
                                                       color={environments.uat.active === true ? "success" : "danger"}
                                                  >
                                                       <small>Uat</small>
                                                  </Button>
                                             </span>
                                        </FormGroup>

                                        <FormGroup>
                                             <span style={{ textDecoration: "underline", color: "blue" }} href="#" id="TooltipExample1">
                                                  <Button type="button" onClick={() => changeEnv('preprod')} className="btn-icon btn-rounded " size="sm"
                                                       color={environments.preprod.active === true ? "success" : "danger"}
                                                  >
                                                       <small>PRP</small>
                                                  </Button>
                                             </span>
                                        </FormGroup>

                                        <FormGroup>
                                             <span style={{ textDecoration: "underline", color: "blue" }} href="#" id="TooltipExample1">
                                                  <Button type="button" onClick={() => changeEnv('prod')} className="btn-icon btn-rounded " size="sm"
                                                       color={environments.prod.active === true ? "success" : "danger"}
                                                  >
                                                       <small>PRD</small>
                                                  </Button>
                                             </span>
                                        </FormGroup>

                                   </div>
                                   <div className="d-flex justify-content-between mt-4">
                                        <Button className="btn-rounded" onClick={() => props.closeModal(true)} color="primary" type="button">
                                             Close
                                        </Button>
                                        <Button className="btn-rounded" color="primary" type="submit">
                                             {itemForUpdate ? 'Update Item' : 'Add New'}
                                        </Button>
                                   </div>
                              </form>
                         </CardBody>
                    </Card>

               </div>
          </div>
     )
}

export default CreateWork;
