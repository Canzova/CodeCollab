import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");

  const createNewRoom = (e) => {
    e.preventDefault(); // Prevents the default behavior (page refresh)
    const id = uuidv4();
    setRoomId(id);

    toast.success("Created a new room");
  };

  const joinRoom = () => {
    if (!roomId || !userName) {
      toast.error("ROOM ID & USERNAME is required");
      return;
    }

    // Redirect
    navigate(`/editor/${roomId}`, {
      state: {
        // Sending username to editorpage
        userName,
      },
    });
  };

  const handleinputEnter = (e)=>{
    if(e.code === 'Enter')
    {
      joinRoom();
    }
  }
  return (
    <div className="homepagewrapper">
      <div className="formWrapper">
        <div className="homepageLogowrapper">
        <img src="/code-sync.png" alt="logo" className="homepagelogo" />
        </div>
        <h4 className="mainLabel">Paste Invitation Room ID</h4>
        <div className="inputGroup">
          <input
            type="text"
            className="inputBox"
            placeholder="ROOM ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            onKeyUp={handleinputEnter}
          />
          <input
            type="text"
            className="inputBox"
            placeholder="USERNAME"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            onKeyUp={handleinputEnter}
          />
          <button className="btn joinBtn" onClick={joinRoom}>
            Join
          </button>
          <span className="creatInfo">
            If you don't have an invite&nbsp;
            <a href="/" className="createNewBtn" onClick={createNewRoom}>
              new room
            </a>
          </span>
        </div>
      </div>

      <footer>
        <h4>
          Built with 💛 by <a href="/">Canzova</a>
        </h4>
      </footer>
    </div>
  );
};

export default Home;
