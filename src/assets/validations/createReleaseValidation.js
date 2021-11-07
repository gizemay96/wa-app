import * as yup from 'yup';

const createReleaseValidationShema = yup.object().shape({
    releaseDate: yup.date().required('Zorunlu Alan'),
    Project: yup.string().required('Zorunlu Alan'),
});

export default createReleaseValidationShema;