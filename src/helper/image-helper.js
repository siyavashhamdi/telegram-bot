import sharp from "sharp";

const overlayImageInfo = {
    father: "./img/father.png",
    mother: "./img/mother.png",
    parents: "./img/parents.png",
    adopted: "./img/adopted.png",
};

const getImageMetadata = async imgStreamOrPath => {
    const metaReader = await sharp(imgStreamOrPath).metadata()

    return metaReader;
}

export const overlayImage = async (imgStreamMain, imgOverlayKey, callback) => {
    const selectdOverlayPath = overlayImageInfo[imgOverlayKey];

    const imgMainMetadata = await getImageMetadata(imgStreamMain);
    const imgOverlayMetadata = await getImageMetadata(selectdOverlayPath);

    let imgMainSharp = sharp(imgStreamMain);

    if (true) {
        imgMainSharp = imgMainSharp.resize(imgOverlayMetadata.width, imgOverlayMetadata.height);
    }

    imgMainSharp
        .composite([{ input: overlayImageInfo[imgOverlayKey], gravity: "southeast" }])
        .toBuffer()
        .then(outputBuffer => {
            if (callback)
                callback(outputBuffer);
        });
};
