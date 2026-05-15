import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_CARS, ADD_CAR } from '../graphql/queries';

export const useCars = () => {
  const { data, loading, error } = useQuery(GET_CARS);
  const [addCarMutation] = useMutation(ADD_CAR);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');

  const addCar = async (newCar: { make: string; model: string; year: string | number; color: string }) => {
    await addCarMutation({
      variables: {
        make: newCar.make,
        model: newCar.model,
        year: Number(newCar.year),
        color: newCar.color,
      },
      refetchQueries: [{ query: GET_CARS }],
    });
  };

  const cars = useMemo(() => {
    if (!data?.cars) return [];
    
    // Clone the Apollo array to prevent read-only crashes
    let processedCars = [...data.cars];

    // Search Filter
    if (searchTerm) {
      processedCars = processedCars.filter((car: any) =>
        car.model?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        car.make?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sorting
    if (sortOption === 'year') {
      processedCars.sort((a: any, b: any) => b.year - a.year); // Newest first
    } else if (sortOption === 'make') {
      processedCars.sort((a: any, b: any) => a.make.localeCompare(b.make)); // Alphabetical
    }

    return processedCars;
  }, [data, searchTerm, sortOption]);

  return { cars, loading, error, searchTerm, setSearchTerm, sortOption, setSortOption, addCar };
};