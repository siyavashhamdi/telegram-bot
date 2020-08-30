import sharp from "sharp";

export const overlayImage = (pathSrcMain, pathSrcOverlay, pathDst, resizeTo) => {
    sharp(pathSrcMain)
        .resize(resizeTo)
        .composite([{ input: pathSrcOverlay, gravity: "southeast" }])
        //.sharpen()
        //.webp({ quality: 90 })
        .toBuffer()
        // .toFile(pathDst, err => {
        //     // opathDstutput.jpg is a 300 pixels wide and 200 pixels high image
        //     // containing a scaled and cropped version of input.jpg
        // });
        .then(outputBuffer => {
            // outputBuffer contains upside down, 300px wide, alpha channel flattened
            // onto orange background, composited with overlay.png with SE gravity,
            // sharpened, with metadata, 90% quality WebP image data. Phew!
            console.log(outputBuffer)
        });
};
