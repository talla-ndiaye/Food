/*
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import './List.css';

const List = () => {
  const url = "http://localhost:4000";
  const [list, setList] = useState([]); // Correction de l'initialisation de l'état

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      console.log(response.data);

      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Erreur lors de la récupération de la liste des aliments");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de la liste des aliments :", error);
      toast.error("Erreur lors de la récupération de la liste des aliments");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="list-container">
      <h1>Liste des Aliments</h1>
      {list.length === 0 ? (
        <p>Aucun aliment trouvé</p>
      ) : (
        <ul>
          {list.map((food) => (
            <li key={food._id} className="list-item">
              <img src={`${url}/uploads/${food.image}`} alt={food.name} className="list-item-image" />
              <div className="list-item-details">
                <h2>{food.name}</h2>
                <p>{food.description}</p>
                <p><strong>Prix :</strong> ${food.price}</p>
                <p><strong>Catégorie :</strong> {food.category}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default List;

*/


import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import './List.css';

const List = ({url}) => {
  //const url = "http://localhost:4000";
  const [list, setList] = useState([]); // Correction de l'initialisation de l'état

  const fetchList = async () => {
   
      const response = await axios.get(`${url}/api/food/list`);
      //console.log(response.data);

      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Erreur lors de la récupération de la liste des aliments");
      }
    
  };

  const removeFood = async(foodId) =>{

    const response =await axios.post(`${url}/api/food/remove`,{id:foodId});
    await fetchList();
    if(response.data.success){
      toast.success(response.data.message)

    }
    else{
      toast.error("Error");
    }
    
  }



  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="list add flex-col">
      <p>All Foods</p>
      
      <div className="list-table-format title">
      <b>Image</b>
      <b>Article</b>
      <b>Catgorie</b>
      <b>Prix</b>
      <b>Supprimer</b>
      </div>
      {list.map((item,index)=>{
        return (
          <div key={index} className="list-table-format">
            <img src={`${url}/images/`+item.image} alt="" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>{item.price}</p>
            <p onClick={()=>removeFood(item._id)} className='cursor'>X</p>
          </div>
        )


      })}
  
    </div>
  );
};

export default List;


