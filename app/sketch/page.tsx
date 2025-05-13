"use client";
import React, { useRef, useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

const page = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [controlStrength, setControlStrength] = useState(0.8);
  const [outputFormat, setOutputFormat] = useState("webp");
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      setIsDrawing(true);
    }
  };

  const stopDrawing = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      ctx.closePath();
    }
    setIsDrawing(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.strokeStyle = "black";

      ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      ctx.stroke();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    setResultImage(null);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/png")
    );
    if (!blob) {
      console.error("Failed to create blob from canvas");
      return;
    }

    const formData = new FormData();
    formData.append("image", blob, "sketch.png");
    // formData.append("prompt", prompt);
    formData.append("controlStrength", controlStrength.toString());
    formData.append("outputFormat", outputFormat);

    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/sketch/sketch-gpt`,
        // "http://localhost:8080/v1/sketch/sketch-gpt",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setResultImage(imageUrl);
      } else {
        const errorText = await response.text();
        console.error("Error:", errorText);
        toast.error("Failed to generate image. Check console for details.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to send request. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  return (
    <div className="w-full min-h-screen mx-auto px-4 py-8">
      <Toaster />
      <div className="flex w-full justify-center items-center flex-col">
        <h1 className="text-3xl font-bold mb-6 text-center">Sketch to Image</h1>
        <h2 className="text-xl pb-3">Start drawing on blank space below</h2>
      </div>
      <div className="flex flex-col items-center">
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          className="border border-gray-300 mb-6"
        />
        <button
          type="button"
          onClick={() => {
            clearCanvas();
            setResultImage(null);
          }}
          disabled={isLoading}
          className={`${
            isLoading ? "bg-violet-400" : "bg-violet-700 hover:bg-violet-900 "
          } mb-4 text-white w-40 h-10 rounded-md text-lg`}
        >
          Clear Canvas
        </button>
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md flex items justify-center flex-col"
        >
          {/* <div className="mb-4">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter prompt"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div> */}
          {/* <div className="mb-4">
            <input
              type="number"
              value={controlStrength}
              onChange={(e) => setControlStrength(parseFloat(e.target.value))}
              step="0.1"
              min="0"
              max="1"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <select
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="webp">WebP</option>
              <option value="png">PNG</option>
              <option value="jpeg">JPEG</option>
            </select>
          </div> */}
          <button
            disabled={isLoading}
            type="submit"
            className={`w-full ${
              isLoading ? "bg-blue-300" : "bg-blue-500"
            }  text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
          >
            {isLoading ? "Please Wait..." : "Generate Image"}
          </button>
        </form>
        {resultImage && (
          <div className="mt-6">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Generated Image
            </h2>
            <img
              src={resultImage}
              alt="Generated image"
              className="max-w-full h-auto"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
