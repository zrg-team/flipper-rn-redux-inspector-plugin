## About
  A flipper plugin supported inspect **redux** state and action logs for **react-native**
## Installation
### 1. install flipper redux middleware to your application

```npm install rn-redux-middleware-flipper react-native-flipper```

Make sure **react-native-flipper** is installed properly if not using autolinking.

### 2. Setup redux middleware
Register the redux middware and connect to flipper. **rn-redux-middleware-flipper**

```javascript
if (__DEV__) { // eslint-disable-line
  const createFlipperMiddleware = require('rn-redux-middleware-flipper').default
  middlewares.push(createFlipperMiddleware())
}
```

### 3. Flipper desktop app
Manage Plugins -> Install Plugins -> Search for ```flipper-plugin-rn-redux-inspector```

## Example

+ [Spiderum application]([https://github.com/zrg-team/rn_spiderum)
