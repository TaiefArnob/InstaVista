import React, { useRef, useEffect } from "react";
import Post from "./Post";
import { useSelector } from "react-redux";

const Posts = () => {
  const { posts } = useSelector((store) => store.post);
  const firstPostRef = useRef(null);

  useEffect(() => {
    if (firstPostRef.current) {
      firstPostRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [posts.length]);

  return (
    <div>
      {posts.map((post, index) => (
        <div key={post._id} ref={index === 0 ? firstPostRef : null}>
          <Post post={post} />
        </div>
      ))}
    </div>
  );
};

export default Posts;
