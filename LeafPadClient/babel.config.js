module.exports = (api) => {
  api.cache(true)
  return {
    "env": {
      "development": {
        "plugins": [
          ["module-resolver", {
            "root": ["./src"],
            "alias": {
              "test": "./test",
              "underscore": "lodash"
            }
          }]
        ]
      }
    },
    presets: ['babel-preset-expo']
  }
}