import * as canvas from 'canvas';

import * as faceapi from 'face-api.js';

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });


const detectionOptions = new faceapi.SsdMobilenetv1Options({minConfidence: 0.5});

const faceDetectionNet = faceapi.nets.ssdMobilenetv1;


export const detectFaces = async photoPath => {
    const image = await canvas.loadImage(photoPath);

    await faceDetectionNet.loadFromDisk('helpers/___weights');

    return await faceapi.detectAllFaces(image, detectionOptions);
};
