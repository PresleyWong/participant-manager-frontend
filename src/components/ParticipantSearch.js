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
import { GenderColoredText } from "../themeConfig";

const SearchTable = ({
  data,
  eventDetail,
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
        eventId: eventDetail.id,
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
        return null;
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
              buttonIcon={<MdHowToReg size={22} />}
              buttonText="Register"
              isDanger={false}
              isLoading={addResponse.isLoading}
              isDisabled={isDisabled || eventDetail.is_closed}
            />
          </Center>
        );
      case "Name":
        return (
          <>
            <GenderColoredText
              gender={cell.row.original.gender}
              text={cell.row.original.english_name}
            />
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
              variant={"custom"}
              size="xs"
              isDisabled={isDisabled || eventDetail.is_closed}
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
              variant={"custom"}
              size="xs"
              placeholder="Select option"
              isDisabled={isDisabled || eventDetail.is_closed}
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
              variant={"custom"}
              isDisabled={isDisabled || eventDetail.is_closed}
              ref={(el) => (remarksRef.current[cell.row.index] = el)}
              value={eventParticipantsWithAppointments[foundIndex].remarks}
            />
          );
        } else {
          return (
            <Textarea
              variant={"custom"}
              isDisabled={isDisabled || eventDetail.is_closed}
              ref={(el) => (remarksRef.current[cell.row.index] = el)}
            />
          );
        }

      default:
        return flexRender(cell.column.columnDef.cell, cell.getContext());
    }
  };

  let content = (
    <Table variant="simple" size="small" boxShadow={"lg"}>
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
  eventDetail,
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
        eventDetail={eventDetail}
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
  eventDetail,
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
        eventDetail={eventDetail}
        eventParticipants={eventParticipants}
        eventParticipantsWithAppointments={eventParticipantsWithAppointments}
      ></SearchResults>
    </VStack>
  );

  return content;
};

export default ParticipantSearch;
