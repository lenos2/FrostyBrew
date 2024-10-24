import { openEditor } from "react-profile";

export const imageFormatter = async (event) => {
    const result = await openEditor({ src: e.target.files[0] });

    var dataURL = result.editedImage.getDataURL();
    let img = {
        name: e.target.files[0].name,
        type: e.target.files[0].type,
        img: dataURL.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
    };
}