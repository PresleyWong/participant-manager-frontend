import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Select,
  Checkbox,
} from "@chakra-ui/react";
import { MdOutlineFileDownload } from "react-icons/md";
import cloneDeep from "lodash.clonedeep";
import { utils, writeFile } from "xlsx";
import { Button, ModalContent } from "./custom-component";

const ExportButton = ({
  apiArray,
  fileName,
  buttonTitle,
  sheet_name = "sheet_1",
}) => {
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [columnsType, setColumnsType] = useState("1");
  const [selectedColumns, setSelectedColumns] = useState([]);

  const totalColumns =
    apiArray.length > 0 ? Object.keys(apiArray[0]).length : "";

  const updateSelectedColumns = (e, column) => {
    if (e.target.checked) {
      setSelectedColumns([...selectedColumns, column]);
    } else {
      setSelectedColumns(selectedColumns.filter((value) => value !== column));
    }
  };

  const handleExport = () => {
    if (columnsType === "1") {
      jsonToFile(apiArray);
    } else {
      const customArray = cloneDeep(apiArray);
      customArray.map((obj) =>
        Object.keys(obj).forEach((key) => {
          if (!selectedColumns.includes(key)) {
            delete obj[key];
          }
        })
      );
      jsonToFile(customArray);
      setSelectedColumns([]);
    }
  };

  const jsonToFile = (jsonData) => {
    const wb = utils.book_new();
    const ws = utils.json_to_sheet([]);
    const writeSetting = { origin: "A1", skipHeader: false };
    utils.sheet_add_json(ws, jsonData, writeSetting);
    utils.book_append_sheet(wb, ws, sheet_name);
    writeFile(wb, fileName);
  };

  return (
    <>
      {apiArray.length > 0 && apiArray !== undefined && (
        <>
          <Button
            size="sm"
            variant="primary"
            leftIcon={<MdOutlineFileDownload size={22} />}
            onClick={() => setShowDownloadModal(true)}
            disabled={apiArray[0].length < 1}
            label={buttonTitle}
          />

          {showDownloadModal && (
            <Modal
              isOpen={showDownloadModal}
              onClose={() => setShowDownloadModal(false)}
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>{buttonTitle}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <p style={{ marginBottom: "10px" }}>Select Download Type: </p>
                  <Select onChange={(e) => setColumnsType(e.target.value)}>
                    <option value="1">All Columns({totalColumns})</option>
                    <option value="2">Custom</option>
                  </Select>
                  {columnsType === "2" && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        width: "100%",
                        marginTop: "20px",
                      }}
                    >
                      {Object.keys(apiArray[0]).map((key, index) => {
                        return (
                          <div
                            key={index}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              width: "33.3%",
                            }}
                          >
                            <Checkbox
                              id={key}
                              onChange={(e) => updateSelectedColumns(e, key)}
                            >
                              {key}
                            </Checkbox>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button
                    variant="info"
                    onClick={() => setShowDownloadModal(false)}
                    label="Close"
                  />
                  <Button
                    ml={3}
                    variant="primary"
                    onClick={() => handleExport()}
                    label="Download"
                  />
                </ModalFooter>
              </ModalContent>
            </Modal>
          )}
        </>
      )}
    </>
  );
};

export default ExportButton;
