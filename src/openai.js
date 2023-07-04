//Open Ai
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

//configurations
const openai = new OpenAIApi(configuration);

exports.openAiSummary = async function (prompt) {
  const chatCompletion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });
  return chatCompletion.data.choices[0].message.content;
};
