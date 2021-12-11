# MLP Implementation on the Blockchain
This project has a working deployment of an MLP (multi-layered perceptron) model on a blockchain as well as a weather implementation with a frontend to test demonstrate the model in action.

## The Backend
The backend is hosted on the NEAR Protocol blockchain. You can learn more about their mission [here](https://near.org). You can see how the neural network was trained, and how predictions from the website are handled [here](https://explorer.testnet.near.org/accounts/mlp1.perceptron.testnet). An example of a prediction is can be seen [here](https://explorer.testnet.near.org/transactions/C1jtoRxfcv4yaQYkyHFsTQDwbmbMNS12j7Gvhs2nLWTT). 

### The model
The model is the basic form of a 3-layer Multi-Layer Perceptron, with two input neurons, 3 hidden neurons, and an output neuron. The input layer uses a hyperbolic tangent activation function, the middle uses a sigmoidal activation function, and the output uses a step activation function to consolidate the inputs into a 0/1 output.

<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSy34_CeT3sV3jpkCm7GqZWSqfbdapSUaAQ2A&usqp=CAU"></img>
