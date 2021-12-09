import { React, useEffect, useState } from 'react'
import Moment from 'moment'
import { getReleases, deleteRelease, createRelease } from '../../services/release.service';

// import "../assets/scss/black-dashboard-react/custom/general.scss"


// reactstrap components
import {
     Card,
     CardHeader,
     CardBody,
     CardTitle,
     Table,
     Row,
     Col,
     Button,
     Modal,
     ModalBody,
     InputGroup,
     InputGroupAddon,
     InputGroupText,
     Input
} from "reactstrap";

import ReleaseItemsModal from '../components/modals/ReleaseItemsModal';
import CreateRelease from '../components/modals/CreateRelease';
// import CustomDatePicker from '../components/MinorComponents/CustomDatePicker';
import DeleteConfirmation from '../components/partial/DeleteConfirmation';

function Releases(props) {
     const [releaseData, setReleaseData] = useState([])
     const [selectedRelease, setSelectedRelease] = useState({})
     const [searchInput, setSearchInput] = useState([]);
     const [loading, setLoading] = useState(true)

     const [filters, setFilter] = useState({
          releaseDate: null,
          Project_contains: '',
     });

     const [projectInputValue, setProjectInputValue] = useState('');

     useEffect(() => {
          getItems();
     }, [filters]);


     const {
          buttonLabel,
          className = 'modal-sm',
          classNameCreateRelease = 'modal-sm'
     } = props;
     const [releaseItemsModal, setReleaseItemsModal] = useState(false);
     const toggleReleaseItemsModal = () => setReleaseItemsModal(!releaseItemsModal);

     const [createReleaseModal, setCreateReleaseModal] = useState(false);
     const toggleCreateReleaseModal = () => setCreateReleaseModal(!createReleaseModal);

     const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);
     const toggleDeleteConfirmModal = () => setDeleteConfirmModal(!deleteConfirmModal);



     const getItems = async () => {
          const data = await getReleases(filters);
          setReleaseData([...data.data]);
          setLoading(false);
     }

     const saveRelease = async (saveData) => {
          setLoading(true);
          const response = await createRelease(saveData);
          if (response) {
               toggleCreateReleaseModal();
               getItems();
          }
     }

     const removeRelease = async (item) => {
          setLoading(true);
          const response = await deleteRelease(item.id);
          if (response) {
               confirmationModalActions();
               getItems();
          }
     }

     const openReleaseItemsModal = (item) => {
          setSelectedRelease({ ...item });
          toggleReleaseItemsModal();
     }

     const closeReleaseItemsModal = () => {
          toggleReleaseItemsModal();
     }

     const closeCreateReleasModal = () => {
          toggleCreateReleaseModal();
     }

     const confirmationModalActions = (item = null, onlyClose = true) => {
          if (!onlyClose)
               setSelectedRelease({ ...item });

          toggleDeleteConfirmModal();
     }


     // Filtering Functions
     const removeFilter = (type) => {

          let openedInputType = type;
          if (type === 'Project_contains') {
               openedInputType = 'project';
               setProjectInputValue('');
          }

          const inputs = searchInput;
          inputs.splice(inputs.findIndex(item => item === openedInputType), 1)
          setSearchInput([...inputs]);

          if (filters[type]) {
               setFilter({ ...filters, [type]: '' });
          }
     }

     const openInput = (value) => {
          const inputs = searchInput;
          inputs.push(value);
          setSearchInput([...inputs]);
     }

     const setSelectedReleaseDate = (date) => {
          if (date !== undefined) {
               const formattedDate = new Date(date).toISOString();
               setFilter({ ...filters, releaseDate: formattedDate });
          }
     }

     const getRandomColorForAttributeValue = () => {

          const colors = ["info", "warning", "success", "primary", "danger"];

          const random = Math.floor(Math.random() * colors.length);

          return colors[random];

     }



     return (
          <div className="content">

               <div className="d-flex justify-content-end">
                    <Button color="info btn-md" onClick={toggleCreateReleaseModal}>{buttonLabel}Create Release</Button>
               </div>


               <Row>
                    <Col md="12">
                         <Card className="card-plain">
                              <CardHeader>
                                   <CardTitle tag="h1">Releases</CardTitle>
                              </CardHeader>
                              <CardBody className="table-case">
                                   <Table className="tablesorter">
                                        <thead className="text-primary">
                                             <tr className="table-head-tr">
                                                  {
                                                       searchInput.every(item => item !== 'releaseDate') &&
                                                       <th style={{ minWidth: "200px" }} onClick={() => openInput('releaseDate')} ><b>Release Date</b> <i class="fas fa-search-plus ml-2"></i>
                                                       </th>
                                                  }

                                                  {searchInput.find(item => item === 'releaseDate') &&
                                                       <th className="p-0 row" >
                                                            <span className="col-6">
                                                                 {/* <CustomDatePicker
                                                                      label={'Select Date'}
                                                                      inputFontSize="14px"
                                                                      inputPadding="9px 10px"
                                                                      labelFontSize="15px"
                                                                      setDateToParent={(date) => setSelectedReleaseDate(date)}></CustomDatePicker> */}
                                                            </span>
                                                            <span className="col-6">
                                                                 <i onClick={() => removeFilter('releaseDate')} className="fas fa-times-circle col-md-1 p-0 close-search-icon"></i>
                                                            </span>
                                                       </th>
                                                  }

                                                  {
                                                       searchInput.every(item => item !== 'project') &&
                                                       <th style={{ minWidth: "200px" }} onClick={() => openInput('project')} ><b>Project</b> <i class="fas fa-search-plus ml-2"></i>
                                                       </th>
                                                  }
                                                  {/* Project INPUT */}
                                                  {searchInput.find(item => item === 'project') &&
                                                       <th className="align-items-center p-0" >
                                                            <InputGroup>
                                                                 <InputGroupAddon onClick={() => filters.Project_contains !== projectInputValue ?
                                                                      setFilter({ ...filters, Project_contains: projectInputValue }) : null} addonType="prepend">
                                                                      <InputGroupText className="text-input-search-icon">
                                                                           <i className="fas fa-search-plus" />
                                                                      </InputGroupText>
                                                                 </InputGroupAddon>
                                                                 <Input
                                                                      type="text"
                                                                      name="project"
                                                                      id="project"
                                                                      value={projectInputValue}
                                                                      onChange={(e) => setProjectInputValue(e.target.value)}
                                                                      onKeyDown={(event) => event.key === 'Enter' && filters.Project_contains !== projectInputValue ?
                                                                           setFilter({ ...filters, Project_contains: projectInputValue }) : null}
                                                                 />
                                                                 <i onClick={() => removeFilter('Project_contains')} className="fas fa-times-circle col-md-1 p-0 close-search-icon"></i>
                                                            </InputGroup>
                                                       </th>
                                                  }
                                                  <th style={{ minWidth: "200px" }}>Scope</th>
                                                  <th style={{ minWidth: "50px" }}></th>
                                             </tr>
                                        </thead>
                                        <tbody>
                                             {loading &&
                                                  <tr>
                                                       <td colspan="9">
                                                            <div class="spinner">
                                                                 <div class="dot1"></div>
                                                                 <div class="dot2"></div>
                                                            </div>
                                                       </td>
                                                  </tr>
                                             }


                                             {!loading &&
                                                  releaseData.map((item, ind) =>
                                                       <tr key={ind} className="table-body-tr">
                                                            <td>{Moment(item.releaseDate).format('DD/MM/YYYY')}</td>
                                                            <td>{item.Project}</td>
                                                            <td><Button onClick={() => openReleaseItemsModal(item)}
                                                                 className="btn-simple btn-rounded btn-sm"
                                                                 color={`${getRandomColorForAttributeValue()}`}
                                                            >Show</Button></td>
                                                            <td className="text-center">
                                                                 <button onClick={() => confirmationModalActions(item, false)} type="button" className="btn btn-inverse-dark btn-rounded btn-icon ml-2">
                                                                      <i style={{ color: 'white' }} className="mdi mdi-delete ml-1"></i>
                                                                 </button>
                                                            </td>
                                                       </tr>

                                                  )

                                             }

                                        </tbody>
                                   </Table>
                              </CardBody>
                         </Card>
                    </Col>
               </Row>




               <Modal isOpen={releaseItemsModal} toggle={toggleReleaseItemsModal} className={className}>
                    <ModalBody>
                         <ReleaseItemsModal

                              selectedRelease={selectedRelease}
                              closeReleaseItemsModal={closeReleaseItemsModal}>
                         </ReleaseItemsModal>
                    </ModalBody>
               </Modal>



               <Modal isOpen={createReleaseModal} toggle={toggleCreateReleaseModal} className={classNameCreateRelease}>
                    <ModalBody>
                         <CreateRelease
                              selectedRelease={selectedRelease}
                              closeCreateReleasModal={closeCreateReleasModal}
                              closeAndSaveRelease={(saveData) => saveRelease(saveData)}
                         >
                         </CreateRelease>
                    </ModalBody>
               </Modal>

               <Modal isOpen={deleteConfirmModal} toggle={toggleDeleteConfirmModal} className={className}>
                    <ModalBody>
                         <DeleteConfirmation message="Are You Sure You Want Delete ?" actionYes={() => removeRelease(selectedRelease)} actionNo={confirmationModalActions}></DeleteConfirmation>
                    </ModalBody>
               </Modal>



          </div>
     )
}

export default Releases
