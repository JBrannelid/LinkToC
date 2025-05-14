import { useState, useCallback, useEffect } from "react";
import {useLoadingState} from "./useLoadingState"
import {horseService, stableService, userService} from "../api/index.js";

export const useHorseManagement = (stableId) => {
    const [horses, setHorses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [operationType, setOperationType] = useState("fetch");
    
    const loadingState = useLoadingState(loading, operationType);

    const fetchHorses = useCallback(async () => {
        if (!stableId) return;

        setLoading(true);
        setOperationType("fetch");

        try {
            
            const horsesResponse = await horseService.getHorsesByStableId(stableId);
            setHorses(Array.isArray(horsesResponse) ? horsesResponse : []);
            setError(null);
        } catch (error) {
            setError(error.message || "Failed to load horses");
        } finally {
            setLoading(false);
        }
    }, [stableId]);
    const addHorse = async (horseData) => {
        setLoading(true);
        setOperationType("create");

        try {
            const createData = {
                name: horseData.name,
                breed: horseData.breed || null,
                color: horseData.color || null,
                age: horseData.age || null,
                stableId: stableId
            };
            await horseService.addHorse(createData);
            await fetchHorses();
            return true;
        } catch (error) {
            setError(error.message || "Failed to add horse");
            setLoading(false);
            return false;
        }
    };
    const updateHorse = async (horseData, horseId) => {
        setLoading(true);
        setOperationType("update");
        try {
            const updateData = {
                id: horseId,
                name: horseData.name,
                breed: horseData.breed || null,
                color: horseData.color || null,
                age: horseData.age || null,
                stableId: stableId
            };
            await horseService.updateHorse(horseId, updateData);
            await fetchHorses();
            return true;
        } catch (error) {
            setError(error.message || "Failed to update horse");
            setLoading(false);
            return false;
        }
    };
    const deleteHorse = async (horseId) => {
        setLoading(true);
        setOperationType("delete");
        try {
            await horseService.deleteHorse(horseId);
            await fetchHorses();
            return true;
        } catch (error) {
            setError(error.message || "Failed to delete horse");
            setLoading(false);
            return false;
        }
    };

    useEffect(() => {
        fetchHorses();
    }, [fetchHorses]);
    
    return {
        horses,
        loading,
        error,
        loadingState,
        addHorse,
        updateHorse,
        deleteHorse,
        refreshData: fetchHorses,
    };
};