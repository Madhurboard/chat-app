import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { logoutRoute } from "../utils/APIRoutes"; // Import the logout route
import { FaPen, FaChevronLeft, FaSignOutAlt } from "react-icons/fa"; // Added SignOut icon

export default function ProfilePage() {
  const { state } = useLocation(); // Get the current user data from location state
  const navigate = useNavigate(); // For back navigation
  const { currentUser } = state || {};

  const handleBack = () => navigate(-1); // Go back to the previous page

  
  // Handle logout
  const handleLogout = async () => {
    const id = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    )._id;
    const data = await axios.get(`${logoutRoute}/${id}`);
    if (data.status === 200) {
      localStorage.clear();
      navigate("/login");
    }
  };
  return (
    <Container>
      <Header>
        <BackButton onClick={handleBack}>
          <FaChevronLeft size={20} />
        </BackButton>
        <h1>Profile</h1>
      </Header>
      {currentUser ? (
        <ProfileDetails>
          <AvatarWrapper>
            <Avatar>
              <img
                src={`data:image/svg+xml;base64,${currentUser.avatarImage}`}
                alt="User Avatar"
              />
            </Avatar>
            <EditIcon>
              <FaPen size={16} />
            </EditIcon>
          </AvatarWrapper>
          <UserInfo>
            <h2>{currentUser.username}</h2>
            <p>{currentUser.email}</p>
          </UserInfo>
          <Section>
            <h3>Bio</h3>
            <p>Add a short bio about yourself...</p>
          </Section>
          <Section>
            <h3>Contact Info</h3>
            <p>No additional contact information added.</p>
          </Section>
          <Section>
            <h3>Settings</h3>
            <p>Manage your account preferences here.</p>
          </Section>

          {/* Logout Button */}
          <LogoutButton onClick={handleLogout}>
            <FaSignOutAlt size={16} /> Logout
          </LogoutButton>
        </ProfileDetails>
      ) : (
        <LoadingMessage>Loading...</LoadingMessage>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #1e1e1e;
  padding: 1rem;
  color: #ffffff;
  overflow-y: auto;
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
  z-index: 10;

  h1 {
    flex: 1;
    font-size: 1.8rem;
    font-weight: 700;
    text-align: center;
    color: #ffffff;
  }
`;

const BackButton = styled.div`
  cursor: pointer;
  color: #ffffff;
  padding: 0.5rem;
  border-radius: 50%;
  &:hover {
    background-color: #444;
  }
`;

const ProfileDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
`;

const AvatarWrapper = styled.div`
  position: relative;
`;

const Avatar = styled.div`
  img {
    height: 120px;
    width: 120px;
    border-radius: 50%;
    border: 2px solid #00c6ff; /* Blue border */
    margin-bottom: 20px;
  }
`;

const EditIcon = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: #333;
  border-radius: 50%;
  padding: 6px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  color: #00c6ff;
  cursor: pointer;

  &:hover {
    background-color: #00c6ff;
    color: white;
    transform: scale(1.1);
  }
`;

const UserInfo = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  h2 {
    font-size: 2rem;
    color: #00c6ff; /* Blue text for the username */
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 1rem;
    color: #b0b0b0;
  }
`;

const Section = styled.div`
  width: 100%;
  background-color: #333;
  padding: 1rem;
  border-radius: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);

  h3 {
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: #ffffff;
  }

  p {
    font-size: 1rem;
    color: #b0b0b0;
  }
`;

const LoadingMessage = styled.p`
  font-size: 1.2rem;
  color: #b0b0b0;
  text-align: center;
`;

const LogoutButton = styled.button`
  margin-top: 2rem;
  background-color: #ff3b3b;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: #e60000;
  }

  svg {
    margin-right: 0.5rem;
  }
`;
