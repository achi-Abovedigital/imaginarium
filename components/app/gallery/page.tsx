"use client";
import React, { useState, useEffect } from "react";
import ImageCard from "@/components/ImageCard";

interface DataProps {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
  prompt?: string;
}

interface FetchResponse {
  data: DataProps[];
  totalPages: number;
}

const ImagesPage = () => {
  const [data, setData] = useState<DataProps[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 9; // Number of items per page

  // const fetchPaginatedData = async (
  //   page: number,
  //   limit: number
  // ): Promise<FetchResponse> => {
  //   try {
  //     const response = await fetch(
  //       `http://localhost:8080/paginated-images?page=${page}&limit=${limit}`
  //     );
  //     if (!response.ok) {
  //       throw new Error("Data fetching failed");
  //     }
  //     const result = await response.json();
  //     return {
  //       data: result.data,
  //       totalPages: Math.ceil(result.totalCount / limit),
  //     };
  //   } catch (error) {
  //     console.error("Error:", error);
  //     return { data: [], totalPages: 0 };
  //   }
  // };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `https://abovedigital-1696444393502.ew.r.appspot.com/paginated-images?page=${currentPage}&limit=${limit}`
      );
      if (!response.ok) {
        throw new Error("Server error");
      }
      const { images, totalPages } = await response.json();
      // console.log(images);
      setData(images);
      setTotalPages(totalPages);
    };

    fetchData();
  }, [currentPage, limit]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="flex flex-col p-2">
      <div className="flex max-w-full justify-center items-center flex-wrap min-h-screen">
        {data.map((item) => (
          <ImageCard key={item.id} data={item} />
        ))}
      </div>
      <div className="flex gap-4 items-center justify-center">
        <button
          className={`${
            currentPage === 1
              ? "bg-violet-400 cursor-not-allowed"
              : "bg-violet-700"
          } w-24 text-white text-lg rounded-lg p-2`}
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <h1 className="font-bold text-lg">{currentPage}</h1>
        <button
          className={`w-24 text-white text-lg rounded-lg p-2 ${
            currentPage >= totalPages
              ? "bg-violet-400 cursor-not-allowed"
              : "bg-violet-700"
          }`}
          onClick={handleNextPage}
          // disabled={currentPage >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ImagesPage;
