import { useCallback, useState } from 'react';
import './app.css';
import Markdown from 'react-markdown';
import { v4 as uuid } from 'uuid';

const client_uuid = uuid();

export default function App() {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function calcHeight(value) {
    let numberOfLineBreaks = (value.match(/\n/g) || []).length;
    let newHeight = 24 + (numberOfLineBreaks - 1) * 16 + 16 + 2;
    return newHeight;
  }

  const callApi = async (message) => {
    return fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/generate-answer?client=${client_uuid}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ question: message }),
    })
      .then((res) => res.json())
      .then((response) => {
        setMessages((oldMessages) => {
          return [...oldMessages, { text: response.answer, type: 'system' }];
        });
      })
      .catch((error) => {
        console.error(error);
        setMessages((oldMessages) => {
          return [
            ...oldMessages,
            { text: 'An error occurred while processing your request.', type: 'system' },
          ];
        });
      });
  };

  const generateAnswer = useCallback(() => {
    setMessages((oldMessages) => {
      return [...oldMessages, { text: userMessage, type: 'user' }];
    });
    setIsLoading(true);

    callApi(userMessage).finally(() => {
      setUserMessage('');
      setIsLoading(false);
    });
  }, [userMessage]);

  return (
    <div className="app">
      <header className="header">
        <img src="/RIC.png" alt="Rangsit logo" />
      </header>
      <div className="message-box">
        {messages.map((message, i) => {
          return (
            <div key={i} className={message.type === 'user' ? 'user-message' : 'system-message'}>
              <div className="message" style={{ whiteSpace: 'pre-line' }}>
                {message.type === 'user' ? message.text : <Markdown>{message.text}</Markdown>}
              </div>
            </div>
          );
        })}
      </div>
      <div className="inputbox">
        <textarea
          disabled={isLoading}
          value={userMessage}
          onKeyUp={(e) => {
            e.target.style.height = calcHeight(e.target.value) + 'px';
          }}
          onChange={(e) => {
            setUserMessage(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              generateAnswer();
            }
          }}
          placeholder="Ask a question ..."
        ></textarea>
        <button
          disabled={userMessage === '' || isLoading}
          onClick={() => {
            generateAnswer();
          }}
        >
          {isLoading ? (
            <span className="loader"></span>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
