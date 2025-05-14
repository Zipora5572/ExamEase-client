// "use client"

// import type React from "react"

// import { useState } from "react"
// import { useSelector, useDispatch } from "react-redux"
// import type { StoreType, AppDispatch } from "../store/store"
// import { updateUser } from "../store/userSlice"
// import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
// import { Button } from "./ui/button"
// import { Input } from "./ui/input"
// import { Label } from "./ui/label"
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
// import { Camera, Mail, Phone, MapPin, Building, Briefcase, Calendar, Save } from "lucide-react"

// const UserProfile = () => {
//   const dispatch = useDispatch<AppDispatch>()
//   const user = useSelector((state: StoreType) => state.auth.user)

//   const [isEditing, setIsEditing] = useState(false)
//   const [formData, setFormData] = useState({
//     firstName: user?.firstName || "",
//     lastName: user?.lastName || "",
//     email: user?.email || "",
//     phone: user?.phone || "",
//     address: user?.address || "",
//     organization: user?.organization || "",
//     position: user?.position || "",
//     bio: user?.bio || "",
//   })

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }))
//   }

//   const handleSave = () => {
//     dispatch(updateUser({ ...user, ...formData }))
//     setIsEditing(false)
 
//   }

//   const getInitials = () => {
//     if (!user) return "U"
//     return `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}` || "U"
//   }

//   return (
//     <div className="container mx-auto py-8 px-4 max-w-4xl">
//       <Card className="overflow-hidden">
//         <div className="relative h-48 bg-gradient-to-r from-cyan-500 to-red-500">
//           <Button
//             variant="ghost"
//             size="icon"
//             className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full"
           
//           >
//             <Camera className="h-5 w-5" />
//           </Button>
//         </div>

//         <div className="relative px-6">
//           <div className="absolute -top-16 left-6 ring-4 ring-white rounded-full">
//             <Avatar className="h-32 w-32">
//               {/* <AvatarImage src={user?.profilePicture || ""} alt={`${user?.firstName} ${user?.lastName}`} /> */}
//               <AvatarFallback className="text-3xl bg-primary text-primary-foreground">{getInitials()}</AvatarFallback>
//             </Avatar>
//           </div>

//           <div className="pt-20 pb-6 flex justify-between items-start">
//             <div>
//               <h1 className="text-3xl font-bold">
//                 {isEditing ? (
//                   <div className="flex gap-2">
//                     <Input
//                       name="firstName"
//                       value={formData.firstName}
//                       onChange={handleInputChange}
//                       className="w-40"
//                       placeholder="First Name"
//                     />
//                     <Input
//                       name="lastName"
//                       value={formData.lastName}
//                       onChange={handleInputChange}
//                       className="w-40"
//                       placeholder="Last Name"
//                     />
//                   </div>
//                 ) : (
//                   `${user?.firstName || ""} ${user?.lastName || ""}`
//                 )}
//               </h1>
            
//             </div>

//             <div>
//               {isEditing ? (
//                 <Button onClick={handleSave} className="flex items-center gap-2">
//                   <Save className="h-4 w-4" /> Save Changes
//                 </Button>
//               ) : (
//                 <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
//               )}
//             </div>
//           </div>
//         </div>

//         <CardContent className="p-6 pt-0">
//           <Tabs defaultValue="about" className="w-full">
//             <TabsList className="mb-6">
//               <TabsTrigger value="about">About</TabsTrigger>
//               <TabsTrigger value="activity">Activity</TabsTrigger>
//               <TabsTrigger value="exams">Exams</TabsTrigger>
//               <TabsTrigger value="settings">Settings</TabsTrigger>
//             </TabsList>

//             <TabsContent value="about">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 <div className="space-y-6">
//                   <div>
//                     <h3 className="text-lg font-medium mb-4">Contact Information</h3>

//                     <div className="space-y-4">
//                       <div>
//                         {isEditing ? (
//                           <div className="space-y-2">
//                             <Label htmlFor="email">Email</Label>
//                             <Input
//                               id="email"
//                               name="email"
//                               value={formData.email}
//                               onChange={handleInputChange}
//                               placeholder="Email address"
//                             />
//                           </div>
//                         ) : (
//                           <div className="flex items-center gap-2">
//                             <Mail className="h-4 w-4 text-gray-500" />
//                             <span>{user?.email || "No email provided"}</span>
//                           </div>
//                         )}
//                       </div>

