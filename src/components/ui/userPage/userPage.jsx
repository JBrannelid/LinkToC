//This page should render the userPage
//With different values depending on if it's a user/horse/admin

//import React from "react";
//import {UserPage} from './components/page/UserProfilePage';
// import {HorsePage} from './components/page/HorseProfilePage';

export default function ProfileContainer({ type, data }) {
    //Determine which profile to render based on type prop
    const renderProfile = () => {
         switch(type) {
             case 'user':
                 return <UserProfilePage data={data} />;
             case 'horse':
                 return <HorseProfilePage data={data} />;
             case 'admin':
                 //Add your admin component when available
                 return <div>Admin profile coming soon</div>;
             default:
                 return <div>Select a profile type</div>;
         }
     };

     return (
         <div className="profile-container">
             {renderProfile()}
         </div>
     );
 }