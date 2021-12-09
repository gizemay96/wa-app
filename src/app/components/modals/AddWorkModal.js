import { React, useState, useEffect } from "react";
// import '../../assets/scss/black-dashboard-react/custom/workItems.scss'

// reactstrap components
import {
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Table,
    Row,
    Col,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Label,
    FormGroup
} from "reactstrap";

import { getWorks, getWorksCount } from '../../../services/works.service'

function AddWorkModal(props) {

    const [filterApplying, setfilterApplying] = useState(false);
    const [workItems, setWorkItems] = useState([]);
    const [environments] = useState(['Dev', 'Fut', 'Uat', 'Preprod', 'Prod']);
    const [searchInput, setSearchInput] = useState([]);
    const [currentPage, setCurrentPage] = useState({
        page: 1,
        total: 0
    });


    // Search Input Values
    const [nameInputValue, setNameInputValue] = useState('');
    const [branchInputValue, setBranchInputValue] = useState('');
    const [ticketIdInputValue, setticketIdInputValue] = useState('');

    const [selectedItems, setSelectedItems] = useState([]);

    const [filters, setFilter] = useState({
        currentEnv: 0,
        type: '',
        name_contains: '',
        branch_contains: '',
        ticketId_contains: '',
        _start: 0,
        _limit: 6
    });


    useEffect(() => {
        setfilterApplying(true);
        getItems();
    }, [filters]);

    // Edit - Get - Delete Functions
    const getItems = async () => {
        const worksData = await getWorks(filters)
        let selectedItemsData = worksData.data.reduce((arr, item) => {
            item.disabled = props.initData.some(initItem => initItem.id === item.id) ? true : false;
            if (item.disabled && !selectedItems.some(added => added.id === item.id)) arr.push(item);
            return arr;
        }, []);
        setSelectedItems([...selectedItemsData, ...selectedItems]);
        setWorkItems(worksData.data);
        setfilterApplying(false);

        const workCount = await getWorksCount();
        setCurrentPage({ ...currentPage, total: workCount.data });
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

    const checkActions = (item) => {
        let items = selectedItems;

        const ind = items.findIndex(addedItem => addedItem.id === item.id);
        if (ind > -1) {
            items[ind].checked = false;
            items.splice(ind, 1);
        } else {
            items.push(item);
        }

        setSelectedItems([...items])
    }

    return (
        <>
            <div className="content">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <UncontrolledDropdown>
                            <DropdownToggle caret data-toggle="dropdown">
                                Environment : {environments[filters.currentEnv - 1] || 'ALL'}
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem onClick={() => filters.currentEnv !== 0 ? setFilter({ ...filters, currentEnv: 0 }) : null}>ALL</DropdownItem>
                                <DropdownItem onClick={() => filters.currentEnv !== 1 ? setFilter({ ...filters, currentEnv: 1 }) : null}>DEV</DropdownItem>
                                <DropdownItem onClick={() => filters.currentEnv !== 2 ? setFilter({ ...filters, currentEnv: 2 }) : null}>FUT</DropdownItem>
                                <DropdownItem onClick={() => filters.currentEnv !== 3 ? setFilter({ ...filters, currentEnv: 3 }) : null}>UAT</DropdownItem>
                                <DropdownItem onClick={() => filters.currentEnv !== 4 ? setFilter({ ...filters, currentEnv: 4 }) : null}>PREPROD</DropdownItem>
                                <DropdownItem onClick={() => filters.currentEnv !== 5 ? setFilter({ ...filters, currentEnv: 5 }) : null}>PROD</DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>

                    </div>
                </div>

                <Row>
                    <Col md="12">
                        <Card className="card-plain">
                            <CardHeader>
                                <CardTitle tag="h4">My Works</CardTitle>
                            </CardHeader>
                            <CardBody className="table-case">
                                <Table className="tablesorter" hover>
                                    <thead className="text-primary">
                                        {/* WORK TYPE HEADER */}
                                        <tr className="table-head-tr">
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
                                                        <InputGroupAddon onClick={() => filters.branch_contains !== nameInputValue ? setFilter({ ...filters, branch_contains: branchInputValue }) : null} addonType="append">
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
                                                            onKeyDown={(event) => event.key === 'Enter' && filters.branch_contains !== nameInputValue ? setFilter({ ...filters, branch_contains: branchInputValue }) : null}
                                                        />
                                                        <i onClick={() => removeFilter('branch_contains')} className="fas fa-times-circle col-md-1 p-0 close-search-icon"></i>
                                                    </InputGroup>
                                                </th>
                                            }
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {
                                            filterApplying &&
                                            <tr>
                                                <td colspan="9">
                                                    <div class="spinner">
                                                        <div class="dot1"></div>
                                                        <div class="dot2"></div>
                                                    </div>
                                                </td>
                                            </tr>
                                        }
                                        {!filterApplying &&
                                            workItems.map((item, ind) =>
                                                <tr key={ind} className="table-body-tr">
                                                    <td><i className={item.type === 'Bug' ? "fas fa-bug" : "fas fa-file-code"}></i> <span>{item.type}</span> </td>
                                                    <td>{item.ticketId}</td>
                                                    <td style={{ maxWidth: "220px" }}>{item.name}</td>
                                                    <td>{item.branch}</td>
                                                    <td className="text-right">
                                                        <FormGroup check>
                                                            <Label check>
                                                                <Input onChange={() => checkActions(item)}
                                                                    checked={selectedItems.some(selected => selected.id === item.id)}
                                                                    disabled={selectedItems.some(selected => selected.id === item.id && selected.disabled)}
                                                                    type="checkbox" />{' '}
                                                                <span className="form-check-sign">
                                                                    <span className="check"></span>
                                                                </span>
                                                            </Label>
                                                        </FormGroup>
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


                <div className="d-flex justify-content-between align-items-enter p-2">
                    <div className="d-flex align-items-center">
                        <Button onClick={props.closeModal} className="btn btn-rounded mr-3" color="danger">
                            Close <i class="fas fa-times-circle"></i>
                        </Button>
                    </div>
                    <div className="pagination d-flex align-items-center">
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
                    <div className="d-flex align-items-center">
                        <Button onClick={() => props.updateReleaseItems(selectedItems)} className="btn btn-rounded" color="primary">
                            Save <i class="fas fa-check-circle"></i>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AddWorkModal;
