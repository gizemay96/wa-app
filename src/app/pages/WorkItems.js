import { React, useState, useEffect } from "react";
// import '../assets/scss/black-dashboard-react/custom/workItems.scss'
import Moment from 'moment'
import { ProgressBar, Dropdown, ButtonGroup } from 'react-bootstrap';

// reactstrap components
import { Row, Col, Button, Modal, ModalBody, Input, InputGroup, InputGroupAddon, InputGroupText } from "reactstrap";
import { Tooltip } from 'reactstrap';

import { getWorks, deleteWork, getWorksCount } from '../../services/works.service'
import CreateWork from "../components/modals/CreateWork";
import DocsModal from "../components/modals/DocsModal";
import DeleteConfirmation from "../components/partial/DeleteConfirmation";
import { tr } from "date-fns/locale";

function WorkItems(props) {

     const [filterApplying, setfilterApplying] = useState(false);
     const [workItems, setWorkItems] = useState([]);
     const [selectedItem, setSelectedItem] = useState(null);
     const [environments] = useState(['Dev', 'Fut', 'Uat', 'Preprod', 'Prod']);
     const [searchInput, setSearchInput] = useState([]);
     const [currentPage, setCurrentPage] = useState({
          page: 1,
          total: 0
     });

     const [nameInputValue, setNameInputValue] = useState('');
     const [branchInputValue, setBranchInputValue] = useState('');
     const [ticketIdInputValue, setticketIdInputValue] = useState('');

     const [filters, setFilter] = useState({
          currentEnv: 0,
          type: '',
          name_contains: '',
          branch_contains: '',
          ticketId_contains: '',
          _start: 0,
          _limit: 10
     });


     useEffect(() => {
          console.log(filters)
          setfilterApplying(true);
          getItems();
     }, [filters]);

     // Below fields are for Tooltip Environment Dates
     const [tooltipOpen, setTooltipOpen] = useState('');


     // Below fields are for Tooltip Add/Update Modal
     const {
          buttonLabel,
          className = "modal-sm"
     } = props;
     const [modal, setModal] = useState(false);
     const toggleModal = () => setModal(!modal, modal === true ? setSelectedItem(null) : null);

     const [docsModal, setDocsModal] = useState(false);
     const toggleDocsModal = () => setDocsModal(!docsModal, docsModal === true ? setSelectedItem(null) : null);


     const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);
     const toggleDeleteConfirmModal = () => setDeleteConfirmModal(!deleteConfirmModal);

     // Edit - Get - Delete Functions
     const getItems = async (closeModal = false, getFor = '', closeFileModal = false) => {
          if (closeFileModal)
               return toggleDocsModal();

          if (closeModal)
               toggleModal();

          const worksData = await getWorks(filters)
          setWorkItems(worksData.data);
          setfilterApplying(false);


          if (worksData.data.length === 0 && getFor === 'delete' && currentPage.page > 1) {
               setCurrentPage({ ...currentPage, page: currentPage.page - 1 });
               setFilter({ ...filters, _start: filters._start - filters._limit });
          } else {
               const workCount = await getWorksCount();
               setCurrentPage({ ...currentPage, total: workCount.data })
          }


     }

     const deleteItem = async (id) => {
          setfilterApplying(true);
          await deleteWork(id)
               .then(res => { getItems(false, 'delete'); });
          confirmationModalActions();
     }

     const editItem = (item) => {
          setSelectedItem(item);
          toggleModal();
     }

     const openDocModal = (item) => {
          setSelectedItem(item);
          toggleDocsModal();
     }

     const confirmationModalActions = (item = null, onlyClose = true) => {
          if (!onlyClose)
               setSelectedItem(item);

          toggleDeleteConfirmModal();
     }

     // Filtering Functions
     const removeFilter = (type) => {

          let openedInputType = type;
          if (type === 'name_contains') {
               openedInputType = 'name';
               setNameInputValue('');
          }
          if (type === 'branch_contains') {
               openedInputType = 'branch';
               setBranchInputValue('');
          }
          if (type === 'ticketId_contains') {
               openedInputType = 'ticketId';
               setticketIdInputValue('');
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

     const changePage = (type) => {
          switch (type) {
               case 'previous':
                    setFilter({ ...filters, _start: filters._start - filters._limit });
                    break;
               case 'next':
                    setFilter({ ...filters, _start: filters._start + filters._limit });
                    break;

               default:
                    break;
          }
          setCurrentPage({ ...currentPage, page: type === 'previous' ? currentPage.page - 1 : currentPage.page + 1 });
     }

     const closeDocModal = () => {
          toggleDocsModal();
     }

     const getProgressCount = (item) => {
          switch (item.currentEnv) {
               case 1:
                    return { count: 27, color: 'danger', label: 'DEV', updatedDate: item.dev.date };

               case 2:
                    return { count: 42, color: 'warning', label: 'FUT', updatedDate: item.fut.date };
               case 3:
                    return { count: 60, color: 'info', label: 'UAT', updatedDate: item.uat.date };
               case 4:
                    return { count: 80, color: 'primary', label: 'PREPROD', updatedDate: item.preprod.date };
               case 5:
                    return { count: 100, color: 'success', label: 'PROD', updatedDate: item.prod.date };

               default:
                    break;
          }
     }

     return (
          <>
               <div className="content">
                    <div className="d-flex justify-content-between align-items-center">
                         <div>
                              <Dropdown>
                                   <Dropdown.Toggle variant="btn btn-primary btn-rounded" id="dropdownMenuButton1">
                                        Environment : {environments[filters.currentEnv - 1] || 'ALL'}
                                   </Dropdown.Toggle>
                                   <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => filters.currentEnv !== 1 ? setFilter({ ...filters, currentEnv: 1 }) : null}>DEV</Dropdown.Item>
                                        <Dropdown.Item onClick={() => filters.currentEnv !== 2 ? setFilter({ ...filters, currentEnv: 2 }) : null}>FUT</Dropdown.Item>
                                        <Dropdown.Item onClick={() => filters.currentEnv !== 3 ? setFilter({ ...filters, currentEnv: 3 }) : null}>UAT</Dropdown.Item>
                                        <Dropdown.Item onClick={() => filters.currentEnv !== 4 ? setFilter({ ...filters, currentEnv: 4 }) : null}>PREPROD</Dropdown.Item>
                                        <Dropdown.Item onClick={() => filters.currentEnv !== 5 ? setFilter({ ...filters, currentEnv: 5 }) : null}>PROD</Dropdown.Item>
                                        <Dropdown.Divider></Dropdown.Divider>
                                        <Dropdown.Item onClick={() => filters.currentEnv !== 0 ? setFilter({ ...filters, currentEnv: 0 }) : null}>ALL</Dropdown.Item>
                                   </Dropdown.Menu>
                              </Dropdown>
                         </div>
                         <div>
                              <div>
                                   <Button color="info btn-md btn-rounded" onClick={toggleModal}>{buttonLabel}Add Work</Button>
                              </div>
                         </div>
                    </div>

                    <Row>
                         <Col md="12">
                              <div className="mt-3">
                                   {/*  */}
                                   <div className="col-lg-12 grid-margin stretch-card">
                                        <div className="card">
                                             <div className="card-body">
                                                  <div className="d-flex justify-content-between">
                                                       <h4 className="card-title">Work Items</h4>
                                                       <h4>Total : {currentPage.total}  Item </h4>
                                                  </div>
                                                  <div className="table-responsive">
                                                       <table className="table table-striped">
                                                            <thead>
                                                                 <tr>
                                                                      {searchInput.every(item => item !== 'type') &&
                                                                           <th onClick={() => openInput('type')} ><b>Type</b> <i class="fas fa-search-plus ml-2"></i>
                                                                           </th>
                                                                      }
                                                                      {/* WORK TYPE SEARCH INPUT */}
                                                                      {searchInput.find(item => item === 'type') &&
                                                                           <th className="d-flex p-0" >
                                                                                <Input
                                                                                     type="select"
                                                                                     name="type"
                                                                                     id="type"
                                                                                     onChange={(event) => setFilter({ ...filters, type: event.target.value === 'All' ? '' : event.target.value })}
                                                                                >
                                                                                     <option>All</option>
                                                                                     <option>Development</option>
                                                                                     <option>Bug</option>
                                                                                </Input>
                                                                                <i onClick={() => removeFilter('type')} className="fas fa-times-circle col-md-2 p-0 close-search-icon"></i>
                                                                           </th>
                                                                      }
                                                                      {/* TICKET ID HEADER */}
                                                                      {searchInput.every(item => item !== 'ticketId') &&
                                                                           <th onClick={() => openInput('ticketId')} ><b>Ticket Id</b> <i class="fas fa-search-plus ml-2"></i>
                                                                           </th>
                                                                      }
                                                                      {/* TICKET ID SEARCH INPUT */}
                                                                      {searchInput.find(item => item === 'ticketId') &&
                                                                           <th className="align-items-center p-0" >
                                                                                <InputGroup>
                                                                                     <InputGroupAddon onClick={() => filters.ticketId_contains !== ticketIdInputValue ? setFilter({ ...filters, ticketId_contains: ticketIdInputValue }) : null} addonType="append">
                                                                                          <InputGroupText className="text-input-search-icon">
                                                                                               <i className="fas fa-search-plus" />
                                                                                          </InputGroupText>
                                                                                     </InputGroupAddon>
                                                                                     <Input
                                                                                          type="text"
                                                                                          name="workName"
                                                                                          id="workName"
                                                                                          value={ticketIdInputValue}
                                                                                          onChange={(e) => setticketIdInputValue(e.target.value)}
                                                                                          onKeyDown={(event) => event.key === 'Enter' && filters.ticketId_contains !== ticketIdInputValue ? setFilter({ ...filters, ticketId_contains: ticketIdInputValue }) : null}
                                                                                     />
                                                                                     <i onClick={() => removeFilter('ticketId_contains')} className="fas fa-times-circle col-md-1 p-0 close-search-icon"></i>
                                                                                </InputGroup>
                                                                           </th>
                                                                      }
                                                                      {/* NAME HEADER */}
                                                                      {searchInput.every(item => item !== 'name') &&
                                                                           <th onClick={() => openInput('name')} ><b>Work</b> <i class="fas fa-search-plus ml-2"></i>
                                                                           </th>
                                                                      }
                                                                      {/* NAME SEARCH INPUT */}
                                                                      {searchInput.find(item => item === 'name') &&
                                                                           <th className="align-items-center p-0">
                                                                                <InputGroup>
                                                                                     <InputGroupAddon onClick={() => filters.name_contains !== nameInputValue ? setFilter({ ...filters, name_contains: nameInputValue }) : null} addonType="append">
                                                                                          <InputGroupText className="text-input-search-icon">
                                                                                               <i className="fas fa-search-plus" />
                                                                                          </InputGroupText>
                                                                                     </InputGroupAddon>
                                                                                     <Input
                                                                                          type="text"
                                                                                          name="workName"
                                                                                          id="workName"
                                                                                          value={nameInputValue}
                                                                                          onChange={(e) => setNameInputValue(e.target.value)}
                                                                                          onKeyDown={(event) => event.key === 'Enter' && filters.name_contains !== nameInputValue ? setFilter({ ...filters, name_contains: nameInputValue }) : null}
                                                                                     />
                                                                                     <i onClick={() => removeFilter('name_contains')} className="fas fa-times-circle col-md-1 p-0 close-search-icon"></i>
                                                                                </InputGroup>
                                                                           </th>
                                                                      }
                                                                      {/* BRANCH HEADER */}
                                                                      {searchInput.every(item => item !== 'branch') &&
                                                                           <th onClick={() => openInput('branch')} ><b>Branch</b> <i class="fas fa-search-plus ml-2"></i>
                                                                           </th>
                                                                      }
                                                                      {/* BRANCH SEARCH INPUT */}
                                                                      {searchInput.find(item => item === 'branch') &&
                                                                           <th className="align-items-center p-0" >
                                                                                <InputGroup>
                                                                                     <InputGroupAddon onClick={() => filters.branch_contains !== branchInputValue ? setFilter({ ...filters, branch_contains: branchInputValue }) : null} addonType="append">
                                                                                          <InputGroupText className="text-input-search-icon">
                                                                                               <i className="fas fa-search-plus" />
                                                                                          </InputGroupText>
                                                                                     </InputGroupAddon>
                                                                                     <Input
                                                                                          type="text"
                                                                                          name="branchName"
                                                                                          id="branchName"
                                                                                          value={branchInputValue}
                                                                                          onChange={(e) => setBranchInputValue(e.target.value)}
                                                                                          onKeyDown={(event) => event.key === 'Enter' && filters.branch_contains !== branchInputValue ? setFilter({ ...filters, branch_contains: branchInputValue }) : null}
                                                                                     />
                                                                                     <i onClick={() => removeFilter('branch_contains')} className="fas fa-times-circle col-md-1 p-0 close-search-icon"></i>
                                                                                </InputGroup>
                                                                           </th>
                                                                      }
                                                                      <th> Environment </th>
                                                                 </tr>
                                                            </thead>
                                                            <tbody>
                                                                 {
                                                                      filterApplying &&
                                                                      <tr>
                                                                           <td colspan="5">
                                                                                <div className="d-flex w-100 justify-content-center">
                                                                                     <div class="spinner">
                                                                                     </div>
                                                                                </div>

                                                                           </td>

                                                                      </tr>
                                                                 }
                                                                 {!filterApplying &&
                                                                      workItems.map((item, ind) =>
                                                                           <tr style={{ color: '#9da2b5' }}>
                                                                                <td>
                                                                                     <span className="menu-icon">
                                                                                          <i className={item.type === 'Bug' ? "mdi mdi-bug bug-icon" : "mdi mdi-book-open-page-variant development-icon"}></i>
                                                                                     </span>
                                                                                     <span>{item.type}</span>
                                                                                </td>
                                                                                <td>{item.ticketId}</td>
                                                                                <td style={{ maxWidth: '420px' }}>{item.name}</td>
                                                                                <td>{item.branch}</td>
                                                                                <td style={{ minWidth: '170px' }}>
                                                                                     <ProgressBar variant={getProgressCount(item)?.color}
                                                                                          now={getProgressCount(item)?.count}
                                                                                          label={getProgressCount(item)?.label}
                                                                                          id={"TooltipExampleDev" + ind}
                                                                                     />
                                                                                     <Tooltip placement="bottom" isOpen={tooltipOpen === 'TooltipExampleDev' + ind} target={"TooltipExampleDev" + ind} toggle={() => setTooltipOpen(tooltipOpen === 'TooltipExampleDev' + ind ? '' : 'TooltipExampleDev' + ind)}>
                                                                                          {getProgressCount(item)?.updatedDate ? Moment(getProgressCount(item)?.updatedDate).format('DD/MM/YYYY HH:mm') : '-'}
                                                                                     </Tooltip>
                                                                                </td>
                                                                                <td>
                                                                                     <button onClick={() => editItem(item)} type="button" className="btn btn-inverse-dark btn-rounded btn-icon ml-2">
                                                                                          <i style={{ color: 'white' }} className="mdi mdi-tooltip-edit ml-1"></i>
                                                                                     </button>
                                                                                     <button onClick={() => openDocModal(item)} type="button" className="btn btn-inverse-dark btn-rounded btn-icon ml-2">
                                                                                          <i style={{ color: 'white' }} className="mdi mdi-folder ml-1"></i>
                                                                                     </button>
                                                                                     <button onClick={() => confirmationModalActions(item, false)} type="button" className="btn btn-inverse-dark btn-rounded btn-icon ml-2">
                                                                                          <i style={{ color: 'white' }} className="mdi mdi-delete ml-1"></i>
                                                                                     </button>
                                                                                </td>
                                                                           </tr>

                                                                      )

                                                                 }
                                                            </tbody>
                                                       </table>
                                                  </div>
                                             </div>
                                        </div>
                                   </div>
                                   <div className="d-flex justify-content-center mt-3">
                                        <button disabled={currentPage.page === 1} onClick={() => changePage('previous')} type="button" className="btn btn-primary btn-rounded btn-icon">
                                             <i className="mdi mdi-arrow-left-bold ml-1"></i>
                                        </button>
                                        <button style={{ pointerEvents: 'none' }} type="button" className="btn btn-primary btn-rounded btn-icon ml-4 mr-4">
                                             {currentPage.page}
                                        </button>
                                        <button disabled={currentPage.page + 1 * filters._limit > currentPage.total} onClick={() => changePage('next')} type="button" className="btn btn-primary btn-rounded btn-icon">
                                             <i className="mdi mdi-arrow-right-bold ml-1"></i>
                                        </button>
                                   </div>
                              </div>
                         </Col>
                    </Row>
               </div>



               {/* MODALS */}
               <Modal style={{ top: "100px" }} isOpen={modal} toggle={toggleModal} className={className}>
                    <ModalBody>
                         <CreateWork updateItem={selectedItem} closeModal={getItems} ></CreateWork>
                    </ModalBody>
               </Modal>

               <Modal isOpen={docsModal} toggle={toggleDocsModal} className={className}>
                    <ModalBody>
                         <DocsModal updateItem={selectedItem} closeDocModal={closeDocModal}></DocsModal>
                    </ModalBody>
               </Modal>

               <Modal isOpen={deleteConfirmModal} toggle={toggleDeleteConfirmModal} className={className}>
                    <ModalBody>
                         <DeleteConfirmation message="Are You Sure You Want Delete ?" actionYes={() => deleteItem(selectedItem.id)} actionNo={confirmationModalActions}></DeleteConfirmation>
                    </ModalBody>
               </Modal>

          </>
     );
}

export default WorkItems;
