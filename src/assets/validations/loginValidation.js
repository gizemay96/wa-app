import * as yup from 'yup';

const loginValidationShema = yup.object().shape({
  identifier: yup.string().email('Please Enter Valid Email.').required('Email Is Required.'),
  password: yup.string().min(5, 'Min 5 Character.').required('Password Is Required.'),
  // confirmPassword: yup.string().oneOf([yup.ref('password')], "Parolalar uyuşmuyor").required('Zorunlu Alan')
});

export default loginValidationShema;