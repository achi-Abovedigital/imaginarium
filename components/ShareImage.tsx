import React from "react";

interface ShareButtonProps {
  imageUrl: string;
}

const ShareImage = ({ imageUrl }: ShareButtonProps) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this image!",
          text: "Found this awesome image, have a look.",
          url: imageUrl,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      alert("Your browser does not support the share feature.");
    }
  };

  return (
    <button
      className="bg-violet-700 rounded-md p-1 text-xl"
      onClick={handleShare}
    >
      Share Image
    </button>
  );
};

export default ShareImage;
