import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute, allUsersRoute } from "../utils/APIRoutes";
import io from "socket.io-client";

export default function ChatContainer({ socket, setIsMenuOpen }) {
  const [messages, setMessages] = useState([]);
  const [avatarImage, setAvatarImage] = useState(null);
  const [username, setUsername] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const scrollRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const currentChat = location.state?.contact;  // The selected chat contact

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);
      if (!userData) {
        navigate("/login");
      } else {
        const user = JSON.parse(userData);
        setCurrentUser(user);
      }
    };
    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    if (currentUser && socket) {
      // Initialize socket connection only once currentUser is available
      if (!socket.current) {
        socket.current = io(process.env.REACT_APP_SOCKET_HOST);
      }
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser, socket]);

  useEffect(() => {
    const fetchContacts = async () => {
      if (currentUser && currentChat) {
        if (currentUser.isAvatarImageSet) {
          const { data } = await axios.get(`${allUsersRoute}/${currentChat._id}`);
          setUsername(data.username);
          setAvatarImage(data.avatarImage);
        } else {
          navigate("/setAvatar");
        }
      }
    };
    fetchContacts();
  }, [currentUser, currentChat, navigate]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (currentChat) {
        const data = await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
        const response = await axios.post(recieveMessageRoute, {
          from: data._id,
          to: currentChat._id,
        });
        setMessages(response.data);
      }
    };

    if (currentChat) {
      fetchMessages();
    }
  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    const data = await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
    if (socket?.current) {
      socket.current.emit("send-msg", { to: currentChat._id, from: data._id, msg });
    }
    await axios.post(sendMessageRoute, { from: data._id, to: currentChat._id, message: msg });

    setMessages((prevMessages) => [...prevMessages, { fromSelf: true, message: msg }]);
  };

  useEffect(() => {
    if (socket?.current) {
      socket.current.on("msg-recieve", (msg) => {
        setMessages((prevMessages) => [...prevMessages, { fromSelf: false, message: msg }]);
      });
    }
    return () => {
      if (socket?.current) {
        socket.current.off("msg-recieve");
      }
    };
  }, [socket]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            {avatarImage ? (
              <img src={`data:image/svg+xml;base64,${avatarImage}`} alt="User Avatar" />
            ) : (
              <p>No Avatar</p>
            )}
          </div>
          <div className="username">
            <h3>{username || "No User"}</h3>
          </div>
        </div>
        <Logout />
      </div>
      <div className="chat-messages">
        {messages.map((message) => (
          <div ref={scrollRef} key={uuidv4()}>
            <div className={`message ${message.fromSelf ? "sended" : "recieved"}`}>
              <div className="content">
                <p>{message.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 12% 75% 13%;
  gap: 0.1rem;
  height: 100vh;
  overflow: hidden;

  @media screen and (max-width: 720px) {
    grid-template-rows: 12% 74% 14%;
  }

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem;
    background-color: #121212;

    @media screen and (max-width: 720px) {
      padding: 0 0.5rem;
    }

    .user-details {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      .avatar {
        img {
          height: 2.5rem;
          width: 2.5rem;
          border-radius: 50%;
          object-fit: cover;

          @media screen and (max-width: 720px) {
            height: 2rem;
            width: 2rem;
          }
        }
      }

      .username {
        h3 {
          color: white;
          font-size: 1rem;
          font-weight: 600;

          @media screen and (max-width: 720px) {
            font-size: 0.9rem;
          }
        }
      }
    }
  }

  .chat-messages {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow-y: auto;
    background-color: #1f1f1f;

    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }

    .message {
      display: flex;
      align-items: center;

      .content {
        max-width: 70%;
        overflow-wrap: break-word;
        padding: 0.8rem;
        font-size: 1rem;
        border-radius: 1rem;
        color: #d1d1d1;

        @media screen and (max-width: 720px) {
          max-width: 85%;
          padding: 0.6rem;
          font-size: 0.9rem;
        }
      }
    }

    .sended {
      justify-content: flex-end;

      .content {
        background-color: #4f04ff21;
      }
    }

    .recieved {
      justify-content: flex-start;

      .content {
        background-color: #9900ff20;
      }
    }
  }

  .chat-input {
    padding: 0 1rem;
    background-color: #121212;

    @media screen and (max-width: 720px) {
      padding: 0 0.5rem;
    }
  }
`;
