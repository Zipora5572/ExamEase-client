// import React, { useState } from 'react';
// import { TableCell, TableRow, Button, Tooltip } from '@mui/material';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import FolderIcon from '@mui/icons-material/Folder';
// import DescriptionIcon from '@mui/icons-material/Description';

// import { StudentExamType } from '../../models/Exam'; // ייתכן שתצטרך לעדכן את המודל שלך בהתאם
// import FileMenu from './FileMenu';

// const StudentExamRow = ({ studentExam, index, handleCheckExam, isHovered, setIsHovered }) => {
//     const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

//     const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
//         setAnchorEl(event.currentTarget);
//     };

//     const handleMenuClose = () => {
//         setAnchorEl(null);
//     };

//     const handleRowClick = () => {
//         // פעולה שיכולה להתרחש כאשר לוחצים על השורה (כמו פתיחה בהגדלה)
//     };

//     return (
//         <TableRow
//             key={studentExam.id}
//             sx={{
//                 '&:hover': { backgroundColor: '#f0f0f0' },
//                 cursor: 'pointer'
//             }}
//             onMouseEnter={() => setIsHovered(true)}
//             onMouseLeave={() => setIsHovered(false)}
//         >
//             <TableCell sx={{ color: 'rgb(75, 75, 75)' }}>
//                 {studentExam.isFolder ? (
//                     <FolderIcon style={{ color: 'rgb(144, 144, 144)', fontSize: '24px' }} />
//                 ) : (
//                     <DescriptionIcon
//                         style={{ color: 'rgb(144, 144, 144)', fontSize: '24px' }}
//                         onClick={handleRowClick}
//                     />
//                 )}
//             </TableCell>
//             <TableCell sx={{ color: 'rgb(75, 75, 75)' }}>
//                 {studentExam.studentExamName}
//             </TableCell>
//             <TableCell align="right" sx={{ width: '300px' }}>
//                 {isHovered && (
//                     <Button variant="contained" color="primary" onClick={() => handleCheckExam(studentExam)}>
//                         Check Exam
//                     </Button>
//                 )}
//             </TableCell>
//             <TableCell sx={{ color: 'rgb(75, 75, 75)' }}>
//                 {studentExam.isChecked ? 'Checked' : 'Not Checked'}
//             </TableCell>
//             <TableCell sx={{ color: 'rgb(75, 75, 75)' }}>
//                 {studentExam.checkedAt ? new Date(studentExam.checkedAt).toLocaleDateString() : '-'}
//             </TableCell>
//             <TableCell align="right" sx={{ padding: 0 }}>
//                 <Button onClick={handleMenuClick}>
//                     <MoreVertIcon />
//                 </Button>
             
//             </TableCell>
//         </TableRow>
//     );
// };

// export default StudentExamRow;

const a=()=>{
    return(<></>)
}
export default a