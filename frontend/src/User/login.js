import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'


function Login() {
    const [inp, setInp] = useState({});
    const [mis, setMis] = useState("");
    const [load, setLoad] = useState(true);
    const navi = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (token) navi('/Chat')
    }, [])

    const data = (e) => {
        setMis("")
        setInp({ ...inp, [e.target.name]: e.target.value })
    }

    function sub() {
        if (inp.name?.length < 4 || inp.password?.length < 8) {
            setMis(inp.name?.length < 4 ? "Invalid Username" : "Invalid Password")
        } else {
            setLoad(false);
            axios.post("http://localhost:3001/log", inp)
                .then(res => {
                    setLoad(true);
                    if (res.data.message.toLowerCase().includes("success")) {
                        localStorage.setItem("token", res.data.token)
                        navi('/chat')
                    }
                })
                .catch(err => {
                    setLoad(true)
                    setMis(err.response?.data?.message || "Something went wrong");
                })
        }
    }

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow" style={{ width: '350px' }}>
                <h3 className="text-center mb-3">Login</h3>
                <div className="mb-3">
                    <input
                        type="text"
                        onChange={data}
                        name="name"
                        placeholder="Username"
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="password"
                        onChange={data}
                        name="password"
                        placeholder="Password"
                        className="form-control"
                    />
                </div>
                {mis && <div className="text-danger text-center mb-3">{mis}</div>}
                <button
                    className="btn btn-primary w-100 d-flex justify-content-center align-items-center"
                    onClick={sub}
                    disabled={!load}
                >
                    {load ? "Login" :
                        <div className="spinner-border spinner-border-sm text-light" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    }
                </button>
                <h6 className='mt-3 text-center'>Don't have an account? <a href='signin'>Sign in</a></h6>
            </div>
        </div>
    )
}

export default Login;
