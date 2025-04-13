// Custom hook for horse profile data
import {useCallback, useEffect, useState} from "react";
import {createHorseProfile} from "../utils/horseProfileUtils.js";
import {horseService} from "../api/index.js";

// New processing function inside the hook file
/**
 *@returns {Object}
 * @param horseId
 */
export const useHorseProfile = (horseId) => 
{
    
    const [horse, setHorse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    
        const getHorseData = useCallback(async () => 
        {
            if (!horseId) {
                console.error("Horse ID is required");
                setError(true);
                setLoading(false);
                return;
            }

            try {
                
                setLoading(true);
                const response = await horseService.getById(horseId);
                    // Use the utility to ensure all fields exist
                    setHorse(createHorseProfile(response.data));
                    setError(false);
                
            } catch (err) {
                console.error("Error fetching horse data:", err);
                setLoading(false);
                    setError(true);
                
            } finally {
                setLoading(false);
            }

        }, [horseId]);
        const updateHorse = async (updateData) => {
            if (!horseId || !updateData) {
                console.error("Horse ID or data is missing");
                return {success: false, message: "Horse ID or data is missing"};
            }
            try {
                setLoading(true);
                const response = await horseService.update(horseId, updateData);
                setHorse(createHorseProfile(response.data));
                setError(false);
                return {success: true, data: response.data};
            } catch (err){
                console.error("Error updating horse data:", err);
                setError(true);
                return {success: false, error: err};
            } finally {
                setLoading(false);
            }
            
        };
        
        const deleteHorse = async () => {
            if(!horseId) {
                console.error("Horse ID is missing");
                return {success: false, error: "Horse ID is missing"};
            }
            try {
                setLoading(true);
                const response = await horseService.delete(horseId);
                setHorse(null);
                setError(false);
                return {success: true, data: response.data};
            } catch (err) {
                console.error("Error deleting horse data:", err);
                setError(true);
                return {success: false, error: err};
            } finally {
                setLoading(false);
            }
        };

        useEffect(() => {
            getHorseData();
        }, [getHorseData]);
        
        
        
        return{ horse, horseId, loading, error, getHorseData, updateHorse, deleteHorse };

};

/**
 * @returns {Object}
 */
export const userHorseManagment = () => {
    const [horse, setHorse] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    
    const fetchAllHorses = useCallback(async () => {
        try {
            setLoading(true);
            const response = await horseService.getAll();
            setHorse(response.data.map(horse => createHorseProfile(horse)));
            setError(false);
        } catch (err) {
            console.error("Error fetching all horses:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    },[]);
    
    const createHorse = async (horseData) => {
        if (!horseData) {
            console.error("Horse data is missing");
            return{success: false, error: "Horse data is missing"};
        }
        try {
            setLoading(true);
            const response = await horseService.create(horseData);
            setHorse(prevHorse => [...prevHorse, createHorseProfile(response.data)]);
            return {success: true, data: response.data};
        } catch (err) {
            console.error("Error creating horse:", err);
            setError(true);
            return {success: false, error: err};
        }finally {
            setLoading(false);
        }
    };
    
    useEffect(()=>{
        fetchAllHorses();
    }, [fetchAllHorses]);
    
    return{ horse, loading, error, fetchAllHorses, createHorse };
}
