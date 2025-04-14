import { useEffect, useState } from "react";
import axios from "axios";
import BlockCard from "../components/BlockCard";
import PaginationControls from "../components/PaginationControls";
import SearchFilter from "../components/SearchFilter";

const BlockListPage = () => {
  const [blocks, setBlocks] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    axios.get(`/api/blocks?page=${page}`).then((res) => {
      setBlocks(res.data.blocks);
    });
  }, [page]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Block List</h1>
      <SearchFilter setBlocks={setBlocks} />
      <div className="grid gap-4">
        {blocks.map((block: any) => (
          <BlockCard key={block.id} block={block} />
        ))}
      </div>
      <PaginationControls page={page} setPage={setPage} />
    </div>
  );
};

export default BlockListPage;