const socket = io('/api/socket')

const clienstTotal = document.getElementById("clients-total");
const messageContainer = document.getElementById("message-container");
const nameInput = document.getElementById("name-input");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");

// Get message from messageInput
const sendMessage = () => {
    if (messageInput.value === "") {
        messageInput.style.border = "1px solid #fff000";
        return;
    }
    messageInput.style.border = "none";

    // Getting the messsage from UI
    const data = {
        name: nameInput.value,
        message: messageInput.value,
        dateTime: new Date(),
    };
    // Send message to socket server
    socket.emit("user-message", data);
    addMessageToUI(true, data);

    // Clear messageInput
    messageInput.value = "";
};

// Submit form message to socket server
messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    sendMessage();
});

// Add Message to UI
const addMessageToUI = (isOwnMessage, data) => {
    clearFeedbackMessage()
    const messageElement = `
                    <li class="${isOwnMessage ? "message-right" : "message-left"
        }">
                <p class="message">
                    ${data.message}
                    <span>${isOwnMessage ? "me" : data.name} ⚪ ${moment(
            data.dateTime,
        ).fromNow()}</span>
                </p>
            </li>
    `;
    messageContainer.innerHTML += messageElement;
    scrollToBottom();
};

// Scroll to bottom of message container
const scrollToBottom = () => {
    messageContainer.scrollTo(0, messageContainer.scrollHeight);
};

messageInput.addEventListener("focus", (e) => {
    socket.emit("feedback-message", {
        feedback: `✍🏿 ${nameInput.value} is typing`,
    });
});
messageInput.addEventListener("focus", (e) => {
    socket.emit("feedback-message", {
        feedback: `✍🏿 ${nameInput.value} is typing`,
    });
});
messageInput.addEventListener("blur", (e) => {
    socket.emit("feedback-message", {
        feedback: "",
    });
});

// Clear feedback message
const clearFeedbackMessage = () => {
    document.querySelectorAll("li.message-feedback").forEach((element) => {
        element.parentNode.removeChild(element);
    })
}

// Socket Events Handlers================================================================
// Retrieve number of connected users from socket server
socket.on("clients-total", (data) => {
    clienstTotal.innerHTML = `Total connected: ${data}`;
});

// Retrieve chat messages sent from socket server
socket.on("chat-message", (data) => {
    addMessageToUI(false, data);
});
// Retrieve feedback messages sent from socket server
socket.on("feedback-message", (data) => {
    clearFeedbackMessage()
    const element = `
    <li class="message-feedback">
         <p class="feedback" id="feedback">${data.feedback}</p>
    </li>`;

    messageContainer.innerHTML += element;
});

