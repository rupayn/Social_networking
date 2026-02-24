import { useGetUserQuery } from "../../redux/features/api/userApi.sclice";

type ApiError = {
  success: boolean;
  message: string;
};

function Home() {
  const { data, error, isLoading, isError } = useGetUserQuery();

  if (isLoading) return <div>Loading...</div>;
  if (isError && error && "data" in error) {
    const apiError = error.data as ApiError;

    return <div>Error: {apiError.message}</div>;
  }

  return (
    <div>
      <h2>Home</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default Home;
