import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";

export default function ChatContainer({ currentChat, socket }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  
  // Fetch messages when the component or currentChat changes
  useEffect(() => {
    const fetchMessages = async () => {
      const data = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );
      const response = await axios.post(recieveMessageRoute, {
        from: data._id,
        to: currentChat._id,
      });
      setMessages(response.data);
    };

    if (currentChat) {
      fetchMessages();
    }
  }, [currentChat]);

  // Handle sending message
  const handleSendMsg = async (msg) => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: data._id,
      msg,
    });
    await axios.post(sendMessageRoute, {
      from: data._id,
      to: currentChat._id,
      message: msg,
    });

    setMessages((prevMessages) => [
      ...prevMessages,
      { fromSelf: true, message: msg },
    ]);
  };

  // Listen for incoming messages in real-time via WebSocket
  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { fromSelf: false, message: msg },
        ]);
      });
    }

    // Clean up listener on unmount
    return () => {
      if (socket.current) {
        socket.current.off("msg-recieve");
      }
    };
  }, [socket]);

  // Automatically scroll to the latest message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
              alt=""
            />
          </div>
          <div className="username">
            <h3>{currentChat.username}</h3>
          </div>
        </div>
        <Logout />
      </div>
      <div className="chat-messages">
        {messages.map((message) => (
          <div ref={scrollRef} key={uuidv4()}>
            <div
              className={`message ${
                message.fromSelf ? "sended" : "recieved"
              }`}
            >
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
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;

  @media screen and (max-width: 720px) {
    grid-template-rows: 15% 75% 10%;
  }

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem;

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
          @media screen and (max-width: 720px) {
            height: 2rem;
          }
        }
      }

      .username {
        h3 {
          color: white;
          font-size: 1rem;
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
    gap: 0.5rem;
    overflow: auto;

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
        max-width: 60%;
        overflow-wrap: break-word;
        padding: 0.8rem;
        font-size: 1rem;
        border-radius: 1rem;
        color: #d1d1d1;

        @media screen and (max-width: 720px) {
          max-width: 80%;
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

    @media screen and (max-width: 720px) {
      padding: 0 0.5rem;
    }
  }
`;

