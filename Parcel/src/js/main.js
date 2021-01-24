import 'core-js/modules/es.promise';

window.addEventListener('DOMContentLoaded', function () {
    'use strict';

    const promise = new Promise((resolve, reject) => setTimeout(() => resolve('resolved'), 3000));
    promise.then(res => console.log(res))

});