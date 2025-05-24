
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import type { ExamFileType, ExamFolderType } from "../../models/Exam"
import ExamDetailsRow from "./ExamDetailsRow"
import ModalWrapper from "../ModalWrapper"
import useModal from "../../hooks/useModal"
import NoDocuments from "../NoDocuments"
interface ExamTableProps {
    exams: ExamFileType[]|null
    folders: ExamFolderType[]
    loading: boolean
    currentFolderId: number | null
    setCurrentFolderId: React.Dispatch<React.SetStateAction<number | null>>
    currentFolderName: string | null
    setCurrentFolderName: React.Dispatch<React.SetStateAction<string | null>>
    folderPath: { id: number | null; name: string }[]
    setFolderPath: React.Dispatch<React.SetStateAction<{ id: number | null; name: string }[]>>
}

const ExamTable: React.FC<ExamTableProps> = ({
    exams,
    folders,
    loading,
    currentFolderId,
    setCurrentFolderId, 
    setCurrentFolderName,
    setFolderPath,
}) => {
    const [selectedFile, setSelectedFile] = useState<{ name: string; url: string } | null>(null)
    const [selectedRow, setSelectedRow] = useState<number | null>(null)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const { isOpen, openModal, closeModal, modalData } = useModal()
    const [viewMode, setViewMode] = useState<"all" | "folder">("all")
    const [filteredExams, setFilteredExams] = useState<ExamFileType[]>(exams)
    const [filteredFolders, setFilteredFolders] = useState<ExamFolderType[]>(folders)

    useEffect(() => {
        if (viewMode === "folder" && currentFolderId !== null) {
            setFilteredExams(exams ? exams.filter((exam) => exam.folderId === currentFolderId) : [])
            setFilteredFolders(folders.filter((folder) => folder.parentFolderId === currentFolderId && folder.ofTeacherExams))
        } else {
            setFilteredExams(exams ? exams.filter((exam) => exam.folderId === null) : [])
            setFilteredFolders(folders.filter((folder) => folder.parentFolderId === null && folder.ofTeacherExams))
        }
    }, [viewMode, currentFolderId, exams, folders])
    selectedRow
    anchorEl
    const openFolder = (folderId: number, folderName: string) => {
       
        
        setFolderPath((prevPath) => [...prevPath, { id: folderId, name: folderName }])
        setCurrentFolderId(folderId)
        setCurrentFolderName(folderName)
        setViewMode("folder")
    }

    const navigate = useNavigate()

    const handleRowClick = (fileName: string, fileUrl: string) => {
        setSelectedFile({ name: fileName, url: fileUrl })
    }


    const handleMenuClose = () => {
        setAnchorEl(null)
        setSelectedRow(null)
    }

    if (selectedFile) {
        navigate("/app/viewExam", { state: { fileName: selectedFile.name, fileUrl: selectedFile.url } })
    }
    return (
        <>
                     

            {!loading && filteredFolders.length === 0 && filteredExams.length === 0 ? (
                <NoDocuments />
            ) : (
                <div className="bg-white rounded-lg  overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                        </div>
                    ) : (
                        // <div className="overflow-x-auto">
                        //     <table className="min-w-full divide-y divide-gray-200">
                        //         <thead className="bg-gray-50">
                        //             <tr>
                        //                 <th
                        //                     scope="col"
                        //                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12"
                        //                 ></th>
                        //                 <th
                        //                     scope="col"
                        //                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        //                 >
                        //                     Name
                        //                 </th>
                        //                 <th
                        //                     scope="col"
                        //                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48"
                        //                 >
                                          
                        //                 </th>
                        //                 <th
                        //                     scope="col"
                        //                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        //                 >
                        //                     Sharing
                        //                 </th>
                        //                 <th
                        //                     scope="col"
                        //                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        //                 >
                        //                     Modified
                        //                 </th>
                        //                 <th
                        //                     scope="col"
                        //                     className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-10"
                        //                 ></th>
                        //             </tr>
                        //         </thead>
                        //         <tbody className="bg-white divide-y divide-gray-200">
                        //             {filteredFolders.map((row, index) => (
                        //                 <ExamDetailsRow
                        //                     key={`folder-${row.id}`}
                        //                     row={row}
                        //                     isFolder={true}
                        //                     index={row.id}
                        //                     handleMenuClick={handleMenuClick}
                        //                     anchorEl={anchorEl}
                        //                     selectedRow={selectedRow}
                        //                     handleMenuClose={handleMenuClose}
                        //                     openFolder={openFolder}
                        //                     openModal={openModal}
                        //                     handleRowClick={handleRowClick}
                        //                 />
                        //             ))}
                        //             {filteredExams.map((row, index) => (
                        //                 <ExamDetailsRow
                        //                     key={`file-${row.id}`}
                        //                     row={row}
                        //                     isFolder={false}
                        //                     index={row.id}
                        //                     handleMenuClick={handleMenuClick}
                        //                     anchorEl={anchorEl}
                        //                     selectedRow={selectedRow}
                        //                     handleMenuClose={handleMenuClose}
                        //                     openFolder={openFolder}
                        //                     openModal={openModal}
                        //                     handleRowClick={handleRowClick}
                        //                 />
                        //             ))}
                        //         </tbody>
                        //     </table>
                        // </div>
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="w-48"></TableHead>
            <TableHead>Sharing</TableHead>
            <TableHead>Modified</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
        {filteredFolders.map((row) => (
                                        <ExamDetailsRow
                                            key={`folder-${row.id}`}
                                            row={row}
                                            isFolder={true}
                                            handleMenuClose={handleMenuClose}
                                            openFolder={openFolder}
                                            openModal={openModal}
                                            handleRowClick={handleRowClick}
                                        />
                                    ))}

{filteredExams.map((row) => (
                                        <ExamDetailsRow
                                            key={`file-${row.id}`}
                                            row={row}
                                            isFolder={false}
                                            handleMenuClose={handleMenuClose}
                                            openFolder={openFolder}
                                            openModal={openModal}
                                            handleRowClick={handleRowClick}
                                        />
                                    ))}
        </TableBody>
      </Table>
    </div>
                    )}
                </div>
            )}

            <ModalWrapper
                open={isOpen}
                handleClose={() => {
                    closeModal()
                    handleMenuClose()
                }}
                title={modalData?.title || ""}
                onConfirm={modalData?.onConfirm}
                confirmText={modalData?.confirmText}
                initialName={modalData?.initialName}
                // setNewName={modalData?.setNewName || (() => { })}
            >
                {modalData?.children}
            </ModalWrapper>
        </>
    )
}

export default ExamTable
