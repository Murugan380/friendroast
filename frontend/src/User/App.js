import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Signin() {
  const navi = useNavigate();
  const [inp, setInp] = useState({
    name: "",
    password: "",
    conpass: ""
  });
  const [load, setLoad] = useState(true);
  const [mis, setMis] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) navi('/Chat');
  }, []);

  const data = (e) => {
    setMis("");
    setInp({ ...inp, [e.target.name]: e.target.value });
  }

  const sub = () => {
    if (inp.name.length < 4 || inp.password.length < 8 || inp.conpass !== inp.password) {
      setMis(inp.name.length < 4 ? "Name should have at least four letters" :
        inp.password.length < 8 ? "Password must have 8 characters" :
          "Confirm password must match the password");
    } else {
      setLoad(false);
      axios.post(`${process.env.REACT_APP_API_URL}/sign`, inp)
        .then(res => {
          setLoad(true);
          if (res.data.message.toLowerCase().includes("success")) {
            navi('/');
          } else {
            setMis(res.data.message);
          }
        })
        .catch(err => {
          console.log(err.response?.data);
          setLoad(true);
        });
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: '350px' }}>
        <h3 className="text-center mb-4">Sign Up</h3>

        <div className="mb-3">
          <input
            type="text"
            onChange={data}
            name="name"
            placeholder="Enter your name"
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            onChange={data}
            name="password"
            placeholder="Create Password"
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            onChange={data}
            name="conpass"
            placeholder="Confirm Password"
            className="form-control"
          />
        </div>

        {mis && <div className="text-danger text-center mb-3">{mis}</div>}

        <button
          className="btn btn-primary w-100 d-flex justify-content-center align-items-center"
          onClick={sub}
          disabled={!load}
        >
          {load ? "Sign in" :
            <div className="spinner-border spinner-border-sm text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          }
        </button>

        <h6 className="mt-3 text-center">
          Already have an account? <a href="/">Login</a>
        </h6>
      </div>
    </div>
  );
}

export default Signin;
