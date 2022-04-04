export default async (app, inject) => {
  let socketInstance = null;

  inject("setSocketInstance", (socket) => {
    socketInstance = socket;
  });

  inject("getSocketInstance", () => {
    return socketInstance;
  });
};
