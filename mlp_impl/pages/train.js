import styles from "../styles/Home.module.css"
import Head from "next/head"
import { connect, Contract, keyStores, KeyPair } from "near-api-js"
import dynamic from "next/dynamic"

export default function Train(){
    const parse_csv = async(event) =>{
      event.preventDefault();
      const file = event.target.file_input.files[0];
      const file_reader = new FileReader;
      file_reader.readAsText(file);
      file_reader.onload = async function(result) { 
          const string_result = result.target.result.toString();
          dynamic({
              loader: async () => {
                const csvParser = await import('../csv_parser_wasm.wasm')
                csvParser.parse_csv(result)
              }
          })
          console.log(csvParser)
      }

    }
    return(
        <form onSubmit={parse_csv}>
            <input type="file" name="file_input"></input>
            <button type="submit">Submit</button>
        </form>
    )
}