import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { allUsersRoute, host } from "../utils/APIRoutes";
import { io } from "socket.io-client";
import Contacts from "../components/Contacts";

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

  // Navigate to profile page on avatar click
  const handleAvatarClick = () => {
    navigate("/profile", { state: { currentUser } });
  };

  return (
    <Container>
      {/* Header Section */}
      <Header>
        <LogoSection>
          <h1>SNAPPY</h1>
        </LogoSection>
        {currentUser && (
          <UserAvatar onClick={handleAvatarClick}>
            <img
              src={`data:image/svg+xml;base64,${currentUser.avatarImage}`}
              alt="User Avatar"
            />
          </UserAvatar>
        )}
      </Header>

      {/* Contacts Section */}
      <ContactsContainer>
        <Contacts contacts={contacts} />
      </ContactsContainer>
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
  justify-content: space-between;
  background-color: #333;
  padding: 1rem;
  border-radius: 1rem;
  margin-bottom: 1rem;
  position: sticky;
  top: 0;
  z-index: 1;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  h1 {
    font-size: 1.5rem;
    color: #00c6ff;
    font-weight: 700;
    letter-spacing: 1px;
  }
`;

const UserAvatar = styled.div`
  img {
    height: 40px;
    width: 40px;
    border-radius: 50%;
    border: 2px solid #00c6ff;
    transition: transform 0.2s ease-in-out;

    &:hover {
      transform: scale(1.05);
      cursor: pointer;
    }
  }
`;

const ContactsContainer = styled.div`
  flex: 1;
  gap: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  background-color: transparent; /* Make background transparent */
  border-radius: 1rem; /* Optional: add a border-radius for smooth corners */
  box-shadow: inset 0px 4px 15px rgba(0, 0, 0, 0.1); /* Subtle inner shadow for depth */

`;
