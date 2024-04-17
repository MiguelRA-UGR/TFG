import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'
import { signup, login } from '../actions/auth'
import { useDispatch } from 'react-redux';

const initialState = {
  userName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const SignUp = () => {
  const [signUp, setSignUp] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const dispatch = useDispatch();
  const history = useNavigate();

  const handlerSignUp = (e) => {
    e.preventDefault();

    if(signUp){
      if (formData.password === formData.confirmPassword) {
        console.log(formData);
      } else {
        setPasswordsMatch(false);
      }

      dispatch(signup(formData, history));

    }else{
      dispatch(login(formData, history));
    }

    
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "confirmPassword" && formData.password === value) {
      setPasswordsMatch(true);
    }
  };

  const toggleSignUp = (e) => {
    e.preventDefault();
    setFormData(initialState);
    setSignUp(!signUp);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="col-md-6 offset-md-3">
      <div className="card card-body">
        <form onSubmit={handlerSignUp}>
          <h3
            className="text-center mb-4"
            style={{ fontFamily: "Cambria, serif" }}
          >
            {signUp ? "Registro" : "Inicio de sesión"}
          </h3>
          <div className="form-group mb-3">
            {signUp && (
              <>
                <div className="form-group mb-3">
                  <label htmlFor="exampleInputName">Nombre de Usuario</label>
                  <input
                    type="text"
                    name="userName"
                    className="form-control"
                    id="exampleInputName"
                    placeholder="Introducir nombre de usuario"
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </>
            )}

            <label htmlFor="exampleInputEmail1">Correo electrónico</label>
            <input
              type="email"
              name="email"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Introducir correo"
              onChange={handleFormChange}
              required
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="exampleInputPassword1">Contraseña</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-control"
                id="password1"
                placeholder="Introducir contraseña"
                onChange={handleFormChange}
                required
              />
              <button
                className="btn btn-link"
                style={{ color: "#000000" }}
                type="button"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-eye-slash-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z" />
                    <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-eye-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {signUp && (
            <>
              <div className="form-group mb-3">
                <label htmlFor="exampleInputPassword2">
                  Confirmar Contraseña
                </label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    className="form-control"
                    id="password2"
                    placeholder="Introducir contraseña"
                    onChange={handleFormChange}
                    required
                  />

                  <button
                    className="btn btn-link"
                    style={{ color: "#000000" }}
                    type="button"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-eye-slash-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z" />
                        <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-eye-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                        <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                      </svg>
                    )}
                  </button>
                </div>
                {!passwordsMatch && (
                <div style={{ color: "red", display: "inline-block" }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    fill="currentColor"
                    className="bi bi-exclamation-circle"
                    viewBox="0 0 16 16"
                    style={{ marginRight: "5px" }}
                  >
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                    <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
                  </svg>
                  <p style={{ color: "red", display: "inline-block" }}>
                    Las contraseñas no coinciden.
                  </p>
                </div>
              )}
              </div>
            </>
          )}

          <div className="form-check"></div>
          <button
            type="submit"
            className="btn btn-warning form-control"
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              backgroundColor: "#f5973d",
              color: "#ffffff",
            }}
          >
            {signUp ? "Completar registro" : "Iniciar sesión"}
          </button>

          <p
            className="text-center mt-3"
            style={{ fontFamily: "Cambria, serif" }}
          >
            {signUp ? "¿Ya tienes cuenta?" : "¿No tienes cuenta aún?"}{" "}
            <a
              href=""
              style={{ color: "#f5973d", fontWeight: "bold" }}
              onClick={toggleSignUp}
            >
              Click aquí
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
