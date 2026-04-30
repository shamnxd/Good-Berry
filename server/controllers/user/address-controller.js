const mongoose = require('mongoose');
const Address = require('../../models/Address');
const HTTP_STATUS = require('../../constants/statusCodes');
const MESSAGES = require('../../constants/messages');


const addressController = {
    getAllAddresses: async (req, res) => {
        try {
            const addresses = await Address.find({ userId: req.user.id });
            res.json(addresses);
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: MESSAGES.ERROR_FETCHING_ADDRESSES });
        }
    },

    addAddress: async (req, res) => {
        try {
            const {street, city, state, zip, country, name, type, mobile, isDefault} = req.body;
            
            if(isDefault) {
                await Address.updateMany(
                    {userId: req.user.id}, 
                    {$set: {isDefault: false}}
                );
            }

            const newAddress = new Address({
                userId: req.user.id,
                street,
                city,
                state,
                zip,
                country,
                name,
                type,
                mobile,
                isDefault
            });

            const savedAddress = await newAddress.save();

            res.status(HTTP_STATUS.CREATED).json(savedAddress);

        } catch (error) {
            console.log(error);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: MESSAGES.ERROR_ADDING_ADDRESS });   
        }
    },

    setDefaultAddress: async (req, res) => {
        try {
            const { id } = req.params;
            await Address.updateMany(
                { userId: req.user.id },
                { $set: { isDefault: false } }
            );
            const updatedAddress = await Address.findOneAndUpdate(
                { userId: req.user.id, _id: id },
                { $set: { isDefault: true } },
                { new: true }
            );
            if (!updatedAddress) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({ message: MESSAGES.ADDRESS_NOT_FOUND });
            }
            res.json(updatedAddress);
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    },

    updateAddress: async (req, res) => {
        try {
            const { id } = req.params;
            const updates = req.body;
    
            if (updates.isDefault) {
                await Address.updateMany(
                    { userId: req.user.id },
                    { $set: { isDefault: false } }
                );
            }
    
            const updatedAddress = await Address.findOneAndUpdate(
                { userId: req.user.id, _id: id },
                updates,
                { new: true }
            );
    
            res.json(updatedAddress);
        } catch (error) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({ message: error.message });
        }
    },    

    deleteAddress: async (req, res) => {
        try {
            const {id} = req.params;
            const deletedAddress = await Address.findOneAndDelete({
                _id: id,
                userId: req.user.id
            });
            if (!deletedAddress) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({ message: MESSAGES.ADDRESS_NOT_FOUND });
            }
        
            res.json({ message: MESSAGES.ADDRESS_DELETED_SUCCESSFULLY });
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    },
}

module.exports = addressController;