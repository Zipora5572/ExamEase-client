// import { useState } from 'react';
// import { Box, TextField, Button, Grid, Paper, Typography } from '@mui/material';
// import { UserType } from '../models/User';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, StoreType } from '../store/store';
// import { updateUser } from '../store/userSlice';

// const Profile = () => {

//     const user = useSelector((state: StoreType) => state.auth.user)
//     const dispatch = useDispatch<AppDispatch>();
//     const [formData, setFormData] = useState<Partial<UserType>>({
//         firstName: user?.firstName,
//         lastName: user?.lastName,
//         email: user?.email,
//         address: user?.address,
//         phoneNumber: user?.phoneNumber,
//         password: ''
//     });
//     const [isEditing, setIsEditing] = useState(false);

//     const handleEdit = () => {
//         setIsEditing(true);
//     };

//     const handleCancel = () => {
//         setFormData({
//             firstName: user?.firstName,
//             lastName: user?.lastName,
//             email: user?.email,
//             address: user?.address,
//             phoneNumber: user?.phoneNumber,
//             password: ''
//         });
//         setIsEditing(false);
//     };

//     const handleSave = () => {
//         // userDispatch({ type: 'UPDATE', data: { ...formData } });
//         dispatch(updateUser({ id: user?.id as number, data: { ...formData } }));
//         setIsEditing(false);
//     };

//     return (
//         <Box
//             display="flex"
//             justifyContent="flex-start"
//             alignItems="center"
//             height="100vh"
//             paddingLeft={2}
//             marginLeft={30}
//         >
//             <Box display="flex" flexDirection="column" alignItems="flex-start">
//                 <Typography
//                     variant="h5"
//                     style={{
//                         marginBottom: '20px',
//                         fontWeight: 'bold',
//                         textAlign: 'left'
//                     }}
//                 >
//                     ACCOUNT PROFILE
//                 </Typography>
//                 <Box display="flex" justifyContent="flex-end" width="100%" marginBottom="20px"> {/* מיקום הכפתור */}
//                     <Button
//                         variant="text"
//                         onClick={handleEdit}
//                     >
//                         Edit
//                     </Button>
//                 </Box>
//                 <Paper
//                     elevation={0}
//                     style={{ padding: '20px', border: '1px solid lightgray', width: '75%', borderRadius: '0' }} // מסגרת מרובעת
//                 >
//                     <Grid container spacing={2}>
//                         <Grid item xs={6} style={{ paddingLeft: '20px' }}>
//                             <Typography variant="h6" style={{ textAlign: 'left' }}>First Name</Typography>
//                         </Grid>
//                         <Grid item xs={6}>
//                             <TextField
//                                 variant="outlined"
//                                 fullWidth
//                                 value={formData.firstName}
//                                 onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
//                                 InputProps={{
//                                     style: { backgroundColor: '#f0f0f0', borderRadius: '0' }, // הסרת רדיוס
//                                     readOnly: !isEditing,
//                                 }}
//                             />
//                         </Grid>
//                         <Grid item xs={6} style={{ paddingLeft: '20px' }}>
//                             <Typography variant="h6" style={{ textAlign: 'left' }}>Last Name</Typography>
//                         </Grid>
//                         <Grid item xs={6}>
//                             <TextField
//                                 variant="outlined"
//                                 fullWidth
//                                 value={formData.lastName}
//                                 onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
//                                 InputProps={{
//                                     style: { backgroundColor: '#f0f0f0', borderRadius: '0' }, // הסרת רדיוס
//                                     readOnly: !isEditing,
//                                 }}
//                             />
//                         </Grid>
//                         <Grid item xs={6} style={{ paddingLeft: '20px' }}>
//                             <Typography variant="h6" style={{ textAlign: 'left' }}>Email</Typography>
//                         </Grid>
//                         <Grid item xs={6}>
//                             <TextField
//                                 variant="outlined"
//                                 fullWidth
//                                 value={formData.email}
//                                 onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
//                                 InputProps={{
//                                     style: { backgroundColor: '#f0f0f0', borderRadius: '0' }, // הסרת רדיוס
//                                     readOnly: !isEditing,
//                                 }}
//                             />
//                         </Grid>
//                         <Grid item xs={6} style={{ paddingLeft: '20px' }}>
//                             <Typography variant="h6" style={{ textAlign: 'left' }}>Address</Typography>
//                         </Grid>
//                         <Grid item xs={6}>
//                             <TextField
//                                 variant="outlined"
//                                 fullWidth
//                                 value={formData.address}
//                                 onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
//                                 InputProps={{
//                                     style: { backgroundColor: '#f0f0f0', borderRadius: '0' }, // הסרת רדיוס
//                                     readOnly: !isEditing,
//                                 }}
//                             />
//                         </Grid>

