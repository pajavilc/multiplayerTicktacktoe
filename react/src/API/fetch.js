import axios from "axios";

const api = axios.create();

function LoginAPI(username, password) {
  const data = JSON.stringify({
    username: username,
    password: password,
  });
  return api.post("/user/login", data, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  })
    .then((response) => {
      return response.data;
    });
}

function RegisterAPI(username, password, mail) {
  console.log(process.env.REACT_APP_BACKEND_ADDRESS);
  const data = JSON.stringify({
    username: username,
    password: password,
    mail: mail,
  });

  return api.post("/user/register", data, {
    headers: {
      "Content-Type": "application/json",
      "Content-Length": data.length,
    },
    withCredentials: false,
  })
    .then((response) => {
      return response.data;
    });
}

function RequestTokenAPI() {
  return api.post(
    "/user/token",
    {},
    {
      withCredentials: true,
    }
  )
    .then((response) => {
      localStorage.setItem("accessToken", response.data.accessToken);
    })
    .catch((err) => alert(err));
}
function Relogin() {
  return api.post(
    "/user/token",
    {},
    {
      withCredentials: true,
    }
  ).then((response) => {
    return response.data
  });
}

function LogoutUserAPI() {
  const token = localStorage.getItem("accessToken");

  return api.delete("/user/logout", {
    headers: {
      authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
}

function GetAvailableGames() {
  return api.get(
    "/game/games",
    {},
    {
      withCredentials: false,
    }
  )
    .then((response) => response.data);
}
function GetUserStats() {
  const token = localStorage.getItem("accessToken");
  return api.post("/stats", {},
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
      withCredentials: false,
    }).then(response => response.data)
}

export function aPITest() {
  api.get("/").then((data) => {
    console.log(data);
    return data;
  });
}
export {
  Relogin,
  LoginAPI,
  RegisterAPI,
  RequestTokenAPI,
  GetUserStats,
  LogoutUserAPI,
  GetAvailableGames as GetAvailableGamesAPI,
};
