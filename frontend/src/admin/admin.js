import axios from 'axios'
import '../App.css';
import {useState,useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
function Adm(){
    const [inp, setInp] = useState({
        frdmessage:""
    });
    const[mis,setMis]=useState("");
    const[color,setColor]=useState("red")
    const[load,setLoad]=useState(true);
    function sub(){
        if(inp.frdmessage.length<15) {return (setMis("Enter the Text"),setColor("red"))}
        setLoad(false)
        axios.post(`${process.env.REACT_APP_API_URL}/admin`,inp)
        .then(res=>{
            setLoad(true);
            setInp({...inp,frdmessage:""})
            if(res.data.toLowerCase().includes("success")){
                setColor("green")
                setMis("Inserted");
            }
            else{
                setMis(res.data)
            }
        })
        .catch(err=>{console.log(err);setLoad(true)})
    }
    return(
        <>
        <div className="container mt-5">
            <textarea name="frdmessage" onChange={e=>{setInp({...inp,[e.target.name]:e.target.value});setMis("")}} className="form-control" value={inp.frdmessage}></textarea>
            <div className="mt-2" style={{color:color}}>{mis}</div>
            <button onClick={e=>sub()} className="btn btn-primary mt-3">{load?"Submit":"submiting..."}</button>
        </div>
        </>
    )
}
export default Adm;