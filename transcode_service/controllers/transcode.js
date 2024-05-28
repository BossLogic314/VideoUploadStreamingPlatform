export let transcode = (async (req, res) => {

    const videoUrl = req.body.videoUrl;
    console.log(videoUrl);
    res.status(200).json({message: "Everything good!"});
});