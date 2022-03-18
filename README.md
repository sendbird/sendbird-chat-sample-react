# Sendbird Chat SDK sample for React

This repository provides feature-level Chat samples with React.

## 🚀 Get started

You must use [NodeJS](https://nodejs.org/en/) to build these sample apps. Node version >16 is required.

### Running the App

In the project directory, 

run `npm install` to install dependencies and then

run `npm start` to run the app in the development mode.

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 🏗 Project structure

```bash
.
├── package.json
├── src
│   ├── App.tsx
│   ├── components
│   │   ├── ...
│   │   ├── group-chat
│   │   └── open-chat
│   ├── constants
│   │   └── ...
│   ├── index.tsx
│   ├── reducers
│   │   └── ...
│   ├── samples
│   │   ├── basic-samples
│   │   │   ├── BasicGroupChannelSample.tsx
│   │   │   └── BasicOpenChannelSample.tsx
│   │   └── feature-samples
│   ├── sendbird-actions
│   │   ├── ...
│   │   ├── channel-actions
│   │   └── message-actions
│   ├── styles
│   │   └── ...
│   └── utils
│       └── ...
└── tsconfig.json
```

### Directory descriptions

- **components**: Contains functional components being used in samples.
- **constants**: Contains shared constants and enums.
- **reducers**: Contains reducers, actions, and their definitions.
- **basic-samples**: Contains basic chat samples.
- **feature-samples**: Contains feature chat samples.
- **sendbird-actions**: Contains functions that call sendbird apis.
- **styles**: Contains styles being used in components.
- **utils**: Contains utility functions.

## Project Specifications

- Language: TypeScript
- Data management: React Hook (functional component)
- Data storage: Redux
- Style library: [Emotion](https://emotion.sh/docs/introduction)
