import amqp from 'amqplib';
import express from "express";

const app = express();
const RABBIT_URL = 'amqp://broker';

let channel;

async function init() {
    const conn = await amqp.connect(RABBIT_URL);
    channel = await conn.createChannel();
    await channel.assertQueue('video_queue');
    app.listen(80, () => console.log("Server listening on port 80"));
}

async function uploadVideo(req, res) {
    try {
        const videoTask = { id: Math.floor(Math.random() * 1000), name: "user_video.mkv" };
        channel.sendToQueue('video_queue', Buffer.from(JSON.stringify(videoTask)));
        console.log(`[App Server] Sent task ${videoTask.id} to Broker.`);
        res.send(`<h1>YouTube Upload</h1><p>Video ${videoTask.id} is being processed!</p>`);
    } catch (err) {
        res.status(500).send("Broker connection failed");
    }
}

app.get('/', uploadVideo);
init();