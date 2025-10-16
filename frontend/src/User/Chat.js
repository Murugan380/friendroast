import './css/chat.css';
import axios from 'axios'
import {jwtDecode} from 'jwt-decode'
import {useNavigate} from 'react-router-dom'
import { useState,useRef,useEffect} from 'react';
import profile from './profile.jpg'
import profile2  from './profile2.gif'
function Chat() {
  const navi=useNavigate();
  const [inp, setInp] = useState([]);
  const[userdata,setUserdata]=useState([{frdname:"",messageId:{frdmessage:""},createdAt:""}]);
  const[userdata2,setUserdata2]=useState([{frdname:"Say your friend Name",messageId:{frdmessage:"I will Roast him"},createdAt:""}]);
  const[proimg,setProimg]=useState("");
  const[proerr,setProerr]=useState("");
   const [groupedMessages, setGroupedMessages] = useState({});
  const [mis, setMis] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const[ac,setAc]=useState(false);
  const[pro,setPro]=useState(true);
  const dropdownRef = useRef(null);
  const[decode,setDecode]=useState({});
  const token=localStorage.getItem("token");
   let decoded={}
  useEffect(()=>{
    if(token){
    decoded=jwtDecode(token);
    setDecode(decoded)
   setUserdata([{frdname:decoded.name,messageId:{frdmessage:"Sorry it's your name ,you'r my boss.I dont't want to roast you"},createdAt:new Date().toISOString()}])
    }
    else{
      navi('/')
    }
  },[])
  const data = (e) => {
    setMis('');
    setInp({...inp,[e.target.name]:e.target.value});
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  const go = () => {
    const match=userdata.filter(item=>item.frdname.toLowerCase()==inp.frdname.toLowerCase())
    if (!/^[A-Za-z][A-Za-z ]{3,20}$/.test(inp.frdname)) {
      setMis('Invalid Name');
    }
    else if(inp.frdname.toLowerCase().includes(decode.name.toLowerCase()))
    {
      const umatch=userdata.filter(item=>item.frdname.toLowerCase()==inp.frdname.toLowerCase())
      document.getElementById('msgg').value="";
      if(umatch){
        const obj=umatch[0];
        setUserdata2(prev=>[...prev,obj])
      }
    }
    else if(match.length > 0){
      document.getElementById('msgg').value="";
      const obj=match[0];
      setUserdata2(prev=>[...prev,obj])
    } else {
      console.log("inp",inp);
      setUserdata2(prev=>[...prev,inp])
      document.getElementById('msgg').value="";
      axios.post(`${process.env.REACT_APP_API_URL}/putdata`,inp,{headers:{authorization:`Bearer ${token}`}})
      .then(res=>{
        setUserdata2(prev => 
  prev.map(u => {
    if (u?.frdname === res.data.result?.frdname) {
      // update only the matching object
      return {
        ...u,
        frdname: res.data.result?.frdname,  // optional if name stays same
        messageId: res.data.messageId,
        createdAt: res.data.result?.createdAt
      };
    }
    return u; // keep others unchanged
  })
);
    setUserdata(prev =>[
    ...prev,{
      frdname:res.data.result?.frdname,
          messageId: res.data.messageId,
           createdAt:res.data.result?.createdAt// ensure mesg is always an array
    }
    ]
    )
    
   
      })
      .catch(err=>console.log(err))
    }
  }
  function upload(e){
    const file =e.target.files[0];
    const formData= new FormData();
    formData.append("profile",file);
    const fil=proimg;
    setPro(false);
    setProerr("");
    setProimg("");
    axios.post(`${process.env.REACT_APP_API_URL}/file`,formData,{headers:{authorization:`Bearer ${token}`,"content-type":"multipart/form-data"}})
    .then(res=>{
      setProimg(res.data);
      document.getElementById('profileUpload').value='';
      setPro(true);
    })
    .catch(err=>{console.log(err);setPro(true);
      if(err.response.data.message=="Server error"){
      document.getElementById('profileUpload').value='';
      }
      setProimg(fil);
      setProerr(err.response.data.message)
    })
  }

useEffect(()=>{
axios.post(`${process.env.REACT_APP_API_URL}/getuserd`, {}, {
        headers: { authorization: `Bearer ${token}` }
      }).then(res=>{
        setProimg(res.data.profile);
      }).catch(err=>console.log(err))
},[])


  useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/getdata`, {}, {
        headers: { authorization: `Bearer ${token}` }
      });
      const data = res.data;
      // Set userdata
      setUserdata([
  ...data, // existing messages
  { 
    frdname: decoded.name,
    messageId: { frdmessage: "Sorry it's your name, you'r my boss. I don't want to roast you" },
    createdAt: new Date().toISOString()
  }
]);
      // Group by date immediately
      const grouped = data.reduce((acc, message) => {
        const date = message.createdAt?.split('T')[0];
        if (!acc[date]) acc[date] = [];
        acc[date].push(message);
        return acc;
      }, {});
      const sortedGrouped = Object.keys(grouped)
  .sort((a, b) => new Date(b) - new Date(a))
  .reduce((acc, date) => {
    acc[date] = grouped[date];
    return acc;
  }, {});
      setGroupedMessages(sortedGrouped);

      // Today’s messages
      const today = new Date().toISOString().split('T')[0];
      setUserdata2(grouped[today] || []);

    } catch (err) {
      console.log(err);
    }
  };

  fetchData();
}, []);

function transfor(i){
  console.log(i);
  setUserdata2(userdata.filter(item=>item?.createdAt?.split('T')[0]==i))
}

function del(d){
axios.post(`${process.env.REACT_APP_API_URL}/deldata`,{body:d},{headers:{authorization:`Bearer ${token}`}})
.then(res=>{
   setGroupedMessages(prev => {
    const newGroups = { ...prev };
    delete newGroups[d]; // delete the key
    return newGroups;
  });
    setUserdata2(prev => prev.filter(item => item.createdAt.split('T')[0] !== d));
  setUserdata(prev => prev.filter((_, i) => i !== d));
})
.catch(err=>console.log(err))
}

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
  const closeMenus = (e) => {
    document.querySelectorAll(".chat-menu.show").forEach(menu => {
      if (!menu.contains(e.target)) menu.classList.remove("show");
    });
  };
  document.addEventListener("click", closeMenus);
  return () => document.removeEventListener("click", closeMenus);
}, []);

const messagesEndRef = useRef(null);
const messagesContainerRef = useRef(null);

useEffect(() => {
  const container = messagesContainerRef.current;
  if (!container) return;

  const isNearBottom =
    container.scrollHeight - container.scrollTop - container.clientHeight < 100;

  if (isNearBottom && messagesEndRef.current) {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }
}, [userdata2,userdata]);

  useEffect(() => {
  function handleClickOutside(event) {
    const leftPanel = document.querySelector(".left-panel");
    const toggleBtn = document.querySelector(".toggle-history-btn");

    // Apply only on mobile view (screen width ≤ 768px)
    if (
      window.innerWidth <= 768 && 
      showHistory &&
      leftPanel &&
      !leftPanel.contains(event.target) &&
      (!toggleBtn || !toggleBtn.contains(event.target))
    ) {
      setShowHistory(false);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, [showHistory]);

  return (
    <div className="chat-app">
      {/* Left Panel */}
      <div className={`left-panel ${showHistory ? 'show' : ''}`}>
        <div className="history-header">
          <h5>Chats</h5>
          <button className="close-history-btn btn-outline-dark btn" onClick={toggleHistory}>✖</button>
        </div>

        <div className="chat-history">
          {Object.entries(groupedMessages).map(([data,messages],i) => (
            <div key={i} className="chat-item" onClick={e=>transfor(data)}>
              <span>{new Date(data).toLocaleDateString("en-US",{
                year:"numeric",
                month:"long",
                day:"numeric"
              })}</span>

              {/* 3-dot button */}
              <div className="chat-options">
                <button
                  className="dots-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    const allMenus = document.querySelectorAll(".chat-menu");
                    allMenus.forEach((m) => m.classList.remove("show"));
                    e.currentTarget.nextElementSibling.classList.toggle("show");
                  }}
                >
                  ⋮
                </button>

                {/* Dropdown Menu */}
                <div className="chat-menu">
                  <button className="delete-btn" onClick={e=>del(data)}>🗑 Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* User Profile */}
        <div className="user-profile" ref={dropdownRef}>
            <img src={proimg?`${process.env.REACT_APP_API_URL}/uploads/${proimg}`:profile} />
            <div className="username-wrapper">
                <button className="username-btn" style={{textTransform:"capitalize"}} onClick={() => setShowDropdown(!showDropdown)}>
                {decode?.name}
                </button>
                {showDropdown && (
                <div className="user-dropdown-up">
                    <a  onClick={e=>setAc(true)}>Profile</a>
                    <a onClick={e=>navi('/logout')}>Logout</a>
                </div>
                )}
            </div>
        </div>
    </div>

      {/* Right Panel */}
      <div className="right-panel">
        <div className="history-toggle-wrapper">
          <button className="toggle-history-btn" onClick={toggleHistory}>☰</button>
        </div>

        <div className="chat-messages"  ref={messagesContainerRef}>
          {userdata2.map(c=>(<>
          
          <div className="message user-msg">
            {c?.frdname}
          </div>
          <div className="message bot-msg">{c?.messageId?.frdmessage?.replace("{name}",c?.frdname||"")}</div>
          </>))}
          <div ref={messagesEndRef}></div>
          </div>

        <div className="chat-input">
          <div className="error-msg">{mis}</div>
          <div className="downbox">
            <input
              type="text"
              placeholder="Type your Comedian..."
              onChange={data}
              name="frdname"
              id="msgg"
              className="input"
            />
            <button type="submit" onClick={go}>➤</button>
          </div>
        </div>
      </div>

      {/*Profile*/}
      {/*Model*/}
      <div className={`modal fade ${ac ? "show d-block" : ""}`}
                tabIndex="-1"
                role="dialog"
                aria-hidden="true"
                style={{ backgroundColor: ac ? "rgba(0,0,0,0.5)" : "" }}
                id="staticBackdrop"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
                aria-labelledby="staticBackdropLabel">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="staticBackdropLabel">Modal title</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={e=>setAc(!ac)}></button>
            </div>
            <div class="modal-body d-grid justify-content-center">
              <div style={{ position: "relative", width: "150px", height: "150px" }}>
                <img
                  src={`${proimg? `${process.env.REACT_APP_API_URL}/uploads/${proimg}`:pro?profile:profile2}`}
                  alt="User"
                  style={{
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #ddd",
                  }}
                />
                {/* Hidden File Input */}
                <input
                  type="file"
                  id="profileUpload"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={e=>upload(e)}
                  name="profile"
                />

                {/* Pencil Button */}
                <label
                  htmlFor="profileUpload"
                  style={{
                    position: "absolute",
                    bottom: "5px",
                    right: "5px",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    borderRadius: "50%",
                    width: "35px",
                    height: "35px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                  }}
                >
                <i className="bi bi-pencil-fill"></i>
              </label>
            </div>
            <div style={{color:"red"}}>{proerr}</div>
            <h1 style={{textTransform:"capitalize"}}>{decode.name}</h1>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onClick={e=>setAc(!ac)}>Close</button>
              <button type="button" class="btn btn-primary" onClick={e=>setAc(!ac)}>OK</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