//                       <div>
//                         {isEditing ? (
//                           <div className="space-y-2">
//                             <Label htmlFor="phone">Phone</Label>
//                             <Input
//                               id="phone"
//                               name="phone"
//                               value={formData.phone}
//                               onChange={handleInputChange}
//                               placeholder="Phone number"
//                             />
//                           </div>
//                         ) : (
//                           <div className="flex items-center gap-2">
//                             <Phone className="h-4 w-4 text-gray-500" />
//                             <span>{user?.phoneNumber || "No phone provided"}</span>
//                           </div>
//                         )}
//                       </div>

//                       <div>
//                         {isEditing ? (
//                           <div className="space-y-2">
//                             <Label htmlFor="address">Address</Label>
//                             <Input
//                               id="address"
//                               name="address"
//                               value={formData.address}
//                               onChange={handleInputChange}
//                               placeholder="Address"
//                             />
//                           </div>
//                         ) : (
//                           <div className="flex items-center gap-2">
//                             <MapPin className="h-4 w-4 text-gray-500" />
//                             <span>{user?.address || "No address provided"}</span>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="space-y-6">
//                   <div>
//                     <h3 className="text-lg font-medium mb-4">Work Information</h3>

//                     <div className="space-y-4">
//                       <div>
//                         {isEditing ? (
//                           <div className="space-y-2">
//                             <Label htmlFor="organization">Organization</Label>
//                             <Input
//                               id="organization"
//                               name="organization"
//                               value={formData.organization}
//                               onChange={handleInputChange}
//                               placeholder="Organization"
//                             />
//                           </div>
//                         ) : (
//                           <div className="flex items-center gap-2">
//                             <Building className="h-4 w-4 text-gray-500" />
//                             <span>{user?.organization || "No organization provided"}</span>
//                           </div>
//                         )}
//                       </div>

//                       <div>
//                         {isEditing ? (
//                           <div className="space-y-2">
//                             <Label htmlFor="position">Position</Label>
//                             <Input
//                               id="position"
//                               name="position"
//                               value={formData.position}
//                               onChange={handleInputChange}
//                               placeholder="Position"
//                             />
//                           </div>
//                         ) : (
//                           <div className="flex items-center gap-2">
//                             <Briefcase className="h-4 w-4 text-gray-500" />
//                             <span>{user?.position || "No position provided"}</span>
//                           </div>
//                         )}
//                       </div>

//                       <div>
//                         <div className="flex items-center gap-2">
//                           <Calendar className="h-4 w-4 text-gray-500" />
//                           <span>Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </TabsContent>

//             <TabsContent value="activity">
//               <div className="space-y-4">
//                 <h3 className="text-lg font-medium">Recent Activity</h3>
//                 <div className="space-y-4">
//                   <div className="border-l-2 border-primary pl-4 py-2">
//                     <p className="text-sm text-gray-500">Today</p>
//                     <p>Uploaded a new exam: "Final Exam - Mathematics 101"</p>
//                   </div>
//                   <div className="border-l-2 border-gray-200 pl-4 py-2">
//                     <p className="text-sm text-gray-500">Yesterday</p>
//                     <p>Graded 15 student submissions for "Midterm Exam - Physics 202"</p>
//                   </div>
//                   <div className="border-l-2 border-gray-200 pl-4 py-2">
//                     <p className="text-sm text-gray-500">3 days ago</p>
//                     <p>Created a new folder: "Spring Semester 2023"</p>
//                   </div>
//                 </div>
//               </div>
//             </TabsContent>

//             <TabsContent value="exams">
//               <div className="space-y-4">
//                 <h3 className="text-lg font-medium">Your Exams</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <Card>
//                     <CardHeader className="pb-2">
//                       <CardTitle className="text-base">Final Exam - Mathematics 101</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <p className="text-sm text-gray-500">Uploaded 1 day ago</p>
//                       <p className="text-sm">25 submissions • 15 graded</p>
//                       <div className="mt-2">
//                         <Button variant="outline" size="sm">
//                           View Details
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>

//                   <Card>
//                     <CardHeader className="pb-2">
//                       <CardTitle className="text-base">Midterm Exam - Physics 202</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <p className="text-sm text-gray-500">Uploaded 1 week ago</p>
//                       <p className="text-sm">32 submissions • 32 graded</p>
//                       <div className="mt-2">
//                         <Button variant="outline" size="sm">
//                           View Details
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </div>
//               </div>
//             </TabsContent>

//             <TabsContent value="settings">
//               <div className="space-y-4">
//                 <h3 className="text-lg font-medium">Profile Settings</h3>
//                 <p>Manage your profile settings and preferences.</p>
//                 <Button onClick={() => (window.location.href = "/settings")}>Go to Settings</Button>
//               </div>
//             </TabsContent>
//           </Tabs>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// export default UserProfile
