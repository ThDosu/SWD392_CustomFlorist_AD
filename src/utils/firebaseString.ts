import { v4 as uuidv4 } from "uuid";
import { storage } from "./firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const uploadImage = async (file: File): Promise<string> => {
  try {
    const realFile = file.name || file;
    console.log("realFile", realFile);

    const imageRef = ref(storage, `product/flower/${realFile}-${uuidv4()}`);
    const snapshot = await uploadBytes(imageRef, file);
    const url = await getDownloadURL(snapshot.ref);

    console.log("url", url);

    return url;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
};
