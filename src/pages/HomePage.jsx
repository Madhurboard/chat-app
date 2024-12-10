import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { allUsersRoute, host } from "../utils/APIRoutes";
import { io } from "socket.io-client";
import Contacts from "../components/Contacts";
import Logo from "../assets/logo.svg"; // Replace with your actual logo path

export default function Homepage() {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
        navigate("/login");
      } else {
        setCurrentUser(
          JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY))
        );
      }
    };
    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchContacts = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          const { data } = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          setContacts(data);
        } else {
          navigate("/setAvatar");
        }
      }
    };
    fetchContacts();
  }, [currentUser, navigate]);

  return (
    <Container>
      {/* Header Section */}
      <Header>
        <LogoSection>
          <img src={Logo} alt="App Logo" />
          <h1>SNAPPY</h1>
        </LogoSection>
        {currentUser && (
          <UserAvatar>
            <img
              src={`data:image/svg+xml;base64,${currentUser.avatarImage}`}
              alt="User Avatar"
            />
          </UserAvatar>
        )}
      </Header>

      {/* Contacts Section */}
      
        <Contacts contacts={contacts} />
      
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  background-color: #131324;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1e1e2f;
  padding: 15px 20px;
  color: white;
  border-bottom: 1px solid #444;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  img {
    height: 40px;
    width: 40px;
  }

  h1 {
    font-size: 1.5rem;
    color: #00c6ff;
    margin: 2px 0 0 0;

    @media (max-width: 768px) {
      font-size: 1.2rem;
    }
  }
`;

const UserAvatar = styled.div`
  img {
    height: 40px;
    width: 40px;
    border-radius: 50%;
    border: 2px solid #00c6ff;
  }
`;

const ContactsContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  background-color: #0e0e14;
  padding: 10px;

  @media (max-width: 768px) {
    padding: 5px;
  }
`;
