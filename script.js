let prompt = document.querySelector("#prompt");
let submitbtn = document.querySelector("#submit");
let chatContainer = document.querySelector(".chat-container");
let imagebtn = document.querySelector("#image");
let image = document.querySelector("#image img");
let imageinput = document.querySelector("#image input");

const Api_Url =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyAbHYLkHpWmHYryEJ_RsQAV04gD2kFm2vU";

// User data for message and optional file
let user = {
  message: null,
  file: {
    mime_type: null,
    data: null,
  },
};

// Function to generate AI response
async function generateResponse(aiChatBox) {
  let text = aiChatBox.querySelector(".ai-chat-area");

  // Check if user message is empty
  // 


  // Create the request body
  let requestBody = {
    contents: [
      {
        parts: [{ text: user.message }],
      },
    ],
  };

  // If an image is uploaded, include the image data
  if (user.file.data) {
    requestBody.contents[0].parts.push({
      inline_data: {
        mime_type: user.file.mime_type,
        data: user.file.data,
      },
    });
  }

  let requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  };

  try {
    let response = await fetch(Api_Url, requestOptions);
    let data = await response.json();

    // Check if `data.candidates` exists and if there is any content
    if (data && data.candidates && data.candidates.length > 0) {
      let apiResponse = data.candidates[0].content.parts[0].text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .trim();
      text.innerHTML = apiResponse;
    } else {
      text.innerHTML = "No response received from AI.";
    }
  } catch (error) {
    console.log(error);
    text.innerHTML = "Error in fetching response.";
  } finally {
    chatContainer.scrollTo({
      top: chatContainer.scrollHeight,
      behavior: "smooth",
    });
    image.src = `img.svg`;
    image.classList.remove("choose");

    // Reset the user file data properly
    user.file = {
      mime_type: null,
      data: null,
    };
  }
}

// Function to create chat box
function createChatBox(html, classes) {
  let div = document.createElement("div");
  div.innerHTML = html;
  div.classList.add(classes);
  return div;
}

// Function to handle user message
function handlechatResponse(userMessage) {
  user.message = userMessage;
  let html = `<img src="user.png" alt="" id="userImage" width="8%">
<div class="user-chat-area">
${user.message}
${
  user.file.data
    ? `<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg" />`
    : ""

}
</div>`;
  prompt.value = "";
  let userChatBox = createChatBox(html, "user-chat-box");
  chatContainer.appendChild(userChatBox);

  chatContainer.scrollTo({
    top: chatContainer.scrollHeight,
    behavior: "smooth",
  });

  setTimeout(() => {
    let html = `<img src="ai.png" alt="" id="aiImage" width="10%">
    <div class="ai-chat-area">
    <img src="loading.webp" alt="Loading..." class="load" width="50px">
    </div>`;
    let aiChatBox = createChatBox(html, "ai-chat-box");
    chatContainer.appendChild(aiChatBox);
    generateResponse(aiChatBox);
  }, 600);
}

// Event listener for Enter key press
prompt.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    handlechatResponse(prompt.value);
  }
});

// Event listener for Submit button click
submitbtn.addEventListener("click", () => {
  handlechatResponse(prompt.value);
});

// Handle image input change
imageinput.addEventListener("change", () => {
  const file = imageinput.files[0];
  if (!file) return;

  let reader = new FileReader();
  reader.onload = (e) => {
    let base64string = e.target.result.split(",")[1];
    user.file = {
      mime_type: file.type,
      data: base64string,
    };
    image.src = `data:${user.file.mime_type};base64,${user.file.data}`;
    image.classList.add("choose");
  };
  reader.readAsDataURL(file);
});

// Event listener for image button click
imagebtn.addEventListener("click", () => {
  imagebtn.querySelector("input").click();
});
// Get the toggle button
const toggleButton = document.getElementById('toggleButton');

// Event listener for toggle button
toggleButton.addEventListener('click', () => {
    // Toggle classes for dark and light mode
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
    
    // Update button text based on current mode
    if (document.body.classList.contains('dark-mode')) {
        toggleButton.textContent = 'Switch to Light Mode'; // Update text for dark mode
    } else {
        toggleButton.textContent = 'Switch to Dark Mode'; // Update text for light mode
    }
});

// Optional: Set initial mode based on user preference or localStorage
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    toggleButton.textContent = 'Switch to Light Mode';
} else {
    document.body.classList.add('light-mode');
    toggleButton.textContent = 'Switch to Dark Mode';
}

// Save the theme in localStorage when it is changed
toggleButton.addEventListener('click', () => {
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});
