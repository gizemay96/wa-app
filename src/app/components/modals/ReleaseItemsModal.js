import { React, useEffect, useState } from 'react'
import Moment from 'moment'
import { getReleaseById, updateRelease } from '../../../services/release.service';


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
    Modal, ModalBody, CardFooter
} from "reactstrap";
import AddWorkModal from './AddWorkModal';
import DeleteConfirmation from '../../components/partial/DeleteConfirmation';

function ReleaseItemsModal({ selectedRelease, closeReleaseItemsModal }, props) {
    const [releaseItemsData, setReleaseItemsData] = useState({});
    const [loadingData, setLoadingData] = useState(true);
    const [removing, setremoving] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedItemForDelete, setSelectedItemForDelete] = useState({});


    const {
        className = 'modal-l'
    } = props;
    const [workItemsModal, setworkItemsModal] = useState(false);
    const toggleWorkItemsModal = () => setworkItemsModal(!workItemsModal);

    const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);
    const toggleDeleteConfirmModal = () => setDeleteConfirmModal(!deleteConfirmModal);


    useEffect(() => {
        setLoadingData(true);
        getItems();
    }, [])

    useEffect(() => {
    }, [removing])

    useEffect(() => {
        setLoadingData(true);
        const selectedItemIds = selectedItems?.map(item => item.id) || [];
        const alreadyAddedItemIds = releaseItemsData.works?.map(item => item.id) || [];
        let sameItems = selectedItemIds.every(element => {
            return alreadyAddedItemIds.includes(element);
        });

        if (!sameItems && !removing) {
            updateReleaseItems(selectedItems);
            toggleWorkItemsModal();
        } else if (removing) {
            updateReleaseItems();
        }
    }, [selectedItems]);

    const getItems = async () => {
        const response = await getReleaseById(selectedRelease.id)
        setReleaseItemsData({ ...response.data });
        setLoadingData(false);
    }

    const updateReleaseItems = async () => {
        const updatedRelease = releaseItemsData;
        updatedRelease.works = selectedItems;
        const response = await updateRelease(updatedRelease);
        if (response) {
            setremoving(false);
            getItems();
        }
    }

    const removeItem = (item) => {
        setLoadingData(true);
        setremoving(true);
        console.log(releaseItemsData.works, item)
        let items = releaseItemsData.works;

        const ind = items.findIndex(addedItem => addedItem.id === item.id);
        console.log(ind)
        if (ind > -1) {
            items[ind].checked = false;
            items.splice(ind, 1);
            setSelectedItems([...items]);
        }
        toggleDeleteConfirmModal();
    }

    const confirmationModalActions = (item = null, onlyClose = true) => {
        if (!onlyClose)
            setSelectedItemForDelete({ ...item });

        toggleDeleteConfirmModal();
    }



    return (
        <div>
            <Row hidden={workItemsModal}>
                <Col md="12">
                    <Card className="card-plain">
                        <CardHeader className="d-flex justify-content-between">
                            <div>
                                <CardTitle tag="h4">( {Moment(selectedRelease.releaseDate).format('DD-MM-YYYY')} ) Release Scope</CardTitle>
                                <p className="category">You can add or delete item</p>
                            </div>
                        </CardHeader>
                        <CardBody className="table-case release-items-modal-body">
                            <div className="table-responsive">
                                <table className="table table-striped">
                                    <thead className="text-primary">
                                        <tr className="table-head-tr">
                                            <th>Type</th>
                                            <th>Ticket Id</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {
                                            loadingData &&
                                            <tr>
                                                <td colspan="2">
                                                    <div className="d-flex w-100 justify-content-center">
                                                        <div class="spinner">
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        }

                                        {!loadingData && releaseItemsData.works.length > 0 &&
                                            releaseItemsData.works.map((item, index) =>
                                                <tr key={index} className="table-body-tr">
                                                    <td>
                                                        <span className="menu-icon">
                                                            <i className={item.type === 'Bug' ? "mdi mdi-bug bug-icon" : "mdi mdi-book-open-page-variant development-icon"}></i>
                                                        </span>
                                                        <span>{item.type}</span> </td>
                                                    <td>{item.ticketId}</td>
                                                    <td className="text-right">
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
                        </CardBody>
                        <CardFooter>
                            <div className="d-flex justify-content-between">
                                <Button onClick={closeReleaseItemsModal} className="btn btn-rounded  " color="danger">
                                    Close <i class="fas fa-times-circle"></i>
                                </Button>
                                <Button onClick={toggleWorkItemsModal} className="btn btn-rounded    " color="primary">
                                    Add <i class="fas fa-plus-circle"></i>
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                </Col>
            </Row>


            <Modal isOpen={workItemsModal} toggle={toggleWorkItemsModal} className={className}>
                <ModalBody>
                    <AddWorkModal closeModal={toggleWorkItemsModal} initData={releaseItemsData.works} updateReleaseItems={setSelectedItems} ></AddWorkModal>
                </ModalBody>
            </Modal>

            <Modal isOpen={deleteConfirmModal} toggle={toggleDeleteConfirmModal} className={className}>
                <ModalBody>
                    <DeleteConfirmation message="Are You Sure You Want Delete ?" actionYes={() => removeItem(selectedItemForDelete)} actionNo={confirmationModalActions}></DeleteConfirmation>
                </ModalBody>
            </Modal>
        </div>
    )
}

export default ReleaseItemsModal
