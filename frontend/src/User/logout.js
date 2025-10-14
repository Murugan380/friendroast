import {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
function Log(){
    const navi=useNavigate();
    useEffect(()=>{
localStorage.removeItem('token');navi('/')
    },[])
}
export default Log;