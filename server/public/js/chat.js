const socket = io();

let currentChatId = null;

//Elements
const $messageForm = document.querySelector("#message");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $messages = document.querySelector("#messages");

//Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

const autoScroll = () => {
  const $newMessage = $messages.lastElementChild;

  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  const visableHeight = $messages.offsetHeight;

  const containerHeight = $messages.scrollHeight;

  const scrollOffset = $messages.scrollTop + visableHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight;
  }
};

socket.on("message", (message) => {
  if (message.chatId !== currentChatId) return;
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });

  $messages.insertAdjacentHTML("beforeend", html);
  autoScroll();
});

const sideBarText = () => {
  const html = Mustache.render(sidebarTemplate, {
    chatData,
  });

  document.querySelector("#sidebar").innerHTML = html;
};

sideBarText();

// disable
$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!currentChatId) return;

  $messageFormButton.setAttribute("disabled", "disabled");

  const message = e.target.elements.message.value;

  socket.emit(
    "sendMessage",
    { text: message, chatId: currentChatId },
    (error) => {
      $messageFormButton.removeAttribute("disabled");
      $messageFormInput.value = "";
      $messageFormInput.focus();
      if (error) {
        console.log(error);
      }
      console.log("message delivered");
    }
  );
});

const getMessages = (chatId, username) => {
  $messages.innerHTML = "";
  currentChatId = chatId;

  fetch(`http://localhost:3000/support-chat/` + chatId, {
    method: "get",
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.json())
    .then((json) =>
      json.map((message) => {
        html = Mustache.render(messageTemplate, {
          username: message.isAdmin ? "Admin" : username,
          message: message.message,
          createdAt: moment(new Date(message.createdAt).getTime()).format(
            "h:mm a"
          ),
        });
        $messages.insertAdjacentHTML("beforeend", html);
      })
    );
};

getMessages();
