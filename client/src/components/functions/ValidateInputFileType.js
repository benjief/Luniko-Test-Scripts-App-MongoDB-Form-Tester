/**
 * The functions below were adapted from https://stackoverflow.com/questions/18299806/how-to-check-file-mime-type-with-javascript-before-upload.
 * Currently, these are only used to validate image files, but more file header checks can be added:
 * https://en.wikipedia.org/wiki/List_of_file_signatures
 * https://mimesniff.spec.whatwg.org/#matching-an-image-type-pattern
 */
const validateInputFileType = async (file, acceptedFileTypes) => {
    checkBrowserFileSupport();
    console.log("checking file type");
    return await checkFileType(file, acceptedFileTypes);
}

const checkBrowserFileSupport = () => {
    return (window.FileReader && window.Blob);
}

const checkFileType = async (uploadedFile, acceptedFileTypes) => {
    var blob = uploadedFile;
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onloadend = async (event) => {
            try {
                let arr = (new Uint8Array(event.target.result)).subarray(0, 4);
                let header = "";
                for (let i = 0; i < arr.length; i++) {
                    header += arr[i].toString(16);
                }
                var fileType = await getFileTypeFromHeader(header);
                var generalFileType = fileType.split("/").shift() + "/*";
                resolve(acceptedFileTypes.includes(fileType) || acceptedFileTypes.includes(generalFileType));
            } catch (e) {
                console.log(e);
                reject(e);
            }
        }
        fileReader.onerror = (e) => {
            reject(e);
        }
        fileReader.readAsArrayBuffer(blob);
    });
}

const getFileTypeFromHeader = (header) => {
    switch (header) {
        case "89504e47":
            return "image/png";
        case "47494638":
            return "image/gif";
        case "ffd8ffe0":
        case "ffd8ffe1":
        case "ffd8ffe2":
        case "ffd8ffe3":
        case "ffd8ffe8":
            return "image/jpeg";
        default:
            return "unknown";
    }
}

export { validateInputFileType };