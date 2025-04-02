import React, {useState, useEffect, useRef} from "react";
import {Card, classNames} from "src/utils/cardUtils.js";


const ProfileCard = ({
    id,
    name,
    imageUrl,
    description,
    
    metadata = [],
    
    stats = [],
    
    allowImageUppload = true,
    showDetailsButton = true,
    onDetailsClick = null,
    
    containerClassNames = "",
    imageClassNames = "",
    
    placeholderImageUrl = "src/components/ui/Images/profilePlaceholder.jpg",
    loadingText = "Loading profile...",
    notFoundText = "Profile Not Found",
    
}) => {
    const [profileImage, set]
    
}