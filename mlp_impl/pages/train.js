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
        let current_array;
        let ctr;
        for (let i = 0; i < string_result.length; i += 18182){
            current_array = string_result.slice(i, i + 18181)
            await fetch("/api/train_api", {
                method: "POST",
                body: JSON.stringify({
                    csv_string: current_array
                })
            })
            ctr = i;
        }
        if (ctr < string_result.length - 1){
            await fetch("/api/train_api", {
                method: "POST",
                body: JSON.stringify({
                    csv_string: string_result.slice(ctr, string_result.length - 1)
                })
            })
        }
        // window.location.reload()
      }

    }
    return(
        <form onSubmit={parse_csv}>
            <input type="file" name="file_input"></input>
            <button type="submit">Submit</button>
        </form>
    )
}