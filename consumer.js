import amqp from 'amqplib'
async function startWorker() {
    const conn = await amqp.connect('amqp://broker');
    const channel = await conn.createChannel();
    await channel.assertQueue('video_queue');
    channel.prefetch(1);

    console.log("Worker is waiting for videos to compress...");
    channel.consume('video_queue', (msg) => {
        const task = JSON.parse(msg.content.toString());
        console.log(`[Worker] Compressing video ID: ${task.id}...`);
        
        setTimeout(() => {
            console.log(`[Worker] Done with ${task.id}!`);
            channel.ack(msg);
        }, 5000);
    });
}
startWorker();