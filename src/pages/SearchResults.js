import { useGetPostSearchQuery } from "../redux/api/postApi";
import { useSearchParams } from "react-router-dom";
import { PostListing } from "./Posts";
import Spinner from "../components/Spinner";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const { data, isLoading, isSuccess, isError, error } = useGetPostSearchQuery(
    searchParams.get("q")
  );

  let content = "";

  if (isSuccess) {
    if (data.posts.length > 0)
      content = (
        <>
          <h1>Search Results</h1> <PostListing posts={data.posts} />
        </>
      );
    else
      content = (
        <>
          <h1>Search Results</h1> <p>No post found...</p>
        </>
      );
  } else if (isError) {
    content = <div>{error.toString()}</div>;
  } else if (isLoading) {
    content = <Spinner />;
  }

  return content;
};

export default SearchResults;
