"use client";
import {
  FaCopy,
  FaInfoCircle,
  FaRegUserCircle,
  FaRegCheckCircle,
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import Image from "next/image";

interface DataProps {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
  prompt?: string;
}

interface ImageCardProps {
  data: DataProps; // Specify that 'data' is an array of 'DataProps' objects
}

const ImageCard = ({ data }: ImageCardProps) => {
  return (
    <div className="flex items-center justify-center p-7">
      <div className="flex flex-wrap gap-1">
        <Toaster />
        <div key={data.id} className="relative">
          {!data.imageUrl ? (
            <p>No image provided</p>
          ) : (
            <Image
              src={data.imageUrl}
              alt={data.name}
              width={450}
              height={300}
              // layout="responsive"
              // placeholder="blur"
              className="h-auto border border-violet-800 rounded-lg"
            />
          )}
          {/* More gradual blur effect */}
          <div className="absolute bottom-0 border-t border-violet-800 left-0 right-0 h-[100px] bg-gradient-to-t from-black/40 via-black/20 to-black/0 backdrop-blur-sm" />
          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-2 p-4">
            {/* <h3 className="text-white text-lg flex items-center gap-2 font-bold">
              <FaRegUserCircle />
              {data.name}
            </h3> */}
            {/* <p className="text-white text-sm">Email: {data.email}</p> */}
            <div className="flex w-full bg-violet-700 p-1 rounded-lg">
              {data.prompt && (
                <div className="flex justify-between w-full items-center px-2">
                  <p className="text-white text-lg font-bold">{data.prompt}</p>
                  <CopyIconWithHoverCard prompt={data.prompt} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface CopyIconWithHoverCardProps {
  prompt: string;
}

const CopyIconWithHoverCard: React.FC<CopyIconWithHoverCardProps> = ({
  prompt,
}) => {
  const [copied, setCopied] = useState(false);
  const [timerId, setTimerId] = useState<number | null>(null);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(prompt).then(() => {
      setCopied(true);
      toast.success(prompt + " Copied in clipboard");
      // Cast the return value of setTimeout to number
      const id = setTimeout(() => {
        setCopied(false);
      }, 4000) as unknown as number;
      setTimerId(id);
    });
  };

  useEffect(() => {
    return () => {
      if (timerId !== null) clearTimeout(timerId);
    };
  }, [timerId]);

  return (
    <div className="relative group inline-block">
      {copied ? (
        <FaRegCheckCircle className="text-xl text-green-500" />
      ) : (
        <FaCopy className="cursor-pointer text-xl" onClick={copyToClipboard} />
      )}
      <div className="absolute z-50 opacity-0 transition-opacity duration-300 ease-in-out bg-white p-3 rounded-lg border-2 border-violet-700 shadow-lg w-48 group-hover:opacity-100 -left-[120px] top-10">
        <div className="flex items-center space-x-2">
          <FaInfoCircle className="text-violet-700" />
          <span>{copied ? "Copied!" : "Copy to clipboard"}</span>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
