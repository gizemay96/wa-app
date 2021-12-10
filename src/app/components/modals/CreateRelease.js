import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import DatePicker from "react-datepicker";
import { Portal } from "react-overlays";

import createReleaseValidationShema from "../../../assets/validations/createReleaseValidation";
// import '../../assets/scss/black-dashboard-react/custom/createWork.scss'
// import styles from '../../assets/scss/black-dashboard-react/custom/test.module.scss';


import {
  FormGroup,
  Label,
  Input,
  Button,
  Card,
  CardBody
} from "reactstrap";
// import CustomDatePicker from 'components/MinorComponents/CustomDatePicker';


function CreateRelease(props) {
  const [selectedDate, setDateFromChild] = React.useState(new Date());
  const [itemForUpdate] = useState(props.updateItem);
  const [startDate, setStartDate] = useState(new Date());

  useEffect(() => {
    formik.setValues({ releaseDate: selectedDate })
  }, [selectedDate])

  const formik = useFormik({
    initialValues: {
      releaseDate: selectedDate,
      Project: itemForUpdate ? itemForUpdate.ticketId : '',
    },
    onSubmit: values => {
      if (itemForUpdate) {
      } else {
        props.closeAndSaveRelease(values)
      }
    },
    validationSchema: createReleaseValidationShema,
  });

//   const CalendarContainer = ({ children }) => {
//     const el = document.getElementById("calendar-portal");

//     return <Portal container={el}>{children}</Portal>;
// };

  return (

    <div>
      <div className="content">
        <h2 className="text-center p-0 m-0">
          Create Release
        </h2>
        <Card className="card-plain" style={{ padding: "30px 30px 0 30px" }}>
          <CardBody className="create-release-body">
               {/* <CustomDatePicker label="Release Date" setDateToParent={(date) => setDateFromChild(date)}></CustomDatePicker> */}
            <DatePicker className="custom-datepicker w-100"
              selected={startDate}
              onChange={(date) => { setDateFromChild(date); setStartDate(date) }}
              // popperContainer={CalendarContainer}
              dateFormat="dd/MM/yyyy"
            />
            <form onSubmit={formik.handleSubmit}>
              <FormGroup className="mt-3">
                <Label for="Project">Project Name</Label>
                <Input
                  id="Project"
                  name="Project"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.Project}
                  style={{ height: "50px" }}
                />
              </FormGroup>
              <div className="d-flex justify-content-between">
                <Button className="btn-rounded" onClick={() => props.closeCreateReleasModal(true)} color="danger" type="button">
                  Close
                </Button>
                <Button className="btn-rounded" color="primary" type="submit">
                  Create Release
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>

      </div>
    </div>
  )
}

export default CreateRelease;
