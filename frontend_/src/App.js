import io from 'socket.io-client';
import './App.css';
import { useState, useEffect, useRef } from 'react';
;
const socket = io("http://localhost:4000");

function App() {

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Crear una referencia para el div
  const divRef = useRef(null);

  //Obtenemos los mensajes del resto de clientes conectados:
  useEffect(() => {
    socket.on("message", message => {
      //console.log(message);
      //Guardamos los mensajes recibidos. De este modo se resetea el array:
      //setMessages([...messages, message]);
      //De este modo se preservan los estados anteriores:
      receiveMessage(message);

    })
    //console.log(messages);
    //Apagamps el evento para que no duplique los mensajes recibidos:
    return () => {
      socket.off("message");
    }

  }, [])

  function receiveMessage(message) {
    setMessages((state) => [...state, message]);
    scrollToBottom();
  }

  function handleSubmit(e) {
    e.preventDefault();
    //console.log(message);
    const newMessage = {
      body: message,
      from: name
    }
    //Guardamos nuestro mensaje para verlo en pantalla:
    setMessages([...messages, newMessage]);
    //Emitimos el mensaje al servidor:
    socket.emit("message", newMessage);
    setMessage("");
    scrollToBottom();

  }

  // Función para enfocar al final del div
  const scrollToBottom = () => {
    
    if (divRef.current) {
      const lastChild = divRef.current.lastElementChild;
      if (lastChild) {
        lastChild.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }

  };


  return (
    <div className="App">

      <h3 className='text-center mt-3' id="title">TalkieTalk</h3>

      <div id="card-name" className='d-flex justify-content-center mt-3'>
        <input type="text" className='form-control' placeholder="Escribe tu nombre..." onChange={(e) => setName(e.target.value)} />
      </div>

      <div className='card mt-3 card-container' id="card-message">
        <div className='card-body'>
          <form onSubmit={handleSubmit}>
            <div className='d-flex justify-content-center'>
              <input type="text" className='form-control mx-1' placeholder="Escribe tu mensaje..." onChange={(e) => setMessage(e.target.value)} value={message} />
              <button className='btn btn-secondary mx-1'>Enviar</button>
            </div>
          </form>
        </div>
      </div>


      <div className='card mt-3 card-container' id="card-chat">
        <div className='card-body'>
          <div id="list-messages" ref={divRef}>
            {
              messages.map((message, i) => {
                return (

                  message.from === name ? (
                    <div className='d-flex justify-content-end'>
                      <div className='card mt-3 card-message mx-1' key={i}>
                        <div className='card-body card-body-message-user'>
                          {message.body}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className='card mt-3 card-message-other mx-1' key={i}>
                      <div className='card-body'>
                        {message.from}: {message.body}
                      </div>
                    </div>
                  )
                )
              })
            }
          </div>

        </div>
      </div>

    </div>
  );
}

export default App;
