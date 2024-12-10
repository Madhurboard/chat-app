import React, { useState } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import styled from "styled-components";
import Picker from "emoji-picker-react";

export default function ChatInput({ handleSendMsg }) {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (event, emojiObject) => {
    let message = msg;
    message += emojiObject.emoji;
    setMsg(message);
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };

  return (
    <Container>
      <div className="button-container">
        <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
          {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
        </div>
      </div>
      <form className="input-container" onSubmit={(event) => sendChat(event)}>
        <input
          type="text"
          placeholder="type your message here"
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
        />
        <button type="submit">
          <IoMdSend />
        </button>
      </form>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 10% 90%;
  background-color: #080420;
  padding: 0 1rem;

  @media screen and (max-width: 720px) {
    grid-template-columns: 15% 85%;
    padding: 0.5rem;
  }

  .button-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .emoji {
      position: relative;

      svg {
        font-size: 1.2rem;
        color: #ffff00c8;
        cursor: pointer;

        @media screen and (max-width: 720px) {
          font-size: 1rem;
        }
      }

      .emoji-picker-react {
        position: absolute;
        top: -350px;
        right: 0;
        background-color: #080420;
        box-shadow: 0 5px 10px #9a86f3;
        border-color: #9a86f3;
        z-index: 100;

        @media screen and (max-width: 720px) {
          top: -300px;
          width: 90vw;
        }

        .emoji-scroll-wrapper::-webkit-scrollbar {
          background-color: #080420;
          width: 5px;

          &-thumb {
            background-color: #9a86f3;
          }
        }

        .emoji-categories button {
          filter: contrast(0);
        }

        .emoji-search {
          background-color: transparent;
          border-color: #9a86f3;
        }

        .emoji-group:before {
          background-color: #080420;
        }
      }
    }
  }

  .input-container {
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 100%;
    background-color: #ffffff34;
    border-radius: 2rem;

    @media screen and (max-width: 720px) {
      gap: 0.5rem;
    }

    input {
      flex: 1;
      background-color: transparent;
      color: white;
      border: none;
      padding-left: 1rem;
      font-size: 1rem;

      &::selection {
        background-color: #9a86f3;
      }

      &:focus {
        outline: none;
      }

      @media screen and (max-width: 720px) {
        font-size: 0.9rem;
        padding-left: 0.5rem;
      }
    }

    button {
      padding: 0.3rem 1.5rem;
      border-radius: 2rem;
      background-color: #9a86f3;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;

      svg {
        font-size: 1.5rem;
        color: white;

        @media screen and (max-width: 720px) {
          font-size: 1.2rem;
        }
      }
    }
  }
`;
