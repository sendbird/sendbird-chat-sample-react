# SendBird Chat SDK sample for React

This repository provides feature-level Chat samples with React.

## 🚀 Get started

You must use [NodeJS](https://nodejs.org/en/) to build these sample apps. Node version >16 is required. Please download [here](https://nodejs.org/en/).

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

## Feature Samples

### Naming Convention

- GroupChannelFeatureASample.tsx, GroupChannelFeatureBSample.tsx, ..., GroupChannelFeatureNSample.tsx.
- OpenChannelFeatureASample.tsx, OpenChannelFeatureBSample.tsx, ..., OpenChannelFeatureNSample.tsx.

### Creating a new feature sample

You can copy BasicGroupChannelSample.tsx or BasicOpenChannelSample.tsx file and rename it to use most of the basic features that is required for the feature sample. And then add to **App.tsx** a new route.

```
<Route path='/feature-samples' element={<GroupChannelFeatureASample/>} />
```

When working on a feature sample, you may find yourself needing to either:

- **Option 1**: Create a new component with [composition](https://reactjs.org/docs/composition-vs-inheritance.html).
- **Option 2**: Add optional props and functions to an existing component.
- **Option 3**: Copy an existing component to create a new component with new features.

Generally, **option 1 is highly recommended** because it uses the existing code. If existing components is not implemented in a way to make composition possible, feel free to edit them to make composition possible.

Depending on cases, if you think option 2 or 3 is a better option, you can think of them as exceptional cases and therefore feel free to go with these options as needed.

## Project Specifications

- Language used: TypeScript
- Data management: React Hook (functional component)
- Data storage: Redux
- Style library: [Emotion](https://emotion.sh/docs/introduction)
