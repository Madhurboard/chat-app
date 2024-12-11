import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

export default function Contacts({ contacts, changeChat }) {
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const navigate = useNavigate(); // Initialize navigate function

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    // Navigate to the ChatContainer page and pass the selected contact as state
    navigate("/chatcontainer", { state: { contact } });
  };

  return (
    <>
      {contacts && contacts.length > 0 && (
        <Container>
          <div className="contacts">
            {contacts.map((contact, index) => {
              return (
                <div
                  key={contact._id}
                  className={`contact ${index === currentSelected ? "selected" : ""}`}
                  onClick={() => changeCurrentChat(index, contact)}
                >
                  <div className="avatar">
                    <img
                      src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                      alt="Contact Avatar"
                    />
                  </div>
                  <div className="username">
                    <h3>{contact.username}</h3>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #1e1e1e; /* Dark background */
  height: 100%;
  overflow: hidden;

  .contacts {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    padding: 0rem;
    gap: 0;

    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }

    .contact {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 0.8rem 1rem;
      cursor: pointer;
      transition: background-color 0.3s ease-in-out, transform 0.1s ease-in-out;
      gap: 1rem;
      position: relative;
      background-color: #ffffffff39; /* Darker contact card background */

      &:hover {
        background-color: #333333;
        border-radius: 1rem;
      }

      &:active {
        transform: scale(0.98);
      }

      .avatar {
        img {
          height: 3rem;
          width: 3rem;
          border-radius: 50%;
        }
      }

      .username {
        h3 {
          color: white;
          font-size: 1rem;
          margin: 0;
        }
      }

      &.selected {
        background-color: #0078d4; /* Blue highlight for selected contact */
        color: white;

        .username h3 {
          font-weight: bold;
        }
      }
    }
  }
`;
