# VoiceBot-Nodejs

This is a Nodejs backend project which is serving static client VoiceBot page by which users can interact verbally (Speech-To-Text) and getting a prompt's response (OpenAPI) from the server side which is then converted to audio response (Text-To-Speech).

Here's a live demo of the project : https://voicebot-adi.onrender.com/

---
## Requirements

For development, you will only need Node.js and a node global package, npm, installed in your environement.
Chrome Browser is preffered.

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

## Install

    $ git clone https://github.com/YOUR_USERNAME/PROJECT_TITLE
    $ cd PROJECT_TITLE
    $ npm install

## Change the template
- fill out the env file with your configurations
- change the socket.io connection point from the clientVoice.js

## Running the project

    $ npm start

## Open on the client side
- #### Open Chrome Browser
- paste link http://localhost/8000 to load the client side page
- look if the connection is successful
- press 'Talk' to give prompt to the backend through speech
- wait for the response to show up
- press 'Restart' to clear the responses
