import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PlaceList from "../components/PlaceList";
import { useHttpClient } from "./../../shared/hooks/http-hook";
import ErrorModal from "./../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "./../../shared/components/UIElements/LoadingSpinner";

const UserPlaces = () => {
  const [loadedPlaces, setLoadedPlaces] = useState();
  const { isLoading, error, clearError, sendRequest } = useHttpClient();

  const userId = useParams().userId;
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await sendRequest(`${process.env.REACT_APP_BACKEND_URI}/places/user/${userId}`);
        setLoadedPlaces(res.places);
      } catch (error) {}
    };
    fetchPlaces();
  }, [sendRequest, userId]);

  const deletePlaceHandler = (placeId) => {
    setLoadedPlaces(loadedPlaces.filter(prevPlaces => prevPlaces.id !== placeId))
  }
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <div className="center">
        <LoadingSpinner />
      </div>}
      {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} onDeletePlace={deletePlaceHandler} />}
    </>
  );
};

export default UserPlaces;
