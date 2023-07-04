//openai
const voiceGPT = require("./openai");

//Setting up socket
const socketSetup = function () {
  io.on("connection", function (client) {
    //send a connection initialisation
    client.emit("connected", { connected: true });
    console.log("Client connected ", client.id);

    //Responding to Request from the client
    client.on("request", async function (prompt) {
      try {
        const summary = await voiceGPT.openAiSummary(prompt);
        client.emit("summary-response", summary);
      } catch (err) {
        client.emit("summary-response", "an error occured");
      }
    });

    //Responding to any error from the socket part
    client.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });

    //Responding to when user disconnects from the connection
    client.on("disconnect", function () {
      console.log("User Disconnected ", client.id);
    });
  });
};

exports.socketSetup = socketSetup;
