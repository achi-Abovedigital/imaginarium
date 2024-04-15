"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../firebaseConfig";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

const Page = () => {
  const [imageUrls, setImageUrls] = useState([]);
  console.log(imageUrls);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [lightboxActive, setLightboxActive] = useState(false);

  let cycleImagesTimer: any = null;

  // firebase fetch new images
  const fetchNewestImages = async () => {
    const imagesRef = collection(db, "images"); // 'images' is your collection name
    const q = query(imagesRef, orderBy("createdAt", "desc"), limit(14));

    const querySnapshot = await getDocs(q);
    const images: any = [];
    querySnapshot.forEach((doc) => {
      images.push(doc.data().imageUrl); // Extracting the 'imageUrl'
    });

    return images;
  };

  // fetch in every 10 seconds from firestore database
  useEffect(() => {
    const fetchAndSetImages = async () => {
      const fetchedImages = await fetchNewestImages();
      setImageUrls((currentImages: any) => {
        // Check if there are new images
        const newImages = fetchedImages.filter(
          (img: any) => !currentImages.includes(img)
        );

        if (newImages.length > 0) {
          // If there are new images, add them to the beginning of the array
          // and remove the oldest images to maintain a length of 14
          return [...newImages, ...currentImages].slice(0, 14);
        }

        // If no new images, just return the current images
        return currentImages;
      });
    };

    // Initial fetch
    fetchAndSetImages();
    // fetch qr
    fetchQrCode();

    // Set up polling
    const intervalId = setInterval(fetchAndSetImages, 10000); // Poll every 10 seconds

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // UseEffect to close lightbox when new images are added
  useEffect(() => {
    if (imageUrls.some((url) => url !== null)) {
      closeLightbox();
    }
  }, [imageUrls]);

  // fetch qr code
  const fetchQrCode = async () => {
    try {
      const response = await fetch(
        "https://abovedigital-1696444393502.ew.r.appspot.com/qr"
      );
      if (!response.ok) throw new Error("Error fetching QR code");
      const qrCodeHtml = await response.text();
      setQrCode(qrCodeHtml);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Function to cycle through images
  const cycleImages = () => {
    const nonNullImages = imageUrls.filter((url) => url !== null);
    if (nonNullImages.length > 1) {
      // Ensure there is more than one image to cycle through
      let nextIndex = (selectedImageIndex ?? 0) + 1;
      nextIndex = nextIndex % nonNullImages.length; // Wrap around if it reaches the end
      setSelectedImageIndex(nextIndex);
    }
  };

  useEffect(() => {
    // Function to start lightbox cycle
    const startLightboxCycle = () => {
      if (imageUrls.some((url) => url !== null)) {
        setLightboxActive(true);
        setSelectedImageIndex(0); // Start from the first image
      }
    };

    if (lightboxActive) {
      console.log("Starting image cycling");
      cycleImagesTimer = setInterval(cycleImages, 5000);
    } else {
      // Start the lightbox cycle after 10 seconds of inactivity
      const timer = setTimeout(startLightboxCycle, 10000);
      return () => {
        console.log("Clearing timer for starting lightbox cycle");
        clearTimeout(timer);
      };
    }

    return () => {
      if (cycleImagesTimer) {
        console.log("Clearing cycle images timer");
        clearInterval(cycleImagesTimer);
      }
    };
  }, [lightboxActive, imageUrls, selectedImageIndex]); // Include selectedImageIndex in dependencies

  // Animation variants for Framer Motion
  const backdropVariant = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const imageVariant = {
    hidden: { scale: 0 },
    visible: { scale: 1 },
  };

  const selectedImage =
    selectedImageIndex !== null ? imageUrls[selectedImageIndex] : null;

  const closeLightbox = () => {
    console.log("Closing lightbox");
    setLightboxActive(false);
    if (cycleImagesTimer) {
      clearInterval(cycleImagesTimer);
      cycleImagesTimer = null;
    }
  };

  return (
    <div className="relative grid grid-cols-3 grid-rows-5 h-screen">
      {imageUrls.slice(0, 7).map((url, index) => (
        <div key={index} className="col-span-1 row-span-1">
          <img
            src={url}
            alt={`Generated Image ${index}`}
            className="object-cover w-full h-full"
          />
        </div>
      ))}
      {/* qr code in middle */}
      <div key="qr" className="col-span-1 row-span-1">
        <div dangerouslySetInnerHTML={{ __html: qrCode || "" }} />
      </div>
      {/* Render images after the QR code */}
      {imageUrls.slice(7).map((url, index) => (
        <div key={index + 8} className="col-span-1 row-span-1">
          {" "}
          {/* Start keys at index + 8 */}
          <img
            src={url}
            alt={`Generated Image ${index + 8}`}
            className="object-cover w-full h-full"
          />
        </div>
      ))}
      {/* {imageUrls.map((url, index) => (
        <img
          src={url}
          alt={`Generated Image ${index}`}
          className="object-cover w-full h-full cursor-pointer"
        />
      ))} */}

      <AnimatePresence>
        {lightboxActive && selectedImage && (
          <>
            <motion.div
              className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50"
              variants={backdropVariant}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <motion.img
                src={selectedImage}
                alt="Enlarged Image"
                className="w-[800px] rounded-xl"
                variants={imageVariant}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Page;
