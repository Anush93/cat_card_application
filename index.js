let { writeFile } = require('fs');
let { join } = require('path');
let blend = require('@mapbox/blend');
let argv = require('minimist')(process.argv.slice(2));
const axios = require('axios');


let {
    greeting = 'Hello',
    who = 'You',
    width = 400,
    height = 500,
    color = 'Pink',
    size = 100,
} = argv;

const getFirstImage = () => {

    return axios.get('https://cataas.com/cat/says/' + greeting,
        { params: { width: width, height: height, color: color, s: size }, responseEncoding: 'binary' },

    )
};

const getSecondImage = () => {
  
    return axios.get('https://cataas.com/cat/says/' + who,
        { params: { width: width, height: height, color: color, s: size }, responseEncoding: 'binary' },

    )
};


Promise.all([getFirstImage(), getSecondImage()]).then(values => {

    if((width<1)||(height<1)){
        console.log('Width and height must be greater than 0');
       return
    }
    const firstRequestBody = (values[0].data);
    const secondRequestBody = (values[1].data);


    blend([{
        buffer: Buffer.from(firstRequestBody, 'binary'),
        x: 0,
        y: 0,
    }, {


        buffer: Buffer.from(secondRequestBody, 'binary'),
        x: width,
        y: 0,
    }], {
        width: width * 2,
        height: height,
        format: 'jpeg',
    }, (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        const fileOut = join(process.cwd(), `/cat-card.jpg`);
        writeFile(fileOut, data, 'binary', (err) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log("The file was saved!");
        });
    });


}).catch(error => {
    console.log(error)


})