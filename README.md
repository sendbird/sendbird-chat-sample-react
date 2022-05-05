# SendBird Chat SDK React Sample

![React sample](/react-sample.gif?raw=true "react sample")


## Overview
A simple react app that demonstrates how to use the Sendbird [Chat SDK](https://sendbird.com/docs/chat).

## Requirement
A Sendbird [account](https://dashboard.sendbird.com/auth/signup).
Node version >16 is required. Download [here](https://nodejs.org/en/).

## Setup
Replace {YOUR_SENDBIRD_APP_ID} in constants.js with yout Sendbird app ID. 
To get the ID  of your Sendbird application, sign in to your dashboard, select the application, go to the Settings > Application > General, and then check the Application ID.

## Install
run `npm install`

## Running the app

run `npm start`

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Considerations in real world app
 - Typescript types are available from the Sendbird Chat SDK if you are building with TS.
 - Chat is based around user generated input so consider mitigations against XSS attacks.
 - In this sample repo users are connecting to sendbird using a user ID. This is not secure and you will want to connect with an authorization token in a deployed app.
 - Pagination of channel and message lists will be a must have in any real world application.


# Gotchas
 - Hot reload can cause issues with the Sendbird Websocket connection while developing. Work around here https://github.com/facebook/create-react-app/issues/2519#issuecomment-318867289




