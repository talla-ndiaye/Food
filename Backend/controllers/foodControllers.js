
/*
// add food item

import fs from 'fs';
import foodModel from "../models/foodModel.js";

const addFood = async (req, res) => {


    let image_filename =`${req.file.filename}`;

    const food = foodModel({
        name:req.body.name,
        description : req.body.description,
        price: req.body.price,
        category :req.body.category,
        image: image_filename
    })

    try {
        await food.save();
        res.json({success:true, message:"Food Added"})

    } catch(error) {
        res.json({success:false,message:"Error"})
    }
}


// all fod list
 const listFood = async(req, res) => {
    try{
        const foods = await foodModel.find({});
        res.json({success:true, data:foods})
    } catch(error) {
        console.log(error);
        res.json({success:false, message:"Error"})
    }


 }


 // remove food item

 const removeFood = async (req,res) => {

    try {
        const food = await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`, ()=>{})

        await foodModel.findByIdAndDelete(req.body.id)
        res.json({succes:true, message:"Food Removed"})
        
    } catch (error) {
        console.log(error)
        res.json({succes:false, message:"Error"})
        
    }

 }

export { addFood, listFood, removeFood };

*/
import fs from 'fs';
import foodModel from "../models/foodModel.js";

// Ajouter un élément alimentaire
const addFood = async (req, res) => {
    try {
        // Vérifiez si le fichier est inclus dans la requête
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Aucun fichier téléchargé" });
        }

        // Obtenez le nom du fichier téléchargé
        let image_filename = req.file.filename;

        // Créez un nouvel élément alimentaire avec les données reçues
        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: image_filename
        });

        // Sauvegardez l'élément alimentaire dans la base de données
        await food.save();
        res.json({ success: true, message: "Nourriture ajoutée" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur lors de l'ajout de la nourriture", error: error.message });
    }
};

// Lister tous les éléments alimentaires
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur lors de la récupération de la liste des aliments", error: error.message });
    }
};

// Supprimer un élément alimentaire
const removeFood = async (req, res) => {
    try {
        // Trouvez l'élément alimentaire par son ID
        const food = await foodModel.findById(req.body.id);

        if (food) {
            // Supprimez le fichier image associé
            fs.unlink(`uploads/${food.image}`, (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ success: false, message: "Erreur lors de la suppression du fichier image", error: err.message });
                }
            });

            // Supprimez l'élément alimentaire de la base de données
            await foodModel.findByIdAndDelete(req.body.id);
            res.json({ success: true, message: "Nourriture supprimée" });
        } else {
            res.status(404).json({ success: false, message: "Élément alimentaire non trouvé" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur lors de la suppression de la nourriture", error: error.message });
    }
};

const searchFood = async (req, res) => {

    try {
        const { query } = req.query;
        const searchResult = await foodModel.find({
            name: { $regex: query, $options: 'i' } // Case-insensitive search
        });
        res.json(searchResult);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while searching', error });
    }

}

export { addFood, listFood, removeFood, searchFood };

