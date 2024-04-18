import React, {useState, useEffect} from "react";
import NewPlantForm from "./NewPlantForm";
import PlantList from "./PlantList";
import Search from "./Search";

function PlantPage() {

  
  const plantsUrl = 'http://localhost:6001/plants'
  const [plants, setPlants] = useState([])
  const [searchParams, setSearchParams] = useState('')
  const [edit, setEdit] = useState(0)

  useEffect(() => {
    fetch('http://localhost:6001/plants')
    .then(res => res.json())
    .then(data => setPlants(data))
  }, [])


  const handlePlantSubmission = (e, newPlant) => {
    e.preventDefault()
    console.log(newPlant)
    fetch(plantsUrl,{
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(newPlant)
    })
    .then(resp => {
      if(resp.ok) {
        setPlants([...plants,newPlant])
      }
    })

  }

  const handleSearchParams = (search) => {
    setSearchParams(search)
  }

  const handleDelete = (id) => {

    fetch(`${plantsUrl}/${id}`, {
      method: 'DELETE'
    })
    .then(resp => {
      if(resp.ok) {
        const filterPlants = plants.filter((plant) => plant.id !== id)
        setPlants(filterPlants)
      }
    })
    .catch(err => console.log(err))
  }

  const handleEdit = (id) => {
    setEdit(id)
  }

  const handleEditSubmission = (e,newPlant) => {
    e.preventDefault();

    fetch(`${plantsUrl}/${newPlant.id}`,{
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newPlant)
    })
    .then(resp => {
      if(resp.ok) {
        setPlants(plants => plants.map((plant) => plant.id === newPlant.id ? newPlant : plant))
      }
    })
    .catch(err => console.log(err))



    setEdit(0)

  }
  

  useEffect(() => {
    fetch(plantsUrl)
    .then(resp => resp.json())
    .then(data => setPlants(data))
  }, [])

  return (
    <main>
      <NewPlantForm handlePlantSubmission={handlePlantSubmission} handleEditSubmission={handleEditSubmission} edit={edit} plants={plants}/>
      <Search handleSearchParams={handleSearchParams}/>
      <PlantList plants={plants} searchParams={searchParams} handleDelete={handleDelete} handleEdit={handleEdit} />
    </main>
  );
}

export default PlantPage;