//                         <Grid item xs={6} style={{ paddingLeft: '20px' }}>
//                             <Typography variant="h6" style={{ textAlign: 'left' }}>Phone Number</Typography>
//                         </Grid>
//                         <Grid item xs={6}>
//                             <TextField
//                                 variant="outlined"
//                                 fullWidth
//                                 value={formData.phoneNumber}
//                                 onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
//                                 InputProps={{
//                                     style: { backgroundColor: '#f0f0f0', borderRadius: '0' }, // הסרת רדיוס
//                                     readOnly: !isEditing,
//                                 }}
//                             />
//                         </Grid>
//                         <Grid item xs={6} style={{ paddingLeft: '20px' }}>
//                             <Typography variant="h6" style={{ textAlign: 'left' }}>Password</Typography>
//                         </Grid>
//                             <Grid item xs={6}>
//                             <TextField
//                                 variant="outlined"
//                                 fullWidth
//                                 value={formData.password}
//                                 onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
//                                 InputProps={{
//                                     style: { backgroundColor: '#f0f0f0', borderRadius: '0' }, // הסרת רדיוס
//                                     readOnly: !isEditing,
//                                 }}
//                                 required
//                             />
//                     </Grid>
                  
//                 </Grid>
//                 {isEditing && (
//                     <Box display="flex" flexDirection="column" alignItems="flex-end" marginTop={2}>
//                         <Box display="flex" justifyContent="flex-end" width="100%">
//                             <Button
//                                 variant="contained"
//                                 color="primary"
//                                 onClick={handleSave}
//                                 style={{ width: '75%', marginBottom: '10px' }} // כפתור רחב
//                             >
//                                 SAVE DETAILS
//                             </Button>
//                             <Button
//                                 variant="outlined"
//                                 color="secondary"
//                                 onClick={handleCancel}
//                             >
//                                 Cancel
//                             </Button>
//                         </Box>
//                     </Box>
//                 )}
//             </Paper>
//         </Box>
//         </Box >
//     );
// }

// export default Profile;
"use client"

import type React from "react"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, StoreType } from "../store/store"
import { updateUser } from "../store/userSlice"
import type { UserType } from "../models/User"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Label } from "../components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog"
// import { useToast } from "../hooks/use-toast"
import { Camera, Save, X } from "lucide-react"

const Profile = () => {
  const user = useSelector((state: StoreType) => state.auth.user)
  const dispatch = useDispatch<AppDispatch>()
//   const { toast } = useToast()
  const [formData, setFormData] = useState<Partial<UserType>>({
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
    address: user?.address,
    phoneNumber: user?.phoneNumber,
    password: "",
  })
  const [isEditing, setIsEditing] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      address: user?.address,
      phoneNumber: user?.phoneNumber,
      password: "",
    })
    setIsEditing(false)
  }

  const handleSave = () => {
    setShowConfirmDialog(true)
  }

  const confirmSave = () => {
    dispatch(updateUser({ id: user?.id as number, data: { ...formData } }))
    setIsEditing(false)
    setShowConfirmDialog(false)
    // toast({
    //   title: "Profile updated",
    //   description: "Your profile information has been updated successfully.",
    //   variant: "default",
    // })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setProfileImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <Card className="shadow-md border-0">
        <CardHeader className="bg-gray-50 border-b">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold">Profile</CardTitle>
              <CardDescription>Manage your account information</CardDescription>
            </div>
            {!isEditing ? (
              <Button onClick={handleEdit} variant="outline">
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleCancel} variant="outline" className="flex items-center gap-1">
                  <X className="h-4 w-4" /> Cancel
                </Button>
                <Button onClick={handleSave} className="flex items-center gap-1">
                  <Save className="h-4 w-4" /> Save Changes
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center gap-4 w-full md:w-1/3">
              <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-md">
                {profileImage ? (
                  <img src={profileImage || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-3xl font-bold text-gray-600">
                    {user?.firstName ? user.firstName.charAt(0).toUpperCase() : "?"}
                    {user?.lastName ? user.lastName.charAt(0).toUpperCase() : ""}
                  </div>
                )}
                {isEditing && (
                  <label
                    htmlFor="profile-image"
                    className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer"
                  >
                    <Camera className="h-5 w-5 text-gray-600" />
                    <input
                      id="profile-image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
              <div className="text-center">
                <h3 className="font-medium text-lg">{`${user?.firstName || ""} ${user?.lastName || ""}`}</h3>
                <p className="text-gray-500 text-sm">{user?.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full md:w-2/3">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-50" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-50" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-50" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-50" : ""}
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-50" : ""}
                />
              </div>

              {isEditing && (
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="password">Password (leave blank to keep current)</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Changes</DialogTitle>
            <DialogDescription>Are you sure you want to save these changes to your profile?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Profile
