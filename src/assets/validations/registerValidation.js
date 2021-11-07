import * as yup from 'yup';

const registerValidationShema = yup.object().shape({
  username: yup.string().required('User Name Is Required.'),
  email: yup.string().email('Please Enter Valid Email.').required('Email Is Required.'),
  password: yup.string().min(5, 'Min 5 Character.').required('Password Is Required.'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], "Passwords Do Not Match").required('Confirm Password Is Required.')
});

export default registerValidationShema;