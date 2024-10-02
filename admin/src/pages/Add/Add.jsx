
import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';
import './Add.css';

const Add = ({url}) => {
    //const url = "http://localhost:4000";

    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Salad"
    });

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", Number(data.price));
        formData.append("category", data.category);
        formData.append("image", image);

        setLoading(true);

        try {
            const response = await axios.post(`${url}/api/food/add`, formData);
            if (response.data.success) {
                setData({
                    name: "",
                    description: "",
                    price: "",
                    category: "Salad"
                });
                setImage(null);
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Erreur lors de l'ajout de la nourriture :", error);
        }  finally {
            setLoading(false);
          }
    };

    return (
        <div className='add'>
            <form className="flex-col" onSubmit={onSubmitHandler}>
                <div className="add-img-upload flex-col">
                    <p>Upload image</p>
                    <label htmlFor="image">
                        <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
                    </label>
                    <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" name="image" hidden required />
                </div>
                <div className="add-product-name flex-col">
                    <p>Nom de L'article</p>
                    <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='nom...' required />
                </div>
                <div className="add-product-description flex-col">
                    <p>Description de L'article</p>
                    <textarea onChange={onChangeHandler} value={data.description} name='description' rows="6" placeholder='Description...' required />
                </div>
                <div className="add-category-price">
                    <div className="add-category flex-col">
                        <p>Categorie</p>
                        <select onChange={onChangeHandler} name="category" value={data.category}>
                            <option value="Salad">Pizza</option>
                            <option value="Salad">Burger</option>
                            <option value="Salad">Donuts</option>
                            <option value="Salad">Juice</option>
                            <option value="Salad">Salad</option>
                            <option value="Rolls">Rolls</option>
                            <option value="Deserts">Deserts</option>
                            <option value="Sandwich">Sandwich</option>
                            <option value="Cake">Cake</option>
                            <option value="Pure Veg">Pure Veg</option>
                            <option value="Pasta">Pasta</option>
                            <option value="Noodles">Noodles</option>
                        </select>
                    </div>
                    <div className="add-price flex-col">
                        <p>Prix</p>
                        <input onChange={onChangeHandler} value={data.price} type="number" name='price' placeholder='10000 Fcfa' required />
                    </div>
                </div>
                <button type='submit' className='add-btn'>{loading ? "Chargement..." : "Ajouter" }</button>
            </form>
        </div>
    );
};

export default Add;
