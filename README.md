# SendBird Chat SDK sample for React

## Requirement

Node version >16 is required. Download [here](https://nodejs.org/en/).

## Running the App

Create a Sendbird applicationa nd a senbird user within that application.

update /src/constants.js to include your own Sendbird app ID.

In the project directory, 

run `npm install` to install dependencies and then

run `npm start` to run the app in the development mode.

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Create a new sample
1. Make a copy of your chosen basic channel sample, either BasicOpenChannelSample or BasicGroupChannelSample.
2. Update the routes in App.js js to include your newly created component.
`<Route path='/group-channel-feature-one' element={<GroupChannelFeatureOne />} />`
3. Update Home.js component link list with`<li><Link to="/group-channel-feature1">Group Channel Feature One</Link></li>`

## Considerations in real world app
 - Typescript types are avaiable if you are building your app in that language.
 - Chat is based around user generated input so consider mitigations against XSS attacks
 - Users should always pass an access token when connection to group channels 
 - User creation done through platofrm API or dashboard
 - Pagination of channel and message lists
 - Sendbird should be installed via npm


# Gotchas
 - Hot reload can cause issues with the Sendbird Websocket connection while developing. Work around here https://github.com/facebook/create-react-app/issues/2519#issuecomment-318867289




