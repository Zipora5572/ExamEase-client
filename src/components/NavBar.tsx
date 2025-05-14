// import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
// import { Link } from "react-router-dom";
// import { useState } from "react";
// import UserAccess from "./Auth/UserAccess";

// const pages = ['Home','Dashboard','About','Exams',];

// const NavBar = () => {
//     const [hoveredButton, setHoveredButton] = useState<string | null>(null);
//     return (
//         <>
//             <AppBar  position="fixed" sx={{ backgroundColor: 'white', zIndex: 1201, boxShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}>
//                 <Container maxWidth={false} sx={{ margin: 0, padding: 0 }}>
//                     <Toolbar disableGutters sx={{ margin: 0, padding: 0 }}>
//                         <Typography component="div" sx={{ flexGrow: 0.1, color: "black", fontWeight: 'bold', paddingLeft: 0 }}>
//                             Exams App
//                         </Typography>
//                         <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-start' }}>
//                             {pages.map((page) => (
//                                 <Box
//                                     key={page}
//                                     onMouseEnter={() => setHoveredButton(page)}
//                                     onMouseLeave={() => setHoveredButton(null)}
//                                     sx={{
//                                         position: 'relative',
//                                         mx: 2,
//                                     }}
//                                 >
//                                     <Button
//                                         component={Link}
//                                         to={`/${page.toLowerCase()}`}
//                                         sx={{
//                                             textTransform: 'none',
//                                             display: 'block',
//                                             fontWeight: 'normal',
//                                             backgroundColor: 'transparent',
//                                             color: 'gray',
//                                             '&:hover': {
//                                                 color: 'black',
//                                             },
//                                             '&:focus': {
//                                                 outline: 'none',
//                                             },
//                                         }}
//                                     >
//                                         {page}
//                                     </Button>
//                                     <Box
//                                         sx={{
//                                             position: 'absolute',
//                                             bottom: '-15px',
//                                             left: 0,
//                                             right: 0,
//                                             height: '2px',
//                                             backgroundColor: 'black',
//                                             transform: hoveredButton === page ? 'scaleX(1)' : 'scaleX(0)',
//                                             transition: 'transform 0.3s ease-in-out',
//                                             transformOrigin: 'left',
//                                         }}
//                                     />
//                                 </Box>
//                             ))}
//                         </Box>
//                         <UserAccess/>
//                     </Toolbar>
//                     <Box sx={{ height: '1px', backgroundColor: 'lightgray' }} />
//                 </Container>
//             </AppBar>
//         </>
//     );
// };

// export default NavBar;

"use client"

import { Link } from "react-router-dom"
import { useState } from "react"

const pages = ["Home", "Dashboard", "About", "Exams"]

const NavBar = () => {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null)

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img src="/online.png" alt="Logo" className="h-8 w-auto mr-2" />
              <span className="text-lg font-semibold text-gray-900">Exams App</span>
            </Link>

            <div className="hidden md:ml-8 md:flex md:space-x-6">
              {pages.map((page) => (
                <div
                  key={page}
                  onMouseEnter={() => setHoveredButton(page)}
                  onMouseLeave={() => setHoveredButton(null)}
                  className="relative"
                >
                  <Link
                    to={`/${page.toLowerCase()}`}
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                  >
                    {page}
                  </Link>
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 transform origin-left transition-transform duration-300 ease-in-out ${
                      hoveredButton === page ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            {/* <UserAccess /> */}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavBar
