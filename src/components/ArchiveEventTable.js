import { Center, Spinner } from "@chakra-ui/react";
import { useGetArchivedEventsQuery } from "../redux/api/eventApi";
import EventTable from "./EventTable";

const ArchiveEventTable = () => {
  const { data, isLoading, isSuccess, isError, error } =
    useGetArchivedEventsQuery();

  if (isSuccess) {
    return <EventTable data={data} />;
  } else if (isLoading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  } else if (isError) {
    return <div>{error.toString()}</div>;
  }
};

export default ArchiveEventTable;
