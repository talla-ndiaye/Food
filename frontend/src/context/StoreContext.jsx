import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {

    const[cartItems,setCartItems] = useState({});

    const url = "http://localhost:4000"

    const [token,setToken] = useState("")

    const [food_list,setFooList] = useState([])

    const addToCart = async (itemId) =>{
        
        if (!cartItems[itemId]) {
            setCartItems((prev)=>({...prev,[itemId]:1}))
        }
        else {
            setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))

        }

        // ajout du panier dans la BD

        if (token) {

            await axios.post(url+"/api/cart/add",{itemId},{headers:{token}})
            
        }
    }


    const removeFromCart = async (itemId) => {
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}))

        if (token) {

            try {

                await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}})

                
            } catch (error) {

                console.error("failed to add item ti cart:", error)
                
            }

            
        }
    }

    

    /*const getTotalCartAmout = () =>{
        let totalAmount = 0;
        for (const item in cartItems)
        {
            if (cartItems[item] > 0 ){
                let itemInfo = food_list.find((product)=>product._id === item);
                totalAmount += itemInfo.price * cartItems[item];

            }
            else {
                console.log(`Item with ID ${item} not found in the food list`);
            }
            
        }
        return totalAmount;

    }*/

    const getTotalCartAmout = () => {
        return Object.entries(cartItems).reduce((total, [itemId, quantity]) => {
          const itemInfo = food_list.find((product) => product._id === itemId);
          if (itemInfo) {
            return total + itemInfo.price * quantity;
          }
          console.log(`Item with ID ${itemId} not found in the food list`);
          return total;
        }, 0);
      };

    //fonction pour recharger les plats depuis la base de donne
    const fetchFoodList = async () => {
        const response = await axios.get(url+"/api/food/list");
        setFooList(response.data.data)

    }

    //* rechargement du panier depuis la bd

    const loadCartData = async (token) => {
        
        const response = await axios.post(url+"/api/cart/get",{},{headers:{token}})
        setCartItems(response.data.cartData);
       
    }
    
     
    useEffect(()=>{
        
        async function loadData (){
            fetchFoodList();
            // empecher la deconnecxion apre actualisation
            if (localStorage.getItem("token")){
                setToken(localStorage.getItem("token"));
                await loadCartData(localStorage.getItem("token"));
            }

        }
        loadData();
    
    },[])


    const contextValue ={
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmout,
        url,
        token,
        setToken

    }
    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider
