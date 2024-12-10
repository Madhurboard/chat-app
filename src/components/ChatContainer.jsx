import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { FiChevronLeft, FiSend, FiSmile } from "react-icons/fi"; // Import smile icon
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes"; // Import API routes
import EmojiPicker from "emoji-picker-react"; // Import the emoji picker

export default function ChatContainer() {
  const { state } = useLocation(); // Access the state passed through navigate
  const contact = state?.contact; // Get the contact object from the state
  const navigate = useNavigate(); // Hook for navigation

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false); // State to control emoji picker visibility
  const scrollRef = useRef(null); // Reference for scrolling to the latest message
  const socket = useRef(null); // Socket reference for real-time updates
  const [currentChat, setCurrentChat] = useState(contact); // Current chat state

  // Fetch messages when currentChat changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (currentChat) {
        const data = await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
        const response = await axios.post(recieveMessageRoute, {
          from: data._id,
          to: currentChat._id,
        });
        setMessages(response.data); // Assuming response.data contains the messages
      }
    };

    if (currentChat) {
      fetchMessages();
    }
    
    // Set up an interval to refresh the messages every second
    const interval = setInterval(() => {
      if (currentChat) {
        fetchMessages();
      }
    }, 1000);

    // Clear the interval when the component unmounts or currentChat changes
    return () => clearInterval(interval);
  }, [currentChat]);

  // Handle sending a message
  const handleSendMsg = async (msg) => {
    const data = await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
    if (socket?.current) {
      socket.current.emit("send-msg", { to: currentChat._id, from: data._id, msg });
    }
    await axios.post(sendMessageRoute, { from: data._id, to: currentChat._id, message: msg });

    setMessages((prevMessages) => [...prevMessages, { fromSelf: true, message: msg }]);
    setNewMessage(""); // Clear the textbox after sending the message
  };

  // Listen for incoming messages via socket
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

  // Scroll to the bottom when new messages are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Handle the back button
  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  // Function to handle emoji click
  const handleEmojiClick = (event, emojiObject) => {
    setNewMessage((prevMessage) => prevMessage + emojiObject.emoji); // Append emoji to message input
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={handleBack}>
          <FiChevronLeft size={30} color="white" />
        </BackButton>
        <Avatar>
          <img
            src={`data:image/svg+xml;base64,${contact.avatarImage}`}
            alt="User Avatar"
            style={{ height: "40px", width: "40px", borderRadius: "50%" }}
          />
        </Avatar>
        <Username>{contact.username}</Username>
      </Header>

      <MessageArea>
        {messages.map((msg, index) => (
          <Message key={index} isUser={msg.fromSelf}>
            <MessageContent isUser={msg.fromSelf}>{msg.message}</MessageContent>
          </Message>
        ))}
        <div ref={scrollRef}></div> {/* This is where the scroll reference is placed */}
      </MessageArea>

      <InputArea>
        <EmojiIcon onClick={() => setEmojiPickerVisible(!emojiPickerVisible)}>
          <FiSmile size={20} color="white" />
        </EmojiIcon>

        <Input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
        />
        <SendButton onClick={() => handleSendMsg(newMessage)}>
          <FiSend size={20} color="white" />
        </SendButton>
        
        {emojiPickerVisible && (
          <EmojiPickerWrapper>
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </EmojiPickerWrapper>
        )}
      </InputArea>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #1e1e1e;
  padding: 1rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  background-color: #333;
  padding: 1rem;
  border-radius: 1rem;
  margin-bottom: 1rem;
  position: sticky;
  top: 0;
  z-index: 1;
`;

const BackButton = styled.button`
  background-color: transparent;
  color: white;
  border: none;
  margin-right: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover {
    color: #0078d4;
  }
`;

const Avatar = styled.div`
  margin-right: 1rem;
`;

const Username = styled.h3`
  color: white;
  font-size: 1.2rem;
  margin: 0;
`;

const MessageArea = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 1rem;

  /* Hide scrollbar */
  ::-webkit-scrollbar {
    display: none;
  }
`;

const Message = styled.div`
  display: flex;
  justify-content: ${(props) => (props.isUser ? "flex-end" : "flex-start")};
  margin: 0.5rem 0;
`;

const MessageContent = styled.div`
  max-width: 60%;
  padding: 0.8rem;
  background-color: ${(props) => (props.isUser ? "#0078D4" : "#333")};
  color: white;
  border-radius: 1rem;
`;

const InputArea = styled.div`
  display: flex;
  gap: 0.5rem;
  position: relative;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.8rem;
  border: none;
  border-radius: 1rem;
  background-color: #333;
  color: white;
  font-size: 1rem;
  outline: none;
`;

const SendButton = styled.button`
  padding: 0.8rem;
  border: none;
  background-color: #0078d4;
  color: white;
  border-radius: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #005a9e;
  }
`;

const EmojiIcon = styled.button`
  background-color: transparent;
  color: white;
  border: none;
  cursor: pointer;
  padding: 0.8rem;

  &:hover {
    background-color: #444;
  }
`;

const EmojiPickerWrapper = styled.div`
  position: absolute;
  bottom: 60px;
  left: 0;
  z-index: 2;
  background-color: #333;
  border-radius: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
`;
