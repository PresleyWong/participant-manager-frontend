import { useRef, useState, useEffect } from "react";
import {
  Input,
  InputGroup,
  InputLeftElement,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  chakra,
  Spinner,
  VStack,
  Center,
  Select,
  Textarea,
} from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon, SearchIcon } from "@chakra-ui/icons";
import { MdHowToReg } from "react-icons/md";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  createColumnHelper,
} from "@tanstack/react-table";

import { useGetParticipantSearchQuery } from "../redux/api/participantApi";
import { useAddParticipantToEventMutation } from "../redux/api/eventApi";
import ConfirmButton from "./ConfirmButton";
import { AddParticipantButton } from "../pages/Participants";

const SearchTable = ({
  data,
  eventId,
  eventParticipants,
  eventParticipantsWithAppointments,
}) => {
  const columnHelper = createColumnHelper();
  const [sorting, setSorting] = useState([]);
  const columns = [
    columnHelper.accessor("id", {
      cell: (info) => info.getValue(),
      header: "ID",
    }),
    columnHelper.accessor("gender", {
      cell: (info) => info.getValue(),
      header: "Gender",
    }),
    columnHelper.accessor("english_name", {
      cell: (info) => info.getValue(),
      header: "English Name",
    }),
    columnHelper.accessor("chinese_name", {
      cell: (info) => info.getValue(),
      header: "Chinese Name",
    }),
    columnHelper.accessor("name", {
      cell: (info) => info.getValue(),
      header: "Name",
    }),
    columnHelper.accessor("email", {
      cell: (info) => info.getValue(),
      header: "Email",
    }),
    columnHelper.accessor("phone", {
      cell: (info) => info.getValue(),
      header: "Phone",
    }),
    columnHelper.accessor("", {
      header: "Language",
    }),
    columnHelper.accessor("college", {
      cell: (info) => info.getValue(),
      header: "College",
    }),
    columnHelper.accessor("academic_year", {
      cell: (info) => info.getValue(),
      header: "Academic Year",
    }),
    columnHelper.accessor("", {
      header: "Remarks",
    }),
    columnHelper.accessor("", {
      header: "Actions",
    }),
  ];

  const languageOptions = ["English", "Chinese", "Bahasa Malaysia"];
  const languageRef = useRef([]);
  const remarksRef = useRef([]);

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    initialState: {
      columnVisibility: {
        id: false,
        gender: false,
        english_name: false,
        chinese_name: false,
      },
    },
  });

  const [addParticipant, addResponse] = useAddParticipantToEventMutation();
  const handleRegister = async (cell) => {
    try {
      await addParticipant({
        eventId: eventId,
        participantId: cell.row.original.id,
        body: {
          language: languageRef.current[cell.row.index].value,
          remarks: remarksRef.current[cell.row.index].value,
        },
      }).unwrap();
    } catch (err) {
      let errorMessage = "";
      Object.entries(err.data).map(([key, value]) => {
        errorMessage += `${key} ${value.toString()} \n`;
      });

      alert(errorMessage);
    }
  };

  const CellFormater = ({ cell }) => {
    const foundIndex = eventParticipants.indexOf(cell.row.original.id);
    const isDisabled = foundIndex >= 0 ? true : false;

    switch (cell.column.columnDef.header) {
      case "Actions":
        return (
          <Center>
            <ConfirmButton
              headerText="Confirm?"
              bodyText="Are you sure you want to register?"
              onSuccessAction={() => {
                handleRegister(cell);
              }}
              buttonIcon={<MdHowToReg size={25} />}
              buttonText="Register"
              isDanger={false}
              isLoading={addResponse.isLoading}
              isDisabled={isDisabled}
            />
          </Center>
        );
      case "Name":
        return (
          <>
            <span
              className={
                "bold-text " +
                (cell.row.original.gender === "Brother"
                  ? "brother-color"
                  : "sister-color")
              }
            >
              {cell.row.original.english_name}
            </span>
            <br />
            {cell.row.original.chinese_name}
          </>
        );
      case "Academic Year":
        return (
          <Center>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </Center>
        );
      case "Language":
        if (isDisabled) {
          return (
            <Select
              size="xs"
              fontSize="13"
              border="2px solid"
              borderColor="teal"
              isDisabled={isDisabled}
              ref={(el) => (languageRef.current[cell.row.index] = el)}
            >
              <option
                value={eventParticipantsWithAppointments[foundIndex].language}
              >
                {eventParticipantsWithAppointments[foundIndex].language}
              </option>
            </Select>
          );
        } else {
          return (
            <Select
              size="xs"
              fontSize="13"
              border="2px solid"
              borderColor="teal"
              placeholder="Select option"
              isDisabled={isDisabled}
              ref={(el) => (languageRef.current[cell.row.index] = el)}
            >
              {languageOptions.map((language, index) => (
                <option key={index} value={language}>
                  {language}
                </option>
              ))}
            </Select>
          );
        }
      case "Remarks":
        if (isDisabled) {
          return (
            <Textarea
              fontSize="13"
              border="2px solid"
              borderColor="teal"
              isDisabled={isDisabled}
              ref={(el) => (remarksRef.current[cell.row.index] = el)}
              value={eventParticipantsWithAppointments[foundIndex].remarks}
            />
          );
        } else {
          return (
            <Textarea
              fontSize="13"
              border="2px solid"
              borderColor="teal"
              isDisabled={isDisabled}
              ref={(el) => (remarksRef.current[cell.row.index] = el)}
            />
          );
        }

      default:
        return flexRender(cell.column.columnDef.cell, cell.getContext());
    }
  };

  let content = (
    <Table variant="striped" size="small" boxShadow={"lg"}>
      <Thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <Tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              const meta = header.column.columnDef.meta;
              return (
                <Th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  isNumeric={meta?.isNumeric}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}

                  <chakra.span pl="4">
                    {header.column.getIsSorted() ? (
                      header.column.getIsSorted() === "desc" ? (
                        <TriangleDownIcon aria-label="sorted descending" />
                      ) : (
                        <TriangleUpIcon aria-label="sorted ascending" />
                      )
                    ) : null}
                  </chakra.span>
                </Th>
              );
            })}
          </Tr>
        ))}
      </Thead>
      <Tbody>
        {table.getRowModel()?.rows.map((row, index) => (
          <Tr key={index}>
            {row.getVisibleCells().map((cell) => {
              const meta = cell.column.columnDef.meta;
              return (
                <Td key={cell.id} isNumeric={meta?.isNumeric}>
                  <CellFormater cell={cell} />
                </Td>
              );
            })}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );

  return content;
};

const SearchResults = ({
  searchTerm,
  eventId,
  eventParticipants,
  eventParticipantsWithAppointments,
}) => {
  const [filteredSearchTerm, setFilteredSearchTerm] = useState(searchTerm);
  const { data, error, isLoading, isFetching } = useGetParticipantSearchQuery(
    filteredSearchTerm,
    { skip: filteredSearchTerm === "" }
  );
  const results = data ?? [];

  useEffect(() => {
    if (searchTerm.length >= 3) {
      setFilteredSearchTerm(searchTerm);
    }
  }, [searchTerm]);

  if (error) {
    return <div className="text-hint">Error while fetching</div>;
  }

  if (isLoading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  if (isFetching) {
    return <div className="text-hint">Fetching saints...</div>;
  }

  if (results.length === 0 && searchTerm.length > 0) {
    return (
      <>
        <div className="text-hint">No saints found</div>
        <AddParticipantButton />
      </>
    );
  }

  if (results.length > 0) {
    return (
      <SearchTable
        data={results}
        eventId={eventId}
        eventParticipants={eventParticipants}
        eventParticipantsWithAppointments={eventParticipantsWithAppointments}
      />
    );
  }
};

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const ParticipantSearch = ({
  eventId,
  eventParticipants,
  eventParticipantsWithAppointments,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const content = (
    <VStack>
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          children={<SearchIcon color="gray.300" />}
        />
        <Input
          type="tel"
          placeholder="Search saints"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>

      <SearchResults
        searchTerm={debouncedSearchTerm}
        eventId={eventId}
        eventParticipants={eventParticipants}
        eventParticipantsWithAppointments={eventParticipantsWithAppointments}
      ></SearchResults>
    </VStack>
  );

  return content;
};

export default ParticipantSearch;
