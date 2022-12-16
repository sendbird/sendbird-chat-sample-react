# SendBird Chat SDK React Sample

![React sample](/react-sample.gif?raw=true "react sample")


## Overview
A simple react app that demonstrates how to use the Sendbird [Chat SDK](https://sendbird.com/docs/chat).

## Requirement
A Sendbird [account](https://dashboard.sendbird.com/auth/signup).
Node version >16 is required. Download [here](https://nodejs.org/en/).

## 🔒 Security tip
When a new Sendbird application is created in the dashboard the default security settings are set permissive to simplify running samples and implementing your first code.

Before launching make sure to review the security tab under ⚙️ Settings -> Security, and set Access token permission to Read Only or Disabled so that unauthenticated users can not login as someone else. And review the Access Control lists. Most apps will want to disable "Allow retrieving user list" as that could expose usage numbers and other information.


## Setup
Replace {YOUR_SENDBIRD_APP_ID} in constants.js with yout Sendbird app ID. 
To get the ID  of your Sendbird application, sign in to your dashboard, select the application, go to the Settings > Application > General, and then check the Application ID.

## Install
run `npm install`

## Running the app

run `npm start`

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Considerations in real world app
 - In this sample repo users are connecting to sendbird using a user ID (Sendbird Dashboard --> Security --> Read & Write). Read & Write is not secure and will create a new user automatically from the SDK if none exists. In production be sure to change the Sendbird Dashboard security settings to Deny login, and [authenticate users](https://sendbird.com/docs/chat/v3/javascript/guides/authentication#2-connect-to-sendbird-server-with-a-user-id-and-a-token) with a Sendbird generated Session Token.
 - Typescript types are available from the Sendbird Chat SDK if you are building with TS.
 - Chat is based around user generated input so consider mitigations against XSS attacks.
 - Pagination of channel and message lists will be a must have in any real world application.



# Gotchas
 - Hot reload can cause issues with the Sendbird Websocket connection while developing. Work around here https://github.com/facebook/create-react-app/issues/2519#issuecomment-318867289




