import { React } from 'react';
import { Link } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';

import { useFormik } from 'formik';
// import logo1 from 'assets/img/waa2.png'
import loginValidationShema from "../../assets/validations/loginValidation";

import { login } from '../../services/user.service'
import { useUser } from '../../contexts/UserContext'

const Login = ({ history }) => {

  const { setActiveUser } = useUser();

  const { handleSubmit, handleChange, values, errors, touched } = useFormik({
    initialValues: {
      identifier: '',
      password: '',
    },
    onSubmit: values => {
      console.log(values)
      loginAction(values);
    },
    validationSchema: loginValidationShema,
  });

  const loginAction = async (values) => {
    const res = await login(values)
    if (res) {
      setActiveUser(res);
      setTimeout(() => {
        history.push('/')
      }, 500)
    }

  }


  return (
    <div>
      <div className="d-flex align-items-center auth px-0">
        <div className="row w-100 mx-0">
          <div className="col-lg-4 mx-auto">
            <div className="card text-left py-5 px-4 px-sm-5">
              <div className="brand-logo">
                <img src={require("../../assets/images/logo.svg")} alt="logo" />
              </div>
              <h4>Hello! let's get started</h4>
              <h6 className="font-weight-light">Sign in to continue.</h6>
              <Form className="pt-3" onSubmit={handleSubmit}>
                <Form.Group className="d-flex search-field">
                  <Form.Control
                    id="identifier"
                    name="identifier"
                    type="identifier"
                    onChange={handleChange}
                    value={values.identifier}
                    placeholder="Email" size="lg" className="h-auto" />
                </Form.Group>
                <Form.Group className="d-flex search-field">
                  <Form.Control
                      id="password"
                      name="password"
                      type="password"
                      onChange={handleChange}
                      value={values.password}
                      autoComplete="off" placeholder="Password" size="lg" className="h-auto" />
                </Form.Group>
                <div className="mt-3">
                  <Button className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn" type="submit">SIGN IN</Button>
                </div>
                <div className="my-2 d-flex justify-content-between align-items-center">
                  <div className="form-check">
                    <label className="form-check-label text-muted">
                      <input type="checkbox" className="form-check-input" />
                      <i className="input-helper"></i>
                      Keep me signed in
                    </label>
                  </div>
                  <a href="!#" onClick={event => event.preventDefault()} className="auth-link text-muted">Forgot password?</a>
                </div>
                <div className="mb-2">
                  <button type="button" className="btn btn-block btn-facebook auth-form-btn">
                    <i className="mdi mdi-facebook mr-2"></i>Connect using facebook
                  </button>
                </div>
                <div className="text-center mt-4 font-weight-light">
                  Don't have an account? <Link to="/user-pages/register" className="text-primary">Create</Link>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

}

export default Login
