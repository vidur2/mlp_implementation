import styles from "../styles/Home.module.css"
import Head from "next/head"

export default function About(){
    return(
        <div className={styles.inforPage}>
        <Head>
            <title>About</title>
            <link rel="icon" href="/logo.svg" />
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
                  <p>The data is based on Australian weather readings, so the</p>
                  <p>prediction is valid for that geographic area alone. A lot </p>
                  <p>of imputation was done on the data during preprocessing.</p>
                  <p>Note that the dataset is imbalanced so the trained model is</p>
                  <p>biased towards predicting it will not rain tomorrow. This </p>
                  <p> is because the model is aMulti-Layer Perceptron trained</p>
                  <p>on a relatively small amount of data. With more data, this </p>
                  <p> bias could be trained out of the model, however, only 15,000</p>
                  <p>rows of data were used to train the model. If there were around</p>
                  <p> 100,000 rows of data, then the model would be more accurate. </p>
                  <p>With 15,000 rows, there are some techniques that could have </p>
                  <p>been used to remove this bias, but it runs the risk of biasing</p>
                  <p>the model towards the raining condition, due to the small amount</p>
                  <p> of data. The reason an MLP was used as opposed to a Logistic</p>
                  <p>Regression Model or Bayesian network is because this is a </p>
                  <p>proof of concept for hosting prediction models using the blockchain.</p>
                </span>
              </th>
            </tr>
          </table>
        </div>
    )
}