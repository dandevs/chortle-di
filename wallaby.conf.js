module.exports = (wallaby) => ({
    files: ["src/**/*.ts"],
    tests: ["tests/**/*.test.ts"],

    testFramework: "jest",

    env: {
        type: "node",
        runner: "node"
    },

    compilers: {
        "**/*.ts": wallaby.compilers.typeScript({
            typescript: require("typescript")
        })
    }
})