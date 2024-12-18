import fs from "fs";
import path from "path";
import { Model, KaldiRecognizer } from "vosk";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";

ffmpeg.setFfmpegPath(ffmpegPath);

const MODEL_PATH = path.join(__dirname, 'models', 'vosk-model-small-en-us-0.15');
const SAMPLE_RATE = 16000;

const model = new Model(MODEL_PATH);

async function transcribeAudio(filePath) {
    return new Promise((resolve, reject) => {
        const recognizer = new KaldiRecognizer(model, SAMPLE_RATE);
        const process = ffmpeg(filePath)
            .audioCodec('pcm_s16le')
            .audioChannels(1)
            .audioFrequency(SAMPLE_RATE)
            .format('wav')
            .on('end', () => {
                const result = recognizer.FinalResult();
                resolve(result.text);
            })
            .on('error', (err) => {
                reject(err);
            });

        process.pipe(recognizer);
    });
}

module.exports = { transcribeAudio };
