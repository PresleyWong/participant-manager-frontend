import { useRef, useState, useEffect } from "react";
import {
  Button,
  Input,
  InputGroup,
  IconButton,
  InputLeftElement,
  list,
  Stack,
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

const SearchTable = ({ data, eventId, eventParticipants }) => {
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
    switch (cell.column.columnDef.header) {
      case "Actions":
        return (
          // <Button
          //   isDisabled={eventParticipants.includes(cell.row.original.id)}
          //   size="sm"
          //   className="primary-button"
          //   onClick={() => handleRegister(cell)}
          //   isLoading={addResponse.isLoading}
          // >
          //   Register
          // </Button>

          <ConfirmButton
            headerText="Confirm?"
            bodyText="Are you sure you want to register?"
            onSuccessAction={() => {
              handleRegister(cell);
            }}
            buttonText="Register"
            isDanger={true}
            isLoading={addResponse.isLoading}
            isDisabled={eventParticipants.includes(cell.row.original.id)}
          />
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
        return (
          <Select
            placeholder="Select option"
            ref={(el) => (languageRef.current[cell.row.index] = el)}
          >
            {languageOptions.map((language, index) => (
              <option key={index} value={language}>
                {language}
              </option>
            ))}
          </Select>
        );
      case "Remarks":
        return (
          <Textarea ref={(el) => (remarksRef.current[cell.row.index] = el)} />
        );
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

const SearchResults = ({ searchTerm, eventId, eventParticipants }) => {
  const [filteredSearchTerm, setFilteredSearchTerm] = useState(searchTerm);
  const { data, error, isLoading, isFetching } = useGetParticipantSearchQuery(
    filteredSearchTerm,
    { skip: filteredSearchTerm === "" }
  );
  const results = data ?? [];

  useEffect(() => {
    if (searchTerm.length > 2) {
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
    return <div className="text-hint">No saints found</div>;
  }

  if (results.length > 0) {
    return (
      <SearchTable
        data={results}
        eventId={eventId}
        eventParticipants={eventParticipants}
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

const ParticipantSearch = ({ eventId, eventParticipants }) => {
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
      ></SearchResults>
    </VStack>
  );

  return content;
};

export default ParticipantSearch;
