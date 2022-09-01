/**
 * The functions below were adapted from https://stackoverflow.com/questions/18299806/how-to-check-file-mime-type-with-javascript-before-upload.
 * Currently, these are only used to validate image files, but more file header checks can be added:
 * https://en.wikipedia.org/wiki/List_of_file_signatures
 * https://mimesniff.spec.whatwg.org/#matching-an-image-type-pattern
 */
const validateInputFileType = async (file, acceptedFileTypes, acceptedFileExtensions) => {
    checkBrowserFileSupport();
    console.log("checking file type");
    return await checkFileType(file, acceptedFileTypes, acceptedFileExtensions);
}

/**
 * Determines whether or not the user's browser supports file attachments.
 * @returns true if the user's browswer supports file attachments, false if not.
 */
const checkBrowserFileSupport = () => {
    return (window.FileReader && window.Blob);
}

/**
 * Determines whether or not a file the user is attempting to attach is of a valid (specified) type.
 * @param {file} uploadedFile - the file in question.
 * @param {array} acceptedFileTypes - accepted general file types (e.g. ["image/*"])
 * @param {array} acceptedFileExtensions - accepted file extensions (e.g. ["image/png"])
 * @returns true if the file is of a valid type, false otherwise.
 */
const checkFileType = async (uploadedFile, acceptedFileTypes, acceptedFileExtensions) => {
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
                // console.log(generalFileType);
                // console.log(fileType);
                resolve(acceptedFileExtensions.includes(fileType) || acceptedFileTypes.includes(generalFileType));
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

/**
 * Returns a string specifying the file type/extension using information from the file header. 
 * @param {string} header - the file in question's header.
 * @returns a string containing the file type/extension (e.g. "image/png") if it matches any of the cases below; unknown if it doesn't.
 */
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
