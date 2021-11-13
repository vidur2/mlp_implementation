import styles from "../styles/Home.module.css"
import Head from "next/head"


export default function Train(){
    const parse_csv = async(event) =>{
    event.preventDefault();
    const file = event.target.file_input.files[0];
    const file_reader = new FileReader;
    file_reader.readAsText(file);
    file_reader.onload = async function(result) { 
        event.preventDefault();
        const string_result = result.target.result.toString();
        const split_result = string_result.split("\n")
        split_result.splice(0, 1);
        for (let i = 0; i < split_result.length; i++){
            const row = split_result[i];
            await fetch("/api/train_api", {
                method: "POST",
                body: JSON.stringify({
                    row_string: row
                })
            })
          }
      }

    }
    return(
        <form onSubmit={parse_csv}>
            <input type="file" name="file_input"></input>
            <button type="submit">Submit</button>
        </form>
    )
}