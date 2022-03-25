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
 - p1 user creation (gc)
 - p1 error handling
 - p1 open chanel set name before creation

p2 highlight user select

p2 github access
p2 update vs create channel button issue
p2 generate open channnel thumbanils
p2 dont load all messages every time
p2 mark as read
p2 update channel list with event when second users create channel
p2 send file on upload
p2 hot reload metnion in slack
p2 show currentl value in update inputs
p2 hide button if cant be clicked
p2 on delete message handler when
p2 check why empty event handlers needed in v4
p2 auto load channel on create
 - p2 cant delete channel
- p2 what should update do for group channel (check main)



