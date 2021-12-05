import { React, useEffect, useState } from 'react'
import {
     Card, CardImg, CardBody,
     Button,
     CardHeader,
     CardTitle,

     Row,
     Col,
     UncontrolledAlert,
     Input
} from 'reactstrap';
import { TabContent, TabPane, Nav, NavItem, NavLink, CardText, } from 'reactstrap';
import classnames from 'classnames';
import { deleteFileById, uploadFileToWorkItem } from 'services/fileService';
import { getWorkById } from 'services/works.service';
import { updateWork } from '../../services/works.service'
import '../../assets/scss/black-dashboard-react/custom/_docsModal.scss'
import '../../assets/scss/black-dashboard-react/custom/general.scss'


function DocsModal(props) {
     const [workItem, setWorkItem] = useState({});
     const [workNotes, setWorkNotes] = useState('');
     const [loading, setLoading] = useState(true);
     const [isError, setIsError] = useState(true);
     const [errorMessage, setErrorMessage] = useState('');

     const [activeTab, setActiveTab] = useState('1');

     const toggle = tab => {
          if (activeTab !== tab) setActiveTab(tab);
     }

     const [fileIcons] = useState({
          xlsx: "https://cdn.icon-icons.com/icons2/342/PNG/512/Excel2_35735.png",
          docx: "https://icons.iconarchive.com/icons/blackvariant/button-ui-ms-office-2016/256/Word-2-icon.png",
          pdf: "https://cdn-icons-png.flaticon.com/512/524/524553.png"
     })

     useEffect(() => {
          getFiles();
     }, [], [workItem]);


     useEffect(() => {
          setTimeout(() => {
               setErrorMessage(null);
               setIsError(false)
          }, 10000);
     }, [isError]);


     const getFiles = async () => {
          await getWorkById(props.updateItem.id)
               .then(res => {
                    setWorkItem(res.data);
                    setWorkNotes(res.data.notes);
                    setLoading(false);
               });
          setTimeout(() => {
               setErrorMessage(null);
               setIsError(false)
          }, 10000);
     }

     const deleteFile = async (fileId) => {
          const item = workItem;
          item.Documents.splice(item.Documents.findIndex(item => item.id === fileId), 1);
          setLoading(true);
          await updateWork(item, item.id)
               .then(res => getFiles());
          await deleteFileById(fileId)
               .then(res => getFiles());
     }

     const upload = () => {
          document.getElementById("selectFile").click()
     }

     const fileSelectHandler = async (files) => {
          setLoading(true);
          let uploadedFiles = [];
          for (let i = 0; i < files.length; i++) {
               const res = await uploadFileToWorkItem(files[i], props.updateItem.id);

               if (res && res.status === 200) {
                    uploadedFiles.push(res.data[0]);
               } else {
                    if (res && res.data.error) {
                         setIsError(true);
                         setErrorMessage(res.data.data.errors[0].message);
                    }
               }
          }

          if (uploadedFiles.length > 0) {
               const newDocs = [...uploadedFiles, ...workItem.Documents];
               const updatedWorkItem = workItem;
               updatedWorkItem.Documents = newDocs;
               await updateWork(updatedWorkItem, updatedWorkItem.id)
                    .then(res => { getFiles(); })
          } else {
               setLoading(false);
          }
     }

     const saveWorkNotes = async () => {
          setLoading(true);
          const newItem = workItem;
          newItem.notes = workNotes;
          await updateWork(newItem, newItem.id)
               .then(res => { getFiles(); })
     }

     return (
          <div className="file-modal-case">

               <div>
                    <Nav tabs>
                         <NavItem>
                              <NavLink
                                   style={{ cursor: 'pointer' }}
                                   className={classnames({ active: activeTab === '1' })}
                                   onClick={() => { toggle('1'); }}
                              >
                                   Files
                              </NavLink>
                         </NavItem>
                         <NavItem>
                              <NavLink
                                   style={{ cursor: 'pointer' }}
                                   className={classnames({ active: activeTab === '2' })}
                                   onClick={() => { toggle('2'); }}
                              >
                                   Notes
                              </NavLink>
                         </NavItem>
                    </Nav>
                    <TabContent activeTab={activeTab}>
                         <TabPane tabId="1">
                              <Row className="mt-3">
                                   <Col sm="12">
                                        <Row>
                                             <Col md="12">
                                                  <Card>
                                                       <CardHeader className="file-modal-header">
                                                            <CardTitle tag="h4">Documents</CardTitle>
                                                            <div>
                                                                 <Button onClick={upload} className="btn-sm" color="primary">
                                                                      <i class="fas fa-upload"></i> Upload
                                                                 </Button>
                                                                 <Button onClick={props.closeDocModal} className="btn-sm" color="primary">
                                                                      Close
                                                                 </Button>
                                                                 <input id='selectFile' hidden multiple type="file" onChange={(event) => fileSelectHandler(event.target.files)}
                                                                      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/pdf , .pdf , application/vnd.ms-excel , .doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                                                 />
                                                            </div>
                                                       </CardHeader>
                                                       <CardBody>
                                                            {
                                                                 isError && errorMessage &&
                                                                 <UncontrolledAlert color="info">
                                                                      <div> Some Files Could Not Be Uploaded</div>
                                                                      <div>Reason: " {errorMessage} "</div>
                                                                 </UncontrolledAlert>

                                                            }

                                                            {
                                                                 loading &&
                                                                 <div class="spinner">
                                                                      <div class="dot1"></div>
                                                                      <div class="dot2"></div>
                                                                 </div>
                                                            }

                                                            {
                                                                 !loading && workItem.Documents && workItem.Documents?.length > 0 &&
                                                                 <div key="upload" className="d-flex mb-2 pb-3 align-items-start file-item">
                                                                      <div className="col-3" style={{ color: "white", fontSize: "12px" }}>File Name</div>
                                                                      <div className="col-6 pl-0" style={{ color: "white", fontSize: "12px" }}>File Name</div>
                                                                      <div className="col-5">
                                                                      </div>
                                                                 </div>
                                                            }

                                                            {!loading &&
                                                                 workItem.Documents.map((doc, ind) =>
                                                                      <>
                                                                           <div key={ind} className="d-flex mb-2 pb-3 align-items-center file-item">
                                                                                <div className="col-2"><CardImg className="file-img" top src={fileIcons[doc.ext?.substring(1)]} alt="..." /></div>
                                                                                <div className="col-7" style={{ color: "white", fontSize: "12px" }}>{doc.name}</div>
                                                                                <div className="col-5">
                                                                                     <Button target={doc.ext === '.pdf' ? '_blank' : ''} href={`https://waa-app.herokuapp.com${doc.url}`} className="btn-sm btn-round btn-icon btn-simple" color="info">
                                                                                          <i class="fas fa-download"></i>
                                                                                     </Button>
                                                                                     <Button onClick={() => deleteFile(doc.id)} className="btn-sm btn-round btn-icon ml-2">
                                                                                          <i class="fas fa-trash-alt"></i>
                                                                                     </Button>
                                                                                </div>
                                                                           </div>
                                                                      </>
                                                                 )
                                                            }
                                                       </CardBody>
                                                  </Card>
                                             </Col>
                                        </Row>
                                   </Col>
                              </Row>
                         </TabPane>


                         <TabPane tabId="2">
                              <Row className="mt-3">
                                   <Col sm="12">
                                        <Card>
                                             <CardHeader>Enter Your Notes</CardHeader>
                                             <CardBody>
                                                  {
                                                       loading &&
                                                       <div class="spinner">
                                                            <div class="dot1"></div>
                                                            <div class="dot2"></div>
                                                       </div>
                                                  }

                                                  {
                                                       !loading &&
                                                       <>

                                                            <Input
                                                                 value={workNotes}
                                                                 type="textarea"
                                                                 onChange={(event => setWorkNotes(event.target.value))}
                                                                 style={{ height: "170px", padding: "10px", fontSize: "14px", maxHeight: "200px" }}
                                                            ></Input>
                                                            <div className="text-right">
                                                                 <Button disabled={workNotes === workItem.notes} onClick={saveWorkNotes} className="col-6 btn-sm mt-3 mb-3" color="primary">
                                                                      <i class="fas fa-save"></i> Save Changes
                                                                 </Button>
                                                            </div>

                                                       </>
                                                  }
                                             </CardBody>

                                        </Card>
                                   </Col>
                              </Row>
                         </TabPane>
                    </TabContent>


               </div>


          </div>
     )
}

export default DocsModal;
