import extLocalStorage from "../utils/ext.local.storage";
import AbstractParser from "../parser/AbstractParser";
import ParserFactory from "../parser/ParserFactory";
import Elements from "../cytoscape/Elements";
import AppStorage from "../AppStorage";
import InputSource from "./InputSource";

class DataManager {
    getUsedInputSource(): InputSource {
        if (extLocalStorage.isPresent(AppStorage.DATA_TEXT)) {
            return InputSource.PLAIN_TEXT
        } else if (extLocalStorage.isPresent(AppStorage.DATA_FILE)) {
            return InputSource.FILE;
        } else {
            return InputSource.NOTHING;
        }
    }

    getElements(): Promise<Elements> {
        let inputSource = this.getUsedInputSource();
        if (inputSource === InputSource.PLAIN_TEXT) {
            return this.getTextDataElements();
        } else if (inputSource === InputSource.FILE) {
            return this.getFileElements();
        } else if (inputSource === InputSource.NOTHING) {
            return new Promise((resolve, reject) => {
                resolve(new Elements());
            });
        } else {
            throw new Error("Unknown input source will be used");
        }
    }

    getTextDataElements(): Promise<Elements> {
        return new Promise((resolve, reject) => {
            let content = extLocalStorage.getItem(AppStorage.DATA_TEXT);
            let parser: AbstractParser = new ParserFactory().create(content);
            resolve(parser.parse(content));
        });
    }

    getFileElements(): Promise<Elements> {
        return new Promise((resolve, reject) => {
            let file = extLocalStorage.getFile(AppStorage.DATA_FILE);
            let reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result);
            }
            reader.onerror = reject;
            reader.readAsBinaryString(file);
        }).then((content) => {
            let parser: AbstractParser = new ParserFactory().create(content);
            return parser.parse(content);
        });
    }
}

export default DataManager;