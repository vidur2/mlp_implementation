import styles from "../styles/Home.module.css"
import Head from "next/head"

export default function About(){
    return(
        <div className={styles.inforPage}>
        <Head>
            <title>About</title>
        </Head>
        <div className={styles.predict_head} id="title">
          <h1 className={styles.title} style={{textDecoration: "none", fontSize: "50px", color: "white"}}>About this Model</h1>
        </div>
          <table style={{paddingTop: "3%"}}>
            <tr>
              <th>
                <h2>The Math</h2>
                <span>
                  <p>The model structure is a multi-layer perceptron, the simplest</p>
                  <p>form of a feed-forward neural network. Because the neural net was</p>
                  <p>coded in Rustlang, it was coded from scratch. The linear algebra</p>
                  <p>for the neural net is the same as a normal multi-layer perceptron</p>
                  <p>with an input layer, a middle layer, and an output layer. Each layer</p>
                  <p>is made up of simulated neurons, which use an activation function</p>
                  <p>and weighted sum to simulate the 'action potential' firing</p>
                  <p>of their organic counterparts. The activation function for</p>
                  <p>each layer of the network is different. The first layer uses a</p>
                  <p>hyperbolic tangent as the activation function, the second uses</p>
                  <p>a logistic function, and the third uses a 'step function' to</p>
                  <p>consolidate the values into a 1/0 output. The outputs of each</p>
                  <p>layer's activation function become the inputs of the next layer</p>
                  <p>and are hence forward propagated to generate an output. This</p>
                  <p>output is then compared to an inputted expected output. The</p>
                  <p>difference between the expected and actual output is then used</p>
                  <p>to adjust the weights of each neuron, so it fires more accurately.</p>
                </span>
              </th>
              <th>
                <h2>The Data</h2>
                <span>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                </span>
              </th>
            </tr>
            <tr>
              <th>
                <h2>The Hosting</h2>
                <span>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                </span>
              </th>
              <th>
                <h2>Further Applications</h2>
                <span>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                </span>
              </th>
            </tr>
          </table>
        </div>
    )
}