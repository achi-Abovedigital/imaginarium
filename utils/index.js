import { db } from "@/app/firebaseConfig";
import { getDocs, collection, onSnapshot } from "firebase/firestore";

// interface User {
//   prompt: string;
//   imageUrl: unknown;
//   id: string;
//   name: string;
//   email: string;
// }

export async function sendAudioToServer(audioBlob, onTranscription) {
  const formData = new FormData();
  formData.append("audioFile", audioBlob, "recording.webm");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/transcribe-audio`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(
        "Server responded with an error while sending audio file!"
      );
    }

    const data = await response.json();
    // Call the callback with both transcriptions
    onTranscription(data.transcription, data.originalTranscription);
  } catch (error) {
    console.error("Error sending audio to the server:", error);
  }
}

export async function fetchDataFromFirestore() {
  const querySnapshot = await getDocs(collection(db, "users"));

  const data = [];
  querySnapshot.forEach((doc) => {
    const docData = doc.data();
    // Assuming 'id' is a field in docData, exclude it
    const { id, ...otherData } = docData;
    data.push({ id: doc.id, ...otherData });
  });

  return data;
}

export async function fetchPaginatedImages(page, limit = 10) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/paginated-images?page=${page}&limit=${limit}`
  );
  const data = await response.json();
  return data;
}

export function setupRealtimeUpdates(db, updateFunction) {
  const unsubscribe = onSnapshot(collection(db, "users"), (querySnapshot) => {
    const images = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Extract the image URL field
      if (data.imageUrl) {
        images.push({
          id: doc.id,
          imageUrl: data.imageUrl,
          ...data,
        });
      }
    });
    updateFunction(images); // Pass the images array to the update function
  });

  return unsubscribe;
}
