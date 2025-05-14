// import { Box, Typography } from '@mui/material';


// export default function NoDocuments({folderId}:{folderId:number|null}) {
   

//   return (
//     <Box
//       sx={{
//         marginTop:'50px',
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         p: 2,
//       }}
//     >
//       <Typography sx={{fontWeight:'bold'}} variant="h5" component="h2" gutterBottom>
//         No Exams yet
//       </Typography>
//       <Typography variant="body2" color="textSecondary" gutterBottom>
//         Exams that you upload from any device will appear here.
//       </Typography>
//       <Box
//         component="img"
//         sx={{
//           height: 150,
//           width: 'auto',
//           objectFit: 'contain',
//           mt: 4,
//           marginBottom: 5,
//         }}
//         alt="No Documents"
//         src="./no-document.png"
//       />
    
      
//     </Box>
//   );
// }
import { FolderOpen } from "lucide-react"

export default function NoDocuments() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="rounded-full bg-gray-100 p-6 mb-4">
        <FolderOpen className="h-12 w-12 text-gray-400" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">No Exams yet</h2>
      <p className="text-sm text-gray-500 max-w-md">Exams that you upload from any device will appear here.</p>
    </div>
  )
}
