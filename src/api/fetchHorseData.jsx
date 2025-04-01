import HorseData from '../testing/HorseData.json';

const fetchHorseData = async (horseId) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const horse = HorseData.find(h => h.id === Number(horseId));
            if (horse) {
                resolve(horse);
            } else {
                reject(new Error("Horse not found"));
            }
        }, 1000); // Simulates network delay
    });
};

export default fetchHorseData;
