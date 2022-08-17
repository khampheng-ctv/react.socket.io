import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://localhost:4001";

function App() {
  const [response, setResponse] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    const fetchData = async () => {
      const res = await fetch(`${ENDPOINT}/get`);
      const data = await res.json();
      setResponse(data);
    };

    //socket.io
    socket.on("getMessage", (data) => {
      if (data) {
        setResponse(data);
      }
    });

    //fetch
    fetchData();

    return () => {
      socket.disconnect();
    };
  }, []);

  const addMessage = async () => {
    try {
      await fetch(`${ENDPOINT}/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: message }),
      });
      setMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-5">
      <div className="text-end">
        {response?.map((item, index) => (
          <p key={index}>{item}</p>
        ))}
      </div>
      <div className="text-end">
        <div className="input-group">
          <input
            type="text"
            className="form-control shadow-none"
            placeholder="text..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                addMessage();
              }
            }}
          />
          <button
            className="btn btn-primary shadow-none"
            disabled={!message}
            onClick={addMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
