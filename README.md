# SendBird Chat SDK sample for React

## Requirement

Node version >16 is required. Download [here](https://nodejs.org/en/).

## Running the App

In the project directory, 

run `npm install` to install dependencies and then

run `npm start` to run the app in the development mode.

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Create a new sample
Make a copy of your chosen basic channel sample, either BasicOpenChannelSample or BasicGroupChannelSample.
Import the newly created component into App.js.
Update the routes in App.js js to include your newly created component.
`<Route path='/basic-samples/group-channel-feature1' element={<BasicGroupChannelFeature1 />} />`

## Considerations in real world use case
Typescript types are avaiable 
Display thumbnail verion of images. Auto thumbnailing is available with Sendbird premium
Error handling SDK requests
Chat is based around user generated input so consider mitigations against XSS attacks
Users should always pass an access token when connection to group channels 
User creation done through platofrm API or dashboard
Pagination of channel and message lists
Pull in Sendbird from npm


## Todo
p1 user creation
p1 error handling
p1 create name on creation
p1 generate open channnel thumbanils
p2 dont load all messages every time
p2 mark as read
p2 send file on upload
p2 hot reload metnion in slack

