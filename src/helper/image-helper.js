import sharp from "sharp";

const overlayImageInfo = {
    father: "./img/father.png"
};

const getImageMetadata = async imgStreamOrPath => {
    const metaReader = await sharp(imgStreamOrPath).metadata()

    return metaReader;
}

export const overlayImage = async (imgStreamMain, imgOverlayKey, callback) => {
    const selectdOverlayPath = overlayImageInfo[imgOverlayKey];

    const imgMainMetadata = await getImageMetadata(imgStreamMain);
    const imgOverlayMetadata = await getImageMetadata(selectdOverlayPath);

    let imgSharp = sharp(imgStreamMain);

    if (true) {
        imgSharp = imgSharp.resize(imgOverlayMetadata.width, imgOverlayMetadata.height);
    }

    imgSharp
        .composite([{ input: overlayImageInfo[imgOverlayKey], gravity: "southeast" }])
        .toBuffer()
        .then(outputBuffer => {
            if (callback)
                callback(outputBuffer);
        });
};
