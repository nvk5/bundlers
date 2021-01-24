module.exports = {
    plugins: [
        // require('postcss-import'),
        require('autoprefixer')({cascade: false, grid: 'autoplace'}),
        require('postcss-custom-properties')({preserve: true})
    ]
}