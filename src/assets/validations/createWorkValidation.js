import * as yup from 'yup';

const createWorkValidationShema = yup.object().shape({
     type: yup.string().required(''),
     ticketId: yup.string().required(''),
     name: yup.string().required(''),
     branch: yup.string().required(''),
});

export default createWorkValidationShema;