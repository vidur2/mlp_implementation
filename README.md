# MLP Implementation on the Blockchain
This project has a working deployment of an MLP (multi-layered perceptron) model on a blockchain as well as a weather implementation with a frontend to test demonstrate the model in action.

## The Code
The code for this project can be seen in the Contract_Files folder (Backend), mlp_impl folder (frontend), data_parsing_csv folder (data science), and the mlp_middle folder (Work in Progress, bigger connection to the blockchain). 

Bigger Commercial Impl Example folder is currently under development, **so commits may happen in this folder** as the judging process happens, however, this is not implemented into the deployed project you are seeing. You can see the code in the folder as a prototype for a more general case of the smart contracts in the Contract_Files folder.

## The Backend
The backend is hosted on the NEAR Protocol blockchain. You can learn more about their mission [here](https://near.org). You can see how the neural network was trained, and how predictions from the website are handled [here](https://explorer.testnet.near.org/accounts/mlp1.perceptron.testnet). An example of a prediction can be seen [here](https://explorer.testnet.near.org/transactions/C1jtoRxfcv4yaQYkyHFsTQDwbmbMNS12j7Gvhs2nLWTT). 

### The model
The model is the basic form of a 3-layer Multi-Layer Perceptron, with two input neurons, 3 hidden neurons, and an output neuron. The input layer uses a hyperbolic tangent activation function, the middle uses a sigmoidal activation function, and the output uses a step activation function to consolidate the inputs into a 0/1 output.

<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSy34_CeT3sV3jpkCm7GqZWSqfbdapSUaAQ2A&usqp=CAU"></img>

### The data
An imbalanced dataset from kaggle was used to train the implementation for this model. Because the focus of the project was not on the data going into the model, but rather the model itself, the fact that the dataset was imbalanced was not considered during preprocessing.  
During Preprocessing the data was: <ol><li>Casted into numeric inputs from categorical data if needed</li><li>Imputed if there was missing data in a row</li></ol>
You can view the Kaggle Dataset [here](https://www.kaggle.com/jsphyg/weather-dataset-rattle-package)

## The frontend
The frontend is a javascript website built with Next.js and hosted on Vercel. I used Vercel because is built specifically for hosting Next.js websites. Next.js was used to build the frontend because it is built on top of React, which allowed different frontend elements to be imported from varius websites which also used React. This allowed me to focus more of my attention on the backend model of the project, and worry less about the frontend.
